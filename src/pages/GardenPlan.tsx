import VoiceGardenPlanner from '@/components/garden-plan/VoiceGardenPlanner';
import Navbar from '@/components/layout/Navbar';
import janeAvatar from '@/assets/jane-transparent.png';

const GardenPlan = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header with Jane Avatar */}
            <div className="text-center mb-8">
              <img 
                src={janeAvatar} 
                alt="Jane - Your Garden Assistant" 
                className="h-48 mx-auto object-contain mb-4 drop-shadow-xl animate-float"
              />
              <h1 className="text-5xl font-bold text-green-800 dark:text-green-400 mb-4">
                Jane
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                Your Personal Gardening Assistant
              </p>
              <p className="text-md text-gray-500 dark:text-gray-400">
                Click the microphone and ask me anything about gardening!
              </p>
            </div>

            {/* Example Questions - MOVED ABOVE VOICE INTERFACE */}
            <div className="mb-8 text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Try asking me:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    "What vegetables grow well in shade?"
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    "I want to start a raised bed garden"
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    "What are good companion plants for tomatoes?"
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    "When should I plant lettuce in New York?"
                  </p>
                </div>
              </div>
            </div>

            {/* Voice Interface */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <VoiceGardenPlanner />
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
