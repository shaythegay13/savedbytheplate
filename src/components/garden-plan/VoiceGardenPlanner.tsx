"use client";

import React, { useState, useEffect, useRef } from "react";

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

const VoiceBox: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<null | (typeof window.SpeechRecognition)>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

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

        // Only append final results to avoid duplication
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

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const clearTranscript = () => {
    setTranscript("");
    setResponse("");
  };

  // Use browser's built-in speech synthesis as fallback
  const useBrowserTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  // Speak text using Voice API with browser TTS fallback
  const speakText = async (text: string) => {
    try {
      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current = null;
      }
      window.speechSynthesis?.cancel(); // Also cancel any browser TTS
      
      setIsSpeaking(true);
      
      // Call voice API to generate speech
      const formData = new FormData();
      formData.append('text', text);
      
      const response = await fetch('https://rxwynfplditdwqtjhkpw.supabase.co/functions/v1/voice-speak', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Check if server tells us to use browser TTS
        if (data.use_browser_tts) {
          console.log('Using browser TTS fallback');
          useBrowserTTS(text);
          return;
        }
        
        // Decode base64 audio and play it
        const audioBytes = atob(data.audio_base64);
        const arrayBuffer = new ArrayBuffer(audioBytes.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < audioBytes.length; i++) {
          view[i] = audioBytes.charCodeAt(i);
        }
        
        const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        
        // Store reference to current audio
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
      } else {
        // Fallback to browser TTS on error
        console.log('API error, using browser TTS fallback');
        useBrowserTTS(text);
      }
    } catch (error) {
      console.error('Speech error:', error);
      // Fallback to browser TTS
      useBrowserTTS(text);
    }
  };

  // Send transcript to conversational API
  const sendPlanRequest = async (notes: string) => {
    if (!notes.trim()) return;

    setIsProcessing(true);
    
    // Stop any currently speaking audio when new request is made
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsSpeaking(false);
    }
    setResponse("");

    try {
      // Use conversational API endpoint
      const apiResponse = await fetch(`https://rxwynfplditdwqtjhkpw.supabase.co/functions/v1/voice-ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text_question: notes,
          context: {}
        })
      });

      const data = await apiResponse.json();
      console.log("API response:", data);
      
      // Get the conversational response
      const responseText = data.answer_text || "I'm here to help you plan your garden!";
      
      // If there's a full garden plan, show it too
      let fullResponse = responseText;
      if (data.garden_plan) {
        fullResponse += "\n\n--- Full Garden Plan ---\n" + data.garden_plan;
      }
      
      setResponse(fullResponse);
      
      // Speak the conversational response (not the full plan)
      speakText(responseText);
      
    } catch (err) {
      console.error("Error sending request:", err);
      const errorMsg = "Sorry, I encountered an error. Please try again.";
      setResponse(errorMsg);
      speakText(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <div className="flex justify-center mb-6">
        <button
          onClick={toggleListening}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 ${
            isListening
              ? "bg-gradient-to-br from-green-500 to-green-300 shadow-lg shadow-green-300 animate-pulse"
              : "bg-gradient-to-br from-green-700 to-green-400 hover:shadow-lg hover:shadow-green-200"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
          {isListening && <span className="absolute -bottom-2 text-xs font-semibold text-green-700 animate-bounce">Listening...</span>}
        </button>
      </div>

      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          {isListening ? "🎤 Listening..." : isSpeaking ? "🔊 Speaking..." : isProcessing ? "⏳ Processing..." : "Click the microphone to start"}
        </p>
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
        <button onClick={clearTranscript} disabled={!transcript && !response} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all">Clear</button>
        <button onClick={() => navigator.clipboard.writeText(response || transcript)} disabled={!transcript && !response} className="flex-1 px-4 py-2 bg-gradient-to-r from-green-700 to-green-500 text-white rounded-lg font-semibold hover:from-green-800 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg">Copy</button>
        <button onClick={() => sendPlanRequest(transcript)} disabled={!transcript || isProcessing} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg">
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