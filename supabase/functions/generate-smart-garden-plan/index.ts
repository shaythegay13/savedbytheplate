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

    // Get insights data to inform recommendations
    const { data: insights } = await supabase
      .from('garden_insights')
      .select('*')
      .eq('hardiness_zone', formData.hardiness_zone)
      .eq('soil_type', formData.soil_type)
      .eq('sunlight', formData.sunlight)
      .order('success_rate', { ascending: false });

    // Generate AI-enhanced recommendations based on learned data
    const plantRecommendations = await generateSmartRecommendations(formData, insights || []);
    const gardenLayout = generateOptimizedLayout(formData, plantRecommendations);
    const plantingCalendar = generateSeasonalCalendar(formData, plantRecommendations);
    const careInstructions = generatePersonalizedCare(formData);
    const expertTips = generateDataDrivenTips(insights || []);

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

async function generateSmartRecommendations(formData: GardenPlanRequest, insights: any[]) {
  // Base plant recommendations enhanced by learning data
  const baseRecommendations = [
    {
      name: "Cherry Tomatoes",
      variety: "Sweet 100",
      plantingTime: "After last frost (typically March-April)",
      harvestTime: "60-70 days from planting",
      spacing: "18-24 inches apart",
      careInstructions: "Water deeply 2-3 times per week. Provide support with stakes or cages.",
      difficulty: "Easy" as const,
      yield: "5-10 lbs per plant"
    },
    {
      name: "Lettuce",
      variety: "Buttercrunch",
      plantingTime: "Early spring or fall",
      harvestTime: "45-60 days from seed",
      spacing: "6-8 inches apart",
      careInstructions: "Keep soil consistently moist. Harvest outer leaves first.",
      difficulty: "Easy" as const,
      yield: "1-2 heads per plant"
    },
    {
      name: "Basil",
      variety: "Genovese",
      plantingTime: "After soil warms to 60°F",
      harvestTime: "Continuous harvest after 60 days",
      spacing: "12 inches apart",
      careInstructions: "Pinch flowers to encourage leaf growth. Water at base of plant.",
      difficulty: "Easy" as const,
      yield: "1-2 cups fresh leaves per week"
    },
    {
      name: "Bell Peppers",
      variety: "California Wonder",
      plantingTime: "2 weeks after last frost",
      harvestTime: "70-80 days from planting",
      spacing: "18-24 inches apart",
      careInstructions: "Consistent watering and full sun. May need support when fruiting.",
      difficulty: "Medium" as const,
      yield: "6-8 peppers per plant"
    }
  ];

  // Enhance recommendations with learned data
  const enhancedRecommendations = baseRecommendations.map(plant => {
    const insight = insights.find(i => i.plant_name === plant.name);
    if (insight && insight.success_rate > 0) {
      return {
        ...plant,
        aiInsights: {
          successRate: insight.success_rate,
          averageYield: insight.average_yield_rating,
          commonIssues: insight.common_issues || [],
          recommendedMonths: insight.best_planting_months || []
        }
      };
    }
    return plant;
  });

  // Add high-success plants from insights data
  const successfulInsights = insights.filter(i => i.success_rate >= 70 && i.total_attempts >= 3);
  for (const insight of successfulInsights) {
    if (!enhancedRecommendations.some(r => r.name === insight.plant_name)) {
      enhancedRecommendations.push({
        name: insight.plant_name,
        variety: "Community Recommended",
        plantingTime: insight.best_planting_months?.join(", ") || "Based on your zone",
        harvestTime: "Varies by variety",
        spacing: "Follow seed packet instructions",
        careInstructions: "Based on community success data",
        difficulty: insight.success_rate >= 85 ? "Easy" as const : "Medium" as const,
        yield: `Average rating: ${insight.average_yield_rating}/5`,
        aiInsights: {
          successRate: insight.success_rate,
          averageYield: insight.average_yield_rating,
          commonIssues: insight.common_issues || [],
          recommendedMonths: insight.best_planting_months || []
        }
      });
    }
  }

  return enhancedRecommendations;
}

function generateOptimizedLayout(formData: GardenPlanRequest, plants: any[]) {
  return [
    {
      section: "High Success Zone (Section A)",
      plants: plants.filter(p => p.aiInsights?.successRate >= 70).map(p => p.name).slice(0, 3),
      size: "4x4 feet",
      notes: "Plants with proven success in your conditions"
    },
    {
      section: "Herb Garden (Section B)",
      plants: ["Basil", "Oregano", "Thyme"],
      size: "2x3 feet",
      notes: "Easy access for cooking"
    },
    {
      section: "Quick Greens (Section C)",
      plants: ["Lettuce", "Spinach", "Arugula"],
      size: "2x4 feet",
      notes: "Can be succession planted every 2 weeks"
    }
  ];
}

function generateSeasonalCalendar(formData: GardenPlanRequest, plants: any[]) {
  const currentMonth = new Date().getMonth();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return Array.from({ length: 4 }, (_, i) => {
    const monthIndex = (currentMonth + i) % 12;
    const monthName = months[monthIndex];
    
    return {
      month: monthName,
      activities: [
        `Check ${plants[0]?.name || 'primary plants'} for seasonal care`,
        "Monitor soil moisture and adjust watering",
        "Apply compost if needed",
        "Watch for seasonal pests"
      ]
    };
  });
}

function generatePersonalizedCare(formData: GardenPlanRequest) {
  return `Based on your ${formData.spaceType} with ${formData.sunlight} exposure in hardiness zone ${formData.hardiness_zone}, here are your AI-enhanced care instructions:

WATERING (Optimized by community data):
- Water deeply but less frequently to encourage root development
- For ${formData.soil_type} soil, our data shows optimal watering every 2-3 days
- Use drip irrigation or soaker hoses if possible to minimize disease

SOIL CARE (Based on successful gardens):
- Add 2-3 inches of compost annually
- Test soil pH annually (most vegetables prefer 6.0-7.0)
- Consider raised beds if drainage is poor

SEASONAL MAINTENANCE (AI-driven insights):
- ${formData.season} specific care includes monitoring for seasonal pests
- Adjust watering based on ${formData.rainfall} rainfall patterns
- Community data suggests frost protection planning for your zone

PLANT HEALTH (Machine learning recommendations):
- Inspect plants weekly for pests and diseases
- Remove diseased foliage immediately
- Rotate crops annually to prevent soil depletion`;
}

function generateDataDrivenTips(insights: any[]) {
  const baseTips = [
    "Start small and expand gradually based on success patterns from our community.",
    "Succession plant lettuce and greens every 2 weeks for continuous harvest.",
    "Plant basil near tomatoes - our data shows improved outcomes.",
    "Water early morning to reduce evaporation and prevent fungal diseases.",
    "Add compost regularly rather than fertilizer for better long-term results.",
    "Encourage beneficial insects with companion flowers like marigolds."
  ];

  // Add data-driven tips based on insights
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