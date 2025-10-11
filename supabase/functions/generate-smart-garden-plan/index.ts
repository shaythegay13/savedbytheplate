import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PYTHON_API_URL = "https://agenticaigardenplanner.onrender.com";

interface GardenPlanRequest {
  spaceType: string;
  spaceSize: string;
  sunlight: string;
  soil_contaminated: string;
  soil_type: string;
  growing_options: string;
  rainfall: string;
  season: string;
  experience_level: string;
  goals: string;
  space_description: string;
  preferred_plants: string;
  time_commitment: string;
  user_id?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const formData: GardenPlanRequest = await req.json();

    // Fetch climate data based on coordinates
    let climateData = null;
    if (formData.latitude && formData.longitude) {
      try {
        const { data: climate, error: climateError } = await supabase.functions.invoke('get-climate-data', {
          body: { 
            latitude: formData.latitude, 
            longitude: formData.longitude 
          }
        });
        
        if (!climateError && climate) {
          climateData = climate;
          console.log('Climate data fetched:', climateData);
        }
      } catch (error) {
        console.error('Error fetching climate data:', error);
      }
    }

    // Determine soil type and rainfall from climate data
    const soil_type = climateData ? determineSoilType(climateData) : 'loamy';
    const rainfall = climateData ? determineRainfall(climateData) : 'moderate';
    const soil_contaminated = formData.spaceType?.includes('container') || 
                              formData.spaceType?.includes('raised-bed') || 
                              formData.spaceType?.includes('hydroponic');

    const requestPayload = {
      space_type: formData.spaceType,
      space_size: formData.spaceSize,
      sunlight: formData.sunlight,
      soil_contaminated: soil_contaminated,
      soil_type: soil_type,
      growing_options: formData.growing_options,
      rainfall: rainfall,
      season: formData.season,
      experience_level: formData.experience_level,
      goals: formData.goals,
      space_description: formData.space_description,
      preferred_plants: formData.preferred_plants.split(',').map(p => p.trim()),
      time_commitment: formData.time_commitment,
      latitude: formData.latitude,
      longitude: formData.longitude,
      city: formData.city,
      hardiness_zone: climateData?.hardiness_zone,
      include_companion_planting: true,
      generate_layout_positions: true
    };

    console.log('Calling Python API for garden plan generation...');
    console.log('API URL:', `${PYTHON_API_URL}/api/v1/garden-plan/generate`);
    console.log('Request payload:', JSON.stringify(requestPayload, null, 2));
    
    // Call the Python FastAPI to generate the garden plan
    const pythonResponse = await fetch(`${PYTHON_API_URL}/api/v1/garden-plan/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    console.log('Python API response status:', pythonResponse.status);

    if (!pythonResponse.ok) {
      const errorText = await pythonResponse.text();
      console.error('Python API error details:', {
        status: pythonResponse.status,
        statusText: pythonResponse.statusText,
        errorBody: errorText
      });
      throw new Error(`Python API failed: ${pythonResponse.status} - ${errorText}`);
    }

    const gardenPlan = await pythonResponse.json();
    console.log('Garden plan generated successfully from Python API');
    console.log('Response data:', JSON.stringify(gardenPlan, null, 2));

    // Save the plan to database if user is authenticated
    if (formData.user_id) {
      const { data: savedPlan, error: saveError } = await supabase
        .from('garden_plans')
        .insert({
          user_id: formData.user_id,
          space_type: formData.spaceType,
          space_size: formData.spaceSize,
          sunlight: formData.sunlight,
          soil_contaminated: formData.soil_contaminated,
          soil_type: formData.soil_type,
          growing_options: formData.growing_options,
          rainfall: formData.rainfall,
          season: formData.season,
          experience_level: formData.experience_level,
          goals: formData.goals,
          space_description: formData.space_description,
          preferred_plants: formData.preferred_plants,
          time_commitment: formData.time_commitment,
          plan_data: gardenPlan
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving plan to database:', saveError);
      }

      return new Response(JSON.stringify({ ...gardenPlan, planId: savedPlan?.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(gardenPlan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error generating garden plan:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate garden plan. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Helper function to determine soil type from climate data
function determineSoilType(climateData: any): string {
  const precipitation = climateData.precipitation_data?.annual_avg || 0;
  
  // High precipitation areas tend to have clay soil
  if (precipitation > 50) return 'clay';
  
  // Low precipitation/arid areas tend to have sandy soil
  if (precipitation < 20) return 'sandy';
  
  // Moderate precipitation areas often have loamy soil
  return 'loamy';
}

// Helper function to determine rainfall from climate data
function determineRainfall(climateData: any): string {
  const precipitation = climateData.precipitation_data?.annual_avg || 0;
  
  if (precipitation < 20) return 'low';
  if (precipitation > 50) return 'high';
  return 'moderate';
}
