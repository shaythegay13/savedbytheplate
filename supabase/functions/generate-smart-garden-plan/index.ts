import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    // Get weather and climate data for location-based recommendations
    let weatherData = null;
    let climateData = null;
    let usdaData = null;
    if (formData.latitude && formData.longitude) {
      [weatherData, climateData, usdaData] = await Promise.all([
        getWeatherData(formData.latitude, formData.longitude),
        getClimateData(formData.latitude, formData.longitude),
        getUSDAClimateData(formData.latitude, formData.longitude, formData.city)
      ]);
    }

    // Get insights data to inform recommendations  
    const { data: insights } = await supabase
      .from('garden_insights')
      .select('*')
      .eq('soil_type', formData.soil_type)
      .eq('sunlight', formData.sunlight)
      .order('success_rate', { ascending: false });

    // Generate AI-enhanced recommendations with real AI
    const plantRecommendations = await generateAIRecommendations(formData, insights || [], weatherData, climateData, usdaData);
    const gardenLayout = await generateAILayout(formData, plantRecommendations, weatherData, climateData, usdaData);
    const plantingCalendar = await generateAICalendar(formData, plantRecommendations, weatherData, climateData, usdaData);
    const careInstructions = await generateAICareInstructions(formData, weatherData, climateData, usdaData);
    const expertTips = await generateAITips(formData, insights || [], weatherData, climateData, usdaData);

    const gardenPlan = {
      plantRecommendations,
      gardenLayout,
      plantingCalendar,
      careInstructions,
      expertTips
    };

    // Save the plan to database if user is authenticated
    if (formData.user_id) {
      const { data: savedPlan } = await supabase
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

      // Generate notification schedule
      if (savedPlan) {
        await generateNotificationSchedule(supabase, savedPlan.id, formData.user_id, plantRecommendations);
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function getWeatherData(lat: number, lon: number) {
  try {
    const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
    if (!apiKey) return null;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      conditions: data.weather[0].description,
      windSpeed: data.wind.speed,
      cloudiness: data.clouds.all
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
}

async function getClimateData(latitude: number, longitude: number) {
  try {
    // Call our climate data edge function
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/get-climate-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({
        latitude,
        longitude,
        start_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0]
      })
    });

    if (!response.ok) {
      console.error('Climate data request failed:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching climate data:', error);
    return null;
  }
}

async function getUSDAClimateData(latitude: number, longitude: number, city?: string) {
  try {
    // Call our USDA climate data edge function
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/get-usda-climate-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({
        latitude,
        longitude,
        year: new Date().getFullYear()
      })
    });

    if (!response.ok) {
      console.error('USDA climate data request failed:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching USDA climate data:', error);
    return null;
  }
}

