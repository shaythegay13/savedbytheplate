import { GOOGLE_MAPS_API_KEY } from '@/components/map/MapConfig';

let isLoading = false;
let isLoaded = false;
const callbacks: Array<() => void> = [];

export const loadGoogleMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (isLoaded) {
      resolve();
      return;
    }

    // If currently loading, add to callback queue
    if (isLoading) {
      callbacks.push(resolve);
      return;
    }

    // Start loading
    isLoading = true;

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=marker&v=weekly`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      resolve();
      // Execute any queued callbacks
      callbacks.forEach(cb => cb());
      callbacks.length = 0;
    };

    script.onerror = () => {
      isLoading = false;
      reject(new Error('Failed to load Google Maps'));
    };

    document.head.appendChild(script);
  });
};
