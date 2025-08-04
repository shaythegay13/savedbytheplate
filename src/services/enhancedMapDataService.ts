import { MapLocation } from '../components/map/types';
import { fetchNYCMapData } from './mapDataService';
import { supabase } from '@/integrations/supabase/client';

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

// Enhanced data fetcher that focuses on the 4 main processed CSV files
export const fetchEnhancedMapData = async (): Promise<MapLocation[]> => {
  try {
    console.log('🌱 Fetching enhanced map data from 4 main processed CSV files...');
    
    const allLocations: MapLocation[] = [];
    
    // Load each specific CSV file with its corresponding type
    const csvSources = [
      { 
        path: '/processed/complete_comprehensive_food_access.csv', 
        name: 'Complete Comprehensive Food Access',
        parser: parseCSVFromMixedTypes
      },
      { 
        path: '/processed/comprehensive_community_fridges.csv', 
        name: 'Community Fridges',
        parser: (csvText: string) => parseCSVToLocations(csvText, 'fridge')
      },
      { 
        path: '/processed/farmers_markets.csv', 
        name: 'Farmers Markets',
        parser: (csvText: string) => parseCSVToLocations(csvText, 'market')
      },
      { 
        path: '/processed/food_banks.csv', 
        name: 'Food Banks',
        parser: (csvText: string) => parseCSVToLocations(csvText, 'foodbank')
      }
    ];
    
    // Load each CSV file with proper parsing
    for (const source of csvSources) {
      try {
        console.log(`🔄 Loading ${source.name} from ${source.path}...`);
        const response = await fetch(source.path);
        if (response.ok) {
          const csvText = await response.text();
          const locations = source.parser(csvText);
          
          if (locations.length > 0) {
            allLocations.push(...locations);
            console.log(`✅ Loaded ${locations.length} locations from ${source.name}`);
            
            // Log some example entries for debugging
            const sampleCount = Math.min(3, locations.length);
            for (let i = 0; i < sampleCount; i++) {
              const loc = locations[i];
              console.log(`   📍 Example: ${loc.name} (${loc.type}) at [${loc.lngLat[0]}, ${loc.lngLat[1]}]`);
            }
          } else {
            console.warn(`⚠️ No valid locations found in ${source.name}`);
          }
        } else {
          console.warn(`⚠️ Could not load ${source.name}: ${response.status}`);
        }
      } catch (error) {
        console.error(`❌ Error loading ${source.name}:`, error);
      }
    }
    
    console.log(`📊 Total locations loaded before deduplication: ${allLocations.length}`);
    
    // Remove duplicates based on proximity and name similarity
    const uniqueLocations = removeDuplicates(allLocations);
    
    // Final summary with proper counts
    const summary = {
      gardens: uniqueLocations.filter(l => l.type === 'garden').length,
      fridges: uniqueLocations.filter(l => l.type === 'fridge').length,
      markets: uniqueLocations.filter(l => l.type === 'market').length,
      foodbanks: uniqueLocations.filter(l => l.type === 'foodbank').length,
      farms: uniqueLocations.filter(l => l.type === 'farm').length,
      urbanfarms: uniqueLocations.filter(l => l.type === 'urbanfarm').length,
      businesses: uniqueLocations.filter(l => l.type === 'business').length
    };
    
    console.log('📊 Enhanced map data final summary:');
    console.log(`  • Community Gardens: ${summary.gardens}`);
    console.log(`  • Community Fridges: ${summary.fridges}`);
    console.log(`  • Farmers Markets: ${summary.markets}`);
    console.log(`  • Food Banks/Pantries: ${summary.foodbanks}`);
    console.log(`  • Farms: ${summary.farms}`);
    console.log(`  • Urban Farms: ${summary.urbanfarms}`);
    console.log(`  • Businesses: ${summary.businesses}`);
    console.log(`  • Total Unique Locations: ${uniqueLocations.length}`);
    
    return uniqueLocations;
  } catch (error) {
    console.error('Error fetching enhanced map data:', error);
    return [];
  }
};

