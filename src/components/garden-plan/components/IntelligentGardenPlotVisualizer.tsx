import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ruler, MapPin } from "lucide-react";
import { researchLocationDimensions } from '@/services/locationResearchService';
import { loadGoogleMaps } from '@/lib/googleMapsLoader';

interface GardenLayout {
  section: string;
  plants: string[];
  size: string;
  notes: string;
}

interface IntelligentGardenPlotVisualizerProps {
  gardenLayout: GardenLayout[];
  spaceType: string;
  spaceSize: string;
  locationDescription?: string;
}

// Known locations with coordinates for mapping
const locationCoordinates: Record<string, { lat: number; lng: number; zoom: number }> = {
  "sheep's meadow": { lat: 40.7759, lng: -73.9750, zoom: 17 },
  "central park": { lat: 40.7829, lng: -73.9654, zoom: 15 }
};

const IntelligentGardenPlotVisualizer: React.FC<IntelligentGardenPlotVisualizerProps> = ({
  gardenLayout,
  spaceType,
  spaceSize,
  locationDescription = "Your Garden Location"
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [locationData, setLocationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setLoading(true);
        const data = await researchLocationDimensions(locationDescription);
        setLocationData(data);
      } catch (error) {
        console.error('Failed to research location:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, [locationDescription]);

  useEffect(() => {
    if (!mapContainer.current || !locationData || mapInitialized) return;

    // Get coordinates for the location
    const coords = locationCoordinates["sheep's meadow"] || locationCoordinates["central park"] || 
                  { lat: 40.7829, lng: -73.9654, zoom: 15 };

    const initMap = async () => {
      try {
        await loadGoogleMaps();
        const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;
        
        map.current = new Map(mapContainer.current!, {
          center: { lat: coords.lat, lng: coords.lng },
          zoom: coords.zoom,
          mapTypeId: 'satellite',
          mapId: 'food-access-map', // Required for Advanced Markers and satellite view
          tilt: 0,
          heading: 0,
          mapTypeControl: true,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
          },
        });

        // Calculate approximate bounds for the area
        const lengthInDegrees = (locationData.estimatedLength || 500) * 0.000009;
        const widthInDegrees = (locationData.estimatedWidth || 300) * 0.000009;

        // Create garden zone overlays
        gardenLayout.forEach((section, index) => {
          const zoneColors = ['#16a34a', '#059669', '#dc2626', '#2563eb'];
          const color = zoneColors[index % 4];
          
          // Position zones around the area
          const angle = (index * Math.PI * 2) / gardenLayout.length;
          const offsetLat = Math.sin(angle) * widthInDegrees * 0.3;
          const offsetLng = Math.cos(angle) * lengthInDegrees * 0.3;
          
          const zoneSize = lengthInDegrees * 0.15;
          
          const zoneBounds = [
            { lat: coords.lat + offsetLat - zoneSize, lng: coords.lng + offsetLng - zoneSize },
            { lat: coords.lat + offsetLat - zoneSize, lng: coords.lng + offsetLng + zoneSize },
            { lat: coords.lat + offsetLat + zoneSize, lng: coords.lng + offsetLng + zoneSize },
            { lat: coords.lat + offsetLat + zoneSize, lng: coords.lng + offsetLng - zoneSize },
          ];

          new google.maps.Polygon({
            paths: zoneBounds,
            strokeColor: color,
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.3,
            map: map.current!,
          });
        });

        // Add location boundary if we have shape data
        if (locationData.shape === 'oval') {
          const points = [];
          const numPoints = 50;
          for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI;
            const x = coords.lng + Math.cos(angle) * lengthInDegrees * 0.5;
            const y = coords.lat + Math.sin(angle) * widthInDegrees * 0.5;
            points.push({ lat: y, lng: x });
          }

          new google.maps.Polygon({
            paths: points,
            strokeColor: '#059669',
            strokeOpacity: 1,
            strokeWeight: 3,
            fillOpacity: 0,
            map: map.current!,
          });
        }

        setMapInitialized(true);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, [locationData, gardenLayout]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sbtp-green-800">
            <Ruler className="mr-2" />
            Researching Your Garden Plot...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin h-8 w-8 border-2 border-sbtp-green-500 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-sbtp-green-800">
          <Ruler className="mr-2" />
          Garden Plot at {locationData?.name}
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <MapPin className="h-4 w-4 text-sbtp-brown-600" />
          <span className="text-sm text-sbtp-brown-600">{locationData?.description}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locationData && (
            <div className="flex gap-2 mb-4">
              {locationData.acres && (
                <Badge variant="secondary" className="bg-sbtp-green-100 text-sbtp-green-800">
                  {locationData.acres} acres
                </Badge>
              )}
              <Badge variant="secondary" className="bg-sbtp-blue/20 text-sbtp-blue">
                {locationData.estimatedLength}' × {locationData.estimatedWidth}'
              </Badge>
              <Badge variant="secondary" className="bg-sbtp-yellow/20 text-sbtp-brown-700">
                {gardenLayout.length} garden zones
              </Badge>
            </div>
          )}
          
          <div className="border border-sbtp-green-200 rounded-lg overflow-hidden" style={{ height: '500px' }}>
            {mapInitialized ? (
              <div ref={mapContainer} className="w-full h-full" />
            ) : (
              <div className="w-full h-full bg-sbtp-green-50 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-sbtp-green-400 mx-auto mb-2" />
                  <p className="text-sbtp-green-600">Loading satellite map...</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
            {gardenLayout.map((section, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded border"
                  style={{ 
                    backgroundColor: ['#16a34a', '#059669', '#dc2626', '#2563eb'][index % 4] + '40',
                    borderColor: ['#16a34a', '#059669', '#dc2626', '#2563eb'][index % 4]
                  }}
                />
                <span className="text-sbtp-brown-700 font-medium">{section.section}</span>
                <span className="text-sbtp-brown-500">({section.plants.length} plants)</span>
              </div>
            ))}
          </div>

          <div className="bg-sbtp-green-50 rounded-lg p-3">
            <h4 className="font-medium text-sbtp-green-800 mb-2">Location Features</h4>
            <ul className="text-sm text-sbtp-brown-600 space-y-1">
              <li>• Open meadow with full sun exposure</li>
              <li>• Well-drained soil conditions</li>
              <li>• Protected from strong winds</li>
              <li>• Easy access for maintenance</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntelligentGardenPlotVisualizer;
