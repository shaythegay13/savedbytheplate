import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WeatherAlert {
  id: string;
  type: string;
  severity: string;
  urgency: string;
  certainty: string;
  event: string;
  headline: string;
  description: string;
  instruction?: string;
  onset: string;
  expires: string;
  areaDesc: string;
  gardenImpact: string;
  recommendations: string[];
}

interface WeatherAlertsRequest {
  latitude: number;
  longitude: number;
  user_id?: string;
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

    const { latitude, longitude, user_id }: WeatherAlertsRequest = await req.json();

    if (!latitude || !longitude) {
      return new Response(JSON.stringify({ error: 'Latitude and longitude are required' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Fetching weather alerts for coordinates: ${latitude}, ${longitude}`);

    // Fetch weather alerts from NWS API
    const alerts = await fetchNWSAlerts(latitude, longitude);
    
    // Process alerts for garden impact
    const processedAlerts = await processAlertsForGardening(alerts);

    // Store alerts in database if user_id provided
    if (user_id && processedAlerts.length > 0) {
      await storeWeatherAlerts(supabase, user_id, processedAlerts);
    }

    return new Response(JSON.stringify({
      alerts: processedAlerts,
      alertCount: processedAlerts.length,
      location: { latitude, longitude }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error in get-weather-alerts function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      alerts: [],
      alertCount: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function fetchNWSAlerts(lat: number, lon: number): Promise<any[]> {
  try {
    // Get the weather office and grid coordinates first
    const pointResponse = await fetch(
      `https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`,
      {
        headers: {
          'User-Agent': 'Smart Backyard Tech Platform (garden-alerts)',
        },
      }
    );

    if (!pointResponse.ok) {
      console.log('Point lookup failed, falling back to zone-based alerts');
      return await fetchZoneBasedAlerts(lat, lon);
    }

    const pointData = await pointResponse.json();
    const { county, forecastZone } = pointData.properties;

    // Fetch alerts for the specific zones
    const alertsResponse = await fetch(
      `https://api.weather.gov/alerts/active?zone=${forecastZone}&county=${county}`,
      {
        headers: {
          'User-Agent': 'Smart Backyard Tech Platform (garden-alerts)',
        },
      }
    );

    if (!alertsResponse.ok) {
      throw new Error(`NWS API error: ${alertsResponse.status}`);
    }

    const alertsData = await alertsResponse.json();
    return alertsData.features || [];

  } catch (error) {
    console.error('Error fetching NWS alerts:', error);
    return [];
  }
}

async function fetchZoneBasedAlerts(lat: number, lon: number): Promise<any[]> {
  try {
    // Fallback: fetch alerts for the general area
    const alertsResponse = await fetch(
      `https://api.weather.gov/alerts/active?point=${lat.toFixed(4)},${lon.toFixed(4)}`,
      {
        headers: {
          'User-Agent': 'Smart Backyard Tech Platform (garden-alerts)',
        },
      }
    );

    if (!alertsResponse.ok) {
      return [];
    }

    const alertsData = await alertsResponse.json();
    return alertsData.features || [];
  } catch (error) {
    console.error('Error fetching zone-based alerts:', error);
    return [];
  }
}

async function processAlertsForGardening(alerts: any[]): Promise<WeatherAlert[]> {
  const gardenRelevantEvents = [
    'Frost Advisory', 'Freeze Warning', 'Hard Freeze Warning',
    'High Wind Warning', 'Wind Advisory',
    'Severe Thunderstorm Warning', 'Tornado Warning',
    'Flash Flood Warning', 'Flood Warning',
    'Heat Advisory', 'Excessive Heat Warning',
    'Winter Storm Warning', 'Ice Storm Warning',
    'Drought', 'Fire Weather Watch'
  ];

  return alerts
    .filter(alert => {
      const event = alert.properties.event;
      return gardenRelevantEvents.some(relevantEvent => 
        event.includes(relevantEvent)
      );
    })
    .map(alert => {
      const props = alert.properties;
      const gardenAnalysis = analyzeGardenImpact(props.event, props.description);
      
      return {
        id: props.id || alert.id,
        type: props.event,
        severity: props.severity || 'Moderate',
        urgency: props.urgency || 'Expected',
        certainty: props.certainty || 'Likely',
        event: props.event,
        headline: props.headline,
        description: props.description,
        instruction: props.instruction,
        onset: props.onset,
        expires: props.expires,
        areaDesc: props.areaDesc,
        gardenImpact: gardenAnalysis.impact,
        recommendations: gardenAnalysis.recommendations
      };
    });
}

function analyzeGardenImpact(event: string, description: string): { impact: string; recommendations: string[] } {
  const eventLower = event.toLowerCase();
  
  if (eventLower.includes('frost') || eventLower.includes('freeze')) {
    return {
      impact: 'High Risk - Frost/freeze conditions can damage or kill tender plants and crops',
      recommendations: [
        'Cover sensitive plants with frost cloth or blankets',
        'Harvest tender vegetables before frost hits',
        'Bring potted plants indoors',
        'Water plants thoroughly before freeze (wet soil retains heat better)',
        'Consider using protective structures like cold frames'
      ]
    };
  }
  
  if (eventLower.includes('wind')) {
    return {
      impact: 'Medium Risk - High winds can damage plants, break branches, and dry out soil',
      recommendations: [
        'Stake tall plants and secure trellises',
        'Harvest ripe fruits that might fall',
        'Water plants well to prevent wind stress',
        'Consider temporary windbreaks for vulnerable areas',
        'Check and secure garden structures'
      ]
    };
  }
  
  if (eventLower.includes('thunderstorm') || eventLower.includes('tornado')) {
    return {
      impact: 'High Risk - Severe storms can destroy plants and garden infrastructure',
      recommendations: [
        'Harvest what you can before the storm',
        'Secure or store garden tools and equipment',
        'Protect young seedlings with covers',
        'Check drainage to prevent waterlogging',
        'Document garden condition for insurance if needed'
      ]
    };
  }
  
  if (eventLower.includes('flood')) {
    return {
      impact: 'High Risk - Flooding can drown plants and contaminate soil',
      recommendations: [
        'Harvest crops that are ready',
        'Improve drainage around garden beds',
        'Move potted plants to higher ground',
        'Avoid working in waterlogged soil after flooding',
        'Test soil for contamination after flood waters recede'
      ]
    };
  }
  
  if (eventLower.includes('heat')) {
    return {
      impact: 'Medium Risk - Extreme heat can stress plants and increase water needs',
      recommendations: [
        'Water plants early morning or late evening',
        'Provide shade for heat-sensitive plants',
        'Mulch heavily to retain soil moisture',
        'Postpone planting until cooler weather',
        'Harvest early morning when plants are coolest'
      ]
    };
  }
  
  if (eventLower.includes('drought')) {
    return {
      impact: 'Medium Risk - Extended dry conditions require water conservation strategies',
      recommendations: [
        'Implement water-saving irrigation techniques',
        'Add thick mulch to retain soil moisture',
        'Focus watering on most valuable plants',
        'Consider drought-tolerant plant varieties',
        'Collect rainwater when available'
      ]
    };
  }
  
  return {
    impact: 'Monitor - Weather conditions may affect garden activities',
    recommendations: [
      'Stay informed about changing conditions',
      'Adjust garden activities as needed',
      'Protect sensitive plants if conditions worsen'
    ]
  };
}

async function storeWeatherAlerts(supabase: any, userId: string, alerts: WeatherAlert[]) {
  try {
    for (const alert of alerts) {
      // Check if alert already exists
      const { data: existing } = await supabase
        .from('weather_alerts')
        .select('id')
        .eq('alert_id', alert.id)
        .eq('user_id', userId)
        .single();

      if (!existing) {
        await supabase
          .from('weather_alerts')
          .insert({
            user_id: userId,
            alert_id: alert.id,
            event_type: alert.event,
            severity: alert.severity,
            headline: alert.headline,
            description: alert.description,
            garden_impact: alert.gardenImpact,
            recommendations: alert.recommendations,
            onset: alert.onset,
            expires: alert.expires,
            area_description: alert.areaDesc
          });
      }
    }
  } catch (error) {
    console.error('Error storing weather alerts:', error);
  }
}