async function generateAIRecommendations(formData: GardenPlanRequest, insights: any[], weatherData: any, climateData: any, usdaData: any) {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIKey) {
    return generateFallbackRecommendations(formData, insights);
  }

  try {
    const prompt = `You are an expert gardener and agricultural advisor. Generate a personalized plant recommendation list based on the following information:

GARDEN DETAILS:
- Space: ${formData.spaceType} (${formData.spaceSize})
- Sunlight: ${formData.sunlight}
- Soil Contaminated: ${formData.soil_contaminated}
- Soil Type: ${formData.soil_type}
- Growing Options: ${formData.growing_options}
- Experience: ${formData.experience_level}
- Time commitment: ${formData.time_commitment}
- Season: ${formData.season}
- Goals: ${formData.goals}
- Preferred plants: ${formData.preferred_plants}

CURRENT WEATHER (if available):
${weatherData ? `Temperature: ${weatherData.temperature}°C, Humidity: ${weatherData.humidity}%, Conditions: ${weatherData.conditions}` : 'Not available'}

CLIMATE DATA:
${climateData ? `
Hardiness Zone: ${climateData.hardiness_zone}
Last Spring Frost: ${climateData.frost_dates.last_spring_frost}
First Fall Frost: ${climateData.frost_dates.first_fall_frost}
Growing Degree Days: ${climateData.growing_degree_days}
Annual Precipitation: ${climateData.precipitation_data.annual_avg} inches
Drought Status: ${climateData.drought_conditions}
Weather Alerts: ${climateData.weather_alerts.length > 0 ? climateData.weather_alerts.join(', ') : 'None'}
` : 'Climate data not available'}

USDA REGIONAL INSIGHTS (if available):
${usdaData ? `
Climate Hub: ${usdaData.regionalInsights.climateHub}
Region: ${usdaData.regionalInsights.region}
Primary Climate Concerns: ${usdaData.regionalInsights.primaryConcerns.join(', ')}
Adaptation Strategies: ${usdaData.regionalInsights.adaptationStrategies.join(', ')}
Major Regional Crops: ${usdaData.agriculturalStatistics.majorCrops.slice(0, 5).map(crop => `${crop.crop} (${crop.acres} acres)`).join(', ')}
Soil Health: pH ${usdaData.soilData.averagePH}, ${usdaData.soilData.averageOM}% organic matter, ${usdaData.soilData.erosionRisk} erosion risk
Climate Trends: ${usdaData.climateTrends.temperatureTrend}, ${usdaData.climateTrends.precipitationTrend}
` : 'USDA data not available'}

COMMUNITY SUCCESS DATA:
${insights.length > 0 ? insights.map(i => `${i.plant_name}: ${i.success_rate}% success rate, ${i.total_attempts} attempts`).join('\n') : 'No community data available'}

Please provide 8-12 diverse plant recommendations in this exact JSON format:
[
  {
    "name": "Plant Name",
    "variety": "Specific Variety",
    "plantingTime": "When to plant",
    "harvestTime": "When to harvest",
    "spacing": "Plant spacing",
    "careInstructions": "Brief care instructions",
    "difficulty": "Easy|Medium|Hard",
    "yield": "Expected yield",
    "whyRecommended": "Why this plant suits their conditions"
  }
]

IMPORTANT: 
- Focus on a diverse variety of vegetables, herbs, fruits, and culturally appropriate crops
- Consider traditional and heritage varieties that grow well in this region
- Include both common and unique plants to create an interesting, productive garden
- If user goals mention cultural relevance, prioritize plants from relevant culinary traditions
- Vary the difficulty levels to match the gardener's experience
- Include quick-growing and long-season crops for continuous harvests`;  

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert gardener and agricultural advisor. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) throw new Error('OpenAI API failed');

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const recommendations = JSON.parse(jsonMatch[0]);
      
      // Enhance with community insights
      return recommendations.map((plant: any) => {
        const insight = insights.find(i => i.plant_name.toLowerCase().includes(plant.name.toLowerCase()));
        if (insight) {
          plant.aiInsights = {
            successRate: insight.success_rate,
            averageYield: insight.average_yield_rating,
            commonIssues: insight.common_issues || [],
            recommendedMonths: insight.best_planting_months || []
          };
        }
        return plant;
      });
    }
    
    throw new Error('Invalid AI response format');
    
  } catch (error) {
    console.error('AI recommendation error:', error);
    return generateFallbackRecommendations(formData, insights);
  }
}

