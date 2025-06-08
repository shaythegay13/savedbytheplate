
// Color configuration for different location types
export const locationColors = {
  farm: '#4CAF50', // green
  market: '#2196F3', // blue
  garden: '#9C27B0', // purple (changed from yellow to purple for community gardens)
  urbanfarm: '#795548', // brown
  business: '#9C27B0', // purple
  fridge: '#FF5722', // orange for community fridges
};

// Set your Mapbox token
export const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2hheXRoZWdheTEzIiwiYSI6ImNtYW15YTR2ODBxOTEycm9qeGhsOGxnN2cifQ.F3DKJtEwjSiAKbqp-7mlXg';

// Default map configuration
export const defaultMapConfig = {
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-73.98, 40.73], // Manhattan, NYC
  zoom: 12
};
