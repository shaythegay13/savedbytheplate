import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-center mb-8">
        <div className="text-8xl mb-6 animate-bounce">🌱</div>
        <h3 className="text-2xl font-bold text-sbtp-green-800 mb-4">
          Please be patient while we generate your AI plan!
        </h3>
        <div className="flex items-center justify-center gap-2 text-sbtp-brown-600">
          <div className="w-2 h-2 bg-sbtp-green-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-sbtp-green-600 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-sbtp-green-600 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;