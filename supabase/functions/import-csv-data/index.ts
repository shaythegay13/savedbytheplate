import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9';
import { parse as parseCsv } from 'https://deno.land/std@0.224.0/csv/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CSVRow {
  [key: string]: string;
}

interface CSVLocation {
  name: string;
  type: string;
  description?: string | null;
  address?: string | null;
  latitude: number;
  longitude: number;
  organization?: string | null;
  website?: string | null;
  neighborhood?: string | null;
  open_hours?: string | null;
  contact_information?: string | null;
  local_items_selling?: string | null;
  social_media_website1?: string | null;
  social_media_website2?: string | null;
  cross_streets?: string | null;
  zip_code?: string | null;
  borough?: string | null;
  owner?: string | null;
  status: string;
  verified: boolean;
  source: string;
}

function normalizeType(type: string): string {
  const normalized = (type || '').toLowerCase().trim();
  const typeMap: Record<string, string> = {
    'community garden': 'garden',
    'garden': 'garden',
    'greenthumb': 'garden',

    'farmers market': 'market',
    'farmers_market': 'market',
    'greenmarket': 'market',
    'market': 'market',

    'community fridge': 'fridge',
    'community_fridge': 'fridge',
    'fridge': 'fridge',
    'free fridge': 'fridge',

    'food bank': 'foodbank',
    'food_bank': 'foodbank',
    'foodbank': 'foodbank',
    'food pantry': 'foodbank',
    'food_pantry': 'foodbank',
    'pantry': 'foodbank',
    'mobile pantry': 'foodbank',
    'soup kitchen': 'foodbank',

    'farm': 'farm',

    'urban farm': 'urbanfarm',
    'urban_farm': 'urbanfarm',
    'urbanfarm': 'urbanfarm',
    'urban agriculture': 'urbanfarm',
    'rooftop farm': 'urbanfarm',
    'hydroponic farm': 'urbanfarm',

    'csa': 'csa',
    'csa program': 'csa',
    'csa pickup': 'csa',
    'csa site': 'csa',
    'community supported agriculture': 'csa',

    'business': 'business',
    'store': 'business',
    'local food business': 'business',
  };
  return typeMap[normalized] || 'garden';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { baseUrl, rowsBySource, includeNYCOpenData } = await req.json().catch(() => ({ 
      baseUrl: '', 
      rowsBySource: null,
      includeNYCOpenData: false 
    }));

    const allLocations: CSVLocation[] = [];
    const uniqueKeys = new Set<string>();
    let totalErrors = 0;

    // Fetch NYC Open Data if requested
    if (includeNYCOpenData) {
      try {
        console.log('Fetching NYC Open Data...');
        const nycResponse = await fetch('https://data.cityofnewyork.us/resource/p78i-pat6.json?$limit=5000');
        if (nycResponse.ok) {
          const nycData = await nycResponse.json();
          const nycLocations = nycData
            .map((item: any) => {
              const lat = parseFloat(item.lat || '0');
              const lng = parseFloat(item.lon || '0');
              if (!lat || !lng || lat === 0 || lng === 0 || Number.isNaN(lat) || Number.isNaN(lng)) return null;

              return {
                name: item.gardenname || 'Unnamed Garden',
                type: 'garden',
                description: item.address || null,
                address: item.address || null,
                latitude: lat,
                longitude: lng,
                organization: item.juris || null,
                website: null,
                neighborhood: item.borough || null,
                open_hours: null,
                contact_information: item.phone || null,
                cross_streets: item.crossstreets || null,
                zip_code: item.zipcode || null,
                borough: item.borough || null,
                status: 'active',
                verified: true,
                source: 'nyc_open_data',
              } as CSVLocation;
            })
            .filter((x: any) => x !== null);

          // Deduplicate within this dataset to avoid ON CONFLICT affecting same row twice
          const nycDeduped = Array.from(
            new Map(
              nycLocations.map((loc: CSVLocation) => [
                `${loc.name}|${loc.latitude}|${loc.longitude}`,
                loc
              ])
            ).values()
          );

          for (let i = 0; i < nycDeduped.length; i += 100) {
            const batch = nycDeduped.slice(i, i + 100);
            const { error } = await supabaseClient
              .from('locations')
              .upsert(batch, { onConflict: 'name,latitude,longitude' });
            if (error) {
              console.error('Error importing NYC Open Data batch:', error);
              totalErrors += batch.length;
            } else {
              // Track unique keys across all sources
              for (const loc of batch) {
                uniqueKeys.add(`${loc.name}|${loc.latitude}|${loc.longitude}`);
              }
            }
          }
          console.log(`Imported ${nycDeduped.length} NYC Open Data locations`);
        }
      } catch (e) {
        console.error('Failed to fetch NYC Open Data:', e);
        totalErrors++;
      }
    }

    // If rows are provided directly from the client, import them without fetching
    if (rowsBySource && typeof rowsBySource === 'object') {
      for (const [source, rawRows] of Object.entries(rowsBySource as Record<string, CSVRow[]>)) {
        try {
          const rows = rawRows as CSVRow[];
          const locations = rows
            .map((row) => {
              // Handle lungs_data source with special column names
              const lat = parseFloat(
                row.latitude || 
                (row as any).lat || 
                (row as any).Latitude || 
                '0'
              );
              const lng = parseFloat(
                row.longitude || 
                (row as any).lng || 
                (row as any).lon || 
                (row as any).long || 
                (row as any).Longitude || 
                '0'
              );
              if (!lat || !lng || lat === 0 || lng === 0 || Number.isNaN(lat) || Number.isNaN(lng)) return null;

              const name = (
                row.name || 
                (row as any)['Name of Garden'] || 
                (row as any)['Name'] || 
                'Unnamed Location'
              ).toString();
              const type = normalizeType(
                (row.type || 
                 (row as any).category || 
                 (row as any).facility_type || 
                 (source === 'lungs_data' ? 'garden' : 'garden')
                ).toString()
              );

              const loc: CSVLocation = {
                name,
                type,
                description: (row.description || (row as any).Description || null) as string | null,
                address: (row.address || (row as any).Address || null) as string | null,
                latitude: lat,
                longitude: lng,
                organization: (row.organization || (row as any).owner || (row as any).Owner || null) as string | null,
                website: (row.website || (row as any).social_media_website1 || (row as any).Website || null) as string | null,
                neighborhood: (row as any).neighborhood || (row as any).Neighborhood || null,
                open_hours: (row as any).open_hours || (row as any).hours || (row as any).Hours || null,
                contact_information: (row as any).contact_information || (row as any)['Contact Information'] || null,
                local_items_selling: (row as any).local_items_selling || (row as any).loca_items_selling || null,
                social_media_website1: (row as any).social_media_website1 || null,
                social_media_website2: (row as any).social_media_website2 || null,
                cross_streets: (row as any).crossstreets || null,
                zip_code: (row as any).zipcode || null,
                borough: (row as any).borough || null,
                owner: (row as any).owner || (row as any).Owner || null,
                status: 'active',
                verified: true,
                source,
              };
              return loc;
            })
            .filter((x): x is CSVLocation => x !== null);

          // Deduplicate within this dataset to avoid ON CONFLICT affecting same row twice
          const deduped = Array.from(
            new Map(
              locations.map((loc: CSVLocation) => [
                `${loc.name}|${loc.latitude}|${loc.longitude}`,
                loc
              ])
            ).values()
          );

          for (let i = 0; i < deduped.length; i += 100) {
            const batch = deduped.slice(i, i + 100);
            const { error } = await supabaseClient
              .from('locations')
              .upsert(batch, { onConflict: 'name,latitude,longitude' });
            if (error) {
              console.error(`Error importing batch from ${source}:`, error);
              totalErrors += batch.length;
            } else {
              for (const loc of batch) {
                uniqueKeys.add(`${loc.name}|${loc.latitude}|${loc.longitude}`);
              }
            }
          }
          console.log(`Processed ${deduped.length} locations from ${source}`);
        } catch (e) {
          console.error(`Failed processing rows for ${source}:`, e);
          totalErrors++;
        }
      }
    } else {
      if (!baseUrl) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Missing baseUrl in request body',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      const csvFiles = [
        { path: '/processed/complete_comprehensive_food_access.csv', source: 'comprehensive_food_access' },
        { path: '/processed/food_banks.csv', source: 'food_banks' },
        { path: '/processed/farmers_markets.csv', source: 'farmers_markets' },
        { path: '/processed/community_fridges.csv', source: 'community_fridges' },
      ];

      for (const file of csvFiles) {
        const url = `${baseUrl}${file.path}`;
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('text/html')) throw new Error(`Expected CSV but got HTML at ${url}`);
          const csvText = await res.text();

          const rows = (await parseCsv(csvText, { columns: true })) as CSVRow[];
          const locations = rows
            .map((row) => {
              const lat = parseFloat(row.latitude || row.lat || row.Latitude || '0');
              const lng = parseFloat(row.longitude || row.lng || row.lon || row.long || row.Longitude || '0');
              if (!lat || !lng || lat === 0 || lng === 0 || Number.isNaN(lat) || Number.isNaN(lng)) return null;

              const name = (row.name || row['Name of Garden'] || row['Name'] || 'Unnamed Location').toString();
              const type = normalizeType((row.type || row.category || row.facility_type || 'garden').toString());

              const loc: CSVLocation = {
                name,
                type,
                description: (row.description || row.Description || null) as string | null,
                address: (row.address || row.Address || null) as string | null,
                latitude: lat,
                longitude: lng,
                organization: (row.organization || row.owner || row.Owner || null) as string | null,
                website: (row.website || row.social_media_website1 || row.Website || null) as string | null,
                neighborhood: (row.neighborhood || row.Neighborhood || null) as string | null,
                open_hours: (row.open_hours || row.hours || row.Hours || null) as string | null,
                contact_information: (row.contact_information || row['Contact Information'] || null) as string | null,
                local_items_selling: (row.local_items_selling || row.loca_items_selling || null) as string | null,
                social_media_website1: (row.social_media_website1 || null) as string | null,
                social_media_website2: (row.social_media_website2 || null) as string | null,
                cross_streets: (row.crossstreets || null) as string | null,
                zip_code: (row.zipcode || null) as string | null,
                borough: (row.borough || null) as string | null,
                owner: (row.owner || row.Owner || null) as string | null,
                status: 'active',
                verified: true,
                source: file.source,
              };
              return loc;
            })
            .filter((x): x is CSVLocation => x !== null);

          // Insert in batches using service role (bypasses RLS)
          // Deduplicate within this dataset first to avoid ON CONFLICT affecting same row twice
          const deduped = Array.from(
            new Map(
              locations.map((loc: CSVLocation) => [
                `${loc.name}|${loc.latitude}|${loc.longitude}`,
                loc
              ])
            ).values()
          );

          for (let i = 0; i < deduped.length; i += 100) {
            const batch = deduped.slice(i, i + 100);
            const { error } = await supabaseClient
              .from('locations')
              .upsert(batch, { onConflict: 'name,latitude,longitude' });
            if (error) {
              console.error(`Error importing batch from ${file.source}:`, error);
              totalErrors += batch.length;
            } else {
              for (const loc of batch) {
                uniqueKeys.add(`${loc.name}|${loc.latitude}|${loc.longitude}`);
              }
            }
          }
        } catch (e) {
          console.error(`Failed processing ${url}:`, e);
          totalErrors++;
        }
      }
    }

    const result = {
      success: totalErrors === 0,
      totalImported: uniqueKeys.size,
      totalErrors,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({ success: false, totalImported: 0, totalErrors: 1, error: String(error) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