// Fetch additional community fridges with fallback
const fetchAdditionalFridges = async (): Promise<MapLocation[]> => {
  try {
    console.log('🔄 Fetching additional community fridges...');
    const response = await fetch('/processed/additional_community_fridges.csv');
    if (!response.ok) {
      console.log('Additional fridges CSV not found, skipping...');
      return [];
    }
    const csvText = await response.text();
    const result = parseCSVToLocations(csvText, 'fridge');
    console.log('✅ Additional community fridges loaded:', result.length);
    return result;
  } catch (error) {
    console.log('Additional fridges data not available:', error);
    return [];
  }
};

// Fetch enhanced farmers markets with fallback
const fetchEnhancedMarkets = async (): Promise<MapLocation[]> => {
  try {
    console.log('🔄 Fetching enhanced farmers markets...');
    const response = await fetch('/processed/enhanced_farmers_markets.csv');
    if (!response.ok) {
      console.log('Enhanced markets CSV not found, skipping...');
      return [];
    }
    const csvText = await response.text();
    const result = parseCSVToLocations(csvText, 'market');
    console.log('✅ Enhanced farmers markets loaded:', result.length);
    return result;
  } catch (error) {
    console.log('Enhanced markets data not available:', error);
    return [];
  }
};

// Fetch Lungs NYC gardens with fallback
const fetchLungsGardens = async (): Promise<MapLocation[]> => {
  try {
    console.log('🔄 Fetching Lungs NYC gardens...');
    const response = await fetch('/processed/lungs_nyc_gardens.csv');
    if (!response.ok) {
      console.log('Lungs NYC gardens CSV not found, skipping...');
      return [];
    }
    const csvText = await response.text();
    const result = parseCSVToLocations(csvText, 'garden');
    console.log('✅ Lungs NYC gardens loaded:', result.length);
    return result;
  } catch (error) {
    console.log('Lungs NYC gardens data not available:', error);
    return [];
  }
};

// Fetch land trust gardens with fallback
const fetchLandTrustGardens = async (): Promise<MapLocation[]> => {
  try {
    console.log('🔄 Fetching land trust gardens...');
    const response = await fetch('/processed/land_trust_gardens.csv');
    if (!response.ok) {
      console.log('Land trust gardens CSV not found, skipping...');
      return [];
    }
    const csvText = await response.text();
    const result = parseCSVToLocations(csvText, 'garden');
    console.log('✅ Land trust gardens loaded:', result.length);
    return result;
  } catch (error) {
    console.log('Land trust gardens data not available:', error);
    return [];
  }
};

// Fetch farms and markets with fallback
const fetchFarmsAndMarkets = async (): Promise<MapLocation[]> => {
  try {
    console.log('🔄 Fetching farms and markets...');
    const response = await fetch('/processed/farms_and_markets.csv');
    if (!response.ok) {
      console.log('Farms and markets CSV not found, skipping...');
      return [];
    }
    const csvText = await response.text();
    // This CSV contains mixed types, so we need to parse differently
    const locations = parseCSVFromMixedTypes(csvText);
    console.log('✅ Farms and markets loaded:', locations.length);
    return locations;
  } catch (error) {
    console.log('Farms and markets data not available:', error);
    return [];
  }
};

// Map CSV types to our MapLocation types
const mapCSVTypeToLocationType = (csvType: string): MapLocation['type'] => {
  const typeMap: Record<string, MapLocation['type']> = {
    'community_fridge': 'fridge',
    'community_garden': 'garden',
    'farmers_market': 'market',
    'farmers market': 'market',
    'food_bank': 'foodbank',
    'food_pantry': 'foodbank',
    'food bank': 'foodbank',
    'mobile_pantry': 'foodbank',
    'soup_kitchen': 'foodbank',
    'distribution_center': 'foodbank',
    'farm': 'farm',
    'urban_farm': 'urbanfarm',
    'urban farm': 'urbanfarm',
    'business': 'business',
    'local_food_business': 'business',
    'fridge': 'fridge',
    'garden': 'garden',
    'market': 'market',
    'foodbank': 'foodbank',
    'urbanfarm': 'urbanfarm'
  };
  
  return typeMap[csvType.toLowerCase()] || 'garden';
};

