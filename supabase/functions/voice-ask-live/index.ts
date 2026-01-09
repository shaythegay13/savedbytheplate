/// <reference lib="dom" />
/// <reference lib="es2021" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Modality, Type, StartSensitivity, EndSensitivity } from "https://esm.sh/@google/genai@latest";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

declare const Deno: any;

// Rate limit constants
const DAILY_LIMIT = 15;
const WINDOW_HOURS = 24;

// ============================================================================
// Rate Limiting Functions
// ============================================================================

async function checkRateLimit(identifier: string, identifierType: 'ip' | 'user'): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const windowStart = new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000);
  
  // Check existing rate limit entry
  const { data: existing } = await supabase
    .from('jane_voice_rate_limits')
    .select('*')
    .eq('identifier', identifier)
    .eq('identifier_type', identifierType)
    .gte('window_start', windowStart.toISOString())
    .maybeSingle();
  
  if (existing) {
    // Entry exists and is within window
    if (existing.call_count >= DAILY_LIMIT) {
      const resetAt = new Date(new Date(existing.window_start).getTime() + WINDOW_HOURS * 60 * 60 * 1000);
      return { allowed: false, remaining: 0, resetAt };
    }
    
    // Increment count
    await supabase
      .from('jane_voice_rate_limits')
      .update({ 
        call_count: existing.call_count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id);
    
    const resetAt = new Date(new Date(existing.window_start).getTime() + WINDOW_HOURS * 60 * 60 * 1000);
    return { allowed: true, remaining: DAILY_LIMIT - existing.call_count - 1, resetAt };
  }
  
  // No entry or expired - create new
  // First, delete any old entries for this identifier
  await supabase
    .from('jane_voice_rate_limits')
    .delete()
    .eq('identifier', identifier)
    .eq('identifier_type', identifierType);
  
  // Insert new entry
  await supabase
    .from('jane_voice_rate_limits')
    .insert({
      identifier,
      identifier_type: identifierType,
      call_count: 1,
      window_start: new Date().toISOString()
    });
  
  const resetAt = new Date(Date.now() + WINDOW_HOURS * 60 * 60 * 1000);
  return { allowed: true, remaining: DAILY_LIMIT - 1, resetAt };
}

function getClientIP(req: Request): string {
  // Check various headers for client IP
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  const cfIP = req.headers.get('cf-connecting-ip');
  if (cfIP) {
    return cfIP;
  }
  return 'unknown';
}

function getUserIdFromAuth(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  try {
    const token = authHeader.substring(7);
    // Decode JWT payload (base64url)
    const payloadPart = token.split('.')[1];
    const payload = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));
    return payload.sub || null;
  } catch {
    return null;
  }
}

// ============================================================================
// Backend API Configuration (Gardening Knowledge Base)
// ============================================================================

const BACKEND_API_URL = Deno.env.get('BACKEND_API_URL') || 'https://voiceagentrender.onrender.com';

// ============================================================================
// Tool Definitions for Gemini Function Calling
// ============================================================================

