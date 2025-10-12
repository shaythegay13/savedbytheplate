import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PYTHON_API_URL = "https://agenticaigardenplanner.onrender.com";

// Comprehensive validation schema for garden plan requests
const gardenPlanRequestSchema = z.object({
  // Required fields
  spaceType: z.string()
    .min(1, "Space type is required")
    .max(50, "Space type too long"),
  spaceSize: z.string()
    .min(1, "Space size is required")
    .max(50, "Space size too long"),
  growing_location: z.enum(['indoors', 'outdoors', 'both'], {
    errorMap: () => ({ message: "Growing location must be 'indoors', 'outdoors', or 'both'" })
  }),
  soil_contaminated: z.string()
    .max(50, "Soil contaminated field too long"),
  soil_type: z.string()
    .max(50, "Soil type too long"),
  growing_options: z.string()
    .max(200, "Growing options too long"),
  rainfall: z.string()
    .max(50, "Rainfall too long"),
  season: z.string()
    .max(50, "Season too long"),
  experience_level: z.string()
    .max(50, "Experience level too long"),
  goals: z.string()
    .max(500, "Goals too long"),
  space_description: z.string()
    .max(1000, "Space description too long"),
  preferred_plants: z.string()
    .max(500, "Preferred plants too long"),
  time_commitment: z.string()
    .max(100, "Time commitment too long"),
  
  // Optional fields with validation
  user_id: z.string()
    .uuid("Invalid user ID format")
    .optional(),
  latitude: z.number()
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude")
    .optional(),
  longitude: z.number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude")
    .optional(),
  city: z.string()
    .max(100, "City name too long")
    .optional(),
}).refine(
  (data) => {
    // If latitude is provided, longitude must also be provided
    if (data.latitude !== undefined || data.longitude !== undefined) {
      return data.latitude !== undefined && data.longitude !== undefined;
    }
    return true;
  },
  {
    message: "Both latitude and longitude must be provided together",
    path: ["latitude", "longitude"]
  }
);