// Special parser for mixed-type CSV data
const parseCSVFromMixedTypes = (csvText: string): MapLocation[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const locations: MapLocation[] = [];
  
  console.log(`📊 Parsing mixed-type CSV, headers:`, headers);
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
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
    values.push(currentValue.trim());
    
    const row: any = {};
    headers.forEach((header, j) => {
      row[header] = values[j] || '';
    });
    
    const lat = parseFloat(row.latitude);
    const lng = parseFloat(row.longitude);
    
    if (isNaN(lat) || isNaN(lng)) continue;
    
    // Map the CSV type to our standardized location type
    const locationType = mapCSVTypeToLocationType(row.type || '');
    
    const location: MapLocation = {
      id: `mixed-${locationType}-${i}`,
      name: row.name || 'Unnamed Location',
      type: locationType,
      description: row.organization || row.address || '',
      tags: [locationType.replace('_', ' '), row.organization].filter(Boolean),
      lngLat: [lng, lat] as [number, number],
      address: row.address,
      website: row.website,
      details: row.additional_info
    };
    
    if (row.hours) {
      location.operatingHours = { monday: row.hours };
    }
    
    locations.push(location);
    
    // Log first few entries for debugging
    if (i <= 5) {
      console.log(`✅ Added ${row.type} -> ${locationType}:`, location.name, `at [${lng}, ${lat}]`);
    }
  }
  
  console.log(`📍 Parsed ${locations.length} mixed-type locations from CSV`);
  return locations;
};

