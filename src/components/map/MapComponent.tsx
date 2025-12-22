import { useEffect, useRef, useState, useMemo } from 'react';
import { MapLocation } from './types';
import { locationColors, defaultMapConfig } from './MapConfig';
import { fetchEnhancedMapData, MapDataFilters, ProgressCallback } from '../../services/enhancedMapDataService';
import LocationPopup from './LocationPopup';
import { loadGoogleMaps } from '@/lib/googleMapsLoader';
import { isLocationOpen } from '@/lib/hoursParser';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import MapLoadingSkeleton from './MapLoadingSkeleton';

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

// Create SVG icon for markers matching the legend with fixed size for performance
const createIconSvg = (type: string, color: string) => {
  const iconPath = getIconPath(type);
  const size = 24; // Fixed size for better performance
  
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

interface MapComponentProps {
  activeFilters?: Set<string>;
  showOpenNow?: boolean;
}

const MapComponent = ({ activeFilters, showOpenNow }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const markerClusterer = useRef<MarkerClusterer | null>(null);
  const markersData = useRef<{ marker: any; location: MapLocation }[]>([]);
  const processedLocationIds = useRef<Set<string>>(new Set());
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [currentZoom, setCurrentZoom] = useState(defaultMapConfig.zoom);

  // Fetch enhanced data progressively
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadProgress(0);
        setLocations([]); // Clear existing locations
        processedLocationIds.current.clear(); // Clear processed IDs for fresh load
        
        // Clear existing markers when filters change
        if (markerClusterer.current) {
          markerClusterer.current.clearMarkers();
          markerClusterer.current = null;
        }
        markers.current.forEach(marker => marker.map = null);
        markers.current = [];
        markersData.current = [];
        
        console.log('🌱 Starting progressive map data load...');
        
        const filters: MapDataFilters = {
          types: activeFilters && activeFilters.size > 0 ? Array.from(activeFilters) : undefined,
        };
        
        // Progressive callback - adds markers as batches arrive
        const onProgress: ProgressCallback = (batch, progress) => {
          if (batch.length > 0) {
            setLocations(prev => [...prev, ...batch]);
            console.log(`📍 Added ${batch.length} locations (${progress}% complete)`);
          }
          setLoadProgress(progress);
        };
        
        await fetchEnhancedMapData(filters, onProgress);
      } catch (error) {
        console.error('Failed to load enhanced map data:', error);
      } finally {
        setLoading(false);
        setLoadProgress(100);
      }
    };
    
    loadData();
  }, [activeFilters]);

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

        // Listen to zoom changes to update cluster sizes
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

  // Add markers incrementally when new locations arrive
  useEffect(() => {
    if (!mapLoaded || !map.current || locations.length === 0) return;

    const addNewMarkers = async () => {
      const { AdvancedMarkerElement } = await (window as any).google.maps.importLibrary('marker');

      // Find new locations that haven't been processed yet
      const newLocations = locations.filter(loc => !processedLocationIds.current.has(loc.id));
      
      if (newLocations.length === 0) return;

      const newMarkers: any[] = [];

      newLocations.forEach(location => {
        // Mark as processed
        processedLocationIds.current.add(location.id);
        
        const color = locationColors[location.type] || '#4CAF50';
        
        // Create custom SVG icon matching the legend with fixed size
        const iconSvg = createIconSvg(location.type, color);
        const parser = new DOMParser();
        const iconElement = parser.parseFromString(iconSvg, 'image/svg+xml').documentElement;

        const marker = new AdvancedMarkerElement({
          map: null, // Don't add to map yet, clusterer will handle this
          position: { lat: location.lngLat[1], lng: location.lngLat[0] },
          content: iconElement,
          title: location.name,
        });

        marker.addListener('click', (event: any) => {
          setActivePopup(location.id);
          
          // Get the marker's position in screen coordinates
          const projection = map.current.getProjection();
          const bounds = map.current.getBounds();
          if (projection && bounds) {
            const point = projection.fromLatLngToPoint(marker.position);
            const scale = Math.pow(2, map.current.getZoom());
            const worldPoint = new (window as any).google.maps.Point(
              point.x * scale,
              point.y * scale
            );
            
            // Get map container position
            const mapDiv = mapContainer.current;
            if (mapDiv) {
              const rect = mapDiv.getBoundingClientRect();
              const topLeft = projection.fromLatLngToPoint(bounds.getNorthEast());
              const topLeftWorldPoint = new (window as any).google.maps.Point(
                topLeft.x * scale,
                topLeft.y * scale
              );
              
              // Calculate pixel position relative to map container
              const pixelX = (worldPoint.x - topLeftWorldPoint.x);
              const pixelY = (worldPoint.y - topLeftWorldPoint.y);
              
              setPopupPosition({ x: pixelX, y: pixelY });
            }
          }
        });

        newMarkers.push(marker);
        markers.current.push(marker);
        markersData.current.push({ marker, location });
      });

      // Initialize clusterer on first batch, add markers on subsequent batches
      if (!markerClusterer.current) {
        // Custom renderer for cluster styling with zoom-based sizing
        const renderer = {
          render: ({ count, position }: any, stats: any, map: any) => {
            const zoom = map.getZoom() || 12;
            const baseSize = Math.max(30, Math.min(70, 85 - (zoom * 3)));
            
            let color = '#86efac';
            let textColor = '#166534';
            
            if (count > stats.clusters.markers.mean) {
              color = '#fbbf24';
              textColor = '#78350f';
            } else if (count > stats.clusters.markers.mean / 2) {
              color = '#7dd3fc';
              textColor = '#0c4a6e';
            }

            const svg = `
              <svg width="${baseSize}" height="${baseSize}" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="22" fill="${color}" stroke="white" stroke-width="3" opacity="0.9"/>
                <text x="25" y="25" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="${textColor}">
                  ${count}
                </text>
              </svg>
            `;

            const parser = new DOMParser();
            const svgElement = parser.parseFromString(svg, 'image/svg+xml').documentElement;

            return new (window as any).google.maps.marker.AdvancedMarkerElement({
              position,
              content: svgElement,
              zIndex: Number((window as any).google.maps.Marker.MAX_ZINDEX) + count,
            });
          },
        };

        markerClusterer.current = new MarkerClusterer({
          map: map.current,
          markers: newMarkers,
          renderer,
        });
      } else {
        // Add new markers to existing clusterer
        markerClusterer.current.addMarkers(newMarkers);
      }
    };

    addNewMarkers();
  }, [mapLoaded, locations]);

  // Update marker visibility based on active filters and open now status
  useEffect(() => {
    if (!activeFilters || !markerClusterer.current) return;
    
    const visibleMarkers: any[] = [];
    
    markersData.current.forEach(({ marker, location }) => {
      const matchesTypeFilter = activeFilters.has(location.type);
      const matchesOpenFilter = !showOpenNow || isLocationOpen(location.hoursText).isOpen;
      
      if (matchesTypeFilter && matchesOpenFilter) {
        visibleMarkers.push(marker);
      }
    });
    
    // Update clusterer with only visible markers
    markerClusterer.current.clearMarkers();
    markerClusterer.current.addMarkers(visibleMarkers);
  }, [activeFilters, showOpenNow]);

  // Handle popup close
  const handlePopupClose = () => {
    setActivePopup(null);
  };

  // Get current active location
  const activeLocation = activePopup ? locations.find(loc => loc.id === activePopup) : null;

  return (
    <div className="relative w-full h-full min-h-[300px] bg-background rounded-lg overflow-hidden border border-border shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Show skeleton while loading data or map not yet initialized */}
      {(loading || !mapLoaded) && (
        <MapLoadingSkeleton 
          progress={loadProgress} 
          locationsLoaded={locations.length} 
        />
      )}
      
      {/* Popup for active location */}
      {activeLocation && popupPosition && (
        <LocationPopup 
          location={activeLocation} 
          locationColors={locationColors}
          onClose={handlePopupClose}
          position={popupPosition}
        />
      )}
    </div>
  );
};

export default MapComponent;