type GardenPlanRequest = z.infer<typeof gardenPlanRequestSchema>;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    console.log('=== GARDEN PLAN REQUEST START ===');
    
    // Parse and validate request body
    const rawRequest = await req.json();
    console.log('Raw request received');
    
    const validationResult = gardenPlanRequestSchema.safeParse(rawRequest);
    if (!validationResult.success) {
      console.error('Validation failed:', JSON.stringify(validationResult.error.format(), null, 2));
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request data', 
          details: validationResult.error.format() 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const formData = validationResult.data;
    console.log('Request validated successfully:', JSON.stringify(formData, null, 2));

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
      size: formData.spaceSize, // Backend expects "size" not "space_size"
      sunlight: sunlight,
      growing_location: formData.growing_location,
      soil_contaminated: soil_contaminated,
      soil_type: soil_type,
      method: formData.growing_options, // Backend expects "method" not "growing_options"
      rainfall: rainfall,
      season: formData.season,
      experience: formData.experience_level, // Backend expects "experience" not "experience_level"
      crop_interests: Array.isArray(formData.goals) ? formData.goals : formData.goals.split(',').map(g => g.trim()), // Backend expects array
      space_description: formData.space_description,
      preferred_plants: Array.isArray(formData.preferred_plants) ? formData.preferred_plants : formData.preferred_plants.split(',').map(p => p.trim()),
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
      aerial_view: enhancedGoogleData?.aerialView,
      // Add user_input wrapper for newer backend versions expecting this structure
      user_input: {
        space_type: formData.spaceType,
        size: formData.spaceSize,
        sunlight: sunlight,
        growing_location: formData.growing_location,
        soil_contaminated: soil_contaminated,
        soil_type: soil_type,
        method: formData.growing_options,
        rainfall: rainfall,
        season: formData.season,
        experience: formData.experience_level,
        crop_interests: Array.isArray(formData.goals) ? formData.goals : formData.goals.split(',').map(g => g.trim()),
        preferences: Array.isArray(formData.preferred_plants) ? formData.preferred_plants : formData.preferred_plants.split(',').map(p => p.trim()),
        space_description: formData.space_description,
        time_commitment: formData.time_commitment,
        latitude: formData.latitude,
        longitude: formData.longitude,
        city: formData.city,
        hardiness_zone: climateData?.hardiness_zone
      }
    };

    // Query plant database for available plants matching user preferences
    console.log('Querying plant database...');
    const { data: plantData, error: plantError } = await supabase
      .from('garden_insights')
      .select('*')
      .limit(300);
    
    if (plantError) {
      console.error('Error querying plant database:', plantError);
    }
    
    console.log(`Found ${plantData?.length || 0} plants in database`);
    
    // Add plant database to request payload
    requestPayload.available_plants = plantData || [];
    
    console.log('Calling Python API for garden plan generation...');
    console.log('API URL:', `${PYTHON_API_URL}/api/v1/garden-plan/generate`);
    console.log('Request payload size:', JSON.stringify(requestPayload).length, 'characters');
    
    // Test Python backend health first
    console.log('Testing Python backend health...');
    const healthCheckTimeout = 60000; // 60 seconds (Render free tier cold start)
    const healthController = new AbortController();
    const healthTimeoutId = setTimeout(() => healthController.abort(), healthCheckTimeout);
    
    try {
      const healthResponse = await fetch(`${PYTHON_API_URL}/health`, {
        method: 'GET',
        signal: healthController.signal,
      });
      clearTimeout(healthTimeoutId);
      console.log('Python backend health status:', healthResponse.status);
      
      if (!healthResponse.ok) {
        console.warn('Python backend health check failed:', healthResponse.status);
      }
    } catch (healthError) {
      clearTimeout(healthTimeoutId);
      console.error('Python backend health check error:', healthError);
      throw new Error(`Python backend is not responding. The service may be sleeping (Render free tier cold start). Error: ${healthError.message}`);
    }
    
    // Increase timeout for main request (Render free tier cold starts can take 30-50 seconds)
    const requestTimeout = 90000; // 90 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), requestTimeout);
    
    console.log('Sending garden plan generation request to Python backend...');
    const pythonResponse = await fetch(`${PYTHON_API_URL}/api/v1/garden-plan/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
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

    // Transform the text-based plan into structured JSON for the frontend
    const structuredPlan = {
      success: gardenPlan.success || true,
      plantRecommendations: extractPlantRecommendations(gardenPlan.plan || ''),
      gardenLayout: extractGardenLayout(gardenPlan.plan || ''),
      careInstructions: extractCareInstructions(gardenPlan.plan || ''),
      expertTips: extractExpertTips(gardenPlan.plan || ''),
      timeline: extractTimeline(gardenPlan.plan || ''),
      rawPlan: gardenPlan.plan || '', // Keep the original text plan
    };

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
          rainfall: formData.rainfall,
          season: formData.season,
          experience_level: formData.experience_level,
          goals: formData.goals,
          space_description: formData.space_description,
          preferred_plants: formData.preferred_plants,
          time_commitment: formData.time_commitment,
          plan_data: structuredPlan
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving plan to database:', saveError);
      }

      return new Response(JSON.stringify({ ...structuredPlan, planId: savedPlan?.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(structuredPlan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });


  } catch (error) {
    console.error('=== ERROR in generate-smart-garden-plan ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== ERROR END ===');
    
    // Determine if it's a timeout error
    const isTimeout = error.name === 'AbortError' || error.message?.includes('aborted');
    
    return new Response(JSON.stringify({ 
      error: isTimeout 
        ? 'Python backend timeout - The service may be cold starting (Render free tier takes 30-50 seconds). Please try again.'
        : error.message || 'Failed to generate garden plan',
      details: error.toString(),
      errorType: error.name,
      pythonBackendUrl: PYTHON_API_URL,
      suggestion: isTimeout 
        ? 'Wait 30 seconds and try again. The backend service is waking up.'
        : 'Please check your connection and try again.'
    }), {
      status: isTimeout ? 504 : 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Helper functions to parse the text-based plan into structured data
function extractPlantRecommendations(plan: string): any[] {
  const recommendations: any[] = [];
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  
  // 1) Extract ALL recommended crops from main list
  const recommendedCropsMatch = plan.match(/Recommended Crops \(top matches\):([\s\S]*?)(?=📊|={3,})/);
  const mainCrops: Array<{name: string, description: string}> = [];
  
  if (recommendedCropsMatch) {
    const cropLines = recommendedCropsMatch[1]
      .split('\n')
      .filter(line => line.trim().startsWith('-'));
    
    cropLines.forEach(line => {
      const match = line.match(/- ([^:]+): (.+)/);
      if (match) {
        mainCrops.push({
          name: match[1].trim(),
          description: match[2].trim()
        });
      }
    });
  }

  // 2) Extract detailed variety information (if available) and group by crop
  const cropVarieties = new Map<string, any[]>();
  const varietySections = plan.split(/={70,}\nVARIETY RECOMMENDATIONS: ([A-Z\s]+)\n={70,}/);
  
  for (let i = 1; i < varietySections.length; i += 2) {
    const cropType = varietySections[i].trim();
    const sectionContent = varietySections[i + 1];
    const varieties: any[] = [];

    const varietyBlocks = sectionContent.split(/📦 /).slice(1);
    varietyBlocks.forEach(varietyText => {
      const lines = varietyText.split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length === 0) return;

      const varietyName = lines[0];
      const varietyDesc = lines[1] || '';
      const difficulty = extractField(varietyText, 'Difficulty');
      const daysMatch = varietyText.match(/Days to Maturity: (\d+) days/);
      const spacing = extractField(varietyText, 'Space Needed');
      const yieldInfo = extractField(varietyText, 'Expected Yield');
      const careTips = extractCareFromVariety(varietyText);

      varieties.push({
        varietyName,
        varietyDesc,
        difficulty: difficulty || 'Easy',
        daysToHarvest: daysMatch ? parseInt(daysMatch[1]) : 60,
        spacing: spacing || '12 inches',
        yield: yieldInfo || 'Varies',
        careInstructions: careTips,
      });
    });

    cropVarieties.set(cropType.toLowerCase(), varieties);
  }

  // 3) Create one recommendation per crop, merging variety details
  mainCrops.forEach(crop => {
    const cropNameLower = crop.name.toLowerCase();
    const varieties = cropVarieties.get(cropNameLower) || [];
    
    // If we have varieties, use the first variety's details as defaults
    const firstVariety = varieties[0];
    
    recommendations.push({
      name: crop.name,
      variety: varieties.length > 0 ? varieties.map(v => v.varietyName).join(', ') : crop.name,
      cropType: crop.name,
      description: crop.description,
      difficulty: firstVariety?.difficulty || 'Easy',
      daysToHarvest: firstVariety?.daysToHarvest || 60,
      spacing: firstVariety?.spacing || '12 inches',
      yield: firstVariety?.yield || 'Varies',
      careInstructions: firstVariety?.careInstructions || '',
      varieties: varieties, // Include all variety details
    });
  });

  return recommendations;
}

function extractCareFromVariety(varietyText: string): string {
  const careTipsMatch = varietyText.match(/Care Tips:([\s\S]*?)(?=\n\n|$)/);
  if (!careTipsMatch) return '';
  
  return careTipsMatch[1]
    .split('\n')
    .map(line => line.trim().replace(/^•\s*/, ''))
    .filter(line => line.length > 0)
    .join('. ');
}

function extractGardenLayout(plan: string): any[] {
  const layoutSection = plan.match(/GARDEN LAYOUT VISUALIZATION[\s\S]*?(?=VARIETY RECOMMENDATIONS:|$)/);
  if (!layoutSection) return [];

  const layout: any[] = [];
  const plantingNotes = plan.match(/Planting Notes:([\s\S]*?)(?=Layout Notes:|$)/);
  
  if (plantingNotes) {
    const noteMatches = plantingNotes[1].matchAll(/\d+\.\s+(.*?):\s+(\d+)\s+plants\s+\((.*?)\s+spacing\)/g);
    for (const match of noteMatches) {
      const [, plant, quantity, spacing] = match;
      layout.push({
        plant: plant.trim(),
        quantity: parseInt(quantity),
        spacing: spacing.trim(),
      });
    }
  }

  return layout;
}

function extractCareInstructions(plan: string): string {
  const careSection = plan.match(/Care Schedule:([\s\S]*?)(?=Succession Planting|Cover Crop|$)/);
  return careSection ? careSection[1].trim() : '';
}

function extractExpertTips(plan: string): string[] {
  const tips: string[] = [];
  
  // Extract layout and setup tips
  const layoutTips = plan.match(/Layout & Setup Tips:([\s\S]*?)(?=Recommended Crops|$)/);
  if (layoutTips) {
    const tipLines = layoutTips[1]
      .split(/\n-\s+/)
      .filter(tip => tip.trim().length > 10)
      .map(tip => tip.trim().replace(/^-\s*/, ''));
    tips.push(...tipLines);
  }

  // Extract pro tips
  const proTips = plan.match(/\*\*Pro Tips:\*\*([\s\S]*?)(?=\n\n|$)/);
  if (proTips) {
    const tipLines = proTips[1]
      .split(/\n-\s+/)
      .filter(tip => tip.trim().length > 10)
      .map(tip => tip.trim().replace(/^-\s*/, ''));
    tips.push(...tipLines);
  }

  return tips;
}

function extractTimeline(plan: string): any[] {
  const timeline: any[] = [];
  const calendarSection = plan.match(/Planting Calendar[\s\S]*?(?=Care Schedule:|$)/);
  
  if (calendarSection) {
    const lines = calendarSection[0].split('\n').filter(line => line.trim().startsWith('-'));
    
    lines.forEach(line => {
      timeline.push({
        period: 'Growing Season',
        task: line.trim().replace(/^-\s*/, ''),
      });
    });
  }

  return timeline;
}

function extractField(text: string, fieldName: string): string {
  const regex = new RegExp(`${fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*([^\\n]+)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}


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
