import { useState, useRef, useCallback, useEffect } from 'react';

const DEFAULT_SUPABASE_URL = 'https://rxwynfplditdwqtjhkpw.supabase.co';
const SUPABASE_URL = (import.meta as any)?.env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;

const toWsUrl = (httpUrl: string) => {
  const trimmed = httpUrl.replace(/\/+$/, '');
  if (trimmed.startsWith('https://')) return `wss://${trimmed.slice('https://'.length)}`;
  if (trimmed.startsWith('http://')) return `ws://${trimmed.slice('http://'.length)}`;
  return trimmed;
};

const VOICE_LIVE_WS_URL = `${toWsUrl(SUPABASE_URL)}/functions/v1/voice-ask-live`;

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface UseVoiceLiveOptions {
  onText?: (text: string) => void;
  onToolCall?: (tool: string, args: Record<string, any>) => void;
  onTurnComplete?: () => void;
  onError?: (error: string) => void;
}

class AudioQueue {
  private queue: Uint8Array[] = [];
  private isPlaying = false;
  private audioContext: AudioContext;
  private onPlayingChange?: (isPlaying: boolean) => void;
  private scheduledTime: number = 0;
  private sampleRate = 24000; // updated from server mimeType (audio/pcm;rate=...)
  private readonly FADE_MS = 12; // longer fade for smoother inter-chunk transitions
  private readonly LOOKAHEAD_MS = 150; // schedule further ahead to survive jitter
  private readonly PREBUFFER_MS = 900; // accumulate more audio before starting playback
  private readonly UNDERRUN_GRACE_MS = 1200; // wait longer for more chunks before stopping
  private readonly CROSSFADE_SAMPLES = 96; // more samples for smoother crossfade
  
  // Backpressure: reject new chunks when queue is too full
  private readonly MAX_QUEUE_LEN = 50; // larger buffer before signaling backpressure
  private readonly RESUME_QUEUE_LEN = 30; // resume threshold
  private backpressureActive = false;
  
  private underrunTimer: number | null = null;
  private rafScheduled = false;

  // Debug metrics to pinpoint pops/static/underruns
  private chunkCounter = 0;
  private lastEnqueueAtMs: number | null = null;
  private prevLastSample: number | null = null;
  private lastChunkEndSample: number = 0; // track last sample for crossfade

  constructor(audioContext: AudioContext, onPlayingChange?: (isPlaying: boolean) => void) {
    this.audioContext = audioContext;
    this.onPlayingChange = onPlayingChange;
  }

  private async ensureAudioContext(): Promise<AudioContext> {
    const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;

    if (!this.audioContext || this.audioContext.state === 'closed') {
      console.log('AudioQueue: creating new audio context');
      this.audioContext = new AudioCtx();
      this.scheduledTime = this.audioContext.currentTime;
      this.isPlaying = false;
      this.onPlayingChange?.(false);
    }

    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch {
        // ignore
      }
    }