function generateFallbackRecommendations(formData: GardenPlanRequest, insights: any[]) {
  // Create diverse recommendations based on user goals and preferences
  const culturalRelevant = formData.goals?.toLowerCase().includes('cultural') || 
                          formData.preferred_plants?.toLowerCase().includes('cultural');
  
  const baseRecommendations = [
    {
      name: "Cherry Tomatoes",
      variety: "Sweet 100",
      plantingTime: "After last frost",
      harvestTime: "60-70 days",
      spacing: "18-24 inches apart",
      careInstructions: "Water deeply 2-3 times per week. Provide support.",
      difficulty: "Easy" as const,
      yield: "5-10 lbs per plant",
      whyRecommended: "Great for beginners and productive in containers"
    },
    {
      name: "Lettuce",
      variety: "Buttercrunch",
      plantingTime: "Early spring or fall",
      harvestTime: "45-60 days",
      spacing: "6-8 inches apart",
      careInstructions: "Keep soil consistently moist.",
      difficulty: "Easy" as const,
      yield: "1-2 heads per plant",
      whyRecommended: "Quick growing and perfect for succession planting"
    },
    {
      name: "Basil",
      variety: "Genovese",
      plantingTime: "After soil warms to 60°F",
      harvestTime: "Continuous after 60 days",
      spacing: "12 inches apart",
      careInstructions: "Pinch flowers to encourage leaf growth.",
      difficulty: "Easy" as const,
      yield: "1-2 cups fresh leaves per week",
      whyRecommended: "Essential herb for cooking and companion planting"
    },
    {
      name: "Bell Peppers",
      variety: "California Wonder",
      plantingTime: "2 weeks after last frost",
      harvestTime: "70-80 days",
      spacing: "18-24 inches apart",
      careInstructions: "Consistent watering and full sun.",
      difficulty: "Medium" as const,
      yield: "6-8 peppers per plant",
      whyRecommended: "Versatile vegetable for cooking and good storage"
    },
    {
      name: "Kale",
      variety: "Lacinato",
      plantingTime: "Early spring or late summer",
      harvestTime: "50-60 days",
      spacing: "12-18 inches apart",
      careInstructions: "Cold tolerant, harvest outer leaves first.",
      difficulty: "Easy" as const,
      yield: "1-2 lbs per plant",
      whyRecommended: "Nutritious superfood, cold hardy, long harvest"
    },
    {
      name: "Zucchini",
      variety: "Black Beauty",
      plantingTime: "After soil is warm",
      harvestTime: "50-60 days",
      spacing: "36 inches apart",
      careInstructions: "Needs space and regular watering.",
      difficulty: "Easy" as const,
      yield: "10-15 lbs per plant",
      whyRecommended: "Highly productive, great for large families"
    },
    {
      name: "Green Beans",
      variety: "Provider Bush",
      plantingTime: "After last frost",
      harvestTime: "50-55 days",
      spacing: "4-6 inches apart",
      careInstructions: "Nitrogen fixing, minimal fertilizer needed.",
      difficulty: "Easy" as const,
      yield: "3-5 lbs per 10ft row",
      whyRecommended: "Improves soil and provides protein-rich harvest"
    },
    {
      name: "Cilantro",
      variety: "Slow Bolt",
      plantingTime: "Cool weather, spring and fall",
      harvestTime: "30-40 days",
      spacing: "4-6 inches apart",
      careInstructions: "Prefers cool weather, succession plant.",
      difficulty: "Easy" as const,
      yield: "Continuous harvest",
      whyRecommended: "Essential for Latin and Asian cuisine"
    },
    {
      name: "Carrots",
      variety: "Nantes",
      plantingTime: "Early spring to late summer",
      harvestTime: "70-80 days",
      spacing: "2-3 inches apart",
      careInstructions: "Thin seedlings, keep soil moist until germination.",
      difficulty: "Medium" as const,
      yield: "1-2 lbs per square foot",
      whyRecommended: "Root vegetable that stores well and great for kids"
    },
    {
      name: "Spinach",
      variety: "Space",
      plantingTime: "Cool weather, spring and fall",
      harvestTime: "40-50 days",
      spacing: "4-6 inches apart",
      careInstructions: "Bolts in heat, succession plant every 2 weeks.",
      difficulty: "Easy" as const,
      yield: "4-6 oz per plant",
      whyRecommended: "Nutritious greens, perfect for salads and cooking"
    },
    {
      name: "Radishes",
      variety: "Cherry Belle",
      plantingTime: "Cool weather, early spring",
      harvestTime: "25-30 days",
      spacing: "1-2 inches apart",
      careInstructions: "Quick growing, harvest promptly when mature.",
      difficulty: "Easy" as const,
      yield: "20-30 radishes per square foot",
      whyRecommended: "Fastest crop, great for beginners and succession planting"
    },
    {
      name: "Cucumber",
      variety: "Straight Eight",
      plantingTime: "After soil warms",
      harvestTime: "55-65 days",
      spacing: "36 inches apart",
      spacing: "12 inches apart for bush varieties",
      careInstructions: "Needs support for vining types, consistent watering.",
      difficulty: "Medium" as const,
      yield: "10-20 cucumbers per plant",
      whyRecommended: "Refreshing summer crop, good for pickling"
    },
    {
      name: "Parsley",
      variety: "Italian Flat Leaf",
      plantingTime: "Spring after frost danger",
      harvestTime: "Continuous after 75 days",
      spacing: "6-8 inches apart",
      careInstructions: "Cut outer stems first, biennial herb.",
      difficulty: "Easy" as const,
      yield: "Continuous harvest",
      whyRecommended: "Essential cooking herb, rich in vitamins"
    },
    {
      name: "Broccoli",
      variety: "Calabrese",
      plantingTime: "Cool weather, spring and fall",
      harvestTime: "60-90 days",
      spacing: "18-24 inches apart",
      careInstructions: "Harvest main head first, side shoots will follow.",
      difficulty: "Medium" as const,
      yield: "1-2 lbs per plant",
      whyRecommended: "Nutritious cruciferous vegetable, multiple harvests"
    },
    {
      name: "Swiss Chard",
      variety: "Bright Lights",
      plantingTime: "Spring through fall",
      harvestTime: "50-60 days",
      spacing: "6-12 inches apart",
      careInstructions: "Cut outer leaves, plant will continue producing.",
      difficulty: "Easy" as const,
      yield: "Continuous harvest",
      whyRecommended: "Beautiful and nutritious, heat tolerant greens"
    },
    {
      name: "Onions",
      variety: "Yellow Storage",
      plantingTime: "Early spring from sets",
      harvestTime: "90-120 days",
      spacing: "4-6 inches apart",
      careInstructions: "Stop watering when tops begin to fall over.",
      difficulty: "Easy" as const,
      yield: "8-12 onions per square foot",
      whyRecommended: "Essential cooking ingredient, stores well"
    },
    {
      name: "Peas",
      variety: "Sugar Snap",
      plantingTime: "Cool weather, early spring",
      harvestTime: "60-70 days",
      spacing: "2-4 inches apart",
      careInstructions: "Provide support, nitrogen fixing legume.",
      difficulty: "Easy" as const,
      yield: "2-4 oz per plant",
      whyRecommended: "Sweet edible pods, improves soil nitrogen"
    },
    {
      name: "Garlic",
      variety: "Hardneck",
      plantingTime: "Fall planting for summer harvest",
      harvestTime: "240-270 days",
      spacing: "4-6 inches apart",
      careInstructions: "Plant cloves pointed end up, mulch for winter.",
      difficulty: "Easy" as const,
      yield: "1 bulb per clove planted",
      whyRecommended: "Essential cooking ingredient, medicinal properties"
    },
    {
      name: "Mint",
      variety: "Spearmint",
      plantingTime: "Spring after frost",
      harvestTime: "Continuous after 40 days",
      spacing: "12-18 inches apart",
      careInstructions: "Contain in pots, spreads aggressively.",
      difficulty: "Easy" as const,
      yield: "Continuous harvest",
      whyRecommended: "Aromatic herb for teas and cooking, pest deterrent"
    },
    {
      name: "Marigolds",
      variety: "French Marigold",
      plantingTime: "After last frost",
      harvestTime: "Flowers all season",
      spacing: "6-8 inches apart",
      careInstructions: "Deadhead for continuous blooms, drought tolerant.",
      difficulty: "Easy" as const,
      yield: "Continuous flowers",
      whyRecommended: "Natural pest deterrent, attracts beneficial insects"
    }
  ];

  // Add culturally relevant options if requested
  if (culturalRelevant) {
    baseRecommendations.push(
      {
        name: "Collard Greens",
        variety: "Georgia Southern",
        plantingTime: "Late summer for fall harvest",
        harvestTime: "60-75 days",
        spacing: "18-24 inches apart",
        careInstructions: "Cold hardy, harvest outer leaves.",
        difficulty: "Easy" as const,
        yield: "2-3 lbs per plant",
        whyRecommended: "Traditional Southern vegetable, excellent nutrition"
      },
      {
        name: "Hot Peppers",
        variety: "Jalapeño",
        plantingTime: "After last frost",
        harvestTime: "70-80 days",
        spacing: "18 inches apart",
        careInstructions: "Loves heat, minimal water once established.",
        difficulty: "Medium" as const,
        yield: "25-35 peppers per plant",
        whyRecommended: "Essential for authentic spicy cuisine"
      }
    );
  }

  return baseRecommendations.map(plant => {
    const insight = insights.find(i => i.plant_name === plant.name);
    if (insight) {
      plant.aiInsights = {
        successRate: insight.success_rate,
        averageYield: insight.average_yield_rating,
        commonIssues: insight.common_issues || [],
        recommendedMonths: insight.best_planting_months || []
      };
    }
    return plant;
  });
}

