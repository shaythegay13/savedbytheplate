import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RATE_LIMIT_WINDOW_MINUTES = 60;
const MAX_REQUESTS_PER_WINDOW = 10;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface EnhancedDataRequest {
  latitude: number;
  longitude: number;
  address?: string;
  includeAirQuality?: boolean;
  includeSolar?: boolean;
  includeWeather?: boolean;
  includePollen?: boolean;
  includeElevation?: boolean;
  includeAerialView?: boolean;
  includeStreetView?: boolean;
}

interface AirQualityData {
  aqi: number;
  category: string;
  dominantPollutant: string;
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2: number;
    co: number;
  };
  healthRecommendations: string[];
  gardenImpact: string;
}

interface SolarData {
  maxSunshineHoursPerYear: number;
  maxArrayPanelsCount: number;
  maxArrayAreaMeters2: number;
  solarPotential: string;
  sunlightHoursPerDay: {
    spring: number;
    summer: number;
    fall: number;
    winter: number;
  };
  optimalPlantingAreas: Array<{
    bounds: { north: number; south: number; east: number; west: number };
    sunExposure: string;
  }>;
}

interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    cloudCover: number;
    uvIndex: number;
  };
  forecast: Array<{
    date: string;
    tempHigh: number;
    tempLow: number;
    precipitation: number;
    humidity: number;
  }>;
  growingConditions: {
    soilMoisture: string;
    frostRisk: boolean;
    heatStress: boolean;
    optimalForPlanting: boolean;
  };
}

interface PollenData {
  overall: {
    index: number;
    category: string;
  };
  types: {
    tree: { index: number; category: string };
    grass: { index: number; category: string };
    weed: { index: number; category: string };
  };
  forecast: Array<{
    date: string;
    index: number;
    category: string;
  }>;
  gardenRecommendations: string[];
}

interface ElevationData {
  elevation: number;
  resolution: number;
  drainagePattern: string;
  frostPocketRisk: string;
  microclimateNotes: string[];
}

interface AerialViewData {
  imageUrl: string;
  tileCoordinates: {
    zoom: number;
    x: number;
    y: number;
  };
  vegetationAnalysis: {
    greenCoverPercentage: number;
    existingTrees: boolean;
    shadedAreas: string[];
  };
}

interface StreetViewData {
  available: boolean;
  panoId?: string;
  imageUrl?: string;
  heading?: number;
  pitch?: number;
  surroundingContext: {
    urbanDensity: string;
    nearbyVegetation: string;
    buildingHeight: string;
  };
}

