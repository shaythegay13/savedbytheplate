
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapLocation } from './types';
import { locationColors, MAPBOX_TOKEN, defaultMapConfig } from './MapConfig';
import { sampleLocations } from './sampleLocations';
import LocationMarker from './LocationMarker';
import LocationPopup from './LocationPopup';
import MapLegend from './MapLegend';
import MapboxTokenMissing from './MapboxTokenMissing';

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const locations = sampleLocations;

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'YOUR_MAPBOX_TOKEN') {
      console.error('Please set your Mapbox token before using the map');
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: defaultMapConfig.style,
      center: defaultMapConfig.center,
      zoom: defaultMapConfig.zoom
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

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      document.head.removeChild(style);
    };
  }, []);

  // Handle marker click
  const handleMarkerClick = (locationId: string) => {
    setActivePopup(activePopup === locationId ? null : locationId);
  };

  // Get current active location
  const activeLocation = activePopup ? locations.find(loc => loc.id === activePopup) : null;

  return (
    <div className="relative w-full h-[70vh] bg-white rounded-lg overflow-hidden border border-sbtp-green-200 shadow-lg">
      {!MAPBOX_TOKEN || MAPBOX_TOKEN === 'YOUR_MAPBOX_TOKEN' ? (
        <MapboxTokenMissing />
      ) : (
        <>
          <div ref={mapContainer} className="absolute inset-0" />
          
          {/* Render markers once map is loaded */}
          {mapLoaded && map.current && locations.map(location => (
            <LocationMarker 
              key={location.id}
              location={location}
              map={map.current!}
              onMarkerClick={handleMarkerClick}
              locationColors={locationColors}
            />
          ))}
          
          {/* Popup for active location */}
          {activeLocation && (
            <LocationPopup 
              location={activeLocation} 
              locationColors={locationColors}
            />
          )}
          
          {/* Map Legend and Location Label */}
          <MapLegend locationColors={locationColors} />
        </>
      )}
    </div>
  );
};

export default MapComponent;
