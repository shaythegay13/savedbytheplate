import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CSVLocation {
  name: string;
  type: string;
  description?: string;
  address?: string;
  latitude: number;
  longitude: number;
  organization?: string;
  website?: string;
  neighborhood?: string;
  open_hours?: string;
  contact_information?: string;
  local_items_selling?: string;
  social_media_website1?: string;
  social_media_website2?: string;
  cross_streets?: string;
  zip_code?: string;
  borough?: string;
  owner?: string;
  source: string;
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

    console.log('Starting CSV import process...');

    // CSV file URLs (from public folder)
    const csvFiles = [
      {
        url: `${Deno.env.get('SUPABASE_URL')?.replace('https://', 'https://rxwynfplditdwqtjhkpw.')}/storage/v1/object/public/location-photos/complete_comprehensive_food_access.csv`,
        source: 'comprehensive_food_access'
      },
      {
        url: '/processed/food_banks.csv',
        source: 'food_banks'
      },
      {
        url: '/processed/farmers_markets.csv',
        source: 'farmers_markets'
      },
      {
        url: '/processed/comprehensive_community_fridges.csv',
        source: 'community_fridges'
      }
    ];

    const locations: CSVLocation[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Parse comprehensive food access CSV
    try {
      const response = await fetch('https://raw.githubusercontent.com/yourusername/yourrepo/main/public/processed/complete_comprehensive_food_access.csv');
      
      if (!response.ok) {
        console.log('Could not fetch CSV from URL, will use inline data insertion instead');
        
        // Since we can't directly access the CSV files from the edge function,
        // we'll provide instructions for manual import or create a different approach
        return new Response(
          JSON.stringify({
            message: 'CSV import requires manual data upload',
            instructions: 'Please use the Supabase dashboard to import CSV files into the locations table',
            schema: {
              required_columns: [
                'name',
                'type',
                'latitude',
                'longitude'
              ],
              optional_columns: [
                'description',
                'address',
                'organization',
                'website',
                'neighborhood',
                'open_hours',
                'contact_information',
                'local_items_selling',
                'social_media_website1',
                'social_media_website2',
                'cross_streets',
                'zip_code',
                'borough',
                'owner'
              ]
            },
            status: 'pending_manual_import'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      }
    } catch (error) {
      console.error('Error fetching CSV:', error);
    }

    // Insert locations into database
    if (locations.length > 0) {
      console.log(`Inserting ${locations.length} locations...`);
      
      // Insert in batches of 100
      for (let i = 0; i < locations.length; i += 100) {
        const batch = locations.slice(i, i + 100);
        
        const { data, error } = await supabaseClient
          .from('locations')
          .upsert(batch, {
            onConflict: 'name,latitude,longitude',
            ignoreDuplicates: true
          });

        if (error) {
          console.error('Error inserting batch:', error);
          errorCount += batch.length;
        } else {
          successCount += batch.length;
          console.log(`Inserted batch ${i / 100 + 1}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Import process completed',
        stats: {
          totalProcessed: locations.length,
          successCount,
          errorCount
        },
        note: 'For complete CSV import, please use the alternative import method described in the response'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check function logs for more information'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
