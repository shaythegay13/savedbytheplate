import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RENDER_BACKEND_URL = 'https://agenticaigardenplanner.onrender.com';

// Fetch crop data from Render backend
async function fetchCrops(query: string = ""): Promise<any[]> {
  try {
    const controller = new AbortController();
    // Increased timeout to 15s to handle Render cold starts
    const timeout = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(`${RENDER_BACKEND_URL}/api/crops`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    
    if (response.ok) {
      const data = await response.json();
      const crops = Array.isArray(data) ? data : [];
      
      // Filter by query if provided
      if (query) {
        const keywords = query.toLowerCase().split(' ');
        return crops.filter((crop: any) => 
          keywords.some((keyword: string) => 
            crop.name?.toLowerCase().includes(keyword) ||
            crop.category?.toLowerCase().includes(keyword) ||
            crop.description?.toLowerCase().includes(keyword)
          )
        ).slice(0, 10);
      }
      return crops.slice(0, 20);
    }
    return [];
  } catch (e) {
    console.warn('Crop fetch error:', e);
    return [];
  }
}

// Fetch enum data from Render backend
async function fetchEnums(): Promise<any> {
  try {
    const controller = new AbortController();
    // Increased timeout to 15s to handle Render cold starts
    const timeout = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(`${RENDER_BACKEND_URL}/api/enums`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (e) {
    console.warn('Enums fetch error:', e);
    return null;
  }
}

// Generate garden plan from Render backend
async function generateGardenPlan(planData: any): Promise<any> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(`${RENDER_BACKEND_URL}/api/v1/garden-plan/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planData),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    
    if (response.ok) {
      return await response.json();
    }
    console.error('Garden plan generation failed:', response.status);
    return null;
  } catch (e) {
    console.warn('Garden plan generation error:', e);
    return null;
  }
}

// Parse user question to extract garden planning intent
function parseGardenIntent(question: string): any {
  const lowerQ = question.toLowerCase();
  
  const intent: any = {
    wantsGardenPlan: lowerQ.includes('plan') || lowerQ.includes('garden') || lowerQ.includes('grow'),
    wantsCropInfo: lowerQ.includes('crop') || lowerQ.includes('plant') || lowerQ.includes('vegetable') || lowerQ.includes('fruit'),
    mentionedCrops: [],
    size: null,
    sunlight: null,
    experience: null,
  };
  
  // Extract mentioned crops
  const commonCrops = ['tomato', 'pepper', 'lettuce', 'carrot', 'bean', 'cucumber', 'squash', 'kale', 'spinach', 'basil', 'mint', 'cilantro', 'parsley'];
  commonCrops.forEach(crop => {
    if (lowerQ.includes(crop)) {
      intent.mentionedCrops.push(crop);
    }
  });
  
  // Extract size
  if (lowerQ.includes('small') || lowerQ.includes('balcony') || lowerQ.includes('container')) {
    intent.size = 'small';
  } else if (lowerQ.includes('medium') || lowerQ.includes('raised bed')) {
    intent.size = 'medium';
  } else if (lowerQ.includes('large') || lowerQ.includes('backyard')) {
    intent.size = 'large';
  }
  
  // Extract sunlight
  if (lowerQ.includes('full sun') || lowerQ.includes('sunny')) {
    intent.sunlight = 'full_sun';
  } else if (lowerQ.includes('partial') || lowerQ.includes('part shade')) {
    intent.sunlight = 'partial_shade';
  } else if (lowerQ.includes('shade') || lowerQ.includes('shady')) {
    intent.sunlight = 'full_shade';
  }
  
  // Extract experience
  if (lowerQ.includes('beginner') || lowerQ.includes('new to') || lowerQ.includes('first time')) {
    intent.experience = 'beginner';
  } else if (lowerQ.includes('experienced') || lowerQ.includes('advanced')) {
    intent.experience = 'advanced';
  }
  
  return intent;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text_question, context } = await req.json();
    
    if (!text_question) {
      throw new Error('No question provided');
    }

    console.log('Voice question received:', text_question);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Parse intent from question
    const intent = parseGardenIntent(text_question);
    console.log('Parsed intent:', intent);

    // Fetch relevant data from Render backend in parallel
    const [cropData, enumData] = await Promise.all([
      fetchCrops(text_question),
      fetchEnums(),
    ]);

    console.log(`Fetched ${cropData.length} crops, enums: ${enumData ? 'yes' : 'no'}`);

    // Build context for AI
    let dataContext = '';
    
    if (cropData.length > 0) {
      dataContext += `\n\nRelevant crops from database:\n${JSON.stringify(cropData.slice(0, 5), null, 2)}`;
    }
    
    if (enumData) {
      dataContext += `\n\nAvailable options:\n- Growing methods: ${enumData.growing_methods?.join(', ') || 'container, raised bed, in-ground'}\n- Sunlight: ${enumData.sunlight_options?.join(', ') || 'full sun, partial shade, full shade'}\n- Experience levels: ${enumData.experience_levels?.join(', ') || 'beginner, intermediate, advanced'}`;
    }

    // Build system prompt
    const systemPrompt = `You are a friendly, knowledgeable garden planning assistant for Saved By The Plate, a community-focused urban gardening platform in NYC.

You help people plan their gardens with practical advice about:
- What to plant based on their climate, space, and season
- Spacing and companion planting
- Container and raised bed gardening
- Watering and care tips
- Pest management and organic methods

Keep responses conversational, helpful, and concise (2-3 paragraphs max).
When users ask about specific plants, provide planting tips, spacing, and care instructions.
For NYC gardeners, consider the local growing season (Zone 7a/7b).
${dataContext}`;

    // Use Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text_question }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (response.status === 402) {
        throw new Error('AI service quota exceeded. Please try again later.');
      }
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const answerText = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try asking again.";

    console.log('Answer generated successfully');

    // Prepare response with relevant crop data
    const responseData: any = {
      transcript: text_question,
      answer_text: answerText,
      garden_plan: null,
      relevant_crops: cropData.slice(0, 5),
      intent: intent,
    };

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in voice-ask function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});