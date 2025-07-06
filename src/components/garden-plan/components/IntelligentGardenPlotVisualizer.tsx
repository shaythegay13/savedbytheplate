import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ruler, MapPin, Settings } from "lucide-react";
import { researchLocationDimensions } from '@/services/locationResearchService';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const map = useRef<mapboxgl.Map | null>(null);
  const [locationData, setLocationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
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

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !locationData || mapInitialized) return;

    mapboxgl.accessToken = token;

    // Get coordinates for the location
    const normalizedLocation = locationDescription.toLowerCase();
    const coords = locationCoordinates["sheep's meadow"] || locationCoordinates["central park"] || 
                  { lat: 40.7829, lng: -73.9654, zoom: 15 };

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [coords.lng, coords.lat],
      zoom: coords.zoom,
      pitch: 0,
      bearing: 0
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Add the garden area overlay
      const centerLat = coords.lat;
      const centerLng = coords.lng;
      
      // Calculate approximate bounds for the area (rough estimation)
      const lengthInDegrees = (locationData.estimatedLength || 500) * 0.000009; // feet to degrees (very rough)
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
        
        map.current?.addSource(`garden-zone-${index}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {
              name: section.section,
              plants: section.plants.length
            },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [centerLng + offsetLng - zoneSize, centerLat + offsetLat - zoneSize],
                [centerLng + offsetLng + zoneSize, centerLat + offsetLat - zoneSize],
                [centerLng + offsetLng + zoneSize, centerLat + offsetLat + zoneSize],
                [centerLng + offsetLng - zoneSize, centerLat + offsetLat + zoneSize],
                [centerLng + offsetLng - zoneSize, centerLat + offsetLat - zoneSize]
              ]]
            }
          }
        });

        map.current?.addLayer({
          id: `garden-zone-fill-${index}`,
          type: 'fill',
          source: `garden-zone-${index}`,
          paint: {
            'fill-color': color,
            'fill-opacity': 0.3
          }
        });

        map.current?.addLayer({
          id: `garden-zone-border-${index}`,
          type: 'line',
          source: `garden-zone-${index}`,
          paint: {
            'line-color': color,
            'line-width': 2
          }
        });
      });

      // Add location boundary if we have shape data
      if (locationData.shape === 'oval') {
        // Create points for oval boundary
        const points = [];
        const numPoints = 50;
        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * 2 * Math.PI;
          const x = centerLng + Math.cos(angle) * lengthInDegrees * 0.5;
          const y = centerLat + Math.sin(angle) * widthInDegrees * 0.5;
          points.push([x, y]);
        }
        points.push(points[0]); // Close the polygon

        map.current?.addSource('location-boundary', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [points]
            }
          }
        });

        map.current?.addLayer({
          id: 'location-boundary-line',
          type: 'line',
          source: 'location-boundary',
          paint: {
            'line-color': '#059669',
            'line-width': 3,
            'line-dasharray': [2, 2]
          }
        });
      }

      setMapInitialized(true);
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      initializeMap(mapboxToken);
      setShowTokenInput(false);
    }
  };

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

          {!mapInitialized && !showTokenInput && (
            <div className="bg-sbtp-yellow/10 border border-sbtp-yellow/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-sbtp-brown-700" />
                <span className="text-sm font-medium text-sbtp-brown-700">Map Configuration Required</span>
              </div>
              <p className="text-sm text-sbtp-brown-600 mb-3">
                To show the satellite view of your garden location, please provide your Mapbox access token.
                You can get one free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-sbtp-green-600 underline">mapbox.com</a>
              </p>
              <Button 
                onClick={() => setShowTokenInput(true)}
                className="bg-sbtp-green-500 hover:bg-sbtp-green-600"
                size="sm"
              >
                Configure Map
              </Button>
            </div>
          )}

          {showTokenInput && (
            <div className="bg-white border border-sbtp-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-sbtp-green-700" />
                <span className="text-sm font-medium text-sbtp-green-700">Enter Mapbox Token</span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJ..."
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleTokenSubmit} className="bg-sbtp-green-500 hover:bg-sbtp-green-600">
                  Load Map
                </Button>
              </div>
            </div>
          )}
          
          <div className="border border-sbtp-green-200 rounded-lg overflow-hidden" style={{ height: '500px' }}>
            {mapInitialized ? (
              <div ref={mapContainer} className="w-full h-full" />
            ) : (
              <div className="w-full h-full bg-sbtp-green-50 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-sbtp-green-400 mx-auto mb-2" />
                  <p className="text-sbtp-green-600">Satellite map will appear here</p>
                  <p className="text-sm text-sbtp-green-500">Configure Mapbox token above to view</p>
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