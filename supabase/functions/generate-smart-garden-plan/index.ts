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
  hardiness_zone: string;
  soil_type: string;
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

    // Get weather data for location-based recommendations
    let weatherData = null;
    if (formData.latitude && formData.longitude) {
      weatherData = await getWeatherData(formData.latitude, formData.longitude);
    }

    // Get insights data to inform recommendations
    const { data: insights } = await supabase
      .from('garden_insights')
      .select('*')
      .eq('hardiness_zone', formData.hardiness_zone)
      .eq('soil_type', formData.soil_type)
      .eq('sunlight', formData.sunlight)
      .order('success_rate', { ascending: false });

    // Generate AI-enhanced recommendations with real AI
    const plantRecommendations = await generateAIRecommendations(formData, insights || [], weatherData);
    const gardenLayout = await generateAILayout(formData, plantRecommendations, weatherData);
    const plantingCalendar = await generateAICalendar(formData, plantRecommendations, weatherData);
    const careInstructions = await generateAICareInstructions(formData, weatherData);
    const expertTips = await generateAITips(formData, insights || [], weatherData);

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
          hardiness_zone: formData.hardiness_zone,
          soil_type: formData.soil_type,
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

async function generateAIRecommendations(formData: GardenPlanRequest, insights: any[], weatherData: any) {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIKey) {
    return generateFallbackRecommendations(formData, insights);
  }

  try {
    const prompt = `You are an expert gardener and agricultural advisor. Generate a personalized plant recommendation list based on the following information:

GARDEN DETAILS:
- Space: ${formData.spaceType} (${formData.spaceSize})
- Sunlight: ${formData.sunlight}
- Hardiness Zone: ${formData.hardiness_zone}
- Soil: ${formData.soil_type}
- Experience: ${formData.experience_level}
- Time commitment: ${formData.time_commitment}
- Season: ${formData.season}
- Goals: ${formData.goals}
- Preferred plants: ${formData.preferred_plants}

CURRENT WEATHER (if available):
${weatherData ? `Temperature: ${weatherData.temperature}°C, Humidity: ${weatherData.humidity}%, Conditions: ${weatherData.conditions}` : 'Not available'}

COMMUNITY SUCCESS DATA:
${insights.length > 0 ? insights.map(i => `${i.plant_name}: ${i.success_rate}% success rate, ${i.total_attempts} attempts`).join('\n') : 'No community data available'}

Please provide 6-8 plant recommendations in this exact JSON format:
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

Focus on plants that will thrive in their specific conditions and match their experience level.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
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
      whyRecommended: "Great for beginners and small spaces"
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
      whyRecommended: "Quick growing and easy to manage"
    }
  ];

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

async function generateAILayout(formData: GardenPlanRequest, plants: any[], weatherData: any) {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIKey) return generateFallbackLayout(formData, plants);

  try {
    const prompt = `Create an optimized garden layout based on:

SPACE: ${formData.spaceType} (${formData.spaceSize})
SUNLIGHT: ${formData.sunlight}
EXPERIENCE: ${formData.experience_level}

PLANTS TO ARRANGE: ${plants.map(p => p.name).join(', ')}

WEATHER CONDITIONS: ${weatherData ? `${weatherData.temperature}°C, ${weatherData.conditions}` : 'Not available'}

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
        model: 'gpt-4.1-2025-04-14',
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

async function generateAICalendar(formData: GardenPlanRequest, plants: any[], weatherData: any) {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIKey) return generateFallbackCalendar(formData, plants);

  try {
    const prompt = `Create a month-by-month gardening calendar for:

LOCATION: Hardiness Zone ${formData.hardiness_zone}
SEASON FOCUS: ${formData.season}
PLANTS: ${plants.map(p => p.name).join(', ')}
CURRENT WEATHER: ${weatherData ? `${weatherData.temperature}°C, ${weatherData.conditions}` : 'Not available'}

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
        model: 'gpt-4.1-2025-04-14',
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

async function generateAICareInstructions(formData: GardenPlanRequest, weatherData: any) {
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

Provide comprehensive care instructions covering watering, soil care, seasonal maintenance, and plant health. Make it specific to their conditions and experience level. Return as plain text (not JSON).`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
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

async function generateAITips(formData: GardenPlanRequest, insights: any[], weatherData: any) {
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

Return as a JSON array of strings: ["tip1", "tip2", ...]

Focus on actionable, specific advice that will help them succeed.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
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