async function generateAILayout(formData: GardenPlanRequest, plants: any[], weatherData: any, climateData: any, usdaData: any) {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIKey) return generateFallbackLayout(formData, plants);

  try {
    const prompt = `Create an optimized garden layout based on:

SPACE: ${formData.spaceType} (${formData.spaceSize})
SUNLIGHT: ${formData.sunlight}
EXPERIENCE: ${formData.experience_level}

PLANTS TO ARRANGE: ${plants.map(p => p.name).join(', ')}

WEATHER CONDITIONS: ${weatherData ? `${weatherData.temperature}°C, ${weatherData.conditions}` : 'Not available'}

CLIMATE DATA: ${climateData ? `Zone ${climateData.hardiness_zone}, Frost season: ${climateData.frost_dates.last_spring_frost} to ${climateData.frost_dates.first_fall_frost}` : 'Not available'}

Return a JSON array of 3-4 garden sections with this format:
[
  {
    "section": "Section Name",
    "plants": ["plant1", "plant2"],
    "size": "dimensions",
    "notes": "layout reasoning"
  }
]

Consider companion planting, sunlight needs, and accessibility.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a garden layout expert. Respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) throw new Error('OpenAI API failed');

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid AI response format');
    
  } catch (error) {
    console.error('AI layout error:', error);
    return generateFallbackLayout(formData, plants);
  }
}

function generateFallbackLayout(formData: GardenPlanRequest, plants: any[]) {
  return [
    {
      section: "Primary Growing Area",
      plants: plants.slice(0, 4).map(p => p.name),
      size: "4x6 feet",
      notes: "Main vegetable growing area with easy access"
    },
    {
      section: "Herb Corner",
      plants: plants.filter(p => p.name.toLowerCase().includes('herb') || p.name.toLowerCase().includes('basil')).map(p => p.name),
      size: "2x3 feet",
      notes: "Convenient location for kitchen herbs"
    }
  ];
}

async function generateAICalendar(formData: GardenPlanRequest, plants: any[], weatherData: any, climateData: any, usdaData: any) {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIKey) return generateFallbackCalendar(formData, plants);

  try {
    const prompt = `Create a month-by-month gardening calendar for:

LOCATION: Based on provided coordinates
SEASON FOCUS: ${formData.season}
PLANTS: ${plants.map(p => p.name).join(', ')}
CURRENT WEATHER: ${weatherData ? `${weatherData.temperature}°C, ${weatherData.conditions}` : 'Not available'}

FROST DATES: ${climateData ? `Last spring frost: ${climateData.frost_dates.last_spring_frost}, First fall frost: ${climateData.frost_dates.first_fall_frost}` : 'Not available'}

Generate 6 months starting from now with this JSON format:
[
  {
    "month": "Month Name",
    "activities": ["activity1", "activity2", "activity3", "activity4"]
  }
]

Include specific planting, care, and harvest activities for their plants and zone.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a gardening calendar expert. Respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) throw new Error('OpenAI API failed');

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid AI response format');
    
  } catch (error) {
    console.error('AI calendar error:', error);
    return generateFallbackCalendar(formData, plants);
  }
}

