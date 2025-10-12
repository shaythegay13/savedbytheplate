import { supabase } from '@/integrations/supabase/client';
import { GOOGLE_MAPS_API_KEY } from '@/components/map/MapConfig';

let isLoading = false;
let isLoaded = false;
const callbacks: Array<() => void> = [];
let loadedSrc: string | null = null;

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

      // Get key/client from Supabase Edge Function (public access, API key is safe to expose client-side)
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
        // Silently fail and continue to fallback
        console.warn('Could not fetch Google Maps key from Supabase:', e);
      }

      // Require API key from Supabase secret - do not use hardcoded fallback
      if (!value || !String(value).startsWith('AIza')) {
        throw new Error('Google Maps API key not configured. Please set the Google_Maps secret in Supabase.');
      }

      const script = document.createElement('script');

      // Prefer API key flow; OAuth clientId (from GCP OAuth) is NOT supported for Maps JS
      const src = type === 'apiKey'
        ? `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(value)}&libraries=marker&v=weekly&auth_referrer_policy=origin`
        : `https://maps.googleapis.com/maps/api/js?client=${encodeURIComponent(value)}&libraries=marker&v=weekly`;

      script.src = src;
      script.async = true;
      script.defer = true;
      loadedSrc = src;

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
        reject(new Error('Failed to load Google Maps. ' + (loadedSrc ?? '')));
      };

      document.head.appendChild(script);
    } catch (e) {
      isLoading = false;
      reject(e);
    }
  });
};