const gardeningTools: Array<{
  name: string;
  description: string;
  parameters: {
    type: typeof Type.OBJECT;
    properties: Record<string, { type: typeof Type.STRING; description: string; enum?: string[] }>;
    required: string[];
  };
}> = [
  {
    name: "getPlantInfo",
    description: "Get detailed information about a specific plant including growing requirements, care tips, and NYC-specific advice. Use this when a user asks about how to grow a plant, what conditions it needs, or general plant information.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        plantName: {
          type: Type.STRING,
          description: "The common name of the plant (e.g., 'tomato', 'basil', 'lettuce')"
        },
        infoType: {
          type: Type.STRING,
          enum: ["general", "growing", "care", "harvest", "problems"],
          description: "What type of information to retrieve"
        }
      },
      required: ["plantName"]
    }
  },
  {
    name: "getCompanionPlants",
    description: "Find companion plants that grow well together and plants to avoid planting together. Use this when a user asks what to plant next to something, or about companion planting.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        plantName: {
          type: Type.STRING,
          description: "The plant to find companions for"
        }
      },
      required: ["plantName"]
    }
  },
  {
    name: "getDiseaseInfo",
    description: "Get information about plant diseases, pests, and organic treatment options. Use this when a user describes plant problems, yellow leaves, spots, bugs, or asks about pest control.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: "Description of the disease, pest, or symptom (e.g., 'yellow leaves on tomato', 'aphids', 'powdery mildew')"
        },
        plantName: {
          type: Type.STRING,
          description: "The affected plant, if known"
        }
      },
      required: ["query"]
    }
  },
  {
    name: "getPlantingCalendar",
    description: "Get NYC-specific planting dates and seasonal recommendations. Use this when a user asks when to plant something or what to plant this month.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        month: {
          type: Type.STRING,
          description: "The month to get recommendations for (e.g., 'April', 'now' for current month)"
        },
        plantName: {
          type: Type.STRING,
          description: "Specific plant to check planting dates for, if any"
        }
      },
      required: []
    }
  }
  ,
  {
    name: "getSoilAdvice",
    description: "Get soil, compost, fertilizing, and pH advice for a plant or general garden soil questions.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        plantName: {
          type: Type.STRING,
          description: "Optional plant name to tailor soil advice (e.g., 'tomato')"
        },
        query: {
          type: Type.STRING,
          description: "Optional user question/context (e.g., 'container soil mix', 'how much compost', 'pH for tomatoes')"
        }
      },
      required: []
    }
  },
  {
    name: "getClimateAdvice",
    description: "Get location-specific climate and timing context (USDA zone, frost dates, heat/drought notes). Use this when weather, frost, zone, or climate affects the answer.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        location: {
          type: Type.STRING,
          description: "User location like city/state, neighborhood, or ZIP (if known)"
        },
        query: {
          type: Type.STRING,
          description: "Optional question context (e.g., 'last frost', 'heat wave', 'drought')"
        }
      },
      required: []
    }
  },
  {
    name: "getSpacingLayout",
    description: "Get spacing and layout guidance for a specific plant and bed/container size.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        plantName: {
          type: Type.STRING,
          description: "Plant name (e.g., 'tomato', 'basil')"
        },
        bedSize: {
          type: Type.STRING,
          description: "Optional bed/container size (e.g., '2x4 raised bed', '10 gallon pot')"
        }
      },
      required: ["plantName"]
    }
  },
  {
    name: "getVarietyRecommendations",
    description: "Recommend varieties/cultivars for a plant based on goals like container growing, flavor, disease resistance, or season length.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        plantName: {
          type: Type.STRING,
          description: "Plant name (e.g., 'tomato')"
        },
        preferences: {
          type: Type.STRING,
          description: "Optional preferences (e.g., 'container', 'heirloom', 'early', 'high yield')"
        }
      },
      required: ["plantName"]
    }
  }
];

// ============================================================================
// Tool Execution - Calls Render API via /api/conversation endpoint
// ============================================================================

