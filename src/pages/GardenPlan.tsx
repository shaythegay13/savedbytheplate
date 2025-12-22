import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useToast } from '@/hooks/use-toast';
import janeAvatar from '@/assets/jane-transparent.png';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: typeof window.SpeechRecognition;
  }
}

const GardenPlan = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<null | (typeof window.SpeechRecognition)>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [janeResponse, setJaneResponse] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + " ";
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

  const useBrowserTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('victoria') ||
        v.name.toLowerCase().includes('karen')
      );
      if (femaleVoice) utterance.voice = femaleVoice;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  const speakText = async (text: string) => {
    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      window.speechSynthesis?.cancel();
      
      setIsSpeaking(true);
      
      const formData = new FormData();
      formData.append('text', text);
      
      const response = await fetch('https://rxwynfplditdwqtjhkpw.supabase.co/functions/v1/voice-speak', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.use_browser_tts) {
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
      } else {
        useBrowserTTS(text);
      }
    } catch (error) {
      console.error('Speech error:', error);
      useBrowserTTS(text);
    }
  };

  const sendQuestion = async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);
    
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsSpeaking(false);
    }

    try {
      const apiResponse = await fetch(`https://rxwynfplditdwqtjhkpw.supabase.co/functions/v1/voice-ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text_question: transcript,
          context: {}
        })
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await apiResponse.json();
      const responseText = data.answer_text || "I'm here to help you with your garden!";
      
      let fullResponse = responseText;
      
      if (data.relevant_crops && data.relevant_crops.length > 0) {
        fullResponse += "\n\n📋 Related crops:";
        data.relevant_crops.slice(0, 3).forEach((crop: any) => {
          fullResponse += `\n• ${crop.name}${crop.category ? ` (${crop.category})` : ''}`;
        });
      }
      
      setJaneResponse(fullResponse);
      setTranscript(""); // Clear transcript after sending
      
      if (!isMuted) {
        speakText(responseText);
      }
      
    } catch (err) {
      console.error("Error sending request:", err);
      const errorMsg = err instanceof Error ? err.message : "Sorry, I encountered an error.";
      setJaneResponse(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleJaneClick = async () => {
    if (!recognition) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    // If currently listening, stop and send the question
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      // Send the question after stopping
      setTimeout(() => sendQuestion(), 100);
      return;
    }

    // Request mic permission and start listening
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      recognition.start();
      setIsListening(true);
      setJaneResponse(""); // Clear previous response
    } catch (err) {
      console.error("Microphone permission denied:", err);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to talk to Jane.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header with Jane Avatar and Speech Bubble */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                {/* Clickable Jane Avatar */}
                <div className="flex-shrink-0 text-center">
                  <button
                    onClick={handleJaneClick}
                    className={`relative group cursor-pointer transition-all duration-300 ${
                      isListening ? 'scale-105' : 'hover:scale-105'
                    }`}
                    aria-label={isListening ? "Click to send your question" : "Click to start talking to Jane"}
                  >
                    <img 
                      src={janeAvatar} 
                      alt="Jane - Your Garden Assistant" 
                      className={`h-48 object-contain drop-shadow-xl transition-all duration-300 ${
                        isListening 
                          ? 'animate-pulse ring-4 ring-green-400 ring-offset-4 rounded-full' 
                          : isSpeaking 
                          ? 'animate-bounce' 
                          : 'group-hover:drop-shadow-2xl'
                      }`}
                    />
                    {/* Status indicator */}
                    <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isListening 
                        ? 'bg-green-500 text-white animate-pulse' 
                        : isProcessing
                        ? 'bg-amber-500 text-white'
                        : isSpeaking
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-100 text-green-700 group-hover:bg-green-200'
                    }`}>
                      {isListening 
                        ? '🎤 Listening... (click to send)' 
                        : isProcessing 
                        ? '⏳ Thinking...' 
                        : isSpeaking 
                        ? '🔊 Speaking...' 
                        : '👆 Click to ask'}
                    </div>
                  </button>
                  <h1 className="text-4xl font-bold text-green-800 dark:text-green-400 mt-4">
                    Jane
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your Personal Gardening Assistant
                  </p>
                </div>

                {/* Speech Bubble / Dialog Box */}
                <div className="relative flex-grow max-w-md">
                  <div className={`relative bg-white dark:bg-gray-700 rounded-2xl p-5 shadow-lg border-2 transition-all duration-300 min-h-[120px] ${
                    isListening 
                      ? 'border-green-500 shadow-green-200' 
                      : isSpeaking 
                      ? 'border-blue-400 shadow-blue-100' 
                      : isProcessing 
                      ? 'border-amber-300 shadow-amber-50' 
                      : 'border-green-200'
                  }`}>
                    {/* Speech bubble pointer */}
                    <div className="hidden md:block absolute left-0 top-1/2 -translate-x-3 -translate-y-1/2">
                      <div className={`w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] transition-colors ${
                        isListening 
                          ? 'border-r-green-500' 
                          : isSpeaking 
                          ? 'border-r-blue-400' 
                          : isProcessing 
                          ? 'border-r-amber-300' 
                          : 'border-r-green-200'
                      }`}></div>
                    </div>
                    
                    {/* Content */}
                    {isListening && transcript ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-medium">
                          <span className="flex gap-0.5">
                            <span className="w-1.5 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="w-1.5 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '100ms' }}></span>
                            <span className="w-1.5 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></span>
                          </span>
                          You&apos;re saying:
                        </div>
                        <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                          {transcript}
                        </p>
                      </div>
                    ) : isListening ? (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <span className="flex gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </span>
                        <span className="text-sm font-medium">I&apos;m listening...</span>
                      </div>
                    ) : isProcessing ? (
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                        <span className="text-sm font-medium">Let me think about that...</span>
                      </div>
                    ) : janeResponse ? (
                      <div className="space-y-2">
                        {isSpeaking && (
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-medium mb-2">
                            <span className="flex gap-0.5">
                              <span className="w-1 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                              <span className="w-1 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '100ms' }}></span>
                              <span className="w-1 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></span>
                            </span>
                            Speaking...
                          </div>
                        )}
                        <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                          {janeResponse}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        👋 Hi! I&apos;m Jane. Click on me and ask me anything about gardening! When you&apos;re done speaking, click me again to get my answer. 🌱
                      </p>
                    )}
                  </div>
                  
                  {/* Mute button */}
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
                    className={`absolute -top-2 -right-2 p-2 rounded-full shadow-md transition-all ${
                      isMuted 
                        ? "bg-red-100 text-red-600 hover:bg-red-200" 
                        : "bg-green-100 text-green-600 hover:bg-green-200"
                    }`}
                    title={isMuted ? "Unmute Jane" : "Mute Jane"}
                  >
                    {isMuted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 5 6 9H2v6h4l5 4V5Z"/>
                        <line x1="22" x2="16" y1="9" y2="15"/>
                        <line x1="16" x2="22" y1="9" y2="15"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Example Questions */}
            <div className="mb-8 text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Try asking me:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    &quot;What vegetables grow well in shade?&quot;
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    &quot;I want to start a raised bed garden&quot;
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    &quot;What are good companion plants for tomatoes?&quot;
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    &quot;When should I plant lettuce in New York?&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl mb-2">🎤</div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Voice Powered
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Natural conversation with AI
                </p>
              </div>
              <div>
                <div className="text-4xl mb-2">🧠</div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Expert Advice
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Personalized gardening advice
                </p>
              </div>
              <div>
                <div className="text-4xl mb-2">🌍</div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Climate Aware
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tailored to your location
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GardenPlan;
