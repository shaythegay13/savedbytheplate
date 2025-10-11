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
  growing_location: string;
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

    // Determine if we need climate data based on growing location
    const needsClimateData = formData.growing_location === 'outdoors' || formData.growing_location === 'both';
    
    // Fetch climate data and enhanced Google data based on coordinates
    let climateData = null;
    let enhancedGoogleData = null;
    let sunlight = 'full-sun'; // default for indoors
    
    if (needsClimateData && formData.latitude && formData.longitude) {
      try {
        // Fetch both climate data and enhanced Google data in parallel
        const [climateResult, googleResult] = await Promise.all([
          supabase.functions.invoke('get-climate-data', {
            body: { 
              latitude: formData.latitude, 
              longitude: formData.longitude 
            }
          }),
          supabase.functions.invoke('get-google-enhanced-data', {
            body: { 
              latitude: formData.latitude, 
              longitude: formData.longitude,
              includeAirQuality: true,
              includeSolar: true,
              includeWeather: true,
              includePollen: true,
              includeElevation: true,
              includeAerialView: true,
              includeStreetView: false // Skip street view for performance
            }
          })
        ]);
        
        if (!climateResult.error && climateResult.data) {
          climateData = climateResult.data;
          console.log('Climate data fetched:', climateData);
        }
        
        if (!googleResult.error && googleResult.data) {
          enhancedGoogleData = googleResult.data;
          console.log('Enhanced Google data fetched:', {
            hasAirQuality: !!enhancedGoogleData.airQuality,
            hasSolar: !!enhancedGoogleData.solar,
            hasWeather: !!enhancedGoogleData.weather,
            hasPollen: !!enhancedGoogleData.pollen,
            hasElevation: !!enhancedGoogleData.elevation
          });
        }
        
        // Determine sunlight based on climate/location data and solar data
        sunlight = determineSunlightEnhanced(formData.latitude, climateData, enhancedGoogleData?.solar);
      } catch (error) {
        console.error('Error fetching climate/Google data:', error);
      }
    } else if (formData.growing_location === 'indoors') {
      // For indoors, use artificial light
      sunlight = 'artificial';
    }

    // Determine soil type and rainfall from climate data (only for outdoor growing)
    const soil_type = (needsClimateData && climateData) ? determineSoilType(climateData) : 'potting-mix';
    const rainfall = (needsClimateData && climateData) ? determineRainfall(climateData) : 'controlled';
    const soil_contaminated = formData.spaceType?.includes('container') || 
                              formData.spaceType?.includes('raised-bed') || 
                              formData.spaceType?.includes('hydroponic') ||
                              formData.growing_location === 'indoors';

    const requestPayload = {
      space_type: formData.spaceType,
      space_size: formData.spaceSize,
      sunlight: sunlight,
      growing_location: formData.growing_location,
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
      generate_layout_positions: true,
      // Enhanced Google data for AI to use
      air_quality: enhancedGoogleData?.airQuality,
      solar_data: enhancedGoogleData?.solar,
      weather_data: enhancedGoogleData?.weather,
      pollen_data: enhancedGoogleData?.pollen,
      elevation_data: enhancedGoogleData?.elevation,
      aerial_view: enhancedGoogleData?.aerialView
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

// Helper function to determine sunlight based on location, climate, and solar data
function determineSunlightEnhanced(latitude: number, climateData: any, solarData: any): string {
  // If we have solar data, use it for more accurate sunlight determination
  if (solarData?.sunlightHoursPerDay) {
    const avgSummerHours = solarData.sunlightHoursPerDay.summer;
    if (avgSummerHours > 8) return 'full-sun';
    if (avgSummerHours > 6) return 'partial-sun';
    if (avgSummerHours > 4) return 'partial-shade';
    return 'shade';
  }
  
  // Fallback to original logic
  return determineSunlight(latitude, climateData);
}

// Original helper function to determine sunlight based on location and climate
function determineSunlight(latitude: number, climateData: any): string {
  // In higher latitudes (further from equator), sunlight is generally less intense
  const absLatitude = Math.abs(latitude);
  
  // Check cloud cover or precipitation patterns from climate data
  const precipitation = climateData?.precipitation_data?.annual_avg || 0;
  
  // High precipitation areas tend to have more cloud cover
  if (precipitation > 60) return 'partial-shade';
  if (precipitation > 40) return 'partial-sun';
  
  // Low precipitation/sunny climates
  if (absLatitude < 35) return 'full-sun'; // Closer to equator
  if (absLatitude < 45) return 'partial-sun';
  
  return 'partial-sun'; // Default
}

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
