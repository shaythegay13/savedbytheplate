
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapLocation } from './types';
import { TreeDeciduous, Store, Leaf, Building2, ShoppingBasket, Refrigerator } from 'lucide-react';

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
    urbanfarm: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h4"/><path d="M6 16h4"/><path d="M16 6h2"/><path d="M16 10h2"/><path d="M16 14h2"/><path d="M16 18h2"/>',
    business: '<path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.6-7.4"/><path d="M9 11V9a3 3 0 1 1 6 0v2"/>',
    fridge: '<rect width="4" height="15" x="2" y="4" rx="2"/><rect width="4" height="15" x="6" y="4" rx="2"/><rect width="4" height="15" x="10" y="4" rx="2"/><rect width="4" height="15" x="14" y="4" rx="2"/><rect width="4" height="15" x="18" y="4" rx="2"/><path d="M2 2v20"/><path d="M22 2v20"/>',
  };
  
  return iconPaths[type as keyof typeof iconPaths] || iconPaths.farm;
};

const LocationMarker = ({ location, map, onMarkerClick, locationColors }: LocationMarkerProps) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  
  useEffect(() => {
    // Create custom marker element with just the icon
    const el = document.createElement('div');
    el.className = 'marker cursor-pointer';
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    
    // Add the icon directly without any background circle
    el.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${locationColors[location.type]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
        ${getIconPath(location.type)}
      </svg>
    `;
    
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
