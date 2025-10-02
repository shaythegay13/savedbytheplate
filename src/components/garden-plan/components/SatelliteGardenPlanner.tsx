import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from "@/components/map/MapConfig";

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
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) return;

    console.log('Initializing map with token:', MAPBOX_TOKEN);
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Determine initial center from location
    let initialCenter: [number, number] = [-74.006, 40.7128];
    if (initialLocation?.lng && initialLocation?.lat) {
      initialCenter = [initialLocation.lng, initialLocation.lat];
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: initialCenter,
      zoom: 19,
      pitch: 45
    });

    // Wait for map to load
    map.current.on('load', () => {
      console.log('Map loaded successfully');
      setIsMapReady(true);
      
      // Add a marker for the location
      if (initialLocation?.lat && initialLocation?.lng) {
        new mapboxgl.Marker({ color: '#22c55e' })
          .setLngLat([initialLocation.lng, initialLocation.lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<div class="p-2"><strong>Your Garden Location</strong></div>`
            )
          )
          .addTo(map.current!);
      }
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
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