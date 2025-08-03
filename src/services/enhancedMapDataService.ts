import { MapLocation } from '../components/map/types';
import { fetchNYCMapData } from './mapDataService';

// CSV data parsers for different food access types
interface CSVLocation {
  name: string;
  type: string;
  address: string;
  latitude: string;
  longitude: string;
  organization?: string;
  website?: string;
  hours?: string;
  contact?: string;
  additional_info?: string;
}

// Parse CSV data into MapLocation format
const parseCSVToLocations = (csvText: string, locationType: MapLocation['type']): MapLocation[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    console.warn(`No data found in CSV for type: ${locationType}`);
    return [];
  }
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  console.log(`📊 Parsing CSV for ${locationType}, headers:`, headers);
  
  const locations: MapLocation[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Enhanced CSV parser - handles quotes and commas better
    const values: string[] = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim()); // Don't forget the last value
    
    const row: any = {};
    headers.forEach((header, j) => {
      row[header] = values[j] || '';
    });
    
    const lat = parseFloat(row.latitude);
    const lng = parseFloat(row.longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      console.warn(`Invalid coordinates for ${row.name}:`, lat, lng);
      continue;
    }
    
    // Use the passed locationType directly instead of trying to map from CSV
    const location: MapLocation = {
      id: `csv-${locationType}-${i}`,
      name: row.name || 'Unnamed Location',
      type: locationType, // Use the parameter directly
      description: row.organization || row.address || '',
      tags: [locationType.replace('_', ' '), row.organization].filter(Boolean),
      lngLat: [lng, lat] as [number, number],
      address: row.address,
      website: row.website,
      details: row.additional_info ? 
        (row.contact ? `${row.additional_info}\nContact: ${row.contact}` : row.additional_info) :
        (row.contact ? `Contact: ${row.contact}` : undefined)
    };
    
    // Parse operating hours
    if (row.hours) {
      location.operatingHours = { monday: row.hours };
    }
    
    locations.push(location);
    console.log(`✅ Added ${locationType}:`, location.name, `at [${lng}, ${lat}]`);
  }
  
  console.log(`📍 Parsed ${locations.length} ${locationType} locations from CSV`);
  return locations;
};

// Fetch and parse community fridges data
const fetchCommunityFridges = async (): Promise<MapLocation[]> => {
  try {
    console.log('🔄 Fetching community fridges...');
    const response = await fetch('/processed/community_fridges.csv');
    if (!response.ok) {
      console.warn('CSV file not found, using fallback data');
      return getFallbackFridges();
    }
    const csvText = await response.text();
    const result = parseCSVToLocations(csvText, 'fridge');
    console.log('✅ Community fridges loaded:', result.length);
    return result;
  } catch (error) {
    console.error('Error fetching community fridges:', error);
    return getFallbackFridges();
  }
};

// Fetch and parse farmers markets data
const fetchFarmersMarkets = async (): Promise<MapLocation[]> => {
  try {
    console.log('🔄 Fetching farmers markets...');
    const response = await fetch('/processed/farmers_markets.csv');
    if (!response.ok) throw new Error('Failed to fetch farmers markets');
    const csvText = await response.text();
    const result = parseCSVToLocations(csvText, 'market');
    console.log('✅ Farmers markets loaded:', result.length);
    return result;
  } catch (error) {
    console.error('Error fetching farmers markets:', error);
    return [];
  }
};

// Fetch and parse food banks data
const fetchFoodBanks = async (): Promise<MapLocation[]> => {
  try {
    console.log('🔄 Fetching food banks...');
    const response = await fetch('/processed/food_banks.csv');
    if (!response.ok) throw new Error('Failed to fetch food banks');
    const csvText = await response.text();
    const result = parseCSVToLocations(csvText, 'foodbank');
    console.log('✅ Food banks loaded:', result.length);
    return result;
  } catch (error) {
    console.error('Error fetching food banks:', error);
    return [];
  }
};

// Enhanced data fetcher that combines all sources
export const fetchEnhancedMapData = async (): Promise<MapLocation[]> => {
  try {
    console.log('🌱 Fetching enhanced map data from all sources...');
    
    // Fetch all data sources in parallel
    const [
      nycGardens,
      communityFridges,
      farmersMarkets,
      foodBanks
    ] = await Promise.all([
      fetchNYCMapData(),
      fetchCommunityFridges(),
      fetchFarmersMarkets(),
      fetchFoodBanks()
    ]);
    
    // Combine all data
    const allLocations = [
      ...nycGardens,
      ...communityFridges,
      ...farmersMarkets,
      ...foodBanks
    ];
    
    console.log('📊 Enhanced map data summary:');
    console.log(`  • Community Gardens: ${nycGardens.length}`);
    console.log(`  • Community Fridges: ${communityFridges.length}`);
    console.log(`  • Farmers Markets: ${farmersMarkets.length}`);
    console.log(`  • Food Banks: ${foodBanks.length}`);
    console.log(`  • Total: ${allLocations.length}`);
    
    return allLocations;
  } catch (error) {
    console.error('Error fetching enhanced map data:', error);
    // Fallback to basic NYC data
    return await fetchNYCMapData();
  }
};

// Helper to categorize locations by type
export const categorizeLocations = (locations: MapLocation[]) => {
  const categories = {
    gardens: locations.filter(l => l.type === 'garden'),
    markets: locations.filter(l => l.type === 'market'),
    farms: locations.filter(l => l.type === 'farm'),
    urbanfarms: locations.filter(l => l.type === 'urbanfarm'),
    businesses: locations.filter(l => l.type === 'business'),
    fridges: locations.filter(l => l.type === 'fridge'),
    foodbanks: locations.filter(l => l.type === 'foodbank')
  };
  
  return categories;
};

// Fallback data if CSV files aren't accessible
const getFallbackFridges = (): MapLocation[] => [
  {
    id: 'fridge-1',
    name: 'Bed-Stuy Community Fridge',
    type: 'fridge' as const,
    description: 'Free 24/7 food access',
    tags: ['Community Fridge', 'Brooklyn'],
    lngLat: [-73.942735, 40.68639],
    address: '375 Throop Avenue, Brooklyn, NY 11221'
  }
];

export default fetchEnhancedMapData;