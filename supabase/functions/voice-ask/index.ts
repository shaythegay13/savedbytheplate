import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple Claude helper using Anthropic API directly
async function askClaude(question: string, cropData: any[] = []) {
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
  
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const systemPrompt = `You are a helpful garden planning assistant with access to:
- 270+ crops with 100+ varieties
- 300+ plant disease database
- Companion planting intelligence
- Environmental/climate data via Google APIs

When answering:
- Provide specific, data-driven advice using the available data
- Include growing conditions, planting times, companion plants, diseases/pests when relevant
- Mention cultural varieties (African, Asian, Latin, Caribbean) when appropriate
- Keep responses conversational, friendly, and concise (2-3 sentences max)
- If you have specific data, use it. If not, provide general guidance.`;

  let userPrompt = question;
  if (cropData.length > 0) {
    userPrompt += `\n\nRelevant crops from database:\n${JSON.stringify(cropData.slice(0, 5), null, 2)}`;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text_question } = await req.json();

    if (!text_question) {
      throw new Error('No question text provided');
    }

    console.log('Question:', text_question);

    // Get crop data from deployed backend
    let cropData = [];
    try {
      const cropsResponse = await fetch('https://agenticaigardenplanner.onrender.com/api/crops', {
        signal: AbortSignal.timeout(2000),
      });
      
      if (cropsResponse.ok) {
        const allCrops = await cropsResponse.json();
        // Simple keyword matching
        const keywords = text_question.toLowerCase().split(' ');
        cropData = allCrops.filter((crop: any) => 
          keywords.some(kw => 
            crop.name?.toLowerCase().includes(kw) ||
            crop.description?.toLowerCase().includes(kw)
          )
        );
      }
    } catch (e) {
      console.warn('Crop fetch timeout, continuing without data');
    }

    // Generate answer with Claude
    const answerText = await askClaude(text_question, cropData);

    console.log('Generated answer');

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