// Remove duplicate locations based on proximity and name similarity
const removeDuplicates = (locations: MapLocation[]): MapLocation[] => {
  const unique: MapLocation[] = [];
  
  for (const location of locations) {
    const isDuplicate = unique.some(existing => {
      // Check coordinate proximity (within ~100 meters)
      const distance = Math.sqrt(
        Math.pow(existing.lngLat[0] - location.lngLat[0], 2) +
        Math.pow(existing.lngLat[1] - location.lngLat[1], 2)
      );
      
      // Check name similarity (basic check)
      const nameSimilar = existing.name.toLowerCase() === location.name.toLowerCase();
      
      // Consider as duplicate if same type and either very close coordinates OR same name
      return existing.type === location.type && (distance < 0.001 || nameSimilar);
    });
    
    if (!isDuplicate) {
      // Ensure unique ID
      location.id = `${location.type}-${unique.length}-${Date.now()}`;
      unique.push(location);
    }
  }
  
  console.log(`🔄 Removed ${locations.length - unique.length} duplicate locations`);
  return unique;
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


// Static land trust data from scraped sources
const getStaticLandTrustData = async (): Promise<MapLocation[]> => {
  const landTrustData: MapLocation[] = [
    // Manhattan Land Trust gardens
    { id: 'mlt-1', name: 'Carver Community Garden', type: 'garden', description: 'Community garden managed by Manhattan Land Trust', tags: ['garden', 'Manhattan Land Trust'], lngLat: [-73.950707, 40.810909], address: '242 E 124th St, New York, NY' },
    { id: 'mlt-2', name: 'Clayton Williams Community Garden', type: 'garden', description: 'Community garden managed by Manhattan Land Trust', tags: ['garden', 'Manhattan Land Trust'], lngLat: [-73.9517, 40.8109], address: '2351 8th Ave, New York, NY' },
    { id: 'mlt-3', name: 'East Harlem Community Garden', type: 'garden', description: 'Community garden managed by Manhattan Land Trust', tags: ['garden', 'Manhattan Land Trust'], lngLat: [-73.9434, 40.7949], address: '433 E 117th St, New York, NY' },
    { id: 'mlt-4', name: 'Five Star Garden', type: 'garden', description: 'Community garden managed by Manhattan Land Trust', tags: ['garden', 'Manhattan Land Trust'], lngLat: [-73.9507, 40.8105], address: '252 W 121st St, New York, NY' },
    { id: 'mlt-5', name: 'Hope Steven Garden', type: 'garden', description: 'Community garden managed by Manhattan Land Trust', tags: ['garden', 'Manhattan Land Trust'], lngLat: [-73.9507, 40.8205], address: '1656 Amsterdam Ave, New York, NY' },
    { id: 'mlt-6', name: 'La Perla Garden', type: 'garden', description: 'Community garden managed by Manhattan Land Trust', tags: ['garden', 'Manhattan Land Trust'], lngLat: [-73.9615, 40.7965], address: '78 W 105th St, New York, NY', website: 'http://laperlagarden.org/' },
    { id: 'mlt-7', name: "Mo' Pals Garden", type: 'garden', description: 'Community garden managed by Manhattan Land Trust', tags: ['garden', 'Manhattan Land Trust'], lngLat: [-73.9507, 40.8305], address: '545 W 147th St, New York, NY' },
    { id: 'mlt-8', name: "Papo's Garden", type: 'garden', description: 'Community garden managed by Manhattan Land Trust', tags: ['garden', 'Manhattan Land Trust'], lngLat: [-73.9425, 40.8055], address: '220 E 119th St, New York, NY' },
    { id: 'mlt-9', name: 'Serenity Garden', type: 'garden', description: 'Community garden managed by Manhattan Land Trust', tags: ['garden', 'Manhattan Land Trust'], lngLat: [-73.9507, 40.8295], address: '522 W 146th St, New York, NY' },
    { id: 'mlt-10', name: '11 Street Community Garden', type: 'garden', description: 'Community garden managed by Manhattan Land Trust', tags: ['garden', 'Manhattan Land Trust'], lngLat: [-73.9831, 40.7285], address: '422 E 11th St, New York, NY' },
    { id: 'mlt-11', name: "Albert's Garden", type: 'garden', description: 'Community garden managed by Manhattan Land Trust', tags: ['garden', 'Manhattan Land Trust'], lngLat: [-73.9911, 40.7254], address: '18 E 2nd St, New York, NY', website: 'http://albertsgarden.org/' },
    { id: 'mlt-12', name: "All People's Garden", type: 'garden', description: 'Community garden managed by Manhattan Land Trust', tags: ['garden', 'Manhattan Land Trust'], lngLat: [-73.9825, 40.7247], address: '295 E 3rd St, New York, NY', website: 'http://allpeoplesgarden.org/' },
    { id: 'mlt-13', name: 'Lower East Side People Care', type: 'garden', description: 'Community garden managed by Manhattan Land Trust', tags: ['garden', 'Manhattan Land Trust'], lngLat: [-73.9898, 40.7130], address: '25 Rutgers St, New York, NY' },
    { id: 'mlt-14', name: 'Parque de Tranquilidad', type: 'garden', description: 'Community garden managed by Manhattan Land Trust', tags: ['garden', 'Manhattan Land Trust'], lngLat: [-73.9835, 40.7226], address: '318 E 4th St, New York, NY', website: 'http://parquedetranquilidad.org/' },
    
    // Brooklyn-Queens Land Trust gardens
    { id: 'bqlt-1', name: '1100 Block Bergen Street Community Garden', type: 'garden', description: 'Community garden managed by Brooklyn-Queens Land Trust', tags: ['garden', 'Brooklyn-Queens Land Trust'], lngLat: [-73.9442, 40.6782], address: 'Bergen St, Brooklyn, NY' },
    { id: 'bqlt-2', name: 'Bed-Stuy Campaign Against Hunger Garden', type: 'garden', description: 'Community garden managed by Brooklyn-Queens Land Trust', tags: ['garden', 'Brooklyn-Queens Land Trust'], lngLat: [-73.9365, 40.6892], address: 'Bed-Stuy, Brooklyn, NY' },
    { id: 'bqlt-3', name: 'Chestnut Commons Community Garden', type: 'garden', description: 'Community garden managed by Brooklyn-Queens Land Trust', tags: ['garden', 'Brooklyn-Queens Land Trust'], lngLat: [-73.9515, 40.6975], address: 'Chestnut St, Brooklyn, NY' },
    { id: 'bqlt-4', name: 'Corona Community Garden', type: 'garden', description: 'Community garden managed by Brooklyn-Queens Land Trust', tags: ['garden', 'Brooklyn-Queens Land Trust'], lngLat: [-73.8648, 40.7489], address: 'Corona, Queens, NY' },
    { id: 'bqlt-5', name: 'East New York Community Garden', type: 'garden', description: 'Community garden managed by Brooklyn-Queens Land Trust', tags: ['garden', 'Brooklyn-Queens Land Trust'], lngLat: [-73.8826, 40.6669], address: 'East New York, Brooklyn, NY' },
    { id: 'bqlt-6', name: 'Flatbush Food Justice Garden', type: 'garden', description: 'Community garden managed by Brooklyn-Queens Land Trust', tags: ['garden', 'Brooklyn-Queens Land Trust'], lngLat: [-73.9626, 40.6501], address: 'Flatbush, Brooklyn, NY' },
    { id: 'bqlt-7', name: 'Jamaica Bay Community Garden', type: 'garden', description: 'Community garden managed by Brooklyn-Queens Land Trust', tags: ['garden', 'Brooklyn-Queens Land Trust'], lngLat: [-73.8370, 40.6892], address: 'Jamaica, Queens, NY' },
    { id: 'bqlt-8', name: 'Park Slope Food Justice Garden', type: 'garden', description: 'Community garden managed by Brooklyn-Queens Land Trust', tags: ['garden', 'Brooklyn-Queens Land Trust'], lngLat: [-73.9772, 40.6708], address: 'Park Slope, Brooklyn, NY' },
    { id: 'bqlt-9', name: 'Prospect Heights Community Garden', type: 'garden', description: 'Community garden managed by Brooklyn-Queens Land Trust', tags: ['garden', 'Brooklyn-Queens Land Trust'], lngLat: [-73.9681, 40.6781], address: 'Prospect Heights, Brooklyn, NY' },
    { id: 'bqlt-10', name: 'Williamsburg Community Garden', type: 'garden', description: 'Community garden managed by Brooklyn-Queens Land Trust', tags: ['garden', 'Brooklyn-Queens Land Trust'], lngLat: [-73.9442, 40.7081], address: 'Williamsburg, Brooklyn, NY' }
  ];
  
  console.log('✅ Static land trust data loaded:', landTrustData.length);
  return landTrustData;
};

// Static Queens Farm data
const getStaticQueensFarmData = async (): Promise<MapLocation[]> => {
  const queensFarmData: MapLocation[] = [
    { id: 'qf-1', name: 'Queens County Farm Museum', type: 'farm', description: "NYC's largest remaining tract of undisturbed farmland", tags: ['farm', 'museum', 'Queens'], lngLat: [-73.7368, 40.7292], address: '73-50 Little Neck Pkwy, Floral Park, NY 11004', website: 'https://www.queensfarm.org/' },
    { id: 'qf-2', name: 'Queens Farm Farmstand', type: 'market', description: 'Fresh produce from Queens County Farm Museum', tags: ['market', 'farm stand', 'Queens'], lngLat: [-73.7368, 40.7292], address: '73-50 Little Neck Pkwy, Floral Park, NY 11004', website: 'https://www.queensfarm.org/farmstand/' }
  ];
  
  console.log('✅ Static Queens farm data loaded:', queensFarmData.length);
  return queensFarmData;
};

// Static additional fridges data
const getStaticAdditionalFridgesData = async (): Promise<MapLocation[]> => {
  const additionalFridges: MapLocation[] = [
    // Community Fridge Finder locations
    { id: 'cf-1', name: 'West Harlem Community Fridge', type: 'fridge', description: '24/7 free food access', tags: ['fridge', 'West Harlem'], lngLat: [-73.9441, 40.8176], address: 'West Harlem, NY' },
    { id: 'cf-2', name: 'Bed-Stuy Community Fridge', type: 'fridge', description: '24/7 free food access', tags: ['fridge', 'Bed-Stuy'], lngLat: [-73.9365, 40.6892], address: 'Bed-Stuy, Brooklyn, NY' },
    { id: 'cf-3', name: 'East Village Community Fridge', type: 'fridge', description: '24/7 free food access', tags: ['fridge', 'East Village'], lngLat: [-73.9857, 40.7282], address: 'East Village, NY' },
    { id: 'cf-4', name: 'Washington Heights Community Fridge', type: 'fridge', description: '24/7 free food access', tags: ['fridge', 'Washington Heights'], lngLat: [-73.9441, 40.8448], address: 'Washington Heights, NY' },
    { id: 'cf-5', name: 'Bushwick Community Fridge', type: 'fridge', description: '24/7 free food access', tags: ['fridge', 'Bushwick'], lngLat: [-73.9194, 40.6944], address: 'Bushwick, Brooklyn, NY' },
    
    // One Love Community Fridge locations
    { id: 'ol-1', name: 'One Love Bronx Fridge', type: 'fridge', description: 'Community fridge by One Love Community', tags: ['fridge', 'One Love', 'Bronx'], lngLat: [-73.8648, 40.8448], address: 'Bronx, NY' },
    { id: 'ol-2', name: 'One Love Queens Fridge', type: 'fridge', description: 'Community fridge by One Love Community', tags: ['fridge', 'One Love', 'Queens'], lngLat: [-73.7949, 40.7282], address: 'Queens, NY' },
    { id: 'ol-3', name: 'One Love Staten Island Fridge', type: 'fridge', description: 'Community fridge by One Love Community', tags: ['fridge', 'One Love', 'Staten Island'], lngLat: [-74.1502, 40.5795], address: 'Staten Island, NY' }
  ];
  
  console.log('✅ Static additional fridges data loaded:', additionalFridges.length);
  return additionalFridges;
};

// Get static One Love Community Fridge data  
const getStaticOneLoveFridgesData = (): MapLocation[] => {
  return [
    {
      id: 'olcf-1-bedstuy',
      name: 'OLCF 1 — Bed-Stuy (Cafe Botani)',
      type: 'fridge',
      description: 'One Love Community Fridge hosted by Cafe Botani',
      tags: ['Community Fridge', 'Brooklyn', '24/7 Access'],
      details: 'Hosted by Cafe Botani, available 24/7',
      lngLat: [-73.9186, 40.6951],
      address: '173 Lewis Ave, Brooklyn, NY 11221'
    },
    {
      id: 'olcf-2-flatbush',
      name: 'OLCF 2 — Flatbush (B\'ShERT)',
      type: 'fridge',
      description: 'One Love Community Fridge hosted by B\'ShERT',
      tags: ['Community Fridge', 'Brooklyn', '24/7 Access'],
      details: 'Hosted by B\'ShERT, available 24/7',
      lngLat: [-73.9441, 40.6501],
      address: '1596 Church Ave, Brooklyn, NY 11226'
    },
    {
      id: 'olcf-3-gowanus',
      name: 'OLCF 3 — Gowanus',
      type: 'fridge',
      description: 'One Love Community Fridge in Gowanus',
      tags: ['Community Fridge', 'Brooklyn', '24/7 Access'],
      details: 'Community fridge in Gowanus neighborhood, available 24/7',
      lngLat: [-73.9903, 40.6736],
      address: '303 Bond St, Brooklyn, NY 11231'
    },
    {
      id: 'olcf-7-harlem',
      name: 'OLCF 7 — Harlem',
      type: 'fridge',
      description: 'One Love Community Fridge in Harlem',
      tags: ['Community Fridge', 'Manhattan', '24/7 Access'],
      details: 'Community fridge serving Harlem community, available 24/7',
      lngLat: [-73.9441, 40.8176],
      address: 'Harlem, Manhattan, NY'
    }
  ];
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