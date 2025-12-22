import { useState } from 'react';
import VoiceGardenPlanner from '@/components/garden-plan/VoiceGardenPlanner';
import Navbar from '@/components/layout/Navbar';
import janeAvatar from '@/assets/jane-transparent.png';

const GardenPlan = () => {
  const [janeResponse, setJaneResponse] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header with Jane Avatar and Speech Bubble */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                {/* Jane Avatar */}
                <div className="flex-shrink-0 text-center">
                  <img 
                    src={janeAvatar} 
                    alt="Jane - Your Garden Assistant" 
                    className={`h-48 object-contain drop-shadow-xl animate-float ${isSpeaking ? 'animate-pulse' : ''}`}
                  />
                  <h1 className="text-4xl font-bold text-green-800 dark:text-green-400 mt-2">
                    Jane
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your Personal Gardening Assistant
                  </p>
                </div>

                {/* Speech Bubble */}
                <div className="relative flex-grow max-w-md">
                  <div className={`relative bg-white dark:bg-gray-700 rounded-2xl p-5 shadow-lg border-2 transition-all duration-300 ${
                    isSpeaking 
                      ? 'border-green-400 shadow-green-100' 
                      : isProcessing 
                      ? 'border-amber-300 shadow-amber-50' 
                      : 'border-green-200'
                  }`}>
                    {/* Speech bubble pointer */}
                    <div className="hidden md:block absolute left-0 top-1/2 -translate-x-3 -translate-y-1/2">
                      <div className={`w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] transition-colors ${
                        isSpeaking 
                          ? 'border-r-green-400' 
                          : isProcessing 
                          ? 'border-r-amber-300' 
                          : 'border-r-green-200'
                      }`}></div>
                    </div>
                    
                    {/* Content */}
                    {isProcessing ? (
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                        <span className="text-sm font-medium">Thinking...</span>
                      </div>
                    ) : janeResponse ? (
                      <div className="space-y-2">
                        {isSpeaking && (
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-medium mb-2">
                            <span className="flex gap-0.5">
                              <span className="w-1 h-3 bg-green-500 rounded-full animate-pulse"></span>
                              <span className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '100ms' }}></span>
                              <span className="w-1 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></span>
                            </span>
                            Speaking...
                          </div>
                        )}
                        <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed max-h-40 overflow-y-auto">
                          {janeResponse.split('\n')[0]}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                        Hi! I&apos;m Jane. Click the microphone below and ask me anything about gardening! 🌱
                      </p>
                    )}
                  </div>
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

            {/* Voice Interface */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <VoiceGardenPlanner 
                onResponseChange={setJaneResponse}
                onSpeakingChange={setIsSpeaking}
                onProcessingChange={setIsProcessing}
              />
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
