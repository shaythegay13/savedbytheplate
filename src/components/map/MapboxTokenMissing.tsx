
import React from 'react';
import { MapPin } from 'lucide-react';

const MapboxTokenMissing = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-8 text-center">
      <MapPin className="h-12 w-12 text-sbtp-green-500 mb-4" />
      <h3 className="text-lg font-semibold text-sbtp-brown-700 mb-2">Mapbox Token Required</h3>
      <p className="text-sbtp-brown-500 mb-4">
        To display the interactive map, you need to add your Mapbox public access token.
      </p>
      <a 
        href="https://account.mapbox.com/access-tokens/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-sbtp-blue underline"
      >
        Get a Mapbox token here
      </a>
      <div className="mt-4 p-4 bg-white rounded-md w-full max-w-md">
        <p className="text-sm text-sbtp-brown-500 mb-2">
          Replace 'YOUR_MAPBOX_TOKEN' in the MapComponent.tsx file with your token.
        </p>
        <code className="block p-2 bg-gray-100 rounded text-xs overflow-auto">
          const MAPBOX_TOKEN = 'pk.eyJ1Ijoi...'
        </code>
      </div>
    </div>
  );
};

export default MapboxTokenMissing;
