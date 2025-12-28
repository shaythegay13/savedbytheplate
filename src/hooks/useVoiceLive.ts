import { useState, useRef, useCallback, useEffect } from 'react';

const VOICE_LIVE_WS_URL = 'wss://rxwynfplditdwqtjhkpw.supabase.co/functions/v1/voice-ask-live';

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

  // Initialize audio context
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    }
    return audioContextRef.current;
  }, []);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('Already connected');
      return;
    }

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
              setStatus('connected');
              break;

            case 'assistant_text':
              setTranscript(prev => prev + data.text);
              options.onText?.(data.text);
              break;

            case 'assistant_audio':
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

            case 'tool_call':
              console.log('Tool call:', data.tool, data.args);
              options.onToolCall?.(data.tool, data.args);
              break;

            case 'turn_complete':
              console.log('Turn complete');
              options.onTurnComplete?.();
              break;

            case 'interrupted':
              console.log('Response interrupted');
              audioQueueRef.current?.clear();
              break;

            case 'error':
              console.error('Session error:', data.message);
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
        setStatus('error');
        options.onError?.('Connection error');
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setStatus('disconnected');
        stopListening();
      };

    } catch (error) {
      console.error('Failed to connect:', error);
      setStatus('error');
      options.onError?.('Failed to connect');
    }
  }, [options, getAudioContext]);

  // Start listening (recording)
  const startListening = useCallback(async () => {
    if (status !== 'connected') {
      console.log('Not connected, connecting first...');
      await connect();
      // Wait a bit for connection to establish
      await new Promise(resolve => setTimeout(resolve, 500));
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

      processorRef.current.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        
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

  // Stop listening
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
