"use client";

import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_SUPABASE_URL = "https://rxwynfplditdwqtjhkpw.supabase.co";
const SUPABASE_URL = (import.meta as any)?.env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const VOICE_SPEAK_URL = `${SUPABASE_URL.replace(/\/+$/, "")}/functions/v1/voice-speak`;
const VOICE_ASK_URL = `${SUPABASE_URL.replace(/\/+$/, "")}/functions/v1/voice-ask`;


declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: typeof window.SpeechRecognition;
  }
}

interface PlanRequest {
  address?: string;
  latitude?: number;
  longitude?: number;
  method: string;
  size: string;
  growing_location: string;
  sunlight: string;
  soil_type: string;
  seasons: string[];
  time_commitment: string;
  experience: string;
  crop_interests: string[];
  preferences: string[];
  additional_notes?: string;
}

type MicPermissionStatus = 'unknown' | 'granted' | 'denied' | 'prompt';

interface VoiceBoxProps {
  onResponseChange?: (response: string) => void;
  onSpeakingChange?: (isSpeaking: boolean) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}

// Audio waveform visualizer component for listening/processing states
const AudioWaveform: React.FC<{ isActive: boolean; color?: string; barCount?: number }> = ({ 
  isActive, 
  color = "bg-green-500", 
  barCount = 5 
}) => {
  return (
    <div className="flex items-center justify-center gap-[3px] h-8" aria-hidden="true">
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-150 ${color} ${
            isActive ? "animate-waveform" : "h-1 opacity-30"
          }`}
          style={isActive ? {
            animationDelay: `${i * 0.12}s`,
            animationDuration: `${0.6 + (i % 3) * 0.15}s`,
          } : undefined}
        />
      ))}
    </div>
  );
};

const VoiceBox: React.FC<VoiceBoxProps> = ({ onResponseChange, onSpeakingChange, onProcessingChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<null | (typeof window.SpeechRecognition)>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [micPermission, setMicPermission] = useState<MicPermissionStatus>('unknown');
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Notify parent of state changes
  useEffect(() => {
    onResponseChange?.(response);
  }, [response, onResponseChange]);

  useEffect(() => {
    onSpeakingChange?.(isSpeaking);
  }, [isSpeaking, onSpeakingChange]);

  useEffect(() => {
    onProcessingChange?.(isProcessing);
  }, [isProcessing, onProcessingChange]);

  // Check microphone permission on mount
  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          setMicPermission(result.state as MicPermissionStatus);
          result.onchange = () => {
            setMicPermission(result.state as MicPermissionStatus);
          };
        } else {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasAudioInput = devices.some(d => d.kind === 'audioinput' && d.label);
          setMicPermission(hasAudioInput ? 'granted' : 'prompt');
        }
      } catch (err) {
        console.log('Could not check mic permission:', err);
        setMicPermission('prompt');
      }
    };

    checkMicPermission();
  }, []);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + " ";
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => setIsListening(false);

      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleListening = async () => {
    if (!recognition) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.",
        variant: "destructive"
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error("Microphone permission denied:", err);
      setMicPermission('denied');
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice features.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start recognition:", err);
        toast({
          title: "Error",
          description: "Failed to start voice recognition. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const clearTranscript = () => {
    setTranscript("");
    setResponse("");
  };

  const selectAndSpeakVoice = (utterance: SpeechSynthesisUtterance, text: string) => {
    const voices = window.speechSynthesis.getVoices();
    const preferredVoicePatterns = [
      /google.*female.*en-us/i, /google us english/i, /google.*us.*english/i,
      /microsoft.*aria/i, /microsoft.*jenny/i, /microsoft.*sara/i,
      /samantha/i, /ava/i, /allison/i, /susan/i,
      /zira/i, /hazel/i, /karen/i, /moira/i, /tessa/i, /victoria/i, /fiona/i,
      /female.*en/i, /en.*female/i,
    ];
    
    let selectedVoice = null;
    for (const pattern of preferredVoicePatterns) {
      selectedVoice = voices.find(v => pattern.test(v.name));
      if (selectedVoice) break;
    }
    
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('en-')) || voices[0];
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  // Split text into TTS-friendly chunks (max ~120 chars, split at sentence boundaries)
  const splitIntoTTSChunks = (text: string): string[] => {
    const MAX_CHUNK = 120;
    // Split at sentence-ending punctuation
    const rawSentences = text.split(/(?<=[.!?])\s+/g)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    const chunks: string[] = [];
    for (const sentence of rawSentences) {
      if (sentence.length <= MAX_CHUNK) {
        chunks.push(sentence);
      } else {
        // Split long sentences at commas or semicolons
        const parts = sentence.split(/(?<=[,;])\s+/g);
        let current = '';
        for (const part of parts) {
          if (current && (current.length + part.length + 1) > MAX_CHUNK) {
            chunks.push(current.trim());
            current = part;
          } else {
            current = current ? current + ' ' + part : part;
          }
        }
        if (current.trim()) chunks.push(current.trim());
      }
    }
    return chunks.length > 0 ? chunks : [text];
  };

  const ttsQueueRef = useRef<SpeechSynthesisUtterance[]>([]);
  const ttsPlayingRef = useRef(false);

  const playNextUtterance = () => {
    if (ttsQueueRef.current.length === 0) {
      ttsPlayingRef.current = false;
      setIsSpeaking(false);
      console.log('[TTS] Queue empty, done speaking');
      return;
    }

    const utterance = ttsQueueRef.current.shift()!;
    ttsPlayingRef.current = true;

    utterance.onstart = () => {
      console.log(`[TTS] Utterance started: "${utterance.text.slice(0, 50)}..." pending=${ttsQueueRef.current.length}`);
    };
    utterance.onboundary = (e) => {
      console.log(`[TTS] Boundary: ${e.name} at char ${e.charIndex}`);
    };
    utterance.onend = () => {
      console.log(`[TTS] Utterance ended, remaining=${ttsQueueRef.current.length}`);
      // Chain to next utterance
      playNextUtterance();
    };
    utterance.onerror = (e) => {
      console.error(`[TTS] Utterance error: ${e.error}, remaining=${ttsQueueRef.current.length}`);
      // Try next utterance on error (don't stop the whole queue)
      if (ttsQueueRef.current.length > 0) {
        setTimeout(() => playNextUtterance(), 100);
      } else {
        ttsPlayingRef.current = false;
        setIsSpeaking(false);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const useBrowserTTS = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }

    // Cancel any ongoing speech and clear queue
    window.speechSynthesis.cancel();
    ttsQueueRef.current = [];
    ttsPlayingRef.current = false;

    const chunks = splitIntoTTSChunks(text);
    console.log(`[TTS] Queueing ${chunks.length} chunks for speech`);

    const voices = window.speechSynthesis.getVoices();

    const buildUtterances = (voiceList: SpeechSynthesisVoice[]) => {
      // Find preferred voice once
      const preferredVoicePatterns = [
        /google.*female.*en-us/i, /google us english/i, /google.*us.*english/i,
        /microsoft.*aria/i, /microsoft.*jenny/i, /microsoft.*sara/i,
        /samantha/i, /ava/i, /allison/i, /susan/i,
        /zira/i, /hazel/i, /karen/i, /moira/i, /tessa/i, /victoria/i, /fiona/i,
        /female.*en/i, /en.*female/i,
      ];
      let selectedVoice: SpeechSynthesisVoice | null = null;
      for (const pattern of preferredVoicePatterns) {
        selectedVoice = voiceList.find(v => pattern.test(v.name)) || null;
        if (selectedVoice) break;
      }
      if (!selectedVoice) {
        selectedVoice = voiceList.find(v => v.lang.startsWith('en-')) || voiceList[0] || null;
      }
      console.log(`[TTS] Selected voice: ${selectedVoice?.name || 'default'}`);

      for (const chunk of chunks) {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        if (selectedVoice) utterance.voice = selectedVoice;
        ttsQueueRef.current.push(utterance);
      }

      // Start playing the queue
      playNextUtterance();
    };

    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        buildUtterances(window.speechSynthesis.getVoices());
      };
    } else {
      buildUtterances(voices);
    }
  };

  const speakText = async (text: string) => {
    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current = null;
      }
      window.speechSynthesis?.cancel();
      
      setIsSpeaking(true);
      
      const formData = new FormData();
      formData.append('text', text);
      
      const response = await fetch(VOICE_SPEAK_URL, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.use_browser_tts) {
        useBrowserTTS(text);
        return;
      }
      
      if (!response.ok) {
        useBrowserTTS(text);
        return;
      }
      
      const audioBytes = atob(data.audio_base64);
      const arrayBuffer = new ArrayBuffer(audioBytes.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < audioBytes.length; i++) {
        view[i] = audioBytes.charCodeAt(i);
      }
      
      const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      
      currentAudioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        currentAudioRef.current = null;
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        currentAudioRef.current = null;
      };
      
      await audio.play();
    } catch (error) {
      console.error('Speech error:', error);
      useBrowserTTS(text);
    }
  };

  const sendPlanRequest = async (notes: string) => {
    if (!notes.trim()) return;

    setIsProcessing(true);
    
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsSpeaking(false);
    }
    setResponse("");

    try {
      const apiResponse = await fetch(VOICE_ASK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text_question: notes,
          context: {}
        })
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await apiResponse.json();
      
      const responseText = data.answer_text || "I'm here to help you plan your garden!";
      
      let fullResponse = responseText;
      
      if (data.relevant_crops && data.relevant_crops.length > 0) {
        fullResponse += "\n\n📋 Related crops from our database:";
        data.relevant_crops.slice(0, 3).forEach((crop: any) => {
          fullResponse += `\n• ${crop.name}${crop.category ? ` (${crop.category})` : ''}`;
        });
      }
      
      if (data.garden_plan) {
        fullResponse += "\n\n🌱 Full Garden Plan:\n" + JSON.stringify(data.garden_plan, null, 2);
      }
      
      setResponse(fullResponse);
      if (!isMuted) {
        speakText(responseText);
      }
      
    } catch (err) {
      console.error("Error sending request:", err);
      const errorMsg = err instanceof Error ? err.message : "Sorry, I encountered an error. Please try again.";
      setResponse(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Determine current state label and color
  const getStateInfo = () => {
    if (isListening) return { label: "Listening...", emoji: "🎤", color: "text-green-600" };
    if (isProcessing) return { label: "Jane is thinking...", emoji: "🧠", color: "text-amber-600" };
    if (isSpeaking) return { label: "Jane is speaking...", emoji: "🔊", color: "text-blue-600" };
    return { label: "Tap the mic to ask Jane", emoji: "🌱", color: "text-gray-500" };
  };

  const stateInfo = getStateInfo();

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      {/* Microphone Permission Status */}
      <div className="flex justify-center mb-3">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
          micPermission === 'granted' 
            ? 'bg-green-100 text-green-700' 
            : micPermission === 'denied'
            ? 'bg-red-100 text-red-700'
            : 'bg-amber-100 text-amber-700'
        }`}>
          {micPermission === 'granted' ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              </svg>
              Microphone ready
            </>
          ) : micPermission === 'denied' ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" x2="22" y1="2" y2="22"/>
                <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/>
                <path d="M5 10v2a7 7 0 0 0 12 5"/>
                <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
              Microphone blocked
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              Tap mic to allow access
            </>
          )}
        </div>
      </div>

      {/* Mic button with waveform ring */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          {/* Animated ring for listening state */}
          {isListening && (
            <div className="absolute inset-0 -m-3 rounded-full border-4 border-green-400 animate-ping opacity-30" />
          )}
          {isProcessing && (
            <div className="absolute inset-0 -m-3 rounded-full border-4 border-amber-400 animate-pulse opacity-40" />
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleListening();
            }}
            type="button"
            aria-label={isListening ? "Stop listening" : "Start voice recording"}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 touch-manipulation select-none ${
              isListening
                ? "bg-gradient-to-br from-green-500 to-green-300 shadow-lg shadow-green-300"
                : isProcessing
                ? "bg-gradient-to-br from-amber-500 to-amber-300 shadow-lg shadow-amber-200"
                : isSpeaking
                ? "bg-gradient-to-br from-blue-500 to-blue-300 shadow-lg shadow-blue-200"
                : micPermission === 'denied'
                ? "bg-gradient-to-br from-gray-400 to-gray-300"
                : "bg-gradient-to-br from-green-700 to-green-400 hover:shadow-lg hover:shadow-green-200"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </button>
        </div>

        {/* Waveform visualizer */}
        <div className="mt-3 h-8">
          {(isListening || isProcessing || isSpeaking) ? (
            <AudioWaveform
              isActive={true}
              color={isListening ? "bg-green-500" : isProcessing ? "bg-amber-500" : "bg-blue-500"}
              barCount={7}
            />
          ) : null}
        </div>

        {/* State label */}
        <p className={`text-sm font-medium mt-1 ${stateInfo.color}`}>
          {stateInfo.emoji} {stateInfo.label}
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            if (!isMuted && currentAudioRef.current) {
              currentAudioRef.current.pause();
              currentAudioRef.current = null;
              setIsSpeaking(false);
            }
            window.speechSynthesis?.cancel();
          }}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${
            isMuted 
              ? "bg-red-100 text-red-700 hover:bg-red-200" 
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
          title={isMuted ? "Unmute voice responses" : "Mute voice responses"}
        >
          {isMuted ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H2v6h4l5 4V5Z"/>
                <line x1="22" x2="16" y1="9" y2="15"/>
                <line x1="16" x2="22" y1="9" y2="15"/>
              </svg>
              Muted
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
              Sound On
            </>
          )}
        </button>
      </div>

      <div className="relative mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Input:</label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Your speech will appear here..."
          className="w-full h-32 p-4 border-2 border-green-200 rounded-xl resize-none focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">{transcript.length} characters</div>
      </div>

      {response && (
        <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <label className="block text-sm font-semibold text-blue-700 mb-2">Garden Plan:</label>
          <div className="text-sm text-gray-700 max-h-64 overflow-y-auto whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button onClick={clearTranscript} disabled={!transcript && !response} className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all">Clear</button>
        <button onClick={() => {
          navigator.clipboard.writeText(response || transcript);
          toast({ title: "Copied!", description: "Text copied to clipboard" });
        }} disabled={!transcript && !response} className="flex-1 px-4 py-3 bg-gradient-to-r from-green-700 to-green-500 text-white rounded-lg font-semibold hover:from-green-800 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg">Copy</button>
        <button onClick={() => sendPlanRequest(transcript)} disabled={!transcript || isProcessing} className="flex-1 px-4 py-3 bg-gradient-to-r from-sbtp-green-600 to-sbtp-green-500 text-white rounded-lg font-semibold hover:from-sbtp-green-700 hover:to-sbtp-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg">
          {isProcessing ? "Processing..." : "Generate Plan"}
        </button>
      </div>
      
      {!recognition && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          ⚠️ Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
        </div>
      )}
    </div>
  );
};

export default VoiceBox;
