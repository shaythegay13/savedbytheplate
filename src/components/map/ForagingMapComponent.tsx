import { useEffect, useRef, useState } from 'react';
import { foragingColors } from '@/data/mockForagingData';
import { defaultMapConfig } from './MapConfig';
import { loadGoogleMaps } from '@/lib/googleMapsLoader';
import { ForagingLocation } from '@/data/mockForagingData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Icon path definitions for foraging items
const getForagingIconPath = (type: string) => {
  const iconPaths = {
    herb: '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M12 2v20"/>',
    berry: '<circle cx="12" cy="5" r="3"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="19" r="3"/>',
    fruit: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z"/><path d="M12 2v4m0 12v4"/>',
    green: '<path d="M12 2v20m-7-7 7-7 7 7m-14 0h14"/>',
    nut: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
  };
  
  return iconPaths[type as keyof typeof iconPaths] || iconPaths.herb;
};

// Create SVG icon for foraging markers
const createForagingIconSvg = (type: string, color: string, zoom: number = 12) => {
  const iconPath = getForagingIconPath(type);
  const baseSize = Math.max(18, Math.min(42, 14 + (zoom - 10) * 3));
  const size = Math.round(baseSize);
  
  return `
    <svg 
      width="${size}" 
      height="${size}" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4)); cursor: pointer;"
    >
      <circle cx="12" cy="12" r="11" fill="${color}" stroke="white" stroke-width="2.5"/>
      <g transform="translate(0, 0)" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
        ${iconPath}
      </g>
    </svg>
  `.trim();
};

interface ForagingMapComponentProps {
  locations: ForagingLocation[];
  activeFilters?: Set<string>;
}

const ForagingMapComponent = ({ locations, activeFilters }: ForagingMapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markersData = useRef<{ marker: any; location: ForagingLocation }[]>([]);
  const [activePopup, setActivePopup] = useState<ForagingLocation | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(defaultMapConfig.zoom);

  // Initialize Google Maps
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initMap = async () => {
      try {
        await loadGoogleMaps();
        const { Map } = await (window as any).google.maps.importLibrary('maps');
        
        map.current = new Map(mapContainer.current!, {
          center: defaultMapConfig.center,
          zoom: defaultMapConfig.zoom,
          mapId: defaultMapConfig.mapId,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });

        // Listen for zoom changes
        map.current.addListener('zoom_changed', () => {
          const newZoom = map.current.getZoom();
          setCurrentZoom(newZoom);
        });

        setMapLoaded(true);
        console.log('🗺️ Foraging map initialized successfully');
      } catch (error) {
        console.error('Failed to initialize foraging map:', error);
      }
    };

    initMap();
  }, []);

  // Add markers to map
  useEffect(() => {
    if (!map.current || !mapLoaded || locations.length === 0) return;

    const addMarkers = async () => {
      const { AdvancedMarkerElement } = await (window as any).google.maps.importLibrary('marker');

      // Clear existing markers
      markersData.current.forEach(({ marker }) => {
        marker.map = null;
      });
      markersData.current = [];

      // Filter locations based on active filters
      const filteredLocations = activeFilters && activeFilters.size > 0
        ? locations.filter(loc => activeFilters.has(loc.type))
        : locations;

      // Add new markers
      filteredLocations.forEach((location) => {
        const color = foragingColors[location.type as keyof typeof foragingColors];
        const iconSvg = createForagingIconSvg(location.type, color, currentZoom);
        
        const parser = new DOMParser();
        const iconElement = parser.parseFromString(iconSvg, 'image/svg+xml').documentElement;

        const marker = new AdvancedMarkerElement({
          map: map.current,
          position: { lat: location.lngLat[1], lng: location.lngLat[0] },
          content: iconElement,
          title: location.name,
        });

        marker.addListener('click', () => {
          setActivePopup(location);
        });

        markersData.current.push({ marker, location });
      });

      console.log(`🌿 Added ${filteredLocations.length} foraging markers to map`);
    };

    addMarkers();
  }, [map.current, mapLoaded, locations, currentZoom, activeFilters]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Foraging Location Popup */}
      {activePopup && (
        <div className="absolute top-4 right-4 w-80 z-10">
          <Card className="shadow-2xl border-2" style={{ borderColor: foragingColors[activePopup.type as keyof typeof foragingColors] }}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5" style={{ color: foragingColors[activePopup.type as keyof typeof foragingColors] }} />
                  <h3 className="font-bold text-lg text-foreground">{activePopup.name}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setActivePopup(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  <Badge 
                    variant="secondary"
                    style={{ 
                      backgroundColor: `${foragingColors[activePopup.type as keyof typeof foragingColors]}20`,
                      color: foragingColors[activePopup.type as keyof typeof foragingColors],
                      border: `1px solid ${foragingColors[activePopup.type as keyof typeof foragingColors]}`
                    }}
                  >
                    {activePopup.type}
                  </Badge>
                  <Badge variant="outline">
                    {activePopup.difficulty}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {activePopup.description}
                </p>
                
                <div className="pt-2 border-t">
                  <p className="text-xs font-semibold text-foreground mb-1">Season:</p>
                  <p className="text-sm text-muted-foreground">{activePopup.season}</p>
                </div>
                
                {activePopup.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-semibold text-foreground mb-1">Notes:</p>
                    <p className="text-sm text-muted-foreground italic">{activePopup.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ForagingMapComponent;
