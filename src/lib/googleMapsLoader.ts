let isLoading = false;
let isLoaded = false;
const callbacks: Array<() => void> = [];

// Define global callback
declare global {
  interface Window {
    initGoogleMaps?: () => void;
  }
}

export const loadGoogleMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
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

      // Remove any existing script to avoid duplicate/cached error state
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) existingScript.remove();

      // Get API key from environment variable (client-side publishable key)
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        isLoading = false;
        reject(new Error('Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file and restrict it by domain in Google Cloud Console.'));
        return;
      }

      // Set up callback function
      window.initGoogleMaps = () => {
        isLoaded = true;
        isLoading = false;
        resolve();
        // Execute any queued callbacks
        callbacks.forEach(cb => cb());
        callbacks.length = 0;
        // Clean up
        delete window.initGoogleMaps;
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=marker&v=weekly&loading=async&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;

      script.onerror = () => {
        isLoading = false;
        delete window.initGoogleMaps;
        reject(new Error('Failed to load Google Maps API. Check your API key and domain restrictions.'));
      };

      document.head.appendChild(script);
    } catch (e) {
      isLoading = false;
      delete window.initGoogleMaps;
      reject(e);
    }
  });
};
