import React from 'react';
import { MapPin } from 'lucide-react';

const MapboxTokenMissing = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-8 text-center">
      <MapPin className="h-12 w-12 text-sbtp-green-500 mb-4" />
      <h3 className="text-lg font-semibold text-sbtp-brown-700 mb-2">Google Maps Loading...</h3>
      <p className="text-sbtp-brown-500 mb-4">
        The map is being initialized. Please wait a moment.
      </p>
    </div>
  );
};

export default MapboxTokenMissing;
