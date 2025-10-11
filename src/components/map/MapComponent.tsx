import { useEffect, useRef, useState } from 'react';
import { MapLocation } from './types';
import { locationColors, defaultMapConfig } from './MapConfig';
import { fetchEnhancedMapData } from '../../services/enhancedMapDataService';
import LocationPopup from './LocationPopup';
import { loadGoogleMaps } from '@/lib/googleMapsLoader';

// Icon path definitions matching the legend
const getIconPath = (type: string) => {
  const iconPaths = {
    farm: '<path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"/><circle cx="12" cy="12" r="3"/>',
    market: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>',
    garden: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    urbanfarm: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>',
    business: '<path d="M2 20h20"/><path d="M4 20V10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M8 14h8"/><path d="M8 18h8"/>',
    fridge: '<rect width="4" height="15" x="2" y="4" rx="2"/><rect width="4" height="15" x="6" y="4" rx="2"/><rect width="4" height="15" x="10" y="4" rx="2"/><rect width="4" height="15" x="14" y="4" rx="2"/><rect width="4" height="15" x="18" y="4" rx="2"/><path d="M2 2v20"/><path d="M22 2v20"/>',
    foodbank: '<path d="M9 2v6h6V2"/><path d="M4 8v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M2 8h20"/><path d="M7 12h10"/><path d="M7 16h10"/>',
    csa: '<path d="M2 20 12 4l10 16H2z"/><path d="M8 20h8"/><path d="M12 6v6"/><path d="M9 10h6"/>',
  };
  
  return iconPaths[type as keyof typeof iconPaths] || iconPaths.farm;
};

// Create SVG icon for markers matching the legend with dynamic sizing
const createIconSvg = (type: string, color: string, zoom: number = 12) => {
  const iconPath = getIconPath(type);
  // Scale icon size based on zoom level (smaller when zoomed out, larger when zoomed in)
  // Zoom levels typically range from 1-20, we'll scale between 16px and 40px
  const baseSize = Math.max(16, Math.min(40, 12 + (zoom - 10) * 3));
  const size = Math.round(baseSize);
  
  return `
    <svg 
      width="${size}" 
      height="${size}" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); cursor: pointer;"
    >
      <circle cx="12" cy="12" r="11" fill="white" stroke="${color}" stroke-width="2"/>
      <g transform="translate(0, 0)" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
        ${iconPath}
      </g>
    </svg>
  `.trim();
};

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const markersData = useRef<{ marker: any; location: MapLocation }[]>([]);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(defaultMapConfig.zoom);

  // Fetch enhanced data from all sources
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('🌱 Starting to load enhanced map data...');
        const allLocations = await fetchEnhancedMapData();
        console.log('📍 Total locations loaded for map:', allLocations.length);
        console.log('📊 Location types breakdown:', {
          gardens: allLocations.filter(l => l.type === 'garden').length,
          markets: allLocations.filter(l => l.type === 'market').length,
          fridges: allLocations.filter(l => l.type === 'fridge').length,
          foodbanks: allLocations.filter(l => l.type === 'foodbank').length,
          farms: allLocations.filter(l => l.type === 'farm').length,
          urbanfarms: allLocations.filter(l => l.type === 'urbanfarm').length,
          businesses: allLocations.filter(l => l.type === 'business').length
        });
        setLocations(allLocations);
      } catch (error) {
        console.error('Failed to load enhanced map data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Initialize Google Maps
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initMap = async () => {
      try {
        await loadGoogleMaps();
        const { Map } = await (window as any).google.maps.importLibrary('maps');
        
        map.current = new Map(mapContainer.current!, {
          ...defaultMapConfig,
          mapTypeControl: true,
          mapTypeControlOptions: {
            position: (window as any).google.maps.ControlPosition.TOP_RIGHT,
          },
          zoomControl: true,
          zoomControlOptions: {
            position: (window as any).google.maps.ControlPosition.RIGHT_BOTTOM,
          },
          streetViewControl: true,
          fullscreenControl: true,
        });

        // Listen to zoom changes to update marker sizes
        map.current.addListener('zoom_changed', () => {
          const zoom = map.current?.getZoom() || defaultMapConfig.zoom;
          setCurrentZoom(zoom);
        });

        setMapLoaded(true);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  // Add markers when map and locations are ready
  useEffect(() => {
    if (!mapLoaded || !map.current || locations.length === 0) return;

    const addMarkers = async () => {
      const { AdvancedMarkerElement } = await (window as any).google.maps.importLibrary('marker');

      // Clear existing markers
      markers.current.forEach(marker => marker.map = null);
      markers.current = [];
      markersData.current = [];

      const zoom = map.current?.getZoom() || defaultMapConfig.zoom;

      locations.forEach(location => {
        const color = locationColors[location.type] || '#4CAF50';
        
        // Create custom SVG icon matching the legend with zoom-based size
        const iconSvg = createIconSvg(location.type, color, zoom);
        const parser = new DOMParser();
        const iconElement = parser.parseFromString(iconSvg, 'image/svg+xml').documentElement;

        const marker = new AdvancedMarkerElement({
          map: map.current!,
          position: { lat: location.lngLat[1], lng: location.lngLat[0] },
          content: iconElement,
          title: location.name,
        });

        marker.addListener('click', () => {
          setActivePopup(activePopup === location.id ? null : location.id);
        });

        markers.current.push(marker);
        markersData.current.push({ marker, location });
      });
    };

    addMarkers();
  }, [mapLoaded, locations]);

  // Update marker sizes when zoom changes
  useEffect(() => {
    if (!mapLoaded || markersData.current.length === 0) return;

    markersData.current.forEach(({ marker, location }) => {
      const color = locationColors[location.type] || '#4CAF50';
      const iconSvg = createIconSvg(location.type, color, currentZoom);
      const parser = new DOMParser();
      const iconElement = parser.parseFromString(iconSvg, 'image/svg+xml').documentElement;
      marker.content = iconElement;
    });
  }, [currentZoom, mapLoaded]);

  // Handle popup close
  const handlePopupClose = () => {
    setActivePopup(null);
  };

  // Get current active location
  const activeLocation = activePopup ? locations.find(loc => loc.id === activePopup) : null;

  return (
    <div className="relative w-full h-[70vh] bg-white rounded-lg overflow-hidden border border-sbtp-green-200 shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-md shadow-md z-10">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-sbtp-green-500 border-t-transparent rounded-full"></div>
            <span className="text-sm text-sbtp-brown-700">Loading food access locations...</span>
          </div>
        </div>
      )}
      
      {/* Popup for active location */}
      {activeLocation && (
        <LocationPopup 
          location={activeLocation} 
          locationColors={locationColors}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
};

export default MapComponent;
