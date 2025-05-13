
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Define our location types
interface MapLocation {
  id: string;
  name: string;
  type: 'farm' | 'market' | 'garden' | 'urbanfarm' | 'business';
  description: string;
  tags: string[];
  details?: string;
  lngLat: [number, number];
}

// Set your Mapbox token - in production this should be in .env
// For now we'll use a temporary value that users should replace
const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN';

const locationColors = {
  farm: '#4CAF50', // green
  market: '#2196F3', // blue
  garden: '#FFC107', // yellow
  urbanfarm: '#795548', // brown
  business: '#9C27B0', // purple
};

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  // Sample data - in a real app, this would come from an API
  const locations: MapLocation[] = [
    {
      id: 'farm1',
      name: 'Uptown Urban Farm',
      type: 'farm',
      description: 'Organic produce, seasonal crops',
      tags: ['Vegetables', 'Fruits', 'Herbs'],
      details: 'Currently growing: Tomatoes, Peppers, Basil',
      lngLat: [-73.9654, 40.7829]
    },
    {
      id: 'market1',
      name: 'Union Square Farmers Market',
      type: 'market',
      description: 'Open Mon, Wed, Fri, Sat (8am-2pm)',
      tags: ['30+ Vendors', 'Local'],
      details: 'Seasonal highlights: Summer berries, Stone fruits',
      lngLat: [-73.9905, 40.7359]
    },
    {
      id: 'garden1',
      name: 'Lower East Side Community Garden',
      type: 'garden',
      description: 'Urban oasis with 20+ community plots',
      tags: ['Community Plots', 'Education'],
      details: 'Workshops every Sunday at 10am',
      lngLat: [-73.9815, 40.7168]
    },
    {
      id: 'urbanfarm1',
      name: 'Rooftop Growing Collective',
      type: 'urbanfarm',
      description: 'Rooftop farm with innovative growing methods',
      tags: ['Hydroponics', 'Vertical Farming'],
      details: 'Tours available by appointment',
      lngLat: [-74.0060, 40.7484]
    },
    {
      id: 'business1',
      name: 'Local Harvest Café',
      type: 'business',
      description: 'Farm-to-table café sourcing within 100 miles',
      tags: ['Café', 'Local-sourced'],
      details: 'Open 7am-8pm daily',
      lngLat: [-73.9787, 40.7689]
    },
  ];

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'YOUR_MAPBOX_TOKEN') {
      console.error('Please set your Mapbox token before using the map');
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-73.98, 40.73], // Manhattan, NYC
      zoom: 12
    });

    // Add controls to the map
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers when map is loaded
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Add markers for each location
    locations.forEach(location => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'marker cursor-pointer';
      el.style.backgroundColor = locationColors[location.type];
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      // Add pulse animation
      el.style.animation = 'pulse-animation 2s infinite';
      
      // Create and store the marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat(location.lngLat)
        .addTo(map.current!);
      
      markersRef.current[location.id] = marker;
      
      // Add click event to marker
      el.addEventListener('click', () => {
        setActivePopup(activePopup === location.id ? null : location.id);
      });
    });

    // Add CSS for marker pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse-animation {
        0% {
          box-shadow: 0 0 0 0 rgba(255,255,255, 0.7);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(255,255,255, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(255,255,255, 0);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Clean up markers
      Object.values(markersRef.current).forEach(marker => marker.remove());
      markersRef.current = {};
      document.head.removeChild(style);
    };
  }, [mapLoaded]);

  // Get current active location
  const activeLocation = activePopup ? locations.find(loc => loc.id === activePopup) : null;

  return (
    <div className="relative w-full h-[70vh] bg-white rounded-lg overflow-hidden border border-sbtp-green-200 shadow-lg">
      {!MAPBOX_TOKEN || MAPBOX_TOKEN === 'YOUR_MAPBOX_TOKEN' ? (
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
      ) : (
        <>
          <div ref={mapContainer} className="absolute inset-0" />
          
          {/* Popup for active location */}
          {activeLocation && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-72 bg-white rounded-md shadow-lg p-3 z-10">
              <h4 className="font-medium text-sbtp-green-700">{activeLocation.name}</h4>
              <p className="text-xs text-sbtp-brown-500 mt-1">{activeLocation.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {activeLocation.tags.map((tag, i) => (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className="text-xs"
                    style={{
                      backgroundColor: `${locationColors[activeLocation.type]}20`,
                      color: locationColors[activeLocation.type]
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-xs mt-2">{activeLocation.details}</p>
              <Button 
                size="sm" 
                className="w-full mt-2 text-xs text-white"
                style={{ backgroundColor: locationColors[activeLocation.type] }}
              >
                View Details
              </Button>
            </div>
          )}
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-md shadow-md text-xs">
            <h4 className="font-medium mb-2 text-sbtp-brown-700">Map Legend</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: locationColors.farm }}></span>
                <span>Farms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: locationColors.market }}></span>
                <span>Farmers Markets</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: locationColors.garden }}></span>
                <span>Community Gardens</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: locationColors.urbanfarm }}></span>
                <span>Urban Farms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: locationColors.business }}></span>
                <span>Local Food Businesses</span>
              </div>
            </div>
          </div>
          
          {/* Manhattan label */}
          <div className="absolute bottom-4 right-4">
            <Badge className="bg-white text-sbtp-brown-700 border border-sbtp-green-200">Manhattan, NYC</Badge>
          </div>
        </>
      )}
    </div>
  );
};

export default MapComponent;
