import { supabase } from '@/integrations/supabase/client';

let isLoading = false;
let isLoaded = false;
const callbacks: Array<() => void> = [];
let loadedSrc: string | null = null;

// Define global callback
declare global {
  interface Window {
    initGoogleMaps?: () => void;
  }
}

export const loadGoogleMaps = (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
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

      // Get key/client from Supabase Edge Function (public access with rate limiting)
      let value: string | undefined;
      let type: 'apiKey' | 'clientId' = 'apiKey';
      try {
        const { data, error } = await supabase.functions.invoke('get-google-maps-key', {
          method: 'GET',
        });
        if (!error && data?.value) {
          value = String(data.value);
          type = (data.type === 'clientId' ? 'clientId' : 'apiKey');
        }
      } catch (e) {
        console.warn('Could not fetch Google Maps key from Supabase:', e);
      }

      if (!value || !String(value).startsWith('AIza')) {
        throw new Error('Google Maps API key not configured. Please set the Google_Maps_API_Key secret in Supabase.');
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
      const src = type === 'apiKey'
        ? `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(value)}&libraries=marker&v=weekly&loading=async&callback=initGoogleMaps`
        : `https://maps.googleapis.com/maps/api/js?client=${encodeURIComponent(value)}&libraries=marker&v=weekly&loading=async&callback=initGoogleMaps`;
      
      script.src = src;
      script.async = true;
      script.defer = true;
      loadedSrc = src;

      script.onerror = () => {
        isLoading = false;
        delete window.initGoogleMaps;
        reject(new Error('Failed to load Google Maps. ' + (loadedSrc ?? '')));
      };

      document.head.appendChild(script);
    } catch (e) {
      isLoading = false;
      delete window.initGoogleMaps;
      reject(e);
    }
  });
};
