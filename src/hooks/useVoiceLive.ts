import { useState, useRef, useCallback, useEffect } from 'react';

const VOICE_LIVE_WS_URL = 'wss://rxwynfplditdwqtjhkpw.functions.supabase.co/functions/v1/voice-ask-live';

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

  constructor(audioContext: AudioContext, onPlayingChange?: (isPlaying: boolean) => void) {
    this.audioContext = audioContext;
    this.onPlayingChange = onPlayingChange;
  }

  async addToQueue(audioData: Uint8Array, sampleRate: number = 24000) {
    this.queue.push(audioData);
    if (!this.isPlaying) {
      await this.playNext(sampleRate);
    }
  }

  private async playNext(sampleRate: number = 24000) {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      this.onPlayingChange?.(false);
      return;
    }

    this.isPlaying = true;
    this.onPlayingChange?.(true);
    const audioData = this.queue.shift()!;

    try {
      // Convert PCM to AudioBuffer
      const float32Data = new Float32Array(audioData.length / 2);
      const dataView = new DataView(audioData.buffer, audioData.byteOffset, audioData.byteLength);
      
      for (let i = 0; i < float32Data.length; i++) {
        const int16 = dataView.getInt16(i * 2, true); // little endian
        float32Data[i] = int16 / 32768; // normalize to -1 to 1
      }

      const audioBuffer = this.audioContext.createBuffer(1, float32Data.length, sampleRate);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      source.onended = () => this.playNext(sampleRate);
      source.start(0);
    } catch (error) {
      console.error('Error playing audio chunk:', error);
      this.playNext(sampleRate); // Continue with next segment
    }
  }

  clear() {
    this.queue = [];
    this.isPlaying = false;
    this.onPlayingChange?.(false);
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
  const sessionReadyDeferredRef = useRef<null | {
    promise: Promise<void>;
    resolve: () => void;
    reject: (err: unknown) => void;
  }>(null);

  // Local silence detection fallback (in case server-side VAD doesn't trigger reliably)
  const hasSpokenRef = useRef(false);
  const lastVoiceAtRef = useRef<number>(0);
  const endTurnSentRef = useRef(false);
  const SPEECH_RMS_THRESHOLD = 0.012;
  const SILENCE_MS = 1200;

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
    const deferred = sessionReadyDeferredRef.current;
    if (!deferred) return;

    await Promise.race([
      deferred.promise,
      new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('Voice session timed out')), timeoutMs)
      ),
    ]);
  };

  // Initialize audio context
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
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
      const ws = new WebSocket(VOICE_LIVE_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received:', data.type);

          switch (data.type) {
            case 'session_ready':
              console.log('Session ready, tools:', data.tools);
              sessionReadyRef.current = true;
              sessionReadyDeferredRef.current?.resolve();
              setStatus('connected');
              break;

            case 'assistant_text':
              // Once the assistant starts responding, stop recording automatically.
              stopListening();
              options.onText?.(data.text);
              break;

            case 'assistant_audio': {
              // Once the assistant starts responding, stop recording automatically.
              stopListening();

              // Decode base64 to Uint8Array
              const binaryString = atob(data.chunk);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }

              // Extract sample rate from mimeType (audio/pcm;rate=24000)
              let sampleRate = 24000;
              if (data.mimeType) {
                const match = data.mimeType.match(/rate=(\d+)/);
                if (match) sampleRate = parseInt(match[1]);
              }

              // Initialize audio queue if needed
              if (!audioQueueRef.current) {
                const ctx = getAudioContext();
                audioQueueRef.current = new AudioQueue(ctx, setIsSpeaking);
              }

              await audioQueueRef.current.addToQueue(bytes, sampleRate);
              break;
            }

            case 'tool_call':
              console.log('Tool call:', data.tool, data.args);
              options.onToolCall?.(data.tool, data.args);
              break;

            case 'turn_complete':
              // Defensive: ensure mic is off when a turn ends.
              stopListening();
              console.log('Turn complete');
              options.onTurnComplete?.();
              break;

            case 'interrupted':
              console.log('Response interrupted');
              audioQueueRef.current?.clear();
              break;

            case 'error':
              // This happens when we start streaming audio before the server session is ready.
              // Treat it as transient and don't flip the whole UI into an error state.
              if (data.message === 'Session not ready') {
                console.warn('Session not ready yet (ignoring)');
                return;
              }
              console.error('Session error:', data.message);
              sessionReadyDeferredRef.current?.reject(new Error(String(data.message || 'Session error')));
              options.onError?.(data.message);
              setStatus('error');
              break;

            case 'session_ended':
              console.log('Session ended');
              setStatus('disconnected');
              break;
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
      setTranscript(''); // Clear previous transcript
      console.log('Started listening');

    } catch (error) {
      console.error('Failed to start listening:', error);
      options.onError?.('Microphone access denied');
    }
  }, [status, connect, options]);
  // Disconnect
  const disconnect = useCallback(() => {
    stopListening();
    audioQueueRef.current?.clear();
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('disconnected');
  }, [stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [disconnect]);

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