function generateFallbackCalendar(formData: GardenPlanRequest, plants: any[]) {
  const currentMonth = new Date().getMonth();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth + i) % 12;
    const monthName = months[monthIndex];
    
    return {
      month: monthName,
      activities: [
        `Check ${plants[0]?.name || 'plants'} for seasonal care`,
        "Monitor soil moisture levels",
        "Apply organic fertilizer as needed",
        "Watch for pests and diseases"
      ]
    };
  });
}

async function generateAICareInstructions(formData: GardenPlanRequest, weatherData: any, climateData: any, usdaData: any) {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIKey) return generateFallbackCare(formData);

  try {
    const prompt = `Create detailed, personalized garden care instructions for:

GARDEN SETUP:
- Space: ${formData.spaceType} (${formData.spaceSize})
- Sunlight: ${formData.sunlight}
- Zone: ${formData.hardiness_zone}
- Soil: ${formData.soil_type}
- Experience: ${formData.experience_level}
- Time available: ${formData.time_commitment}

CURRENT CONDITIONS: ${weatherData ? `${weatherData.temperature}°C, ${weatherData.humidity}% humidity, ${weatherData.conditions}` : 'Not available'}

CLIMATE INFORMATION: ${climateData ? `
Zone ${climateData.hardiness_zone}, ${climateData.precipitation_data.annual_avg}" annual rainfall
Drought status: ${climateData.drought_conditions}
Temperature range: ${climateData.temperature_data.avg_low}°F to ${climateData.temperature_data.avg_high}°F
Growing season: ${climateData.frost_dates.last_spring_frost} to ${climateData.frost_dates.first_fall_frost}
` : 'Climate data not available'}

Provide comprehensive care instructions covering watering, soil care, seasonal maintenance, and plant health. Make it specific to their conditions and experience level. Return as plain text (not JSON).`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert gardening advisor. Provide practical, actionable advice.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) throw new Error('OpenAI API failed');

    const data = await response.json();
    return data.choices[0].message.content.trim();
    
  } catch (error) {
    console.error('AI care instructions error:', error);
    return generateFallbackCare(formData);
  }
}

