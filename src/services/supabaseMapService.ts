
import { supabase } from '@/integrations/supabase/client';
import { MapLocation } from '../components/map/types';

// Interface for the LUNGS Data1 table structure
interface LungsData {
  'Garden Name': string;
  'Address': string;
  'Open Hours'?: string;
  'Website'?: string;
  'Facebook'?: string;
  'Contact'?: string;
}

// Transform Supabase data to MapLocation format
const transformSupabaseData = (item: LungsData, index: number): MapLocation => {
  return {
    id: `supabase-${index}`,
    name: item['Garden Name'],
    type: 'garden' as const,
    description: item['Address'] || 'Community Garden',
    tags: ['Community Garden', 'LUNGS Data'],
    details: item['Contact'] ? `Contact: ${item['Contact']}` : undefined,
    lngLat: [0, 0], // Will need geocoding for actual coordinates
    address: item['Address'],
    operatingHours: item['Open Hours'] ? {
      // Parse the open hours if they're in a structured format
      // For now, we'll store as a general note
      monday: item['Open Hours'],
      tuesday: item['Open Hours'],
      wednesday: item['Open Hours'],
      thursday: item['Open Hours'],
      friday: item['Open Hours'],
      saturday: item['Open Hours'],
      sunday: item['Open Hours']
    } : undefined,
    website: item['Website'],
    facebook: item['Facebook']
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
    
    const transformedData = data.map((item, index) => transformSupabaseData(item, index));
    
    // Filter out items without addresses for now
    return transformedData.filter(item => item.address);
  } catch (error) {
    console.error('Failed to fetch Supabase garden data:', error);
    return [];
  }
};
