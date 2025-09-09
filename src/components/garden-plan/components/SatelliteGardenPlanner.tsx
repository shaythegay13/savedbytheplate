import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Satellite, Info } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface PlantRecommendation {
  name: string;
  variety: string;
  plantingTime: string;
  harvestTime: string;
  spacing: string;
  careInstructions: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  yield: string;
  companions?: string[];
}

interface PlantPlacement {
  id: string;
  plant: PlantRecommendation;
  lng: number;
  lat: number;
}

interface SatelliteGardenPlannerProps {
  plantRecommendations: PlantRecommendation[];
  userAddress?: string;
  onLayoutComplete: (placements: PlantPlacement[]) => void;
}

const SatelliteGardenPlanner: React.FC<SatelliteGardenPlannerProps> = ({
  plantRecommendations,
  userAddress = "",
  onLayoutComplete
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<PlantRecommendation | null>(null);
  const [plantPlacements, setPlantPlacements] = useState<PlantPlacement[]>([]);
  const [address, setAddress] = useState(userAddress);
  const [isTokenMissing, setIsTokenMissing] = useState(true);

  // Check for Mapbox token
  useEffect(() => {
    // In a real app, this would come from Supabase Edge Function secrets
    const token = process.env.VITE_MAPBOX_TOKEN || '';
    if (token) {
      setMapboxToken(token);
      setIsTokenMissing(false);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || isTokenMissing) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [-74.006, 40.7128], // Default to NYC
      zoom: 18,
      pitch: 0
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add click handler for placing plants
    map.current.on('click', (e) => {
      if (!selectedPlant) return;

      const placement: PlantPlacement = {
        id: `plant-${Date.now()}`,
        plant: selectedPlant,
        lng: e.lngLat.lng,
        lat: e.lngLat.lat
      };

      // Create a plant marker
      const el = document.createElement('div');
      el.className = 'plant-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#22c55e';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '20px';
      el.style.cursor = 'pointer';
      el.innerHTML = getPlantEmoji(selectedPlant.name);

      // Add popup with plant info
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${selectedPlant.name}</h3>
            <p class="text-xs text-gray-600">${selectedPlant.variety}</p>
            <p class="text-xs mt-1">Spacing: ${selectedPlant.spacing}</p>
            <button 
              onclick="window.removePlant('${placement.id}')" 
              class="text-xs text-red-600 hover:text-red-800 mt-1"
            >
              Remove
            </button>
          </div>
        `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Store marker reference in placement
      (placement as any).marker = marker;

      setPlantPlacements(prev => [...prev, placement]);
    });

    // Geocode address if provided
    if (address) {
      geocodeAddress(address);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, isTokenMissing]);

  // Global function to remove plants (called from popup)
  useEffect(() => {
    (window as any).removePlant = (plantId: string) => {
      setPlantPlacements(prev => {
        const updated = prev.filter(p => {
          if (p.id === plantId) {
            // Remove marker from map
            if ((p as any).marker) {
              (p as any).marker.remove();
            }
            return false;
          }
          return true;
        });
        return updated;
      });
    };

    return () => {
      delete (window as any).removePlant;
    };
  }, []);

  const getPlantEmoji = (plantName: string): string => {
    const name = plantName.toLowerCase();
    if (name.includes('tomato')) return '🍅';
    if (name.includes('lettuce')) return '🥬';
    if (name.includes('basil')) return '🌿';
    if (name.includes('pepper')) return '🌶️';
    if (name.includes('carrot')) return '🥕';
    if (name.includes('cucumber')) return '🥒';
    if (name.includes('bean')) return '🫘';
    if (name.includes('corn')) return '🌽';
    if (name.includes('radish')) return '🫎';
    if (name.includes('onion')) return '🧅';
    return '🌱';
  };

  const geocodeAddress = async (addressToGeocode: string) => {
    if (!map.current) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addressToGeocode)}.json?access_token=${mapboxToken}&limit=1`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        map.current.flyTo({
          center: [lng, lat],
          zoom: 19,
          pitch: 45,
          duration: 2000
        });

        // Add a marker for the property
        const propertyMarker = new mapboxgl.Marker({ color: '#ef4444' })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<div class="p-2"><strong>Your Property</strong><br/>${addressToGeocode}</div>`))
          .addTo(map.current);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const handleAddressSearch = () => {
    if (address && map.current) {
      geocodeAddress(address);
    }
  };

  const handleComplete = () => {
    onLayoutComplete(plantPlacements);
  };

  if (isTokenMissing) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-sbtp-green-800">Satellite Garden Planner Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              To use the satellite garden planner, you need a Mapbox access token. 
              <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                Get your free token from Mapbox
              </a>
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Enter your Mapbox Public Token:</label>
              <Input
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsZjR3..."
                className="font-mono text-sm"
              />
            </div>
            <Button 
              onClick={() => setIsTokenMissing(false)}
              disabled={!mapboxToken}
              className="bg-sbtp-green-500 hover:bg-sbtp-green-600"
            >
              Continue with Satellite View
            </Button>
          </div>
          
          <div className="bg-sbtp-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sbtp-green-800 mb-2">How to get your Mapbox token:</h4>
            <ol className="text-sm text-sbtp-green-700 space-y-1 list-decimal list-inside">
              <li>Visit <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mapbox.com</a> and create a free account</li>
              <li>Go to your Account Dashboard</li>
              <li>Find the "Access Tokens" section</li>
              <li>Copy your "Default public token" (starts with "pk.")</li>
              <li>Paste it above to continue</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-sbtp-green-800 flex items-center gap-2">
          <Satellite className="h-6 w-6" />
          Satellite Garden Planner
        </CardTitle>
        <p className="text-sbtp-brown-600">
          View your actual property from above and place plants exactly where you want them in your garden.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Address Search */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Your Property Address:</label>
          <div className="flex gap-2">
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address to see your property"
              className="flex-1"
            />
            <Button 
              onClick={handleAddressSearch}
              variant="outline"
              className="whitespace-nowrap"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Find Property
            </Button>
          </div>
        </div>

        {/* Plant Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Select a Plant to Place</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {plantRecommendations.map((plant, index) => (
              <Button
                key={index}
                variant={selectedPlant === plant ? "default" : "outline"}
                className={`h-auto p-3 text-left ${
                  selectedPlant === plant 
                    ? "bg-sbtp-green-500 hover:bg-sbtp-green-600" 
                    : "hover:bg-sbtp-green-50"
                }`}
                onClick={() => setSelectedPlant(plant)}
              >
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getPlantEmoji(plant.name)}</span>
                    <div className="font-medium text-sm">{plant.name}</div>
                  </div>
                  <div className="text-xs opacity-70">{plant.variety}</div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs mt-1 ${
                      plant.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      plant.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {plant.difficulty}
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {selectedPlant 
              ? `Click anywhere on your property to place ${selectedPlant.name}. Click on existing plants to see details or remove them.`
              : "Select a plant above, then click on your property to place it. Use satellite view to see the exact layout of your garden space."
            }
          </AlertDescription>
        </Alert>

        {/* Map Container */}
        <div className="relative h-96 w-full rounded-lg overflow-hidden border border-gray-300">
          <div ref={mapContainer} className="absolute inset-0" />
          {plantPlacements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white text-center">
              <div>
                <Satellite className="h-12 w-12 mx-auto mb-2 opacity-70" />
                <p>Enter your address above to see your property</p>
              </div>
            </div>
          )}
        </div>

        {/* Plant Summary */}
        {plantPlacements.length > 0 && (
          <div className="bg-sbtp-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sbtp-green-800 mb-2">
              Plants Placed ({plantPlacements.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {plantPlacements.map((placement) => (
                <Badge key={placement.id} variant="secondary" className="bg-sbtp-green-100 text-sbtp-green-800">
                  {getPlantEmoji(placement.plant.name)} {placement.plant.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-sbtp-brown-600">
            Tip: Use the map controls to zoom and rotate for the best view of your property
          </div>
          <Button 
            onClick={handleComplete}
            disabled={plantPlacements.length === 0}
            className="bg-sbtp-green-500 hover:bg-sbtp-green-600"
          >
            Continue with Garden Plan ({plantPlacements.length} plants)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SatelliteGardenPlanner;