function generateFallbackCare(formData: GardenPlanRequest) {
  return `Personalized care instructions for your ${formData.spaceType} garden:

WATERING:
- Water deeply 2-3 times per week based on your ${formData.soil_type} soil
- Check soil moisture 2 inches down before watering
- Water early morning to reduce evaporation

SOIL CARE:
- Add compost regularly for healthy soil
- Test soil pH annually (6.0-7.0 ideal for most vegetables)
- Ensure good drainage in your ${formData.spaceType}

MAINTENANCE:
- Weekly plant inspections for pests and diseases
- Seasonal adjustments for your ${formData.hardiness_zone} zone
- Proper spacing for your ${formData.sunlight} conditions`;
}

async function generateAITips(formData: GardenPlanRequest, insights: any[], weatherData: any, climateData: any, usdaData: any) {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIKey) return generateFallbackTips(insights);

  try {
    const prompt = `Generate 8-10 expert gardening tips personalized for:

GARDENER PROFILE:
- Experience: ${formData.experience_level}
- Space: ${formData.spaceType}
- Goals: ${formData.goals}
- Time commitment: ${formData.time_commitment}

GROWING CONDITIONS:
- Zone: ${formData.hardiness_zone}
- Sunlight: ${formData.sunlight}
- Soil: ${formData.soil_type}

COMMUNITY DATA: ${insights.length > 0 ? insights.map(i => `${i.plant_name}: ${i.success_rate}% success`).join(', ') : 'Limited data'}

CURRENT WEATHER: ${weatherData ? `${weatherData.temperature}°C, ${weatherData.conditions}` : 'Not available'}

CLIMATE INTELLIGENCE: ${climateData ? `
Hardiness Zone: ${climateData.hardiness_zone}
Growing Season: ${climateData.frost_dates.last_spring_frost} to ${climateData.frost_dates.first_fall_frost}
Growing Degree Days: ${climateData.growing_degree_days}
Precipitation Pattern: ${climateData.precipitation_data.seasonal_pattern}
Drought Risk: ${climateData.drought_conditions}
Weather Alerts: ${climateData.weather_alerts.length > 0 ? climateData.weather_alerts.join(', ') : 'None'}
` : 'Climate data not available'}

Return as a JSON array of strings: ["tip1", "tip2", ...]

Focus on actionable, specific advice that will help them succeed.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert gardening advisor. Respond with valid JSON array only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) throw new Error('OpenAI API failed');

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid AI response format');
    
  } catch (error) {
    console.error('AI tips error:', error);
    return generateFallbackTips(insights);
  }
}

function generateFallbackTips(insights: any[]) {
  const baseTips = [
    "Start small and expand gradually as you gain experience.",
    "Water early morning to reduce evaporation and prevent diseases.",
    "Add compost regularly for healthy, fertile soil.",
    "Plant companion flowers like marigolds to attract beneficial insects.",
    "Keep a garden journal to track what works best.",
    "Succession plant greens every 2 weeks for continuous harvest."
  ];

  if (insights.length > 0) {
    const highSuccessPlants = insights.filter(i => i.success_rate >= 80);
    if (highSuccessPlants.length > 0) {
      baseTips.unshift(`Community insight: ${highSuccessPlants[0].plant_name} has ${highSuccessPlants[0].success_rate}% success rate in your conditions.`);
    }
  }

  return baseTips;
}

async function generateNotificationSchedule(supabase: any, planId: string, userId: string, plants: any[]) {
  const notifications = [];
  const today = new Date();

  // Generate planting reminders
  for (const plant of plants.slice(0, 3)) { // Limit to first 3 plants
    const plantingDate = new Date(today);
    plantingDate.setDate(today.getDate() + 7); // Next week

    notifications.push({
      garden_plan_id: planId,
      user_id: userId,
      notification_type: 'planting',
      plant_name: plant.name,
      scheduled_date: plantingDate.toISOString().split('T')[0],
      message: `Time to plant your ${plant.name}! Check soil temperature and weather conditions.`
    });

    // Harvest reminder
    const harvestDate = new Date(plantingDate);
    harvestDate.setDate(plantingDate.getDate() + 70); // Approximate harvest time

    notifications.push({
      garden_plan_id: planId,
      user_id: userId,
      notification_type: 'harvest',
      plant_name: plant.name,
      scheduled_date: harvestDate.toISOString().split('T')[0],
      message: `Your ${plant.name} should be ready for harvest! Check for ripeness.`
    });
  }

  if (notifications.length > 0) {
    await supabase.from('garden_notifications').insert(notifications);
  }
}