    return this.audioContext;
  }

  private getQueuedSeconds() {
    // PCM16 mono => 2 bytes per sample
    const samples = this.queue.reduce((sum, chunk) => sum + chunk.byteLength / 2, 0);
    return samples / this.sampleRate;
  }

  async addToQueue(audioData: Uint8Array, sampleRate?: number): Promise<boolean> {
    if (typeof sampleRate === 'number' && Number.isFinite(sampleRate) && sampleRate > 0) {
      this.sampleRate = sampleRate;
    }

    // Track backpressure state but ALWAYS queue the chunk
    // Return value signals whether caller should continue sending more
    const wasBackpressureActive = this.backpressureActive;
    
    if (this.queue.length >= this.MAX_QUEUE_LEN) {
      if (!this.backpressureActive) {
        this.backpressureActive = true;
        console.warn(`AudioQueue: BACKPRESSURE ON - signaling pause (qLen=${this.queue.length} >= ${this.MAX_QUEUE_LEN})`);
      }
    } else if (this.backpressureActive && this.queue.length < this.RESUME_QUEUE_LEN) {
      this.backpressureActive = false;
      console.log(`AudioQueue: BACKPRESSURE OFF - resume sending (qLen=${this.queue.length} < ${this.RESUME_QUEUE_LEN})`);
    }

    // --- Diagnostics: inspect raw PCM chunk ---
    const enqueueAtMs = performance.now();
    const interArrivalMs = this.lastEnqueueAtMs === null ? null : enqueueAtMs - this.lastEnqueueAtMs;
    this.lastEnqueueAtMs = enqueueAtMs;

    const byteLen = audioData.byteLength;
    if (byteLen % 2 !== 0) {
      console.warn('AudioQueue: odd PCM byte length (dropping last byte):', byteLen);
    }

    const safeLen = byteLen - (byteLen % 2);
    const sampleCount = safeLen / 2;
    const chunkDurationS = sampleCount / this.sampleRate;

    let peak = 0;
    let first = 0;
    let last = 0;
    let jump: number | null = null;

    if (sampleCount > 0) {
      const dv = new DataView(audioData.buffer, audioData.byteOffset, safeLen);
      first = dv.getInt16(0, true) / 32768;
      last = dv.getInt16(safeLen - 2, true) / 32768;

      for (let i = 0; i < sampleCount; i++) {
        const v = dv.getInt16(i * 2, true) / 32768;
        peak = Math.max(peak, Math.abs(v));
      }

      if (this.prevLastSample !== null) {
        jump = Math.abs(first - this.prevLastSample);
      }
      this.prevLastSample = last;
    }

    // Filter out problematic silent chunks with timing gaps (coming from API)
    // These cause glitches because they're essentially dead air with discontinuities
    const SILENCE_THRESHOLD = 0.005; // peak below this is considered silent
    const GAP_THRESHOLD_MS = 25; // inter-arrival above this indicates a timing gap
    
    const isSilent = peak < SILENCE_THRESHOLD;
    const hasTimingGap = interArrivalMs !== null && interArrivalMs > GAP_THRESHOLD_MS;
    
    if (isSilent && hasTimingGap) {
      console.warn(
        `AudioQueue: SKIPPING bad chunk - silent (peak=${peak.toFixed(4)}) with gap (inter=${interArrivalMs?.toFixed(1)}ms)`
      );
      // Don't add to queue, but don't reset prevLastSample so crossfade still works
      return true; // Chunk was "handled" (skipped intentionally)
    }

    this.queue.push(audioData);

    // Schedule continuous queue draining via RAF for predictable timing
    // This ensures we're actively pulling from the queue, not just waiting for onended
    if (this.isPlaying && this.queue.length > 0) {
      if (!this.rafScheduled) {
        this.rafScheduled = true;
        requestAnimationFrame(() => {
          this.rafScheduled = false;
          if (this.queue.length > 0 && this.isPlaying) {
            void this.playNext();
          }
        });
      }
    }
    
    const queuedS = this.getQueuedSeconds();
    const chunkId = ++this.chunkCounter;
    console.log(
      `AudioQueue: enqueue #${chunkId} samples=${sampleCount} dur=${chunkDurationS.toFixed(3)}s ` +
        `peak=${peak.toFixed(3)} first=${first.toFixed(3)} last=${last.toFixed(3)} ` +
        `jump=${jump === null ? 'n/a' : jump.toFixed(3)} ` +
        `inter=${interArrivalMs === null ? 'n/a' : interArrivalMs.toFixed(1)}ms ` +
        `queued=${queuedS.toFixed(3)}s qLen=${this.queue.length}`
    );

    // If we were waiting for more audio, cancel the underrun grace timer.
    if (this.underrunTimer !== null) {
      clearTimeout(this.underrunTimer);
      this.underrunTimer = null;
    }

    if (!this.isPlaying) {
      const prebufferS = this.PREBUFFER_MS / 1000;

      // Wait until we have a small buffer built up so the queue doesn't underrun.
      if (this.getQueuedSeconds() < prebufferS) {
        // Signal backpressure status but don't start playback yet
        return !this.backpressureActive;
      }

      const ctx = await this.ensureAudioContext();
      this.scheduledTime = ctx.currentTime + this.LOOKAHEAD_MS / 1000;
      console.log(
        `AudioQueue: prebuffer reached (queued=${this.getQueuedSeconds().toFixed(3)}s), starting playback`
      );
      await this.playNext();
    }

    // Return whether caller should continue sending (false = pause upstream)
    return !this.backpressureActive;
  }

  private async playNext() {
    const ctx = await this.ensureAudioContext();

    if (this.queue.length === 0) {
      console.warn('⚠️ UNDERRUN - queue empty! Waiting for more chunks...');

      // Avoid hard stop/restart loops due to tiny gaps in chunk delivery.
      // Wait a short grace period for additional chunks before we actually stop.
      if (this.underrunTimer !== null) return;

      this.underrunTimer = window.setTimeout(() => {
        this.underrunTimer = null;
        if (this.queue.length === 0) {
          console.log('AudioQueue: queue empty after grace, stopping playback');
          this.isPlaying = false;
          this.onPlayingChange?.(false);
        } else {
          console.log('AudioQueue: recovered from underrun, resuming playback');
          // More audio arrived during the grace period; resume scheduling.
          void this.playNext();
        }
      }, this.UNDERRUN_GRACE_MS);

      return;
    }

    if (ctx.state === 'closed') {
      console.warn('AudioQueue: cannot playNext because AudioContext is closed');
      return;
    }

    // Helpful scheduling diagnostics: are we falling behind?
    const now = ctx.currentTime;
    const lateByS = now - this.scheduledTime;
    if (lateByS > 0.01) {
      console.warn(`AudioQueue: scheduling late by ${(lateByS * 1000).toFixed(1)}ms`);
    }

    this.isPlaying = true;
    this.onPlayingChange?.(true);

    const queuedBeforeShift = this.queue.length;
    const audioData = this.queue.shift()!;

    try {
      if (audioData.byteLength % 2 !== 0) {
        console.warn('AudioQueue: odd PCM byte length in playNext (dropping last byte):', audioData.byteLength);
      }

      // Convert PCM16 to Float32
      const float32Data = new Float32Array(Math.floor(audioData.length / 2));
      const safeLen = float32Data.length * 2;
      const dataView = new DataView(audioData.buffer, audioData.byteOffset, safeLen);

      for (let i = 0; i < float32Data.length; i++) {
        const int16 = dataView.getInt16(i * 2, true); // little endian
        // Normalize to [-1, 1] and clamp (prevents rare overflows from causing harsh distortion)
        const f = int16 / 32768;
        float32Data[i] = Math.max(-1, Math.min(1, f));
      }

      // Apply sample-level crossfade at chunk start to eliminate clicks from discontinuities
      // This smooths the jump between the last sample of the previous chunk and the first sample of this chunk
      if (float32Data.length > 0) {
        const firstSample = float32Data[0];
        const jump = Math.abs(firstSample - this.lastChunkEndSample);
        
        // Only apply crossfade if there's a significant discontinuity (> 0.1 amplitude jump)
        if (jump > 0.1) {
          const crossfadeSamples = Math.min(this.CROSSFADE_SAMPLES, float32Data.length);
          for (let i = 0; i < crossfadeSamples; i++) {
            const t = i / crossfadeSamples; // 0 to 1
            // Blend from previous end sample to current sample
            float32Data[i] = this.lastChunkEndSample * (1 - t) + float32Data[i] * t;
          }
          console.log(`AudioQueue: applied crossfade for jump=${jump.toFixed(3)}`);
        }
        
        // Store last sample for next chunk's crossfade
        this.lastChunkEndSample = float32Data[float32Data.length - 1];
      }

      // Create buffer at the sample rate specified by the server
      const audioBuffer = ctx.createBuffer(1, float32Data.length, this.sampleRate);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;

      // Add a tiny fade-in/out to avoid audible clicks between chunks
      const gain = ctx.createGain();
      source.connect(gain);
      gain.connect(ctx.destination);

      // Schedule seamlessly: use scheduledTime or start immediately if we've fallen behind.
      // Never schedule in the past.
      const startTime = this.scheduledTime > now ? this.scheduledTime : now;
      const startDelayMs = (startTime - now) * 1000;

      // Envelope ramps for smooth transitions
      const fade = Math.min(this.FADE_MS / 1000, audioBuffer.duration / 4);
      const peakGain = 0.9; // a little headroom helps avoid harsh clipping/distortion
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(peakGain, startTime + fade);
      gain.gain.setValueAtTime(
        peakGain,
        Math.max(startTime + fade, startTime + audioBuffer.duration - fade)
      );
      gain.gain.linearRampToValueAtTime(0, startTime + audioBuffer.duration);

      console.log(
        `AudioQueue: play chunk queuedBefore=${queuedBeforeShift} queuedAfter=${this.queue.length} ` +
          `now=${now.toFixed(3)} scheduled=${this.scheduledTime.toFixed(3)} start=${startTime.toFixed(3)} ` +
          `delay=${startDelayMs.toFixed(1)}ms dur=${audioBuffer.duration.toFixed(3)}`
      );

      source.start(startTime);

      // Update when next chunk should start (immediately after this one ends)
      this.scheduledTime = startTime + audioBuffer.duration;

      source.onended = () => {
        console.log(`AudioQueue: chunk ended, queuedRemaining=${this.queue.length}`);
        void this.playNext();
      };
    } catch (error) {
      console.error('AudioQueue: error playing audio chunk:', error);
      // Continue with next segment
      void this.playNext();
    }
  }

  clear() {
    this.queue = [];
    this.isPlaying = false;
    this.scheduledTime = 0;
    if (this.underrunTimer !== null) {
      clearTimeout(this.underrunTimer);
      this.underrunTimer = null;
    }
    this.onPlayingChange?.(false);
  }

  // Wait for all queued audio to finish playing
  async waitForCompletion(): Promise<void> {
    // If nothing is playing, return immediately
    if (!this.isPlaying && this.queue.length === 0) {
      return;
    }
    
    // Poll until audio finishes (check every 100ms)
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!this.isPlaying && this.queue.length === 0 && this.underrunTimer === null) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      
      // Safety timeout: don't wait forever (max 30 seconds)
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 30000);
    });
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  isAccepting(): boolean {
    // When backpressure is active, don't accept new chunks until queue drains
    return !this.backpressureActive;
  }
}

