
import { MapLocation, NYCDataItem } from '../components/map/types';

const NYC_DATA_URL = 'https://data.cityofnewyork.us/resource/p78i-pat6.json';

// Map NYC facility types to our location types
const mapFacilityType = (facilityType?: string, facilitySubtype?: string): MapLocation['type'] => {
  const type = facilityType?.toLowerCase() || '';
  const subtype = facilitySubtype?.toLowerCase() || '';
  
  if (type.includes('garden') || subtype.includes('garden')) return 'garden';
  if (type.includes('farm') || subtype.includes('farm')) {
    if (type.includes('urban') || subtype.includes('urban')) return 'urbanfarm';
    return 'farm';
  }
  if (type.includes('market') || subtype.includes('market')) return 'market';
  return 'business';
};

// Generate tags based on facility data
const generateTags = (item: NYCDataItem): string[] => {
  const tags: string[] = [];
  
  if (item.facility_type) tags.push(item.facility_type);
  if (item.facility_subtype) tags.push(item.facility_subtype);
  if (item.borough) tags.push(item.borough);
  
  return tags.slice(0, 3); // Limit to 3 tags
};

// Transform NYC data to our MapLocation format
const transformNYCData = (item: NYCDataItem): MapLocation | null => {
  if (!item.lat || !item.lon) return null; // Skip invalid entries
  const lat = parseFloat(item.lat);
  const lng = parseFloat(item.lon);
  if (isNaN(lat) || isNaN(lng)) return null; // Skip non-numeric coordinates
  
  return {
    id: item.objectid || `location-${Math.random().toString(36).substr(2, 9)}`,
    name: item.gardenname || 'Unnamed facility',
    type: mapFacilityType(item.facility_type, item.facility_subtype),
    description: item.address || 'NYC facility',
    tags: generateTags(item),
    details: item.phone ? `Phone: ${item.phone}` : undefined,
    lngLat: [lng, lat] // Verify coordinate order (Mapbox uses [lng, lat])
  };
};

export const fetchNYCMapData = async (): Promise<MapLocation[]> => {
  try {
    console.log('Fetching NYC map data...');
    const response = await fetch(`${NYC_DATA_URL}?$limit=5000`); // Increased limit
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data: NYCDataItem[] = await response.json();
    console.log('Raw data sample:', data.slice(0, 5)); // Debugging
    
    const locations = data
      .map(item => {
        const transformed = transformNYCData(item);
        if (!transformed) console.warn('Skipped item:', item);
        return transformed;
      })
      .filter((location): location is MapLocation => location !== null);
      // .filter(location => { ... }); // Disabled geographic filter
    
    console.log('Transformed locations:', locations);
    return locations;
  } catch (error) {
    console.error('Full error:', error); // Detailed error
    return [];
  }
};
