import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const climateRequestSchema = z.object({
  latitude: z.number()
    .min(-90, "Latitude must be >= -90")
    .max(90, "Latitude must be <= 90"),
  longitude: z.number()
    .min(-180, "Longitude must be >= -180")
    .max(180, "Longitude must be <= 180"),
  state: z.string().max(50, "State must be less than 50 characters").optional(),
  county: z.string().max(100, "County must be less than 100 characters").optional(),
  year: z.number()
    .int("Year must be an integer")
    .min(1900, "Year must be >= 1900")
    .max(2100, "Year must be <= 2100")
    .optional()
});

interface USDAClimateRequest {
  latitude: number;
  longitude: number;
  state?: string;
  county?: string;
  year?: number;
}

interface USDAClimateData {
  regionalInsights: {
    climateHub: string;
    region: string;
    primaryConcerns: string[];
    adaptationStrategies: string[];
  };
  agriculturalStatistics: {
    majorCrops: Array<{
      crop: string;
      acres: number;
      production: number;
      yield: number;
      trend: 'increasing' | 'stable' | 'decreasing';
    }>;
    livestockData: Array<{
      type: string;
      count: number;
      trend: 'increasing' | 'stable' | 'decreasing';
    }>;
  };
  soilData: {
    averageOM: number; // Organic matter percentage
    averagePH: number;
    erosionRisk: 'low' | 'moderate' | 'high';
    soilHealthTrends: string[];
  };
  climateTrends: {
    temperatureTrend: string;
    precipitationTrend: string;
    growingSeasonChanges: string;
    extremeWeatherFrequency: string;
  };
  recommendedPractices: string[];
  conservationPrograms: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const rawBody = await req.json();
    
