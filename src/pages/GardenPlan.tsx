import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Star, Loader2 } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import janeAvatar from '@/assets/jane-transparent.png';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: typeof window.SpeechRecognition;
  }
}

const TRIAL_DURATION_DAYS = 2;

const GardenPlan = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [trialStatus, setTrialStatus] = useState<{
    isOnTrial: boolean;
    trialExpired: boolean;
    trialEndsAt: Date | null;
    daysRemaining: number;
  }>({ isOnTrial: false, trialExpired: false, trialEndsAt: null, daysRemaining: 0 });
  const [trialLoading, setTrialLoading] = useState(true);
  const { subscribed, loading: subscriptionLoading } = useSubscription(user);
  const navigate = useNavigate();
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<null | (typeof window.SpeechRecognition)>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [janeResponse, setJaneResponse] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check and manage trial status
  useEffect(() => {
    const checkTrialStatus = async () => {
      if (!user) {
        setTrialLoading(false);
        return;
      }

      try {
        // Get user's profile to check trial status
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('jane_trial_started_at')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setTrialLoading(false);
          return;
        }

        if (!profile?.jane_trial_started_at) {
          // Start trial for new users
          const now = new Date();
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ jane_trial_started_at: now.toISOString() })
            .eq('id', user.id);

          if (updateError) {
            console.error('Error starting trial:', updateError);
          }

          const trialEndsAt = new Date(now.getTime() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000);
          setTrialStatus({
            isOnTrial: true,
            trialExpired: false,
            trialEndsAt,
            daysRemaining: TRIAL_DURATION_DAYS
          });
        } else {
          // Check existing trial
          const trialStarted = new Date(profile.jane_trial_started_at);
          const trialEndsAt = new Date(trialStarted.getTime() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000);
          const now = new Date();
          const trialExpired = now > trialEndsAt;
          const daysRemaining = Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

          setTrialStatus({
            isOnTrial: !trialExpired,
            trialExpired,
            trialEndsAt,
            daysRemaining
          });
        }
      } catch (err) {
        console.error('Error checking trial:', err);
      } finally {
        setTrialLoading(false);
      }
    };

    if (user && !subscribed) {
      checkTrialStatus();
    } else {
      setTrialLoading(false);
    }
  }, [user, subscribed]);

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
      
      // Always try to parse JSON response (even on 429)
      const data = await response.json().catch(() => null);
      
      // If rate limited or instructed to use browser TTS, fall back gracefully
      if (!response.ok || data?.use_browser_tts) {
        console.log('Using browser TTS (rate limit or fallback)');
        useBrowserTTS(text);
        return;
      }
      
      if (data?.audio_base64) {
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

  const sendQuestion = async (questionText?: string) => {
    const question = questionText || transcript;
    if (!question.trim()) return;

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
          text_question: question,
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

  // Show loading state while checking auth, subscription, and trial
  if (authLoading || subscriptionLoading || trialLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  // Allow access if subscribed OR on active trial
  const hasAccess = subscribed || (user && trialStatus.isOnTrial && !trialStatus.trialExpired);

  // Show paywall for non-subscribers with expired/no trial
  if (!user || !hasAccess) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto py-12 px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="border-2 border-amber-200 shadow-xl">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 relative">
                    <img 
                      src={janeAvatar} 
                      alt="Jane - Your Garden Assistant" 
                      className="h-32 sm:h-40 object-contain opacity-50 grayscale"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-amber-500 rounded-full p-3">
                        <Lock className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-green-800 dark:text-green-400">
                    {trialStatus.trialExpired ? 'Trial Ended' : 'Premium Feature'}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                    {trialStatus.trialExpired 
                      ? 'Your 2-day free trial has ended. Subscribe to continue using Ask Jane!'
                      : !user 
                      ? 'Sign in to start your free 2-day trial of Ask Jane!'
                      : 'Ask Jane is available exclusively for premium subscribers'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!user && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200">
                      <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                        🎉 Free 2-Day Trial
                      </h3>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        Sign in now to try Ask Jane free for 2 days. No credit card required!
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2 flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      What you'll get with Premium:
                    </h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Ask Jane - Your Personal AI Gardening Assistant</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Voice-powered gardening advice and tips</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Curated educational content</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Discord community access</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {!user ? (
                      <>
                        <Button 
                          onClick={() => navigate('/auth')}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                        >
                          Sign In to Start Free Trial
                        </Button>
                        <p className="text-center text-sm text-gray-500">
                          Already have an account?{' '}
                          <Link to="/auth" className="text-green-600 hover:underline">
                            Log in here
                          </Link>
                        </p>
                      </>
                    ) : (
                      <Button 
                        onClick={() => navigate('/premium')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                      >
                        <Star className="mr-2 h-5 w-5" />
                        Upgrade to Premium
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show trial banner if user is on trial
  const trialBanner = !subscribed && trialStatus.isOnTrial && (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 text-center text-sm">
      <span className="font-medium">🎉 Free Trial:</span> {trialStatus.daysRemaining} day{trialStatus.daysRemaining !== 1 ? 's' : ''} remaining.{' '}
      <Link to="/premium" className="underline font-semibold hover:text-blue-100">
        Subscribe now
      </Link>{' '}
      to keep using Ask Jane!
    </div>
  );

  return (
    <>
      <Navbar />
      {trialBanner}
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                {/* Clickable Jane Avatar */}
                <div className="flex-shrink-0 text-center">
                  <button
                    onClick={handleJaneClick}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      handleJaneClick();
                    }}
                    className={`relative group cursor-pointer transition-all duration-300 touch-manipulation ${
                      isListening ? 'scale-105' : 'hover:scale-105 active:scale-105'
                    }`}
                    aria-label={isListening ? "Tap to send your question" : "Tap to start talking to Jane"}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {/* Glow effect when speaking */}
                    {isSpeaking && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-blue-400/30 blur-xl animate-pulse scale-110" />
                        <div className="absolute inset-0 rounded-full bg-blue-300/20 blur-2xl animate-ping scale-125" style={{ animationDuration: '2s' }} />
                        <div className="absolute inset-0 rounded-full border-4 border-blue-400/50 animate-ping scale-105" style={{ animationDuration: '1.5s' }} />
                      </>
                    )}
                    {/* Glow effect when listening */}
                    {isListening && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-green-400/30 blur-xl animate-pulse scale-110" />
                        <div className="absolute inset-0 rounded-full border-4 border-green-400/50 animate-ping scale-105" style={{ animationDuration: '1.5s' }} />
                      </>
                    )}
                    <img 
                      src={janeAvatar} 
                      alt="Jane - Your Garden Assistant" 
                      className={`relative h-32 sm:h-48 object-contain drop-shadow-xl transition-all duration-300 ${
                        isListening 
                          ? 'scale-105' 
                          : isSpeaking 
                          ? 'scale-105 drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]' 
                          : 'group-hover:drop-shadow-2xl'
                      }`}
                    />
                    {/* Status indicator */}
                    <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isListening 
                        ? 'bg-green-500 text-white animate-pulse' 
                        : isProcessing
                        ? 'bg-amber-500 text-white'
                        : isSpeaking
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-100 text-green-700 group-hover:bg-green-200 active:bg-green-200'
                    }`}>
                      {isListening 
                        ? '🎤 Listening... (tap to send)' 
                        : isProcessing 
                        ? '⏳ Thinking...' 
                        : isSpeaking 
                        ? '🔊 Speaking...' 
                        : '👆 Tap to ask'}
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
                {[
                  "What vegetables grow well in shade?",
                  "I want to start a raised bed garden",
                  "What are good companion plants for tomatoes?",
                  "When should I plant lettuce in New York?"
                ].map((question) => (
                  <button
                    key={question}
                    onClick={() => sendQuestion(question)}
                    disabled={isProcessing || isListening}
                    className={`bg-green-100 dark:bg-green-900 rounded-lg p-4 text-left transition-all duration-200 border-2 border-transparent ${
                      isProcessing || isListening
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-green-200 dark:hover:bg-green-800 hover:border-green-400 hover:scale-[1.02] cursor-pointer hover:shadow-md'
                    }`}
                  >
                    <p className="text-sm text-green-800 dark:text-green-200">
                      &quot;{question}&quot;
                    </p>
                  </button>
                ))}
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
