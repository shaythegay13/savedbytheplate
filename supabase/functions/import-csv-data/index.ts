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
    'store': 'business',
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

    const { baseUrl } = await req.json().catch(() => ({ baseUrl: '' }));
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
      { path: '/processed/comprehensive_community_fridges.csv', source: 'community_fridges' },
    ];

    const allLocations: CSVLocation[] = [];
    let totalErrors = 0;

    for (const file of csvFiles) {
      const url = `${baseUrl}${file.path}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
        const csvText = await res.text();

        const rows = (await parseCsv(csvText, { columns: true })) as CSVRow[];
        const locations = rows
          .map((row) => {
            const lat = parseFloat(row.latitude || row.lat || row.Latitude || '0');
            const lng = parseFloat(row.longitude || row.lng || row.lon || row.Longitude || '0');
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
        for (let i = 0; i < locations.length; i += 100) {
          const batch = locations.slice(i, i + 100);
          const { error } = await supabaseClient
            .from('locations')
            .upsert(batch, { onConflict: 'name,latitude,longitude', ignoreDuplicates: true });
          if (error) {
            console.error(`Error importing batch from ${file.source}:`, error);
            totalErrors += batch.length;
          } else {
            allLocations.push(...batch);
          }
        }
      } catch (e) {
        console.error(`Failed processing ${url}:`, e);
        totalErrors++;
      }
    }

    const result = {
      success: totalErrors === 0,
      totalImported: allLocations.length,
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
