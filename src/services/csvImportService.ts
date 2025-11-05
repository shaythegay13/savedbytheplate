import { supabase } from '@/integrations/supabase/client';
import Papa from 'papaparse';

interface CSVRow {
  [key: string]: string;
}

export async function importCSVToLocations() {
  const csvFiles = [
    { path: '/processed/complete_comprehensive_food_access.csv', source: 'comprehensive_food_access' },
    { path: '/processed/food_banks.csv', source: 'food_banks' },
    { path: '/processed/farmers_markets.csv', source: 'farmers_markets' },
    { path: '/processed/comprehensive_community_fridges.csv', source: 'community_fridges' }
  ];

  let totalImported = 0;
  let totalErrors = 0;

  for (const file of csvFiles) {
    try {
      console.log(`Importing ${file.path}...`);
      
      const response = await fetch(file.path);
      const csvText = await response.text();
      
      const parsed = Papa.parse<CSVRow>(csvText, {
        header: true,
        skipEmptyLines: true
      });

      const locations = parsed.data.map(row => {
        const lat = parseFloat(row.latitude || row.lat || row.Latitude || '0');
        const lng = parseFloat(row.longitude || row.lng || row.lon || row.Longitude || '0');

        if (!lat || !lng || lat === 0 || lng === 0) {
          return null;
        }

        return {
          name: row.name || row['Name of Garden'] || row['Name'] || 'Unnamed Location',
          type: normalizeType(row.type || row.category || row.facility_type || 'garden'),
          description: row.description || row.Description || null,
          address: row.address || row.Address || null,
          latitude: lat,
          longitude: lng,
          organization: row.organization || row.owner || row.Owner || null,
          website: row.website || row.social_media_website1 || row.Website || null,
          neighborhood: row.neighborhood || row.Neighborhood || null,
          open_hours: row.open_hours || row.hours || row.Hours || null,
          contact_information: row.contact_information || row['Contact Information'] || null,
          local_items_selling: row.local_items_selling || row.loca_items_selling || null,
          social_media_website1: row.social_media_website1 || null,
          social_media_website2: row.social_media_website2 || null,
          cross_streets: row.crossstreets || null,
          zip_code: row.zipcode || null,
          borough: row.borough || null,
          owner: row.owner || row.Owner || null,
          status: 'active',
          verified: true,
          source: file.source
        };
      }).filter(loc => loc !== null);

      // Insert in batches of 50
      for (let i = 0; i < locations.length; i += 50) {
        const batch = locations.slice(i, i + 50);
        
        const { error } = await supabase
          .from('locations')
          .upsert(batch, {
            onConflict: 'name,latitude,longitude',
            ignoreDuplicates: true
          });

        if (error) {
          console.error(`Error importing batch from ${file.source}:`, error);
          totalErrors += batch.length;
        } else {
          totalImported += batch.length;
        }
      }

      console.log(`Completed ${file.source}: ${locations.length} locations processed`);
      
    } catch (error) {
      console.error(`Error processing ${file.path}:`, error);
      totalErrors++;
    }
  }

  return {
    success: totalErrors === 0,
    totalImported,
    totalErrors
  };
}

function normalizeType(type: string): string {
  const normalized = type.toLowerCase().trim();
  
  // Map various type names to standard types
  const typeMap: { [key: string]: string } = {
    'community garden': 'garden',
    'garden': 'garden',
    'greenthumb': 'garden',
    'farmers market': 'market',
    'market': 'market',
    'greenmarket': 'market',
    'community fridge': 'fridge',
    'fridge': 'fridge',
    'free fridge': 'fridge',
    'food bank': 'foodbank',
    'foodbank': 'foodbank',
    'food pantry': 'foodbank',
    'farm': 'farm',
    'urban farm': 'urbanfarm',
    'csa': 'csa',
    'business': 'business',
    'store': 'business'
  };

  return typeMap[normalized] || 'garden';
}
