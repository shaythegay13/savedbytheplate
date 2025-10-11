import { useEffect, useRef, useState } from 'react';
import { MapLocation } from './types';
import { locationColors, defaultMapConfig } from './MapConfig';
import { fetchEnhancedMapData } from '../../services/enhancedMapDataService';
import LocationPopup from './LocationPopup';
import { loadGoogleMaps } from '@/lib/googleMapsLoader';

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);

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
        const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;
        
        map.current = new Map(mapContainer.current!, {
          ...defaultMapConfig,
          mapTypeControl: true,
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
          },
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
          },
          streetViewControl: true,
          fullscreenControl: true,
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
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;

      // Clear existing markers
      markers.current.forEach(marker => marker.map = null);
      markers.current = [];

      locations.forEach(location => {
        const color = locationColors[location.type] || '#4CAF50';
        
        // Create custom pin
        const pin = new PinElement({
          background: color,
          borderColor: '#ffffff',
          glyphColor: '#ffffff',
          scale: 1.2,
        });

        const marker = new AdvancedMarkerElement({
          map: map.current!,
          position: { lat: location.lngLat[1], lng: location.lngLat[0] },
          content: pin.element,
          title: location.name,
        });

        marker.addListener('click', () => {
          setActivePopup(activePopup === location.id ? null : location.id);
        });

        markers.current.push(marker);
      });
    };

    addMarkers();
  }, [mapLoaded, locations]);

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
