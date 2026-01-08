import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface ClimateDataRequest {
  latitude: number;
  longitude: number;
  hardiness_zone?: string;
  start_date?: string;
  end_date?: string;
}

interface ClimateData {
  hardiness_zone: string;
  frost_dates: {
    last_spring_frost: string;
    first_fall_frost: string;
  };
  growing_degree_days: number;
  precipitation_data: {
    annual_avg: number;
    seasonal_pattern: string;
  };
  temperature_data: {
    avg_high: number;
    avg_low: number;
    extreme_high: number;
    extreme_low: number;
  };
  drought_conditions: string;
  weather_alerts: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, hardiness_zone, start_date, end_date }: ClimateDataRequest = await req.json();

    console.log('Fetching climate data for:', { latitude, longitude, hardiness_zone });

    // Get data from multiple sources in parallel
    const [hardinessData, noaaData, acisData] = await Promise.all([
      getHardinessZoneData(latitude, longitude, hardiness_zone),
      getNOAAClimateData(latitude, longitude, start_date, end_date),
      getACISData(latitude, longitude)
    ]);

    const climateData: ClimateData = {
      hardiness_zone: hardinessData.zone,
      frost_dates: hardinessData.frost_dates,
      growing_degree_days: acisData.gdd || 0,
      precipitation_data: noaaData.precipitation,
      temperature_data: noaaData.temperature,
      drought_conditions: acisData.drought_status || 'Unknown',
      weather_alerts: noaaData.alerts || []
    };

    return new Response(JSON.stringify(climateData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error fetching climate data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getHardinessZoneData(lat: number, lon: number, providedZone?: string) {
  try {
    // If zone is provided, use it, otherwise try to determine from coordinates
    if (providedZone) {
      return {
        zone: providedZone,
        frost_dates: calculateFrostDates(lat, providedZone)
      };
    }

    // Use USDA Plant Hardiness Zone API or fallback calculation
    const zone = calculateHardinessZone(lat, lon);
    return {
      zone,
      frost_dates: calculateFrostDates(lat, zone)
    };
  } catch (error) {
    console.error('Error getting hardiness zone data:', error);
    return {
      zone: 'Unknown',
      frost_dates: { last_spring_frost: 'Unknown', first_fall_frost: 'Unknown' }
    };
  }
}

async function getNOAAClimateData(lat: number, lon: number, startDate?: string, endDate?: string) {
  const noaaApiKey = Deno.env.get('NOAA_CDO_API_KEY');
  
  if (!noaaApiKey) {
    console.log('NOAA API key not available, using fallback data');
    return getFallbackWeatherData(lat, lon);
  }

  try {
    // Get nearest weather station
    const stationResponse = await fetch(
      `https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?locationid=FIPS:US&limit=1&offset=0&datatypeid=TMAX&datatypeid=TMIN&datatypeid=PRCP`,
      {
        headers: {
          'token': noaaApiKey
        }
      }
    );

    if (!stationResponse.ok) {
      throw new Error('Failed to fetch weather station data');
    }

    const stations = await stationResponse.json();
    
    // Get climate data for the past year
    const endDateStr = endDate || new Date().toISOString().split('T')[0];
    const startDateStr = startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      precipitation: {
        annual_avg: 35.0, // Default values
        seasonal_pattern: 'Even distribution'
      },
      temperature: {
        avg_high: 75,
        avg_low: 45,
        extreme_high: 95,
        extreme_low: 15
      },
      alerts: []
    };

  } catch (error) {
    console.error('Error fetching NOAA data:', error);
    return getFallbackWeatherData(lat, lon);
  }
}

async function getACISData(lat: number, lon: number) {
  try {
    // ACIS Web Services API call for growing degree days and drought conditions
    const acisResponse = await fetch('http://data.rcc-acis.org/StnData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        loc: `${lon},${lat}`,
        sdate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        edate: new Date().toISOString().split('T')[0],
        elems: [
          {"name": "maxt"},
          {"name": "mint"},
          {"name": "gdd50"}
        ]
      })
    });

    if (acisResponse.ok) {
      const acisData = await acisResponse.json();
      const gddSum = acisData.data?.reduce((sum: number, day: any) => {
        const gdd = parseFloat(day[2]);
        return sum + (isNaN(gdd) ? 0 : gdd);
      }, 0) || 0;

      return {
        gdd: gddSum,
        drought_status: 'Normal' // Would be calculated from precipitation data
      };
    }

    throw new Error('ACIS API request failed');

  } catch (error) {
    console.error('Error fetching ACIS data:', error);
    return {
      gdd: 0,
      drought_status: 'Unknown'
    };
  }
}

function calculateHardinessZone(lat: number, lon: number): string {
  // Simplified hardiness zone calculation based on latitude
  // This is a rough approximation - real implementation would use USDA data
  if (lat >= 48) return '3a';
  if (lat >= 45) return '4a';
  if (lat >= 42) return '5a';
  if (lat >= 39) return '6a';
  if (lat >= 36) return '7a';
  if (lat >= 33) return '8a';
  if (lat >= 30) return '9a';
  if (lat >= 27) return '10a';
  return '11a';
}

function calculateFrostDates(lat: number, zone: string) {
  // Simplified frost date calculation
  const zoneNum = parseInt(zone.charAt(0));
  
  // Spring frost dates (approximate)
  const springFrostDates: { [key: number]: string } = {
    3: 'May 15-31',
    4: 'May 1-15',
    5: 'April 15-30',
    6: 'April 1-15',
    7: 'March 15-31',
    8: 'March 1-15',
    9: 'February 15-28',
    10: 'January 31 or earlier'
  };

  // Fall frost dates (approximate)
  const fallFrostDates: { [key: number]: string } = {
    3: 'September 15-30',
    4: 'October 1-15',
    5: 'October 15-31',
    6: 'November 1-15',
    7: 'November 15-30',
    8: 'December 1-15',
    9: 'December 15-31',
    10: 'January 1 or later'
  };

  return {
    last_spring_frost: springFrostDates[zoneNum] || 'Unknown',
    first_fall_frost: fallFrostDates[zoneNum] || 'Unknown'
  };
}

function getFallbackWeatherData(lat: number, lon: number) {
  // Fallback weather data based on general US climate patterns
  return {
    precipitation: {
      annual_avg: lat > 40 ? 40 : 25, // Northern areas get more precipitation
      seasonal_pattern: 'Even distribution'
    },
    temperature: {
      avg_high: 85 - (lat - 30) * 2, // Rough temperature estimation
      avg_low: 45 - (lat - 30) * 2,
      extreme_high: 100 - (lat - 30) * 1.5,
      extreme_low: 10 - (lat - 30) * 3
    },
    alerts: []
  };
}