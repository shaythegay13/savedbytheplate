import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text_question, context } = await req.json();
    
    if (!text_question) {
      throw new Error('No question provided');
    }

    console.log('Question:', text_question);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Fetch crop data with timeout
    let cropData: any[] = [];
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      
      const cropResponse = await fetch('https://agenticaigardenplanner.onrender.com/api/crops', {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      
      if (cropResponse.ok) {
        const jsonData = await cropResponse.json();
        // Ensure cropData is always an array
        cropData = Array.isArray(jsonData) ? jsonData : [];
      }
    } catch (e) {
      console.warn('Crop fetch timeout, continuing without data');
      cropData = [];
    }

    // Filter relevant crops based on question keywords
    const keywords = text_question.toLowerCase().split(' ');
    const relevantCrops = cropData.filter((crop: any) => 
      keywords.some((keyword: string) => 
        crop.name?.toLowerCase().includes(keyword) ||
        crop.category?.toLowerCase().includes(keyword)
      )
    ).slice(0, 5);

    // Build system prompt
    const systemPrompt = `You are a friendly, knowledgeable garden planning assistant. 
You help people plan their gardens with practical advice about:
- What to plant based on their climate and season
- Spacing and companion planting
- Watering and care tips
- Pest management

Keep responses conversational, helpful, and concise (2-3 paragraphs max).
${relevantCrops.length > 0 ? `\nRelevant crop data: ${JSON.stringify(relevantCrops)}` : ''}`;

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
    const answerText = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    console.log('Answer generated successfully');

    return new Response(
      JSON.stringify({
        transcript: text_question,
        answer_text: answerText,
        garden_plan: null,
      }),
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
