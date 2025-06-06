
import { supabase } from '@/integrations/supabase/client';
import { MapLocation } from '../components/map/types';

// Interface for the LUNGS Data1 table structure based on actual table schema
interface LungsData {
  'Name of Garden': string;
  'Address': string;
  'Hours'?: string;
  'Website'?: string;
  'Contact Information'?: string;
  'Neighborhood'?: string;
  'Longitude'?: number;
  'Latitude'?: number;
}

// Transform Supabase data to MapLocation format
const transformSupabaseData = (item: LungsData, index: number): MapLocation => {
  // Use actual coordinates if available, otherwise default to [0, 0]
  const lng = item['Longitude'] || 0;
  const lat = item['Latitude'] || 0;
  
  return {
    id: `supabase-${index}`,
    name: item['Name of Garden'],
    type: 'garden' as const,
    description: item['Address'] || 'Community Garden',
    tags: ['Community Garden', 'LUNGS Data', ...(item['Neighborhood'] ? [item['Neighborhood']] : [])],
    details: item['Contact Information'] ? `Contact: ${item['Contact Information']}` : undefined,
    lngLat: [lng, lat],
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
      .from('LUNGS Data1')
      .select('*');

    if (error) {
      console.error('Error fetching Supabase data:', error);
      return [];
    }

    if (!data) {
      console.log('No data found in Supabase table');
      return [];
    }

    console.log('Supabase data fetched:', data.length, 'records');
    console.log('Sample Supabase record:', data[0]);
    
    const transformedData = data.map((item, index) => transformSupabaseData(item, index));
    
    // Filter out items without addresses
    const validData = transformedData.filter(item => item.address);
    
    console.log('Valid Supabase locations after filtering:', validData.length);
    
    return validData;
  } catch (error) {
    console.error('Failed to fetch Supabase garden data:', error);
    return [];
  }
};
