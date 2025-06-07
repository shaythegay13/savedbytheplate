
import { supabase } from '@/integrations/supabase/client';
import { MapLocation } from '../components/map/types';

// Interface for the lungs_data1 table structure based on actual table schema
interface LungsData {
  'Name of Garden': string;
  'Address': string;
  'Hours'?: string;
  'Website'?: string;
  'Contact Information'?: string;
  'Neighborhood'?: string;
  'longitude'?: number;
  'latitude'?: number;
}

// Check if coordinates are within NYC bounds (rough boundaries)
const isWithinNYCBounds = (lat: number, lng: number): boolean => {
  // NYC rough boundaries
  const nycBounds = {
    north: 40.9176,  // Northern Bronx
    south: 40.4774,  // Southern Staten Island
    east: -73.7004,  // Eastern Queens
    west: -74.2591   // Western Staten Island
  };
  
  return lat >= nycBounds.south && 
         lat <= nycBounds.north && 
         lng >= nycBounds.west && 
         lng <= nycBounds.east;
};

// Transform Supabase data to MapLocation format
const transformSupabaseData = (item: LungsData, index: number): MapLocation | null => {
  const lng = item['longitude'];
  const lat = item['latitude'];
  
  // Check if we have valid coordinates
  let validCoords = false;
  let finalLng = 0;
  let finalLat = 0;
  
  if (lng && lat && lng !== 0 && lat !== 0) {
    // Check if coordinates are within NYC bounds
    if (isWithinNYCBounds(lat, lng)) {
      validCoords = true;
      finalLng = lng;
      finalLat = lat;
      console.log(`✅ Valid NYC coordinates for ${item['Name of Garden']}: ${lat}, ${lng}`);
    } else {
      console.warn(`⚠️ Coordinates outside NYC for ${item['Name of Garden']}: ${lat}, ${lng} - will use [0,0]`);
    }
  } else {
    console.log(`❌ No coordinates for ${item['Name of Garden']} - will use [0,0]`);
  }
  
  return {
    id: `supabase-${index}`,
    name: item['Name of Garden'],
    type: 'garden' as const,
    description: item['Address'] || 'Community Garden',
    tags: ['Community Garden', 'LUNGS Data', ...(item['Neighborhood'] ? [item['Neighborhood']] : [])],
    details: item['Contact Information'] ? `Contact: ${item['Contact Information']}` : undefined,
    lngLat: [finalLng, finalLat],
    address: item['Address'],
    operatingHours: item['Hours'] ? {
      // Parse the open hours if they're in a structured format
      // For now, we'll store as a general note for all days
      monday: item['Hours'],
      tuesday: item['Hours'],
      wednesday: item['Hours'],
      thursday: item['Hours'],
      friday: item['Hours'],
      saturday: item['Hours'],
      sunday: item['Hours']
    } : undefined,
    website: item['Website'],
    borough: item['Neighborhood'] // Using neighborhood as borough for now
  };
};

export const fetchSupabaseGardenData = async (): Promise<MapLocation[]> => {
  try {
    console.log('Fetching garden data from Supabase...');
    
    const { data, error } = await supabase
      .from('lungs_data1') // Updated to use the correct table name
      .select('*');

    console.log('Supabase query result:', { data, error });

    if (error) {
      console.error('Error fetching Supabase data:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No data found in Supabase table lungs_data1');
      return [];
    }

    console.log('Supabase data fetched successfully:', data.length, 'records');
    console.log('Sample Supabase record:', data[0]);
    
    const transformedData = data
      .map((item, index) => transformSupabaseData(item, index))
      .filter((location): location is MapLocation => location !== null);
    
    // Filter out items without addresses
    const validData = transformedData.filter(item => item.address);
    
    // Separate items with valid coordinates vs those at [0,0]
    const withValidCoords = validData.filter(item => item.lngLat[0] !== 0 || item.lngLat[1] !== 0);
    const withoutCoords = validData.filter(item => item.lngLat[0] === 0 && item.lngLat[1] === 0);
    
    console.log('Valid Supabase locations after filtering:', validData.length);
    console.log('- With valid NYC coordinates:', withValidCoords.length);
    console.log('- Without coordinates (at [0,0]):', withoutCoords.length);
    
    if (withoutCoords.length > 0) {
      console.log('Gardens without coordinates (need manual coordinate fixes):');
      withoutCoords.forEach(garden => {
        console.log(`- ${garden.name} at ${garden.address}`);
      });
    }
    
    return validData;
  } catch (error) {
    console.error('Failed to fetch Supabase garden data:', error);
    return [];
  }
};
