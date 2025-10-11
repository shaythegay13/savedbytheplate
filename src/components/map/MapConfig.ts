// Color configuration for different location types
export const locationColors = {
  farm: '#4CAF50', // green
  market: '#2196F3', // blue for farmers markets
  garden: '#DC2626', // red for community gardens
  urbanfarm: '#795548', // brown
  business: '#9C27B0', // purple
  fridge: '#FF5722', // orange for community fridges
  foodbank: '#F59E0B', // amber for food banks
  csa: '#FF8C00', // dark orange for CSAs
};

// Google Maps API key
export const GOOGLE_MAPS_API_KEY = 'AIzaSyCGuiIwh3b2OWtyAvQWqMVgqTpDDY-eBnk';

// Default map configuration
export const defaultMapConfig = {
  center: { lat: 40.73, lng: -73.98 }, // Manhattan, NYC
  zoom: 12,
  mapId: 'food-access-map' // Required for advanced markers
};
