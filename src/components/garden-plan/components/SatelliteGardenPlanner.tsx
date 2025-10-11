import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { GOOGLE_MAPS_API_KEY } from "@/components/map/MapConfig";

interface SatelliteGardenPlannerProps {
  plantRecommendations: any[];
  userAddress?: string;
  initialLocation?: { address?: string; lat?: number; lng?: number };
  onLayoutComplete: (placements: any[]) => void;
}

const SatelliteGardenPlanner: React.FC<SatelliteGardenPlannerProps> = ({
  initialLocation,
  onLayoutComplete
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !GOOGLE_MAPS_API_KEY) return;

    console.log('Initializing Google Maps');
    
    // Determine initial center from location
    let initialCenter = { lat: 40.7128, lng: -74.006 };
    if (initialLocation?.lat && initialLocation?.lng) {
      initialCenter = { lat: initialLocation.lat, lng: initialLocation.lng };
    }

    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=marker&v=weekly&callback=initGardenMap`;
      script.async = true;
      script.defer = true;
      
      (window as any).initGardenMap = async () => {
        const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;
        
        map.current = new Map(mapContainer.current!, {
          center: initialCenter,
          zoom: 19,
          mapTypeId: 'satellite',
          tilt: 45,
          mapTypeControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
          },
          streetViewControl: false,
          fullscreenControl: true,
        });

        console.log('Map loaded successfully');
        setIsMapReady(true);
        
        // Add a marker for the location
        if (initialLocation?.lat && initialLocation?.lng) {
          marker.current = new AdvancedMarkerElement({
            map: map.current,
            position: initialCenter,
            title: 'Your Garden Location',
          });
        }
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();

    return () => {
      if (marker.current) {
        marker.current.map = null;
      }
    };
  }, [initialLocation]);

  const handleComplete = () => {
    onLayoutComplete([]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-sbtp-green-800 flex items-center justify-center gap-2">
          <MapPin className="h-6 w-6" />
          Confirm Geolocation
        </CardTitle>
        <p className="text-sbtp-brown-600">
          Verify that this is the location you want to place your garden.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Map Container */}
        <div className="relative h-[500px] w-full rounded-lg overflow-hidden border border-gray-300">
          <div ref={mapContainer} className="absolute inset-0" />
          {!isMapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
              <p>Loading map...</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleComplete}
            className="bg-sbtp-green-500 hover:bg-sbtp-green-600 px-8"
          >
            Confirm Location & Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SatelliteGardenPlanner;
