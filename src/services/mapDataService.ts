
import { MapLocation, NYCDataItem } from '../components/map/types';
import { fetchGreenThumbData, mergeGardenData } from './greenThumbService';

const NYC_DATA_URL = 'https://data.cityofnewyork.us/resource/p78i-pat6.json';

// Map jurisdiction abbreviations to full names
const expandJurisdiction = (juris?: string): string => {
  if (!juris) return '';
  
  const jurisdictionMap: Record<string, string> = {
    'DPR': 'NYC Parks',
    'HPD': 'Department of Housing Preservation and Development',
    'NYCHA': 'New York City Housing Authority',
    'DOT': 'Department of Transportation',
    'DOE': 'Department of Education',
    'NYRP': 'New York Restoration Project',
    'BQLT': 'Brooklyn-Queens Land Trust',
    'MLT': 'Manhattan Land Trust',
    'DSNY': 'Department of Sanitation',
    'HRA': 'Human Resources Administration',
    'PRI': 'Privately owned land'
  };
  
  // Handle multiple jurisdictions separated by "/"
  if (juris.includes('/')) {
    return juris.split('/').map(abbr => jurisdictionMap[abbr.trim()] || abbr.trim()).join(' / ');
  }
  
  return jurisdictionMap[juris] || juris;
};

// Map borough abbreviations to full names
const expandBorough = (borough?: string): string => {
  if (!borough) return '';
  
  const boroughMap: Record<string, string> = {
    'B': 'Brooklyn',
    'M': 'Manhattan',
    'Q': 'Queens',
    'R': 'Staten Island',
    'X': 'Bronx'
  };
  
  return boroughMap[borough] || borough;
};

// Map NYC facility types to our location types
const mapFacilityType = (facilityType?: string, facilitySubtype?: string): MapLocation['type'] => {
  // Since these are all community gardens, return 'garden'
  return 'garden';
};

// Generate tags based on facility data
const generateTags = (item: NYCDataItem): string[] => {
  const tags: string[] = [];
  
  if (item.facility_type) tags.push(item.facility_type);
  if (item.facility_subtype) tags.push(item.facility_subtype);
  if (item.borough) tags.push(expandBorough(item.borough));
  
  return tags.slice(0, 3); // Limit to 3 tags
};

// Extract operating hours from the data
const extractOperatingHours = (item: NYCDataItem) => {
  const hours: any = {};
  
  if (item.openhrsm) hours.monday = item.openhrsm;
  if (item.openhrstu) hours.tuesday = item.openhrstu;
  if (item.openhrsw) hours.wednesday = item.openhrsw;
  if (item.openhrsth) hours.thursday = item.openhrsth;
  if (item.openhrsf) hours.friday = item.openhrsf;
  if (item.openhrssa) hours.saturday = item.openhrssa;
  if (item.openhrssu) hours.sunday = item.openhrssu;
  
  // Only return if we have at least one hour entry
  return Object.keys(hours).length > 0 ? hours : undefined;
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
    lngLat: [lng, lat], // Verify coordinate order (Mapbox uses [lng, lat])
    address: item.address,
    crossstreets: item.crossstreets,
    zipcode: item.zipcode,
    borough: expandBorough(item.borough),
    communityboard: item.communityboard,
    juris: expandJurisdiction(item.juris),
    status: item.status,
    operatingHours: extractOperatingHours(item)
  };
};

export const fetchNYCMapData = async (): Promise<MapLocation[]> => {
  try {
    console.log('Fetching NYC map data...');
    const response = await fetch(`${NYC_DATA_URL}?$limit=5000`);
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data: NYCDataItem[] = await response.json();
    console.log('Raw NYC data sample:', data.slice(0, 5));
    
    const nycLocations = data
      .map(item => {
        const transformed = transformNYCData(item);
        if (!transformed) console.warn('Skipped item:', item);
        return transformed;
      })
      .filter((location): location is MapLocation => location !== null);

    // Fetch and merge GreenThumb data
    console.log('Fetching GreenThumb data...');
    const greenThumbLocations = await fetchGreenThumbData();
    
    // Merge all data sources
    const allLocations = mergeGardenData(nycLocations, greenThumbLocations);
    
    console.log('Total locations (NYC + GreenThumb):', allLocations.length);
    
    return allLocations;
  } catch (error) {
    console.error('Full error:', error);
    return [];
  }
};