    // Validate input
    const validationResult = climateRequestSchema.safeParse(rawBody);
    if (!validationResult.success) {
      const errors = (validationResult as { success: false; error: z.ZodError }).error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return new Response(JSON.stringify({ error: 'Invalid input', details: errors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const { latitude, longitude, state, county, year = new Date().getFullYear() } = validationResult.data;

    console.log(`Fetching USDA climate data for coordinates: ${latitude}, ${longitude}`);

    // Determine the climate hub region
    const climateHub = determineClimateHub(latitude, longitude);
    
    // Get state/county if not provided
    const location = await getLocationInfo(latitude, longitude, state, county);
    
    // Fetch NASS QuickStats data
    const [cropData, livestockData, soilData] = await Promise.all([
      fetchCropStatistics(location.state, location.county, year),
      fetchLivestockStatistics(location.state, location.county, year),
      fetchSoilData(location.state, location.county)
    ]);

    // Get climate trends and recommendations
    const climateTrends = getClimateTrends(climateHub.region, latitude);
    const recommendations = getRegionalRecommendations(climateHub.region, latitude);

    const usdaClimateData: USDAClimateData = {
      regionalInsights: {
        climateHub: climateHub.name,
        region: climateHub.region,
        primaryConcerns: climateHub.concerns,
        adaptationStrategies: climateHub.strategies
      },
      agriculturalStatistics: {
        majorCrops: cropData,
        livestockData: livestockData
      },
      soilData: soilData,
      climateTrends: climateTrends,
      recommendedPractices: recommendations.practices,
      conservationPrograms: recommendations.programs
    };

    return new Response(JSON.stringify(usdaClimateData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error('Error in get-usda-climate-data function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // Use default coordinates for fallback if the request failed before parsing
    const fallbackLat = 40.7128;
    const fallbackLon = -74.0060;
    return new Response(JSON.stringify({ 
      error: errorMessage,
      fallbackData: getFallbackData(fallbackLat, fallbackLon)
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function determineClimateHub(lat: number, lon: number) {
  // Map coordinates to USDA Climate Hub regions
  if (lat >= 47 && lon <= -110) {
    return {
      name: "Northern Plains Climate Hub",
      region: "Northern Plains",
      concerns: ["Extreme weather variability", "Drought management", "Soil erosion"],
      strategies: ["Crop diversification", "Cover cropping", "Water conservation"]
    };
  } else if (lat >= 25 && lat <= 37 && lon >= -106) {
    return {
      name: "Southern Plains Climate Hub", 
      region: "Southern Plains",
      concerns: ["Heat stress", "Water scarcity", "Extreme weather events"],
      strategies: ["Drought-resistant varieties", "Efficient irrigation", "Heat management"]
    };
  } else if (lat >= 37 && lat <= 49 && lon >= -100) {
    return {
      name: "Midwest Climate Hub",
      region: "Midwest", 
      concerns: ["Flooding", "Temperature extremes", "Changing precipitation patterns"],
      strategies: ["Drainage management", "Season extension", "Pest adaptation"]
    };
  } else if (lat >= 24 && lat <= 39 && lon <= -75) {
    return {
      name: "Southeast Climate Hub",
      region: "Southeast",
      concerns: ["Hurricanes", "Heat and humidity", "Pests and diseases"],
      strategies: ["Storm preparation", "Disease resistance", "Heat tolerance"]
    };
  } else if (lat >= 39 && lat <= 47 && lon <= -75) {
    return {
      name: "Northeast Climate Hub",
      region: "Northeast",
      concerns: ["Frost variability", "Extreme precipitation", "Growing season changes"],
      strategies: ["Season extension", "Crop adaptation", "Water management"]
    };
  } else if (lat >= 32 && lon <= -114) {
    return {
      name: "Southwest Climate Hub",
      region: "Southwest",
      concerns: ["Extreme heat", "Water scarcity", "Desertification"],
      strategies: ["Water conservation", "Heat-tolerant crops", "Soil protection"]
    };
  } else if (lat >= 42 && lon <= -114) {
    return {
      name: "Northwest Climate Hub", 
      region: "Northwest",
      concerns: ["Water availability", "Fire risk", "Temperature variability"],
      strategies: ["Fire management", "Water efficiency", "Climate adaptation"]
    };
  } else {
    return {
      name: "General Climate Hub",
      region: "General",
      concerns: ["Climate variability", "Weather extremes", "Resource management"],
      strategies: ["Adaptive management", "Risk mitigation", "Sustainable practices"]
    };
  }
}

async function getLocationInfo(lat: number, lon: number, providedState?: string, providedCounty?: string) {
  if (providedState && providedCounty) {
    return { state: providedState, county: providedCounty };
  }

  // Simple state mapping based on coordinates (in real implementation, use geocoding)
  let state = 'US';
  if (lat >= 25 && lat <= 31 && lon >= -106 && lon <= -93) state = 'TX';
  else if (lat >= 39 && lat <= 48 && lon >= -104 && lon <= -80) state = 'IA';
  else if (lat >= 36 && lat <= 42 && lon >= -109 && lon <= -102) state = 'CO';
  else if (lat >= 40 && lat <= 49 && lon >= -97 && lon <= -89) state = 'IL';
  else if (lat >= 32 && lat <= 42 && lon >= -125 && lon <= -114) state = 'CA';

  return { state, county: 'Unknown' };
}

async function fetchCropStatistics(state: string, county: string, year: number) {
  const nasApiKey = Deno.env.get('USDA_NASS_API_KEY');
  
  if (!nasApiKey) {
    console.log('USDA NASS API key not found, using fallback data');
    return getFallbackCropData();
  }

  try {
    const baseUrl = 'https://quickstats.nass.usda.gov/api/api_GET/';
    const params = new URLSearchParams({
      key: nasApiKey,
      source_desc: 'CENSUS',
      sector_desc: 'CROPS',
      state_alpha: state,
      year: year.toString(),
      format: 'JSON'
    });

    const response = await fetch(`${baseUrl}?${params}`);
    
    if (!response.ok) {
      throw new Error(`NASS API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      return processCropData(data.data);
    }
    
    return getFallbackCropData();
  } catch (error) {
    console.error('Error fetching NASS crop data:', error);
    return getFallbackCropData();
  }
}

async function fetchLivestockStatistics(state: string, county: string, year: number) {
  const nasApiKey = Deno.env.get('USDA_NASS_API_KEY');
  
  if (!nasApiKey) {
    return getFallbackLivestockData();
  }

  try {
    const baseUrl = 'https://quickstats.nass.usda.gov/api/api_GET/';
    const params = new URLSearchParams({
      key: nasApiKey,
      source_desc: 'CENSUS',
      sector_desc: 'ANIMALS & PRODUCTS',
      state_alpha: state,
      year: year.toString(),
      format: 'JSON'
    });

    const response = await fetch(`${baseUrl}?${params}`);
    
    if (!response.ok) {
      throw new Error(`NASS API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      return processLivestockData(data.data);
    }
    
    return getFallbackLivestockData();
  } catch (error) {
    console.error('Error fetching NASS livestock data:', error);
    return getFallbackLivestockData();
  }
}

async function fetchSoilData(state: string, county: string) {
  // Soil data from USDA Web Soil Survey (simplified)
  return {
    averageOM: 3.2,
    averagePH: 6.5,
    erosionRisk: 'moderate' as const,
    soilHealthTrends: [
      'Organic matter levels stable',
      'pH trending slightly acidic',
      'Increased focus on soil health practices'
    ]
  };
}

function processCropData(rawData: any[]) {
  const cropStats = new Map();
  
  rawData.forEach(item => {
    if (item.commodity_desc && item.statisticcat_desc === 'AREA HARVESTED') {
      const crop = item.commodity_desc.toLowerCase();
      const acres = parseInt(item.Value?.replace(/,/g, '') || '0');
      
      if (acres > 0) {
        cropStats.set(crop, {
          crop: item.commodity_desc,
          acres: acres,
          production: 0, // Would need additional API call
          yield: 0, // Would need additional API call  
          trend: 'stable' as const
        });
      }
    }
  });

  return Array.from(cropStats.values()).slice(0, 10); // Top 10 crops
}

function processLivestockData(rawData: any[]) {
  const livestockStats = new Map();
  
  rawData.forEach(item => {
    if (item.commodity_desc && item.statisticcat_desc === 'INVENTORY') {
      const animal = item.commodity_desc.toLowerCase();
      const count = parseInt(item.Value?.replace(/,/g, '') || '0');
      
      if (count > 0) {
        livestockStats.set(animal, {
          type: item.commodity_desc,
          count: count,
          trend: 'stable' as const
        });
      }
    }
  });

  return Array.from(livestockStats.values()).slice(0, 5); // Top 5 livestock types
}

function getClimateTrends(region: string, latitude: number) {
  // Climate trends based on USDA Climate Hub data
  const trends = {
    "Northern Plains": {
      temperatureTrend: "Warming winters, variable summers",
      precipitationTrend: "More intense precipitation events",
      growingSeasonChanges: "Earlier spring, longer growing season",
      extremeWeatherFrequency: "Increased drought and flooding cycles"
    },
    "Southern Plains": {
      temperatureTrend: "Rising average temperatures",
      precipitationTrend: "Decreased spring precipitation", 
      growingSeasonChanges: "Heat stress during growing season",
      extremeWeatherFrequency: "More frequent heat waves and droughts"
    },
    "Midwest": {
      temperatureTrend: "Warmer temperatures year-round",
      precipitationTrend: "Wetter springs, variable summers",
      growingSeasonChanges: "Extended growing season",
      extremeWeatherFrequency: "Increased extreme precipitation events"
    },
    "Southeast": {
      temperatureTrend: "Rising temperatures and humidity",
      precipitationTrend: "More intense storm events",
      growingSeasonChanges: "Longer, hotter summers",
      extremeWeatherFrequency: "Increased hurricane intensity"
    },
    "Northeast": {
      temperatureTrend: "Warming temperatures in all seasons",
      precipitationTrend: "Increased winter and spring precipitation",
      growingSeasonChanges: "Earlier spring onset",
      extremeWeatherFrequency: "More extreme heat and precipitation events"
    }
  };

  return trends[region as keyof typeof trends] || trends["Northern Plains"];
}

function getRegionalRecommendations(region: string, latitude: number) {
  const recommendations = {
    "Northern Plains": {
      practices: [
        "No-till farming to improve soil health",
        "Cover crops for erosion control", 
        "Crop rotation with diverse species",
        "Water conservation techniques",
        "Integrated pest management"
      ],
      programs: [
        "Conservation Reserve Program (CRP)",
        "Environmental Quality Incentives Program (EQIP)",
        "Conservation Stewardship Program (CSP)"
      ]
    },
    "Southern Plains": {
      practices: [
        "Drought-resistant crop varieties",
        "Efficient irrigation systems",
        "Soil moisture conservation",
        "Heat stress management",
        "Grazing management"
      ],
      programs: [
        "Environmental Quality Incentives Program (EQIP)",
        "Conservation Reserve Program (CRP)",
        "Agricultural Conservation Easement Program (ACEP)"
      ]
    }
  };

  return recommendations[region as keyof typeof recommendations] || recommendations["Northern Plains"];
}

function getFallbackCropData() {
  return [
    { crop: "Corn", acres: 50000, production: 8500, yield: 170, trend: 'stable' as const },
    { crop: "Soybeans", acres: 35000, production: 1400, yield: 40, trend: 'increasing' as const },
    { crop: "Wheat", acres: 25000, production: 1250, yield: 50, trend: 'decreasing' as const },
    { crop: "Vegetables", acres: 5000, production: 15000, yield: 300, trend: 'increasing' as const }
  ];
}

function getFallbackLivestockData() {
  return [
    { type: "Cattle", count: 15000, trend: 'stable' as const },
    { type: "Hogs", count: 8000, trend: 'increasing' as const },
    { type: "Poultry", count: 50000, trend: 'increasing' as const }
  ];
}

function getFallbackData(lat: number, lon: number): USDAClimateData {
  const climateHub = determineClimateHub(lat, lon);
  
  return {
    regionalInsights: {
      climateHub: climateHub.name,
      region: climateHub.region,
      primaryConcerns: climateHub.concerns,
      adaptationStrategies: climateHub.strategies
    },
    agriculturalStatistics: {
      majorCrops: getFallbackCropData(),
      livestockData: getFallbackLivestockData()
    },
    soilData: {
      averageOM: 3.0,
      averagePH: 6.8,
      erosionRisk: 'moderate',
      soilHealthTrends: ['Baseline soil health metrics available']
    },
    climateTrends: getClimateTrends(climateHub.region, lat),
    recommendedPractices: [
      "Soil health improvement",
      "Water conservation",
      "Climate adaptation strategies"
    ],
    conservationPrograms: [
      "Environmental Quality Incentives Program (EQIP)",
      "Conservation Stewardship Program (CSP)"
    ]
  };
}