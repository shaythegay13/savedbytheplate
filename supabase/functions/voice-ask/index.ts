/// <reference lib="dom" />
/// <reference lib="es2021" />

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from "https://esm.sh/@google/genai@latest";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const voiceAskSchema = z.object({
  text_question: z.string()
    .min(1, "Question cannot be empty")
    .max(1000, "Question must be less than 1000 characters"),
  context: z.record(z.unknown()).optional()
});

const BACKEND_API_URL = Deno.env.get('BACKEND_API_URL') || 'https://voiceagentrender.onrender.com';

// ============================================================================
// Helper Functions - Render Backend Integration
// ============================================================================

async function fetchCrops(query: string = ""): Promise<any[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(`${BACKEND_API_URL}/api/crops`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    
    if (response.ok) {
      const data = await response.json();
      const crops = Array.isArray(data) ? data : (Array.isArray(data?.crops) ? data.crops : []);
      
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

async function fetchEnums(): Promise<any> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(`${BACKEND_API_URL}/api/enums`, {
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

// ============================================================================
// Intent Parsing
// ============================================================================

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
  
  const commonCrops = ['tomato', 'pepper', 'lettuce', 'carrot', 'bean', 'cucumber', 'squash', 'kale', 'spinach', 'basil', 'mint', 'cilantro', 'parsley'];
  commonCrops.forEach(crop => {
    if (lowerQ.includes(crop)) {
      intent.mentionedCrops.push(crop);
    }
  });
  
  if (lowerQ.includes('small') || lowerQ.includes('balcony') || lowerQ.includes('container')) {
    intent.size = 'small';
  } else if (lowerQ.includes('medium') || lowerQ.includes('raised bed')) {
    intent.size = 'medium';
  } else if (lowerQ.includes('large') || lowerQ.includes('backyard')) {
    intent.size = 'large';
  }
  
  if (lowerQ.includes('full sun') || lowerQ.includes('sunny')) {
    intent.sunlight = 'full_sun';
  } else if (lowerQ.includes('partial') || lowerQ.includes('part shade')) {
    intent.sunlight = 'partial_shade';
  } else if (lowerQ.includes('shade') || lowerQ.includes('shady')) {
    intent.sunlight = 'full_shade';
  }
  
  if (lowerQ.includes('beginner') || lowerQ.includes('new to') || lowerQ.includes('first time')) {
    intent.experience = 'beginner';
  } else if (lowerQ.includes('experienced') || lowerQ.includes('advanced')) {
    intent.experience = 'advanced';
  }
  
  return intent;
}

// ============================================================================
// Jane's System Prompt - Reusable for future Live API integration
// ============================================================================

function buildJaneSystemPrompt(dataContext: string): string {
  return `You are Jane, a friendly and knowledgeable garden planning assistant for Saved By The Plate, a community-focused urban gardening platform in NYC.

Your personality:
- Warm, encouraging, and approachable
- Passionate about helping people grow their own food
- Especially supportive of teens and beginners
- Uses simple language, avoids jargon

CRITICAL - OUTPUT RULES (STRICT):
- Do NOT reveal your internal reasoning, planning, scratch work, or analysis.
- Do NOT narrate tool usage, data fetching, or system behavior.
- Do NOT include headings like "Defining the Query Scope" or "Re-evaluating Tool Response".
- Only output the final, user-facing answer.

**SPEECH OUTPUT FORMATTING (CRITICAL FOR TTS):**
Your response will be read aloud by text-to-speech. Format for natural speech:
- Use short, clear sentences (1-2 lines each).
- Separate main ideas with paragraph breaks (blank lines) - these become natural pauses.
- Use simple vocabulary and avoid technical jargon.
- Spell out acronyms (e.g., "NPK" → "N-P-K" or "nitrogen, phosphorus, and potassium").
- Use natural punctuation (periods, commas, exclamation marks) for proper pacing.
- Avoid parenthetical asides - rewrite them as separate sentences.
- Don't use bullet points or lists - write as flowing prose.

Example of good speech formatting:
"Plant tomatoes in full sun. They need six to eight hours of direct sunlight daily.

Water deeply when the soil feels dry. Morning watering is best because it helps prevent disease."

You help people plan their gardens with practical advice about:
- What to plant based on their climate, space, and season
- Spacing and companion planting
- Container and raised bed gardening
- Watering and care tips
- Pest management and organic methods

Keep responses conversational, helpful, and concise (2-3 short paragraphs max).
When users ask about specific plants, provide planting tips, spacing, and care instructions.
For NYC gardeners, consider the local growing season (Zone 7a/7b).
${dataContext}`;
}

// ============================================================================
// Gemini API Integration
// ============================================================================

async function callGeminiAPI(systemPrompt: string, userQuestion: string): Promise<string> {
  const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY');
  
  if (!GOOGLE_AI_API_KEY) {
    throw new Error('GOOGLE_AI_API_KEY not configured');
  }

  const ai = new GoogleGenAI({ apiKey: GOOGLE_AI_API_KEY });

  console.log('Calling Gemini API with model: gemini-2.5-flash');

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userQuestion,
    config: {
      systemInstruction: systemPrompt,
    },
  });

  const text = (result as any)?.text as string | undefined;

  if (!text) {
    throw new Error('Empty response from Gemini API');
  }

  return text;
}

// ============================================================================
// TODO: Future Live API Integration
// ============================================================================
/*
 * To upgrade to real-time voice with Gemini Live API:
 * 
 * 1. Import LiveClient:
 *    import { GoogleGenerativeAI, LiveClient } from "https://esm.sh/@google/genai@latest";
 * 
 * 2. Create a separate edge function (e.g., voice-ask-live) that:
 *    - Handles WebSocket upgrade
 *    - Creates a LiveClient session:
 *      
 *      const client = new LiveClient({
 *        model: "gemini-2.5-flash-native-audio-preview-12-2025",
 *        config: {
 *          responseModalities: ["AUDIO", "TEXT"],
 *          systemInstruction: buildJaneSystemPrompt(dataContext),
 *        },
 *      });
 * 
 * 3. Message protocol:
 *    - Receive: { type: "text", text: string } or { type: "audio", chunk: base64 }
 *    - Send: { type: "assistant_text", text: string } or { type: "assistant_audio", chunk: base64 }
 * 
 * 4. Audio specs:
 *    - Input: 16kHz, 16-bit PCM, mono
 *    - Output: 24kHz, 16-bit PCM, mono
 * 
 * 5. Or use ephemeral tokens for client-direct Live connection
 */

// ============================================================================
// Main Handler
// ============================================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json();
    
    // Validate input
    const validationResult = voiceAskSchema.safeParse(rawBody);
    if (!validationResult.success) {
      const errors = (validationResult as { success: false; error: z.ZodError }).error.errors.map(e => e.message).join(', ');
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { text_question, context } = validationResult.data;

    console.log('Voice question received:', text_question.slice(0, 100));

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
      dataContext += `\n\nAvailable options:\n- Growing methods: ${enumData.methods?.join(', ') || 'container, raised bed, in-ground'}\n- Sunlight: ${enumData.sunlight?.join(', ') || 'full sun, partial shade, full shade'}\n- Experience levels: ${enumData.experience?.join(', ') || 'beginner, intermediate, advanced'}`;
    }

    // Build system prompt
    const systemPrompt = buildJaneSystemPrompt(dataContext);

    // Call Gemini API directly
    const answerText = await callGeminiAPI(systemPrompt, text_question);

    console.log('Answer generated successfully via Gemini API');

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

  } catch (error: unknown) {
    console.error('Error in voice-ask function:', error);

    const err = error instanceof Error ? error : new Error(String(error));
    const details = err.message;

    // Handle specific error types
    let statusCode = 500;
    let errorMessage = 'Internal server error';

    const lower = details.toLowerCase();
    if (
      lower.includes('rate limit') ||
      lower.includes('quota') ||
      lower.includes('resource_exhausted') ||
      lower.includes('429')
    ) {
      statusCode = 429;
      errorMessage = 'Rate limit exceeded. Please try again in a moment.';
    } else if (lower.includes('api key') || lower.includes('permission') || lower.includes('unauthorized') || lower.includes('forbidden')) {
      statusCode = 401;
      errorMessage = 'AI API key is invalid or not authorized for this model.';
    } else if (lower.includes('not found') || lower.includes('model')) {
      statusCode = 400;
      errorMessage = 'AI model is unavailable or not enabled for this project.';
    }

    return new Response(
      JSON.stringify({ error: errorMessage, details }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
