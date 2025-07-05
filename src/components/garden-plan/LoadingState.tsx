import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sbtp-green-500 mb-4"></div>
      <h3 className="text-xl font-semibold text-sbtp-green-800 mb-2">🤖 AI Agent Creating Your Smart Garden Plan</h3>
      <p className="text-sbtp-brown-600 text-center max-w-md">
        Our learning AI is analyzing your space, climate, and preferences alongside community data to create the most accurate personalized gardening plan for you...
      </p>
    </div>
  );
};

export default LoadingState;