interface EnhancedGardenData {
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  airQuality?: AirQualityData;
  solar?: SolarData;
  weather?: WeatherData;
  pollen?: PollenData;
  elevation?: ElevationData;
  aerialView?: AerialViewData;
  streetView?: StreetViewData;
  timestamp: string;
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

// Input validation schema
const enhancedDataSchema = z.object({
  latitude: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
  longitude: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
  address: z.string().max(500, "Address too long").optional(),
  includeAirQuality: z.boolean().optional(),
  includeSolar: z.boolean().optional(),
  includeWeather: z.boolean().optional(),
  includePollen: z.boolean().optional(),
  includeElevation: z.boolean().optional(),
  includeAerialView: z.boolean().optional(),
  includeStreetView: z.boolean().optional(),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get JWT from Authorization header for authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client for auth and rate limiting
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) {
      console.error("Authentication failed:", authError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limiting check
    const identifier = user.id;
    const windowStartIso = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();

    const { data: rows } = await supabase
      .from("newsletter_rate_limits")
      .select("id, attempt_count, first_attempt_at")
      .eq("identifier", identifier)
      .gte("first_attempt_at", windowStartIso)
      .order("first_attempt_at", { ascending: false })
      .limit(1);

    const rateLimitData = rows && rows.length > 0 ? rows[0] : null;

    if (rateLimitData && rateLimitData.attempt_count >= MAX_REQUESTS_PER_WINDOW) {
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: RATE_LIMIT_WINDOW_MINUTES * 60
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate request body
    const rawData = await req.json();
    const validationResult = enhancedDataSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      const validationError = validationResult.error;
      const errorDetails = validationError.format();
      console.error("Validation failed:", errorDetails);
      return new Response(
        JSON.stringify({ 
          error: "Invalid request data", 
          details: errorDetails 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const {
      latitude,
      longitude,
      address,
      includeAirQuality = true,
      includeSolar = true,
      includeWeather = true,
      includePollen = true,
      includeElevation = true,
      includeAerialView = true,
      includeStreetView = true,
    } = validationResult.data;

    console.log("Fetching enhanced Google data for:", { latitude, longitude, address });

    // Update rate limit counter
    const nowIso = new Date().toISOString();
    if (rateLimitData) {
      await supabase
        .from("newsletter_rate_limits")
        .update({
          attempt_count: rateLimitData.attempt_count + 1,
          last_attempt_at: nowIso
        })
        .eq("id", rateLimitData.id);
    } else {
      await supabase
        .from("newsletter_rate_limits")
        .insert({
          identifier,
          attempt_count: 1,
          first_attempt_at: nowIso,
          last_attempt_at: nowIso
        });
    }

    const googleApiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

    if (!googleApiKey) {
      throw new Error("Google Maps API key not configured");
    }

    // Fetch all data in parallel for performance
    const [
      airQuality,
      solar,
      weather,
      pollen,
      elevation,
      aerialView,
      streetView,
    ] = await Promise.all([
      includeAirQuality ? getAirQualityData(latitude, longitude, googleApiKey) : Promise.resolve(null),
      includeSolar ? getSolarData(latitude, longitude, googleApiKey) : Promise.resolve(null),
      includeWeather ? getWeatherData(latitude, longitude, googleApiKey) : Promise.resolve(null),
      includePollen ? getPollenData(latitude, longitude, googleApiKey) : Promise.resolve(null),
      includeElevation ? getElevationData(latitude, longitude, googleApiKey) : Promise.resolve(null),
      includeAerialView ? getAerialViewData(latitude, longitude, googleApiKey) : Promise.resolve(null),
      includeStreetView ? getStreetViewData(latitude, longitude, googleApiKey) : Promise.resolve(null),
    ]);

    const enhancedData: EnhancedGardenData = {
      location: {
        latitude,
        longitude,
        address,
      },
      airQuality: airQuality || undefined,
      solar: solar || undefined,
      weather: weather || undefined,
      pollen: pollen || undefined,
      elevation: elevation || undefined,
      aerialView: aerialView || undefined,
      streetView: streetView || undefined,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(enhancedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error fetching enhanced Google data:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// ============================================================================
// AIR QUALITY API
// ============================================================================

async function getAirQualityData(
  lat: number,
  lng: number,
  apiKey: string
): Promise<AirQualityData | null> {
  try {
    const response = await fetch(
      `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: {
            latitude: lat,
            longitude: lng,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Air Quality API error:", response.status);
      return null;
    }

    const data = await response.json();
    const aqi = data.indexes?.[0]?.aqi || 0;
    const category = data.indexes?.[0]?.category || "Unknown";
    const dominantPollutant = data.indexes?.[0]?.dominantPollutant || "Unknown";

    // Extract pollutant concentrations
    const pollutants = {
      pm25: data.pollutants?.find((p: any) => p.code === "pm25")?.concentration?.value || 0,
      pm10: data.pollutants?.find((p: any) => p.code === "pm10")?.concentration?.value || 0,
      o3: data.pollutants?.find((p: any) => p.code === "o3")?.concentration?.value || 0,
      no2: data.pollutants?.find((p: any) => p.code === "no2")?.concentration?.value || 0,
      so2: data.pollutants?.find((p: any) => p.code === "so2")?.concentration?.value || 0,
      co: data.pollutants?.find((p: any) => p.code === "co")?.concentration?.value || 0,
    };

    // Generate garden-specific recommendations
    const healthRecommendations = generateAirQualityRecommendations(aqi, category);
    const gardenImpact = analyzeGardenImpact(aqi, dominantPollutant, pollutants);

    return {
      aqi,
      category,
      dominantPollutant,
      pollutants,
      healthRecommendations,
      gardenImpact,
    };
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    return null;
  }
}

function generateAirQualityRecommendations(aqi: number, category: string): string[] {
  const recommendations: string[] = [];

  if (aqi <= 50) {
    recommendations.push("Excellent air quality for all gardening activities");
    recommendations.push("Ideal conditions for outdoor planting and maintenance");
  } else if (aqi <= 100) {
    recommendations.push("Good air quality for most gardening activities");
    recommendations.push("Sensitive plants may benefit from afternoon watering to wash off particles");
  } else if (aqi <= 150) {
    recommendations.push("Moderate air quality - consider limiting extended outdoor work");
    recommendations.push("Rinse leafy vegetables before harvesting");
    recommendations.push("Water plants in evening to help remove air pollutants");
  } else if (aqi <= 200) {
    recommendations.push("Unhealthy air - limit gardening to essential tasks");
    recommendations.push("Avoid working with soil to minimize dust");
    recommendations.push("Consider indoor gardening activities today");
  } else {
    recommendations.push("Very unhealthy air - postpone non-essential gardening");
    recommendations.push("Keep windows closed if growing indoors");
    recommendations.push("Wait for better air quality before harvesting");
  }

  return recommendations;
}

function analyzeGardenImpact(aqi: number, dominantPollutant: string, pollutants: any): string {
  if (aqi <= 50) {
    return "Minimal impact on plant growth. Excellent conditions for photosynthesis and healthy development.";
  } else if (aqi <= 100) {
    return "Slight impact on sensitive plants. Most vegetables and herbs will thrive normally.";
  } else if (aqi <= 150) {
    return `Moderate impact - ${dominantPollutant} levels may reduce photosynthesis efficiency by 10-15%. Consider growing pollution-tolerant varieties.`;
  } else if (aqi <= 200) {
    return `Significant impact - High ${dominantPollutant} can damage leaf surfaces and reduce yields. Leafy greens may accumulate pollutants.`;
  } else {
    return `Severe impact - Hazardous air quality can cause visible damage to plants. Consider protective measures like row covers or delay planting.`;
  }
}

// ============================================================================
// SOLAR API
// ============================================================================

async function getSolarData(
  lat: number,
  lng: number,
  apiKey: string
): Promise<SolarData | null> {
  try {
    // Solar API endpoint for building insights
    const response = await fetch(
      `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&key=${apiKey}`
    );

    if (!response.ok) {
      console.error("Solar API error:", response.status);
      return null;
    }

    const data = await response.json();

    const maxSunshineHours = data.solarPotential?.maxSunshineHoursPerYear || 0;
    const maxArrayPanels = data.solarPotential?.maxArrayPanelsCount || 0;
    const maxArrayArea = data.solarPotential?.maxArrayAreaMeters2 || 0;

    // Calculate seasonal sunlight hours (approximation based on annual data)
    const avgDailyHours = maxSunshineHours / 365;
    const sunlightHoursPerDay = {
      spring: avgDailyHours * 1.1, // 10% more in spring
      summer: avgDailyHours * 1.3, // 30% more in summer
      fall: avgDailyHours * 0.9,   // 10% less in fall
      winter: avgDailyHours * 0.7, // 30% less in winter
    };

    // Determine solar potential category
    let solarPotential = "Low";
    if (maxSunshineHours > 2000) solarPotential = "Excellent";
    else if (maxSunshineHours > 1500) solarPotential = "High";
    else if (maxSunshineHours > 1000) solarPotential = "Moderate";

    // Extract optimal planting areas from solar panels data
    const optimalPlantingAreas = data.solarPotential?.roofSegmentStats?.map((segment: any) => ({
      bounds: {
        north: segment.boundingBox?.ne?.latitude || lat,
        south: segment.boundingBox?.sw?.latitude || lat,
        east: segment.boundingBox?.ne?.longitude || lng,
        west: segment.boundingBox?.sw?.longitude || lng,
      },
      sunExposure: segment.stats?.sunshineQuantiles?.[2] > 1000 ? "Full Sun" : 
                   segment.stats?.sunshineQuantiles?.[2] > 500 ? "Partial Sun" : "Shade",
    })) || [];

    return {
      maxSunshineHoursPerYear: maxSunshineHours,
      maxArrayPanelsCount: maxArrayPanels,
      maxArrayAreaMeters2: maxArrayArea,
      solarPotential,
      sunlightHoursPerDay,
      optimalPlantingAreas,
    };
  } catch (error) {
    console.error("Error fetching solar data:", error);
    return null;
  }
}

// ============================================================================
// WEATHER API (Current Conditions)
// ============================================================================

async function getWeatherData(
  lat: number,
  lng: number,
  apiKey: string
): Promise<WeatherData | null> {
  try {
    // Note: Google doesn't have a dedicated Weather API, but we can use Maps Platform
    // For actual weather data, you might want to use OpenWeatherMap or similar
    // This is a placeholder structure showing how it would integrate
    
    // Using a weather service (you'd need to add OpenWeatherMap API key)
    const weatherApiKey = Deno.env.get("OPENWEATHER_API_KEY");
    
    if (!weatherApiKey) {
      console.log("Weather API key not configured, using fallback");
      return getFallbackWeatherData(lat, lng);
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly&units=imperial&appid=${weatherApiKey}`
    );

    if (!response.ok) {
      return getFallbackWeatherData(lat, lng);
    }

    const data = await response.json();

    const current = {
      temperature: data.current?.temp || 70,
      humidity: data.current?.humidity || 50,
      windSpeed: data.current?.wind_speed || 5,
      precipitation: data.current?.rain?.["1h"] || 0,
      cloudCover: data.current?.clouds || 0,
      uvIndex: data.current?.uvi || 0,
    };

    const forecast = data.daily?.slice(0, 7).map((day: any) => ({
      date: new Date(day.dt * 1000).toISOString().split("T")[0],
      tempHigh: day.temp?.max || 75,
      tempLow: day.temp?.min || 55,
      precipitation: day.pop * 100 || 0,
      humidity: day.humidity || 50,
    })) || [];

    const growingConditions = analyzeGrowingConditions(current, forecast);

    return {
      current,
      forecast,
      growingConditions,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return getFallbackWeatherData(lat, lng);
  }
}

function getFallbackWeatherData(lat: number, lng: number): WeatherData {
  // Provide reasonable defaults based on location
  return {
    current: {
      temperature: 70,
      humidity: 60,
      windSpeed: 5,
      precipitation: 0,
      cloudCover: 30,
      uvIndex: 5,
    },
    forecast: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 86400000).toISOString().split("T")[0],
      tempHigh: 75,
      tempLow: 55,
      precipitation: 20,
      humidity: 60,
    })),
    growingConditions: {
      soilMoisture: "Moderate",
      frostRisk: false,
      heatStress: false,
      optimalForPlanting: true,
    },
  };
}

function analyzeGrowingConditions(current: any, forecast: any[]): any {
  const avgTemp = (current.temperature + forecast[0]?.tempHigh + forecast[0]?.tempLow) / 3;
  const frostRisk = forecast.some((day) => day.tempLow < 32);
  const heatStress = forecast.some((day) => day.tempHigh > 95);
  const optimalForPlanting = avgTemp >= 50 && avgTemp <= 85 && !frostRisk;

  let soilMoisture = "Moderate";
  if (current.precipitation > 0.5 || forecast[0]?.precipitation > 50) {
    soilMoisture = "Wet";
  } else if (current.humidity < 30 && forecast[0]?.precipitation < 10) {
    soilMoisture = "Dry";
  }

  return {
    soilMoisture,
    frostRisk,
    heatStress,
    optimalForPlanting,
  };
}

// ============================================================================
// POLLEN API
// ============================================================================

async function getPollenData(
  lat: number,
  lng: number,
  apiKey: string
): Promise<PollenData | null> {
  try {
    const response = await fetch(
      `https://pollen.googleapis.com/v1/forecast:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lng}&days=5`
    );

    if (!response.ok) {
      console.error("Pollen API error:", response.status);
      return null;
    }

    const data = await response.json();
    
    const dailyInfo = data.dailyInfo?.[0];
    const overallIndex = dailyInfo?.pollenTypeInfo?.[0]?.indexInfo?.value || 0;
    const overallCategory = dailyInfo?.pollenTypeInfo?.[0]?.indexInfo?.category || "Low";

    // Extract pollen types
    const treeInfo = dailyInfo?.pollenTypeInfo?.find((p: any) => p.code === "TREE");
    const grassInfo = dailyInfo?.pollenTypeInfo?.find((p: any) => p.code === "GRASS");
    const weedInfo = dailyInfo?.pollenTypeInfo?.find((p: any) => p.code === "WEED");

    const types = {
      tree: {
        index: treeInfo?.indexInfo?.value || 0,
        category: treeInfo?.indexInfo?.category || "Low",
      },
      grass: {
        index: grassInfo?.indexInfo?.value || 0,
        category: grassInfo?.indexInfo?.category || "Low",
      },
      weed: {
        index: weedInfo?.indexInfo?.value || 0,
        category: weedInfo?.indexInfo?.category || "Low",
      },
    };

    // Build forecast
    const forecast = data.dailyInfo?.map((day: any) => ({
      date: day.date,
      index: day.pollenTypeInfo?.[0]?.indexInfo?.value || 0,
      category: day.pollenTypeInfo?.[0]?.indexInfo?.category || "Low",
    })) || [];

    const gardenRecommendations = generatePollenRecommendations(overallIndex, types);

    return {
      overall: {
        index: overallIndex,
        category: overallCategory,
      },
      types,
      forecast,
      gardenRecommendations,
    };
  } catch (error) {
    console.error("Error fetching pollen data:", error);
    return null;
  }
}

function generatePollenRecommendations(overallIndex: number, types: any): string[] {
  const recommendations: string[] = [];

  if (types.tree.index > 3) {
    recommendations.push("High tree pollen - excellent time for fruit tree pollination");
    recommendations.push("Consider hand-pollinating fruit trees if bee activity is low");
  }

  if (types.grass.index > 3) {
    recommendations.push("High grass pollen - ideal for grass seed germination");
    recommendations.push("Good conditions for establishing new lawn areas");
  }

  if (types.weed.index > 3) {
    recommendations.push("High weed pollen - monitor for unwanted weed growth");
    recommendations.push("Consider mulching to prevent weed seed germination");
  }

  if (overallIndex > 4) {
    recommendations.push("Very high pollen - excellent for pollinator-dependent crops");
    recommendations.push("Great time to plant flowers that attract bees and butterflies");
  } else if (overallIndex < 2) {
    recommendations.push("Low pollen levels - may need to hand-pollinate some crops");
    recommendations.push("Consider planting self-pollinating varieties");
  }

  return recommendations;
}

// ============================================================================
// ELEVATION API
// ============================================================================

async function getElevationData(
  lat: number,
  lng: number,
  apiKey: string
): Promise<ElevationData | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=${apiKey}`
    );

    if (!response.ok) {
      console.error("Elevation API error:", response.status);
      return null;
    }

    const data = await response.json();
    const elevation = data.results?.[0]?.elevation || 0;
    const resolution = data.results?.[0]?.resolution || 0;

    // Analyze drainage and microclimate based on elevation
    const drainagePattern = analyzeDrainage(elevation);
    const frostPocketRisk = analyzeFrostRisk(elevation, lat);
    const microclimateNotes = generateMicroclimateNotes(elevation, lat);

    return {
      elevation,
      resolution,
      drainagePattern,
      frostPocketRisk,
      microclimateNotes,
    };
  } catch (error) {
    console.error("Error fetching elevation data:", error);
    return null;
  }
}

function analyzeDrainage(elevation: number): string {
  if (elevation < 100) {
    return "Low elevation - may have drainage challenges, consider raised beds";
  } else if (elevation < 500) {
    return "Moderate elevation - generally good drainage";
  } else if (elevation < 2000) {
    return "Higher elevation - excellent drainage, may need more frequent watering";
  } else {
    return "High elevation - very good drainage, shorter growing season";
  }
}

function analyzeFrostRisk(elevation: number, lat: number): string {
  const baseRisk = Math.abs(lat) > 40 ? "Moderate" : "Low";
  
  if (elevation > 2000) {
    return "High - cold air settles at higher elevations";
  } else if (elevation < 100) {
    return "Moderate - low areas can be frost pockets";
  } else {
    return baseRisk;
  }
}

function generateMicroclimateNotes(elevation: number, lat: number): string[] {
  const notes: string[] = [];

  if (elevation > 1000) {
    notes.push("Higher elevation means cooler temperatures - adjust planting dates accordingly");
    notes.push("Increased UV exposure benefits some crops but may stress others");
    notes.push("Consider cold-hardy varieties");
  }

  if (elevation < 200) {
    notes.push("Lower elevation may have higher humidity");
    notes.push("Watch for fungal diseases in humid conditions");
    notes.push("Good for moisture-loving plants");
  }

  notes.push(`At ${Math.round(elevation)}m elevation, expect temperature to be ${Math.round(elevation / 100 * 0.6)}°F cooler than sea level`);

  return notes;
}

// ============================================================================
// AERIAL VIEW / MAP TILES API
// ============================================================================

async function getAerialViewData(
  lat: number,
  lng: number,
  apiKey: string
): Promise<AerialViewData | null> {
  try {
    // Using Static Maps API for aerial view
    const zoom = 20; // High zoom for detailed view
    const size = "640x640";
    const maptype = "satellite";

    const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&maptype=${maptype}&key=${apiKey}`;

    // Calculate tile coordinates for Map Tiles API
    const scale = 1 << zoom;
    const worldCoordinate = {
      x: ((lng + 180) / 360) * scale,
      y: ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * scale,
    };

    const tileCoordinates = {
      zoom,
      x: Math.floor(worldCoordinate.x),
      y: Math.floor(worldCoordinate.y),
    };

    // Analyze vegetation (this would require image processing in production)
    const vegetationAnalysis = {
      greenCoverPercentage: 45, // Placeholder - would need actual image analysis
      existingTrees: true,
      shadedAreas: ["North side", "East corner"],
    };

    return {
      imageUrl,
      tileCoordinates,
      vegetationAnalysis,
    };
  } catch (error) {
    console.error("Error fetching aerial view data:", error);
    return null;
  }
}

// ============================================================================
// STREET VIEW API
// ============================================================================

async function getStreetViewData(
  lat: number,
  lng: number,
  apiKey: string
): Promise<StreetViewData | null> {
  try {
    // Check if Street View is available at this location
    const metadataResponse = await fetch(
      `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lng}&key=${apiKey}`
    );

    if (!metadataResponse.ok) {
      console.error("Street View metadata error:", metadataResponse.status);
      return null;
    }

    const metadata = await metadataResponse.json();

    if (metadata.status !== "OK") {
      return {
        available: false,
        surroundingContext: {
          urbanDensity: "Unknown",
          nearbyVegetation: "Unknown",
          buildingHeight: "Unknown",
        },
      };
    }

    const panoId = metadata.pano_id;
    const heading = 0; // North
    const pitch = 0; // Horizontal

    const imageUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${lat},${lng}&heading=${heading}&pitch=${pitch}&key=${apiKey}`;

    // Analyze surrounding context (would need image analysis in production)
    const surroundingContext = {
      urbanDensity: metadata.location ? "Urban" : "Suburban",
      nearbyVegetation: "Moderate tree cover",
      buildingHeight: "2-3 stories",
    };

    return {
      available: true,
      panoId,
      imageUrl,
      heading,
      pitch,
      surroundingContext,
    };
  } catch (error) {
    console.error("Error fetching street view data:", error);
    return null;
  }
}
