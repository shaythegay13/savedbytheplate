
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapLocation } from './types';

interface LocationMarkerProps {
  location: MapLocation;
  map: mapboxgl.Map;
  onMarkerClick: (id: string) => void;
  locationColors: Record<string, string>;
}

const LocationMarker = ({ location, map, onMarkerClick, locationColors }: LocationMarkerProps) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  
  useEffect(() => {
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
      .addTo(map);
    
    markerRef.current = marker;
    
    // Add click event to marker
    el.addEventListener('click', () => {
      onMarkerClick(location.id);
    });

    // Clean up on unmount
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [location, map, onMarkerClick, locationColors]);

  return null; // This is a non-visual component that manages map markers
};

export default LocationMarker;