export function useVoiceLive(options: UseVoiceLiveOptions = {}) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Gate sending audio until the server explicitly tells us the Gemini session is ready.
  const sessionReadyRef = useRef(false);
  const sessionReadyAtRef = useRef<number>(0);
  const sessionReadyDeferredRef = useRef<null | {
    promise: Promise<void>;
    resolve: () => void;
    reject: (err: unknown) => void;
  }>(null);

  // Local silence detection fallback
  const hasSpokenRef = useRef(false);
  const lastVoiceAtRef = useRef<number>(0);
  const endTurnSentRef = useRef(false);
  const SPEECH_RMS_THRESHOLD = 0.012;
  const SILENCE_MS = 1200;

  // Auto-reconnect tracking
  const reconnectCountRef = useRef(0);
  const MAX_AUTO_RECONNECTS = 3;

  // Tool processing guard: prevent mic restart from interrupting Gemini's tool response
  const toolProcessingRef = useRef(false);
  const toolProcessingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track whether audio was received during the current turn
  const audioReceivedInTurnRef = useRef(false);
  // Track last tool call info for fallback TTS
  const lastToolInfoRef = useRef<{ tool: string; args: Record<string, any> } | null>(null);

  const createDeferred = () => {
    let resolve!: () => void;
    let reject!: (err: unknown) => void;
    const promise = new Promise<void>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };

  const waitForSessionReady = async (timeoutMs = 12000) => {
    console.log('Waiting for session ready...');
    const deferred = sessionReadyDeferredRef.current;
    if (!deferred) {
      console.warn('No deferred promise for session ready');
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    try {
      await Promise.race([
        deferred.promise.then(() => {
          if (timeoutId) clearTimeout(timeoutId);
        }),
        new Promise<void>((_, reject) => {
          timeoutId = setTimeout(() => {
            console.error('Session ready timeout after', timeoutMs, 'ms');
            reject(new Error('Voice session timed out - the server did not respond in time. Please try again.'));
          }, timeoutMs);
        }),
      ]);
      console.log('Session ready confirmed');
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error('waitForSessionReady failed:', err);
      throw err;
    }
  };

  // Initialize audio context
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      console.log('Creating new audio context');
      // Don't force a specific sample rate; we'll create buffers at the server-provided rate.
      audioContextRef.current = new AudioContext();
    }

    // Best-effort resume (may still require a user gesture depending on autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {});
    }

    return audioContextRef.current;
  }, []);
  // Stop listening - defined first so connect can reference it
  const stopListening = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsListening(false);
    console.log('Stopped listening');
  }, []);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('Already connected');
      return;
    }

    // Reset readiness for the next session
    sessionReadyRef.current = false;
    sessionReadyDeferredRef.current = createDeferred();

    setStatus('connecting');

    try {
      console.log('Opening Voice Live WebSocket:', VOICE_LIVE_WS_URL);

      // Best-effort: pre-warm the playback audio context on a user gesture.
      try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') await ctx.resume();
      } catch {
        // ignore
      }

      const ws = new WebSocket(VOICE_LIVE_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = async (event) => {
        console.log('[WS RAW EVENT DATA]', event.data);
        
        try {
          const data = JSON.parse(event.data);
          console.log('[WS PARSED MESSAGE]', data);

          switch (data.type) {
            case 'session_ready':
              console.log('Session ready, tools:', data.tools);
              sessionReadyRef.current = true;
              sessionReadyAtRef.current = Date.now();
              reconnectCountRef.current = 0; // Reset reconnect counter on success
              sessionReadyDeferredRef.current?.resolve();
              setStatus('connected');
              break;

            case 'assistant_text': {
              stopListening();
              const textFragment = data.text || '';
              options.onText?.(textFragment.endsWith(' ') ? textFragment : textFragment + ' ');
              break;
            }

            case 'assistant_audio': {
              stopListening();

              if (!audioQueueRef.current) {
                const ctx = getAudioContext();
                audioQueueRef.current = new AudioQueue(ctx, setIsSpeaking);
              }

              const binaryString = atob(data.chunk);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }

              let sampleRate = 24000;
              if (data.mimeType) {
                const match = data.mimeType.match(/rate=(\d+)/);
                if (match) sampleRate = parseInt(match[1]);
              }

              const shouldContinue = await audioQueueRef.current.addToQueue(bytes, sampleRate);
              if (!shouldContinue) {
                console.log('AudioQueue: backpressure active, chunk queued but upstream should pause');
              }
              break;
            }

            case 'tool_call':
              console.log('Tool call:', data.tool, data.args);
              // Block mic restart while tool is processing to prevent interrupting Gemini's response
              toolProcessingRef.current = true;
              audioReceivedInTurnRef.current = false;
              lastToolInfoRef.current = { tool: data.tool, args: data.args };
              console.log('🔧 Tool processing started — mic restart blocked');
              // Safety timeout: unblock after 30s in case tool hangs
              if (toolProcessingTimerRef.current) clearTimeout(toolProcessingTimerRef.current);
              toolProcessingTimerRef.current = setTimeout(() => {
                if (toolProcessingRef.current) {
                  console.warn('Tool processing timeout (30s) — unblocking mic');
                  toolProcessingRef.current = false;
                }
              }, 30000);
              options.onToolCall?.(data.tool, data.args);
              break;

            case 'turn_complete': {
              stopListening();
              console.log(`Turn complete (audioReceived=${audioReceivedInTurnRef.current}, toolProcessing=${toolProcessingRef.current})`);
              
              // Unblock mic restart
              toolProcessingRef.current = false;
              if (toolProcessingTimerRef.current) {
                clearTimeout(toolProcessingTimerRef.current);
                toolProcessingTimerRef.current = null;
              }
              
              // If a tool was called but NO audio came back, Gemini was likely interrupted.
              // Send a fallback text so the user gets *something*.
              if (!audioReceivedInTurnRef.current && lastToolInfoRef.current) {
                console.warn('⚠️ Turn complete with NO audio after tool call — sending fallback text');
                const toolName = lastToolInfoRef.current.tool;
                const plantName = lastToolInfoRef.current.args?.plantName || lastToolInfoRef.current.args?.query || '';
                const fallbackText = plantName
                  ? `I found information about ${plantName}. Tap the mic again and I'll share what I learned.`
                  : `I found some information for you. Tap the mic again so I can share it.`;
                options.onText?.(fallbackText);
              }
              
              lastToolInfoRef.current = null;
              audioReceivedInTurnRef.current = false;
              options.onTurnComplete?.();
              break;
            }

            case 'interrupted':
              console.log('Response interrupted');
              audioQueueRef.current?.clear();
              break;

            case 'error':
              if (data.message === 'Session not ready') {
                console.warn('Session not ready yet (ignoring)');
                return;
              }
              console.error('Session error:', data.message);
              sessionReadyDeferredRef.current?.reject(new Error(String(data.message || 'Session error')));
              options.onError?.(data.message);
              setStatus('error');
              break;

            case 'session_ended': {
              const timeSinceReady = Date.now() - sessionReadyAtRef.current;
              console.log(`Session ended (${timeSinceReady}ms after ready, reconnects: ${reconnectCountRef.current})`);
              
              // If the session ended very quickly after becoming ready, the server
              // is auto-reconnecting. Wait for the next session_ready.
              if (timeSinceReady < 8000 && reconnectCountRef.current < MAX_AUTO_RECONNECTS) {
                reconnectCountRef.current++;
                console.log(`Session ended quickly — server reconnecting (attempt ${reconnectCountRef.current}/${MAX_AUTO_RECONNECTS}), waiting...`);
                sessionReadyRef.current = false;
                // Create a new deferred for the reconnected session
                sessionReadyDeferredRef.current = createDeferred();
                // Wait for reconnect with a generous timeout (server does 1s, 2s, 3s backoff)
                waitForSessionReady(20000).then(() => {
                  console.log('Server reconnected successfully');
                }).catch(() => {
                  console.error('Server reconnect failed after all attempts');
                  setStatus('disconnected');
                  stopListening();
                });
                return;
              }
              
              sessionReadyRef.current = false;
              setStatus('disconnected');
              break;
            }
          }
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        sessionReadyDeferredRef.current?.reject(error);
        setStatus('error');
        options.onError?.('Connection error');
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        sessionReadyDeferredRef.current?.reject(new Error('WebSocket closed'));
        setStatus('disconnected');
        stopListening();
      };

    } catch (error) {
      console.error('Failed to connect:', error);
      sessionReadyDeferredRef.current?.reject(error);
      setStatus('error');
      options.onError?.('Failed to connect');
    }
  }, [options, getAudioContext, stopListening]);

  // Start listening (recording)
  const startListening = useCallback(async () => {
    if (status !== 'connected') {
      console.log('Not connected, connecting first...');
      await connect();
      await waitForSessionReady();
    }

    // Autoplay policy: ensure playback context is resumed from this user gesture.
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') await ctx.resume();
    } catch {
      // ignore
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      sourceRef.current = audioContext.createMediaStreamSource(stream);
      processorRef.current = audioContext.createScriptProcessor(4096, 1, 1);

      // Reset local silence detection state
      hasSpokenRef.current = false;
      endTurnSentRef.current = false;
      lastVoiceAtRef.current = Date.now();

      processorRef.current.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        if (!sessionReadyRef.current) return;

        const inputData = e.inputBuffer.getChannelData(0);

        // Local RMS-based silence detection (fallback)
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          const v = inputData[i];
          sum += v * v;
        }
        const rms = Math.sqrt(sum / inputData.length);
        const now = Date.now();

        if (rms > SPEECH_RMS_THRESHOLD) {
          hasSpokenRef.current = true;
          lastVoiceAtRef.current = now;
        }

        // Convert Float32 to Int16 PCM
        const int16Array = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // Convert to base64
        const uint8Array = new Uint8Array(int16Array.buffer);
        let binary = '';
        const chunkSize = 0x8000;
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
          binary += String.fromCharCode.apply(null, Array.from(chunk));
        }
        const base64 = btoa(binary);

        // Send to WebSocket
        wsRef.current.send(JSON.stringify({
          type: 'audio',
          chunk: base64
        }));

        // If we've detected speech and then enough silence, end the turn.
        if (
          hasSpokenRef.current &&
          !endTurnSentRef.current &&
          now - lastVoiceAtRef.current > SILENCE_MS
        ) {
          endTurnSentRef.current = true;
          try {
            wsRef.current.send(JSON.stringify({ type: 'end_turn' }));
          } catch {
            // ignore
          }
          stopListening();
        }
      };

      sourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContext.destination);
      setIsListening(true);
      console.log('Microphone access granted and listening started');
    } catch (err) {
      console.error('Microphone access error:', err);
      // Provide a clear, actionable error message
      const isPermissionDenied = err instanceof DOMException && (
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
      );
      const errorMessage = isPermissionDenied
        ? 'Microphone access was denied. Please click the microphone icon in your browser address bar to allow access, then refresh the page and try again.'
        : 'Failed to access microphone. Please ensure your browser has microphone permissions and try again.';
      options.onError?.(errorMessage);
      throw err;
    }
  }, [status, connect, options]);
  // Disconnect - waits for audio to finish before cleanup
  const disconnect = useCallback(async () => {
    stopListening();
    
    // Close WebSocket first to stop receiving new audio
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    // Wait for any playing audio to finish before clearing
    if (audioQueueRef.current) {
      await audioQueueRef.current.waitForCompletion();
      audioQueueRef.current.clear();
    }
    
    setStatus('disconnected');
  }, [stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // For unmount, we need to do a synchronous cleanup
      // Close WebSocket immediately
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      
      // Clear audio queue (can't wait async in cleanup)
      audioQueueRef.current?.clear();
      
      // NOTE: Do NOT close the AudioContext here.
      // In dev (and/or StrictMode) premature closure can cause subsequent playback to fail with
      // "Construction of AudioBufferSourceNode is not useful when context is closed".
      // The AudioQueue now recreates/resumes a closed/suspended context defensively.
      audioContextRef.current = null;
      audioQueueRef.current = null;
    };
  }, []);

  return {
    status,
    isListening,
    isSpeaking,
    transcript,
    connect,
    startListening,
    stopListening,
    disconnect,
    clearTranscript: () => setTranscript('')
  };
}
