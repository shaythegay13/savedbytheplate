import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface GardenLayout {
  section: string;
  plants: string[];
  size: string;
  notes: string;
}

interface LocationBasedMapProps {
  gardenLayout: GardenLayout[];
  locationDescription?: string;
}

const LocationBasedMap: React.FC<LocationBasedMapProps> = ({ 
  gardenLayout, 
  locationDescription = "Sheep's Meadow, Central Park, New York" 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    // Sheep's Meadow coordinates in Central Park
    const sheepsMeadowCenter = [-73.9719, 40.7744];
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: sheepsMeadowCenter,
      zoom: 16,
      pitch: 0,
    });

    map.current.on('load', () => {
      // Add Sheep's Meadow boundary (approximate)
      const meadowBoundary = [
        [-73.9725, 40.7748],
        [-73.9713, 40.7748],
        [-73.9713, 40.7740],
        [-73.9725, 40.7740],
        [-73.9725, 40.7748]
      ];

      map.current?.addSource('meadow-boundary', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [meadowBoundary]
          }
        }
      });

      map.current?.addLayer({
        id: 'meadow-boundary',
        type: 'line',
        source: 'meadow-boundary',
        layout: {},
        paint: {
          'line-color': '#10B981',
          'line-width': 3,
          'line-opacity': 0.8
        }
      });

      map.current?.addLayer({
        id: 'meadow-fill',
        type: 'fill',
        source: 'meadow-boundary',
        layout: {},
        paint: {
          'fill-color': '#10B981',
          'fill-opacity': 0.1
        }
      });

      // Add crop sections as markers
      gardenLayout.forEach((section, index) => {
        const offsetX = (index % 3 - 1) * 0.0004;
        const offsetY = Math.floor(index / 3) * 0.0002 - 0.0001;
        const sectionCoords: [number, number] = [
          sheepsMeadowCenter[0] + offsetX, 
          sheepsMeadowCenter[1] + offsetY
        ];

        // Create marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'crop-marker';
        markerEl.style.width = '40px';
        markerEl.style.height = '40px';
        markerEl.style.borderRadius = '50%';
        markerEl.style.backgroundColor = '#F59E0B';
        markerEl.style.border = '3px solid white';
        markerEl.style.cursor = 'pointer';
        markerEl.style.display = 'flex';
        markerEl.style.alignItems = 'center';
        markerEl.style.justifyContent = 'center';
        markerEl.style.fontSize = '16px';
        markerEl.innerHTML = '🌱';

        // Create popup content
        const plantsHtml = section.plants.map(plant => `<li>${plant}</li>`).join('');
        const popupContent = `
          <div class="p-2">
            <h3 class="font-semibold text-green-800 mb-2">${section.section}</h3>
            <p class="text-sm text-gray-600 mb-2">Size: ${section.size}</p>
            <ul class="text-sm list-disc list-inside mb-2">${plantsHtml}</ul>
            <p class="text-xs text-gray-500">${section.notes}</p>
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(popupContent);

        new mapboxgl.Marker(markerEl)
          .setLngLat(sectionCoords)
          .setPopup(popup)
          .addTo(map.current!);
      });

      // Add main location marker
      const mainMarkerEl = document.createElement('div');
      mainMarkerEl.style.width = '20px';
      mainMarkerEl.style.height = '20px';
      mainMarkerEl.style.borderRadius = '50%';
      mainMarkerEl.style.backgroundColor = '#DC2626';
      mainMarkerEl.style.border = '2px solid white';

      new mapboxgl.Marker(mainMarkerEl)
        .setLngLat(sheepsMeadowCenter)
        .setPopup(new mapboxgl.Popup().setHTML(`<div class="p-2"><strong>${locationDescription}</strong></div>`))
        .addTo(map.current!);
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  };

  const handleTokenSubmit = () => {
    if (mapboxToken) {
      setShowTokenInput(false);
      initializeMap();
    }
  };

  if (showTokenInput) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sbtp-green-800">
            <MapPin className="mr-2" />
            Location-Based Garden Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sbtp-brown-600">
              To display the interactive map of {locationDescription}, please enter your Mapbox public token.
            </p>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter your Mapbox public token"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleTokenSubmit} disabled={!mapboxToken}>
                Load Map
              </Button>
            </div>
            <p className="text-xs text-sbtp-brown-500">
              You can get your token from{' '}
              <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-sbtp-blue-600 underline">
                mapbox.com
              </a>{' '}
              after creating a free account.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-sbtp-green-800">
          <MapPin className="mr-2" />
          Your Garden Location: {locationDescription}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapContainer} 
          className="w-full h-96 rounded-lg border border-sbtp-green-200"
        />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {gardenLayout.map((section, index) => (
            <div key={index} className="bg-sbtp-green-50 p-3 rounded-lg border border-sbtp-green-200">
              <h4 className="font-medium text-sbtp-green-800 mb-1">{section.section}</h4>
              <p className="text-xs text-sbtp-brown-600 mb-2">{section.size}</p>
              <div className="flex flex-wrap gap-1">
                {section.plants.slice(0, 3).map((plant, pIndex) => (
                  <span key={pIndex} className="text-xs bg-sbtp-yellow/20 text-sbtp-brown-700 px-2 py-1 rounded">
                    {plant}
                  </span>
                ))}
                {section.plants.length > 3 && (
                  <span className="text-xs text-sbtp-brown-500">+{section.plants.length - 3} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationBasedMap;