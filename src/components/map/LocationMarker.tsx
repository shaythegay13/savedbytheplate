
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapLocation } from './types';

interface LocationMarkerProps {
  location: MapLocation;
  map: mapboxgl.Map;
  onMarkerClick: (id: string) => void;
  locationColors: Record<string, string>;
}

const getIconPath = (type: string) => {
  const iconPaths = {
    farm: '<path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"/><circle cx="12" cy="12" r="3"/>',
    market: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>',
    garden: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    urbanfarm: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>',
    business: '<path d="M2 20h20"/><path d="M4 20V10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M8 14h8"/><path d="M8 18h8"/>',
    fridge: '<rect width="4" height="15" x="2" y="4" rx="2"/><rect width="4" height="15" x="6" y="4" rx="2"/><rect width="4" height="15" x="10" y="4" rx="2"/><rect width="4" height="15" x="14" y="4" rx="2"/><rect width="4" height="15" x="18" y="4" rx="2"/><path d="M2 2v20"/><path d="M22 2v20"/>',
    foodbank: '<path d="M9 2v6h6V2"/><path d="M4 8v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M2 8h20"/><path d="M7 12h10"/><path d="M7 16h10"/>',
  };
  
  return iconPaths[type as keyof typeof iconPaths] || iconPaths.farm;
};

// Calculate icon size based on zoom level
const getIconSize = (zoom: number) => {
  // Base size at zoom level 12
  const baseSize = 20;
  const minSize = 12;
  const maxSize = 32;
  
  // Scale factor based on zoom (less aggressive scaling)
  const scaleFactor = Math.pow(1.15, zoom - 12);
  const size = baseSize * scaleFactor;
  
  // Clamp between min and max sizes
  return Math.max(minSize, Math.min(maxSize, size));
};

const LocationMarker = ({ location, map, onMarkerClick, locationColors }: LocationMarkerProps) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    // Create custom marker element with just the icon
    const el = document.createElement('div');
    el.className = 'marker cursor-pointer';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    
    elementRef.current = el;
    
    // Function to update icon size based on zoom
    const updateIconSize = () => {
      if (!elementRef.current) return;
      
      const zoom = map.getZoom();
      const size = getIconSize(zoom);
      
      elementRef.current.style.width = `${size}px`;
      elementRef.current.style.height = `${size}px`;
      
      elementRef.current.innerHTML = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${locationColors[location.type]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
          ${getIconPath(location.type)}
        </svg>
      `;
    };
    
    // Initial size setup
    updateIconSize();
    
    // Create and store the marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat(location.lngLat)
      .addTo(map);
    
    markerRef.current = marker;
    
    // Add click event to marker
    el.addEventListener('click', () => {
      onMarkerClick(location.id);
    });
    
    // Listen for zoom changes
    const handleZoom = () => {
      updateIconSize();
    };
    
    map.on('zoom', handleZoom);

    // Clean up on unmount
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      map.off('zoom', handleZoom);
    };
  }, [location, map, onMarkerClick, locationColors]);

  return null; // This is a non-visual component that manages map markers
};

export default LocationMarker;