async function executeToolCall(
  toolName: string,
  args: Record<string, any>,
  userQuestion?: string,
  userContext?: Record<string, any>
): Promise<string> {
  console.log(`Executing tool: ${toolName}`, JSON.stringify(args));
  
  try {
    // Build a natural language query for the Render conversation API
    let message = '';

    switch (toolName) {
      case 'getPlantInfo':
        message = args.infoType 
          ? `Tell me about ${args.infoType} information for ${args.plantName}.`
          : `Tell me about growing ${args.plantName}. Include care tips, spacing, and growing requirements.`;
        break;
        
      case 'getCompanionPlants':
        message = `What are good companion plants for ${args.plantName}? Also tell me what plants to avoid planting near it.`;
        break;
        
      case 'getDiseaseInfo':
        message = args.plantName
          ? `My ${args.plantName} has ${args.query}. What could be causing this and how can I treat it organically?`
          : `How do I deal with ${args.query} in my garden? What organic treatments work best?`;
        break;
        
      case 'getPlantingCalendar':
        if (args.plantName && args.month) {
          message = `When should I plant ${args.plantName}? Is ${args.month} a good time?`;
        } else if (args.plantName) {
          message = `What is the best time to plant ${args.plantName}?`;
        } else if (args.month) {
          message = `What vegetables and herbs should I plant in ${args.month}?`;
        } else {
          message = `What should I plant right now? Give me seasonal recommendations.`;
        }
        break;

      case 'getSoilAdvice':
        if (args.plantName && args.query) {
          message = `Soil question for ${args.plantName}: ${args.query}`;
        } else if (args.plantName) {
          message = `What soil, compost, and fertilizing basics should I follow for ${args.plantName}?`;
        } else if (args.query) {
          message = `Soil question: ${args.query}`;
        } else {
          message = `Give general soil and compost advice for a home garden.`;
        }
        break;

      case 'getClimateAdvice':
        if (args.location && args.query) {
          message = `Climate question for ${args.location}: ${args.query}`;
        } else if (args.location) {
          message = `What is the climate/growing season like in ${args.location} (zone and frost dates)?`;
        } else if (args.query) {
          message = `Climate question: ${args.query}`;
        } else {
          message = `Climate and frost-date guidance for gardening.`;
        }
        break;

      case 'getSpacingLayout':
        message = args.bedSize
          ? `How should I space ${args.plantName} in a ${args.bedSize}?`
          : `How far apart should I plant ${args.plantName}?`;
        break;

      case 'getVarietyRecommendations':
        message = args.preferences
          ? `Recommend ${args.plantName} varieties. Preferences: ${args.preferences}`
          : `Recommend good ${args.plantName} varieties.`;
        break;
        
      default:
        return JSON.stringify({ error: `Unknown tool: ${toolName}` });
    }

    const url = `${BACKEND_API_URL}/api/conversation`;
    const finalMessage = (userQuestion && String(userQuestion).trim()) ? String(userQuestion).trim() : message;
    const context = {
      ...(userContext || {}),
      tool: {
        name: toolName,
        args: args || {}
      }
    };
    console.log(`Calling Backend API: ${url} with message: ${finalMessage}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: finalMessage, context })
    });

    if (!response.ok) {
      console.error(`Render API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error body: ${errorText}`);
      return JSON.stringify({
        error: "Could not fetch from knowledge base",
        fallback: true,
        suggestion: "I couldn't access my plant database right now, but I can share general knowledge."
      });
    }

    const data = await response.json();
    console.log(`Tool result for ${toolName}:`, JSON.stringify(data).slice(0, 300));
    
    // Extract the response text from the conversation API
    return JSON.stringify({
      tool: toolName,
      query: finalMessage,
      answer: data.response || data.answer || JSON.stringify(data),
      garden_plan: data.garden_plan || null
    });

  } catch (error: unknown) {
    console.error(`Tool execution error for ${toolName}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return JSON.stringify({
      error: errorMessage,
      fallback: true,
      suggestion: "I'm having trouble accessing my plant database, but I can help with general advice."
    });
  }
}

// ============================================================================
// Jane's System Prompt for Live Voice Interaction
// ============================================================================

const JANE_SYSTEM_PROMPT = `You are Jane, an expert gardening assistant.
d knowledgeable garden planning assistant for Saved By The Plate, a community-focused urban gardening platform in NYC.

Your personality:
- Warm, encouraging, and approachable like a supportive mentor
- Passionate about helping people grow their own food
- Especially supportive of teens and beginners who are new to gardening
- Uses simple, conversational language - avoid jargon

You help people with:
- What to plant based on their space, sunlight, and experience level
- Practical tips for container and raised bed gardening
- Companion planting and spacing advice
- Watering, care, and organic pest management
- Location-aware growing advice. If timing/climate matters, ask for their city/state, neighborhood, or ZIP.

CRITICAL - OUTPUT RULES (STRICT):
- Do NOT reveal your internal reasoning, planning, scratch work, or analysis.
- Do NOT narrate tool usage (do not mention tools, function names, "tool calls", "query scope", or what you are about to do).
- Do NOT include headings like "Defining the Query Scope" or "Re-evaluating Tool Response".
- Only say the final, user-facing answer.

CRITICAL - TOOL USAGE REQUIRED:
You MUST use the provided tools for ANY plant-related questions. Do NOT answer from your general knowledge without first calling the appropriate tool.

MANDATORY tool usage rules:
1. getPlantInfo - ALWAYS call this when asked about ANY specific plant (tomatoes, basil, lettuce, peppers, etc.). This gives you accurate NYC-specific growing info.
2. getCompanionPlants - ALWAYS call this when asked "what should I plant next to X" or "companion plants" or "what grows well with X"
3. getDiseaseInfo - ALWAYS call this when someone mentions yellowing leaves, pests, spots, wilting, or any plant problem
4. getPlantingCalendar - ALWAYS call this when asked "when should I plant", "what to plant now", or timing questions
5. getSoilAdvice - ALWAYS call this for soil/compost/fertilizer/pH questions
6. getClimateAdvice - ALWAYS call this when weather, frost dates, drought, heat, or USDA zone affects the answer
7. getSpacingLayout - ALWAYS call this for spacing/layout/"how far apart" questions
8. getVarietyRecommendations - ALWAYS call this for variety/cultivar/heirloom/recommendation questions

After calling a tool, use the response data to inform your spoken answer. If a tool fails, acknowledge it briefly and offer general guidance.

Voice interaction style:
- Keep responses SHORT and conversational (1-2 sentences per thought)
- Speak naturally as if having a friendly chat
- Ask follow-up questions to understand their situation
- Be encouraging and celebrate small wins`;

const WORD_SEGMENTATION_VOCAB = new Set(
  [
    'a','about','above','across','after','again','against','all','also','always','am','an','and','another','any','are','around','as','at',
    'away','basil','be','because','before','beginner','beginners','best','better','but','by','calendar','can','choice','choices','classic','climate',
    'companion','companions','companionplanting','container','containers','could','day','days','deter','deterpests','disease','do','does','doable','done',
    'down','easy','enough','especially','every','fantastic','favor','flavor','for','from','frost','garden','gardening','get','good','great','grow','growing',
    'had','has','have','help','helpful','here','how','i','if','important','improve','in','indoors','into','is','it','its','key','keep','keeping','last','lettuce',
    'like','look','make','makes','marigold','marigolds','may','me','mix','mother','much','near','nearby','need','now','of','off','often','on','once','options','or',
    'out','over','parsley','partner','pests','perfect','plant','planting','plenty','pots','protect','question','raise','raised','really','right','room','said','seedling',
    'seedlings','shade','should','since','sky','soil','some','spacing','start','state','such','sunlight','super','sure','that','thats','the','them','there','these','this',
    'those','time','timing','to','today','tomato','tomatoes','totally','trade','try','until','up','use','varieties','variety','want','way','we','well','when','which','will',
    'with','without','work','works','would','you','your'
  ].map((w) => w.toLowerCase())
);

function segmentGluedToken(token: string): string {
  const raw = token;
  const lower = token.toLowerCase();
  const n = lower.length;
  if (n < 12) return raw;
  if (!/^[a-z]+$/i.test(raw)) return raw;

  const maxWordLen = 20;
  const dpScore = new Array<number>(n + 1).fill(-Infinity);
  const dpNext = new Array<number>(n + 1).fill(-1);
  dpScore[n] = 0;

  for (let i = n - 1; i >= 0; i--) {
    let bestScore = -Infinity;
    let bestJ = i + 1;

    for (let j = i + 1; j <= Math.min(n, i + maxWordLen); j++) {
      const part = lower.slice(i, j);
      const isKnown = WORD_SEGMENTATION_VOCAB.has(part);
      const partScore = isKnown ? part.length * part.length : -2;
      const total = partScore + dpScore[j];
      if (total > bestScore) {
        bestScore = total;
        bestJ = j;
      }
    }

    dpScore[i] = bestScore;
    dpNext[i] = bestJ;
  }

  const pieces: string[] = [];
  let i = 0;
  while (i < n && dpNext[i] > i) {
    const j = dpNext[i];
    pieces.push(raw.slice(i, j));
    i = j;
  }

  if (pieces.length <= 1) return raw;
  const knownCount = pieces.reduce((sum, p) => sum + (WORD_SEGMENTATION_VOCAB.has(p.toLowerCase()) ? 1 : 0), 0);
  if (knownCount / pieces.length < 0.6) return raw;
  return pieces.join(' ');
}

function sanitizeAssistantText(text: string): string {
  let out = String(text || '');

  // Remove common meta-reasoning section headers if they appear.
  out = out.replace(/\*\*\s*Defining the Query Scope\s*\*\*[\s\S]*?(?=\*\*|$)/gi, '');
  out = out.replace(/\*\*\s*Re-evaluating Tool Response\s*\*\*[\s\S]*?(?=\*\*|$)/gi, '');
  out = out.replace(/\*\*\s*Formulating User Interaction\s*\*\*[\s\S]*?(?=\*\*|$)/gi, '');

  // Additional meta-reasoning headers observed in Gemini Live output.
  out = out.replace(/\*\*\s*Assessing[\s\S]*?\*\*[\s\S]*?(?=\*\*|$)/gi, '');
  out = out.replace(/\*\*\s*Formulating[\s\S]*?\*\*[\s\S]*?(?=\*\*|$)/gi, '');
  out = out.replace(/\*\*\s*Answering[\s\S]*?\*\*/gi, '');
  out = out.replace(/\bAnswering\s+the\s+Query\b/gi, '');

  // Even broader meta headers we don't want shown to users.
  out = out.replace(/\*\*\s*Analyzing[\s\S]*?\*\*[\s\S]*?(?=\*\*|$)/gi, '');
  out = out.replace(/\*\*\s*Prioritizing[\s\S]*?\*\*[\s\S]*?(?=\*\*|$)/gi, '');
  out = out.replace(/\*\*\s*Addressing[\s\S]*?\*\*[\s\S]*?(?=\*\*|$)/gi, '');
  out = out.replace(/\*\*\s*Refining[\s\S]*?\*\*[\s\S]*?(?=\*\*|$)/gi, '');
  out = out.replace(/\*\*\s*Adjusting[\s\S]*?\*\*[\s\S]*?(?=\*\*|$)/gi, '');
  out = out.replace(/\*\*\s*Rethinking[\s\S]*?\*\*[\s\S]*?(?=\*\*|$)/gi, '');
  out = out.replace(/\*\*\s*Re-?Evaluating[\s\S]*?\*\*[\s\S]*?(?=\*\*|$)/gi, '');

  // Remove common planning/narration sentences that sometimes leak into text output.
  // (We only want the user-facing answer.)
  out = out.replace(/\bI(?:'|’)ve\s+determined\b[\s\S]*?(?=(\n\n|$))/gi, '');
  out = out.replace(/\bMy\s+focus\s+has\s+shifted\b[\s\S]*?(?=(\n\n|$))/gi, '');
  out = out.replace(/\bI\s+now\s+plan\b[\s\S]*?(?=(\n\n|$))/gi, '');
  out = out.replace(/\bI\s+am\s+now\s+formulating\b[\s\S]*?(?=(\n\n|$))/gi, '');

  // Remove common tool-failure preambles; keep the helpful advice that follows.
  out = out.replace(/\bOh\s+wow\s*,?\s*I\s*(?:am|'m)\s+running\s+into\s+some\s+trouble[\s\S]*?(?=\bBut\b)/gi, '');
  out = out.replace(/\bI\s*(?:am|'m)\s+hitting\s+a\s+roadblock\b[\s\S]*?(?=(\n\n|$))/gi, '');

  // Strip placeholder tool names sometimes rendered as empty backticks.
  out = out.replace(/`{2,}/g, '');
  out = out.replace(/`[^`]*`/g, '');

  // Remove any leftover tool/process narration lines.
  out = out.replace(/\b(getPlantInfo|getCompanionPlants|getDiseaseInfo|getPlantingCalendar|getSoilAdvice|getClimateAdvice|getSpacingLayout|getVarietyRecommendations)\b/gi, '');
  out = out.replace(/\btool\s*call\b/gi, '');
  out = out.replace(/\bquery\s*scope\b/gi, '');

  // Normalize whitespace (Gemini output sometimes arrives with missing spaces/newlines).
  out = out
    .replace(/[\t\r]+/g, ' ')
    .replace(/\u00A0/g, ' ')
    // Fix glued common verbs/auxiliaries/pronouns: marigoldsare -> marigolds are, whichis -> which is
    .replace(
      /([a-zA-Z])((?:is|are|was|were|be|been|being|can|could|should|would|will|won't|dont|don't|does|doesn't|did|didn't|have|has|had|help|keep|make|get|start|wait|look|need|want|try|use|find|plant|grow|water|feed|protect)(?=[a-zA-Z]))/g,
      '$1 $2'
    )
    // Fix glued question/relative words: that'sa -> that's a, whichis -> which is, thatcan -> that can
    .replace(
      /([a-zA-Z])((?:which|that|this|these|those|here|there)(?=[a-zA-Z]))/g,
      '$1 $2'
    )
    // Fix common "jammed" connector words when followed by whitespace/punctuation.
    // Examples: tomatoesin Brooklyn -> tomatoes in Brooklyn, getthe -> get the
    .replace(
      /([a-zA-Z])((?:the|a|an|and|or|but|so|to|of|in|on|at|for|from|with|without|as|by|into|until|after|before|around|about|over|under|up|out|off|per)(?=(?:\s|[.,;:!?)])))/g,
      '$1 $2'
    )
    // Common pronouns/determiners that frequently get glued in transcriptions.
    .replace(
      /([a-zA-Z])((?:you|your|we|they|them|their|it|its|this|that|these|those|here|there)(?=(?:\s|[.,;:!?)])))/g,
      '$1 $2'
    )
    // Ensure a single space after punctuation when followed by a non-space character.
    .replace(/([,.;:!?])(\S)/g, '$1 $2')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([a-zA-Z])([A-Z])/g, '$1 $2')
    .replace(/\s{2,}/g, ' ')
    .trim();

  out = out.replace(/\b[A-Za-z]{12,}\b/g, (m) => segmentGluedToken(m));

  return out;
}

// ============================================================================
// WebSocket Handler for Gemini Live API
// ============================================================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Check for WebSocket upgrade
  const upgradeHeader = req.headers.get("upgrade") || "";
  
  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response(
      JSON.stringify({ 
        error: "WebSocket upgrade required",
        usage: "Connect via WebSocket. Send { type: 'audio', chunk: '<base64 PCM 16kHz>' }"
      }),
      { 
        status: 426,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  // ========== RATE LIMITING ==========
  const clientIP = getClientIP(req);
  const userId = getUserIdFromAuth(req);
  
  console.log(`Rate limit check - IP: ${clientIP}, User: ${userId || 'anonymous'}`);
  
  // Check IP rate limit
  const ipLimit = await checkRateLimit(clientIP, 'ip');
  if (!ipLimit.allowed) {
    console.log(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ 
        error: "Rate limit exceeded",
        message: `You've reached the daily limit of ${DAILY_LIMIT} Jane voice sessions. Please try again later.`,
        resetAt: ipLimit.resetAt.toISOString()
      }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // Check user rate limit if authenticated
  if (userId) {
    const userLimit = await checkRateLimit(userId, 'user');
    if (!userLimit.allowed) {
      console.log(`Rate limit exceeded for user: ${userId}`);
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded",
          message: `You've reached the daily limit of ${DAILY_LIMIT} Jane voice sessions. Please try again later.`,
          resetAt: userLimit.resetAt.toISOString()
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }
  
  console.log(`Rate limit passed - IP remaining: ${ipLimit.remaining}`);
  // ========== END RATE LIMITING ==========

  const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY');
  
  if (!GOOGLE_AI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "GOOGLE_AI_API_KEY not configured" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Upgrade to WebSocket
  const { socket, response } = Deno.upgradeWebSocket(req);
  
  let geminiSession: any = null;
  let isConnected = false;
  let lastUserText: string | undefined = undefined;
  let lastUserContext: Record<string, any> | undefined = undefined;

  socket.onopen = async () => {
    console.log("Client WebSocket connected");
    
    try {
      // Initialize Gemini Live client
      const ai = new GoogleGenAI({ apiKey: GOOGLE_AI_API_KEY });
      
      // Message handler function
      const handleGeminiMessage = async (message: any) => {
        const messageStr = JSON.stringify(message);
        console.log("Gemini message received:", messageStr.slice(0, 500));
        
        // Log all top-level keys to understand message structure
        console.log("Message keys:", Object.keys(message));
        
        try {
          // If input transcription is enabled, capture the user's transcribed speech.
          if (message.serverContent?.inputTranscription?.text) {
            lastUserText = String(message.serverContent.inputTranscription.text || '').trim() || lastUserText;
          }

          // Handle tool calls from Gemini - check multiple possible structures
          if (message.toolCall || message.tool_call || message.serverContent?.toolCall) {
            const toolCallData = message.toolCall || message.tool_call || message.serverContent?.toolCall;
            console.log("🔧 TOOL CALL DETECTED:", JSON.stringify(toolCallData));
            
            const functionCalls = toolCallData.functionCalls || toolCallData.function_calls || [];
            const toolResponses: any[] = [];
            
            for (const call of functionCalls) {
              const toolName = call.name;
              const args = call.args || {};
              
              // Notify client that we're fetching data
              if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                  type: "tool_call",
                  tool: toolName,
                  args: args
                }));
              }
              
              // Execute the tool call against Render API
              const result = await executeToolCall(toolName, args, lastUserText, lastUserContext);
              
              toolResponses.push({
                functionResponses: [{
                  id: call.id,
                  name: toolName,
                  response: { result: result }
                }]
              });
            }
            
            // Send tool results back to Gemini
            for (const toolResponse of toolResponses) {
              if (geminiSession) {
                await geminiSession.sendToolResponse(toolResponse);
              }
            }
            
            return;
          }

          // Handle audio/text responses
          if (message.serverContent?.modelTurn?.parts) {
            for (const part of message.serverContent.modelTurn.parts) {
              if (socket.readyState !== WebSocket.OPEN) continue;
              
              // Audio response (base64 encoded)
              if (part.inlineData?.mimeType?.includes("audio")) {
                socket.send(JSON.stringify({
                  type: "assistant_audio",
                  chunk: part.inlineData.data,
                  mimeType: part.inlineData.mimeType // audio/pcm;rate=24000
                }));
              }
            }
          }

          // Handle outputTranscription (transcription of Jane's audio)
          if (message.serverContent?.outputTranscription?.text) {
            if (socket.readyState === WebSocket.OPEN) {
              const sanitized = sanitizeAssistantText(message.serverContent.outputTranscription.text);
              if (!sanitized) return;
              socket.send(JSON.stringify({
                type: "assistant_text",
                text: sanitized
              }));
            }
          }

          // Handle turn completion
          if (message.serverContent?.turnComplete) {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({
                type: "turn_complete"
              }));
            }
          }

          // Handle interruption
          if (message.serverContent?.interrupted) {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({
                type: "interrupted"
              }));
            }
          }

        } catch (e) {
          console.error("Error processing Gemini message:", e);
        }
      };
      
      // Create Live session with callbacks pattern
      geminiSession = await ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-12-2025",
        config: {
          // IMPORTANT: Live API only allows ONE modality per session
          responseModalities: [Modality.AUDIO],
          // Enable transcription so we still get text of what Jane says
          outputAudioTranscription: {},
          // Enable transcription so we can forward the user's actual question to the backend.
          inputAudioTranscription: {},
          systemInstruction: {
            parts: [{ text: JANE_SYSTEM_PROMPT }]
          },
          // Register gardening tools
          tools: [{
            functionDeclarations: gardeningTools
          }],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Aoede" // Warm, friendly female voice
              }
            }
          },
          // Audio input config (keep server-side VAD on)
          realtimeInputConfig: {
            automaticActivityDetection: {
              disabled: false,
              startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_HIGH,
              endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_HIGH,
              prefixPaddingMs: 300,
              silenceDurationMs: 1000
            }
          }
        },
        // Use callbacks pattern instead of .on() methods
        callbacks: {
          onopen: () => {
            console.log("Gemini Live connection opened");
          },
          onmessage: handleGeminiMessage,
          onerror: (e: any) => {
            console.error("Gemini session error:", e);
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({
                type: "error",
                message: "Voice session error: " + (e.message || "Unknown error")
              }));
            }
          },
          onclose: (e: any) => {
            console.log("Gemini session closed:", e?.reason || "No reason");
            isConnected = false;
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({
                type: "session_ended",
                message: "Voice session ended"
              }));
            }
          }
        }
      });

      isConnected = true;
      console.log("Gemini Live session established with tools:", gardeningTools.map(t => t.name).join(", "));

      // Send ready message to client
      socket.send(JSON.stringify({ 
        type: "session_ready",
        message: "Jane is ready to listen",
        tools: gardeningTools.map(t => t.name)
      }));

    } catch (error: unknown) {
      console.error("Failed to initialize Gemini Live:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      socket.send(JSON.stringify({
        type: "error",
        message: "Failed to start voice session: " + errorMessage
      }));
      socket.close();
    }
  };

  socket.onmessage = async (event: MessageEvent) => {
    if (!isConnected || !geminiSession) {
      socket.send(JSON.stringify({
        type: "error",
        message: "Session not ready"
      }));
      return;
    }

    try {
      const message = JSON.parse(event.data);
      console.log("Received message type:", message.type);

      // Only handle audio input (voice-only interface)
      if (message.type === "audio" && message.chunk) {
        // Allow client to attach context (location, coords, etc.) alongside audio.
        if (message.context && typeof message.context === 'object') {
          lastUserContext = message.context;
        }
        // Send audio chunk to Gemini Live (base64 encoded PCM @ 16kHz)
        try {
          await geminiSession.sendRealtimeInput({
            audio: {
              data: message.chunk,
              mimeType: "audio/pcm;rate=16000",
            },
          });
        } catch (e) {
          console.error("Failed to send audio chunk to Gemini:", e);
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              type: "error",
              message: "Failed to stream audio to Jane",
            }));
          }
        }
      } else if (message.type === "end_turn") {
        // Client signals end of speech.
        // IMPORTANT: The Live API already handles turn-taking via server-side VAD.
        // Sending unsupported end-of-stream events can close the session ("invalid argument").
        // Instead, we send a brief silence chunk so VAD can confidently detect end-of-speech.
        console.log("Client signaled end of turn - sending silence to trigger server VAD");
        try {
          const silenceBytes = new Uint8Array(16000 * 2); // 1s of PCM16 @ 16kHz (all zeros)
          let binary = "";
          const chunkSize = 0x8000;
          for (let i = 0; i < silenceBytes.length; i += chunkSize) {
            const chunk = silenceBytes.subarray(i, Math.min(i + chunkSize, silenceBytes.length));
            binary += String.fromCharCode.apply(null, Array.from(chunk));
          }
          const silenceBase64 = btoa(binary);

          await geminiSession.sendRealtimeInput({
            audio: {
              data: silenceBase64,
              mimeType: "audio/pcm;rate=16000",
            },
          });
        } catch (e) {
          console.error("Failed to send end_turn silence:", e);
        }
      } else {
        console.log("Ignoring non-audio message type:", message.type);
      }

    } catch (error: unknown) {
      console.error("Error processing client message:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      socket.send(JSON.stringify({
        type: "error",
        message: "Failed to process audio: " + errorMessage
      }));
    }
  };

  socket.onclose = () => {
    console.log("Client WebSocket disconnected");
    if (geminiSession) {
      try {
        geminiSession.close();
      } catch (e) {
        console.error("Error closing Gemini session:", e);
      }
    }
    isConnected = false;
  };

  socket.onerror = (error: Event) => {
    console.error("WebSocket error:", error);
    if (geminiSession) {
      try {
        geminiSession.close();
      } catch (e) {
        console.error("Error closing Gemini session on error:", e);
      }
    }
  };

  return response;
});
