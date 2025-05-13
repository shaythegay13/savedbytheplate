
// Color configuration for different location types
export const locationColors = {
  farm: '#4CAF50', // green
  market: '#2196F3', // blue
  garden: '#FFC107', // yellow
  urbanfarm: '#795548', // brown
  business: '#9C27B0', // purple
};

// Set your Mapbox token - in production this should be in .env
// For now we'll use a temporary value that users should replace
export const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN';

// Default map configuration
export const defaultMapConfig = {
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-73.98, 40.73], // Manhattan, NYC
  zoom: 12
};
