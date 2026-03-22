/// <reference lib="dom" />
/// <reference lib="es2021" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Modality, Type, StartSensitivity, EndSensitivity } from "npm:@google/genai@^1.34.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

declare const Deno: any;

// Rate limit constants
const DAILY_LIMIT = 100; // Increased for testing/development
const WINDOW_HOURS = 24;

// WebSocket message validation schemas
const MAX_AUDIO_CHUNK_SIZE = 1024 * 1024; // 1MB max per chunk

const audioMessageSchema = z.object({
  type: z.literal("audio"),
  chunk: z.string()
    .min(1, "Audio chunk cannot be empty")
    .max(MAX_AUDIO_CHUNK_SIZE, "Audio chunk too large (max 1MB)"),
  context: z.record(z.unknown()).optional()
});

const endTurnMessageSchema = z.object({
  type: z.literal("end_turn")
});

const wsMessageSchema = z.discriminatedUnion("type", [
  audioMessageSchema,
  endTurnMessageSchema
]);

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

async function getAuthenticatedUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  try {
    const token = authHeader.substring(7);
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Properly verify JWT signature using Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      console.error('JWT verification failed:', error?.message || 'No user found');
      return null;
    }
    return user.id;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return null;
  }
}

// ============================================================================
// Backend API Configuration (Gardening Knowledge Base)
// ============================================================================

const BACKEND_API_URL = (Deno.env.get('BACKEND_API_URL') || 'https://voiceagentrender.onrender.com').replace(/\/+$/g, '');

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

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

    const trimmedQuestion = (userQuestion ?? '').toString().trim();
    const normalizedQuestion = trimmedQuestion.toLowerCase();
    const normalizedPlant = (args?.plantName ?? '').toString().trim().toLowerCase();

    let shouldUseUserQuestion = false;
    if (trimmedQuestion.length >= 20) {
      shouldUseUserQuestion = true;
    } else if (normalizedPlant && normalizedQuestion.includes(normalizedPlant)) {
      shouldUseUserQuestion = true;
    }

    const finalMessage = shouldUseUserQuestion ? trimmedQuestion : message;
    if (!shouldUseUserQuestion && trimmedQuestion) {
      console.warn(
        `Ignoring partial transcription \"${trimmedQuestion}\" for ${toolName}; falling back to templated query \"${message}\".`
      );
    }
    const context = {
      ...(userContext || {}),
      tool: {
        name: toolName,
        args: args || {}
      }
    };
    console.log(`Calling Backend API: ${url} with message: ${finalMessage}`);

    const maxAttempts = 3;
    let response: Response | undefined;
    let lastError: unknown = undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      try {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: finalMessage, context }),
          signal: controller.signal
        });

        if (response.ok) break;

        // Retry transient upstream issues (Render cold start / gateway).
        if ([429, 502, 503, 504].includes(response.status) && attempt < maxAttempts) {
          console.warn(`Backend API non-OK (attempt ${attempt}/${maxAttempts}): ${response.status} ${response.statusText}`);
          await sleep(400 * attempt);
          continue;
        }

        break;
      } catch (err: unknown) {
        lastError = err;

        // Retry network/timeout errors.
        if (attempt < maxAttempts) {
          console.warn(`Backend API fetch error (attempt ${attempt}/${maxAttempts}):`, err);
          await sleep(400 * attempt);
          continue;
        }
      } finally {
        clearTimeout(timeout);
      }
    }

    if (!response || !response.ok) {
      const status = response?.status;
      const statusText = response?.statusText;
      let errorText = '';

      try {
        if (response) errorText = await response.text();
      } catch (_) {
        // ignore
      }

      console.error(`Render API error: ${status ?? 'NO_RESPONSE'} ${statusText ?? ''}`);
      if (errorText) console.error(`Error body: ${errorText}`);
      if (lastError) console.error(`Fetch error:`, lastError);

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

const JANE_SYSTEM_PROMPT = `You are Jane, a warm and knowledgeable garden planning assistant for Saved By The Plate, a community-focused urban gardening platform in NYC.

Your personality:
- Warm, encouraging, and approachable like a supportive mentor
- Passionate about helping people grow their own food

CRITICAL - CONVERSATION CONTINUITY:
- This is a CONTINUOUS voice conversation. You MUST remember everything the user has said so far in this session.
- Do NOT repeat your greeting or say "Let's get started" after the first turn.
- If the user asks a follow-up question, answer it directly based on the context of the conversation.
- Only greet the user ONCE at the very beginning of the session. After that, respond naturally to their questions.

You help people with:
- What to plant based on their space, sunlight, and experience level
- Practical tips for container and raised bed gardening
- Companion planting and spacing advice
- Watering, care, and organic pest management
- Location-aware growing advice for NYC (Zone 7a/7b)

ABSOLUTELY CRITICAL - SILENT TOOL USAGE:
- When you need information, call the tool SILENTLY. Do NOT say "let me check", "first let's check the climate", "let me look that up", or ANYTHING about what you are doing.
- NEVER narrate your process. NEVER say what tool you are calling or what data you are fetching.
- Just be SILENT while tools execute, then speak your answer using the data.
- Do NOT reveal internal reasoning, planning, scratch work, analysis, or thought process.
- The user should ONLY hear your final, helpful answer. Nothing else.

CRITICAL - TOOL USAGE REQUIRED:
You MUST use the provided tools for ANY plant-related questions. Call tools silently, wait for results, then answer using the data.

Tool rules:
1. getPlantInfo - Call for ANY specific plant question (tomatoes, basil, lettuce, etc.)
2. getCompanionPlants - Call for "what to plant next to X" or companion planting
3. getDiseaseInfo - Call for yellowing leaves, pests, spots, wilting, plant problems
4. getPlantingCalendar - Call for "when should I plant", timing questions
5. getSoilAdvice - Call for soil/compost/fertilizer/pH questions
6. getClimateAdvice - Call for weather, frost dates, USDA zone questions
7. getSpacingLayout - Call for spacing/layout/"how far apart" questions
8. getVarietyRecommendations - Call for variety/cultivar recommendations

After receiving tool results, incorporate the data naturally into your spoken answer. If a tool fails, offer general guidance without mentioning the failure.

Voice interaction style:
- Every sentence MUST be under 15 words. Break longer thoughts into two sentences.
- Speak naturally as if having a friendly chat.
- Pause between ideas. Use short, clear phrases.
- Ask follow-up questions to understand their situation.
- Be encouraging and celebrate small wins.
- Do NOT use lists, bullet points, or special formatting. Speak in flowing prose only.`;

const CUSTOM_SEGMENTATION_WORDS = [
  'basil',
  'companionplanting',
  'gardening',
  'marigolds',
  'parsley',
  'seedlings',
  'soil',
  'spacing',
  'steer',
  'sunlight',
  'tomatoes',
  'tuck',
  'cabbage',
  'fennel'
];

function buildWordSegmentationVocab(): Set<string> {
  const vocab = new Set<string>();
  try {
    const dictUrl = new URL('./google-10000-english.txt', import.meta.url);
    const rawDict = Deno.readTextFileSync(dictUrl);
    rawDict
      .split(/\s+/)
      .map((word) => word.trim().toLowerCase())
      .filter(Boolean)
      .forEach((word) => vocab.add(word));
  } catch (error) {
    console.error('Failed to load google-10000-english dictionary for word segmentation', error);
  }

  CUSTOM_SEGMENTATION_WORDS.forEach((word) => vocab.add(word.toLowerCase()));
  return vocab;
}

const WORD_SEGMENTATION_VOCAB = buildWordSegmentationVocab();

function segmentGluedToken(token: string): string {
  const raw = token;
  const lower = token.toLowerCase();
  const n = lower.length;
  if (n < 16) return raw;
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
  out = out.replace(/\bI(?:'|')ve\s+determined\b[\s\S]*?(?=(\n\n|$))/gi, '');
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

  // Normalize whitespace
  out = out
    .replace(/[\t\r]+/g, ' ')
    .replace(/\u00A0/g, ' ')
    // Ensure space after punctuation when followed by letter or number
    .replace(/([,.;:!?])([a-zA-Z0-9])/g, '$1 $2')
    // Remove space before punctuation
    .replace(/\s+([,.;:!?])/g, '$1')
    // Add space between lowercase and uppercase (camelCase fix)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Collapse multiple spaces
    .replace(/\s{2,}/g, ' ')
    .trim();

  // FIXED: Only segment VERY long words that are clearly glued (16+ chars)
  // This avoids fragmenting normal words like "containers" or "spinach"
  out = out.replace(/\b[A-Za-z]{16,}\b/g, (m) => segmentGluedToken(m));

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
  const userId = await getAuthenticatedUserId(req);
  
  console.log(`Rate limit check - IP: ${clientIP}, User: ${userId || 'anonymous (IP-based)'}`);
  
  // Determine which identifier to use for primary rate limiting
  const identifier = userId || `ip:${clientIP}`;
  const identifierType: 'user' | 'ip' = userId ? 'user' : 'ip';
  
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
  let sessionStartedAt = 0;
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 3;

  // Conversation memory: generate a unique session ID for this WS connection
  const conversationSessionId = crypto.randomUUID();
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const memoryClient = createClient(supabaseUrl, supabaseServiceKey);

  // Store a conversation turn in the DB
  async function storeTurn(role: 'user' | 'assistant' | 'tool_result', content: string, toolName?: string) {
    try {
      // Trim to max 2000 chars to keep storage lean
      const trimmed = content.slice(0, 2000);
      await memoryClient
        .from('jane_conversation_turns')
        .insert({
          session_id: conversationSessionId,
          role,
          content: trimmed,
          tool_name: toolName || null,
        });
    } catch (e) {
      console.warn('Failed to store conversation turn:', e);
    }
  }

  // Retrieve conversation history for context injection
  async function getConversationHistory(): Promise<string> {
    try {
      const { data } = await memoryClient
        .from('jane_conversation_turns')
        .select('role, content, tool_name')
        .eq('session_id', conversationSessionId)
        .order('created_at', { ascending: true })
        .limit(20); // Last 20 turns max

      if (!data || data.length === 0) return '';

      return data
        .map((t: any) => {
          if (t.role === 'user') return `User: ${t.content}`;
          if (t.role === 'tool_result') return `[Tool ${t.tool_name}]: ${t.content.slice(0, 300)}`;
          return `Jane: ${t.content}`;
        })
        .join('\n');
    } catch (e) {
      console.warn('Failed to retrieve conversation history:', e);
      return '';
    }
  }

  // Cleanup expired turns opportunistically (runs ~5% of connections)
  if (Math.random() < 0.05) {
    memoryClient.rpc('cleanup_jane_conversation_turns').then(() => {
      console.log('Cleaned up expired conversation turns');
    }).catch(() => {});
  }

  async function initGeminiSession() {
    const ai = new GoogleGenAI({ apiKey: GOOGLE_AI_API_KEY });

    // Message handler function
    const handleGeminiMessage = async (message: any) => {
      const messageStr = JSON.stringify(message);
      console.log("Gemini message received:", messageStr.slice(0, 500));
      console.log("Message keys:", Object.keys(message));

      try {
        // Capture user's transcribed speech and store it
        if (message.serverContent?.inputTranscription?.text) {
          const newText = String(message.serverContent.inputTranscription.text || '').trim();
          if (newText) {
            lastUserText = newText;
          }
        }

        // Detect full user utterance on turn boundaries and store
        if (message.serverContent?.turnComplete && lastUserText) {
          await storeTurn('user', lastUserText);
        }

        // Handle tool calls
        if (message.toolCall || message.tool_call || message.serverContent?.toolCall) {
          const toolCallData = message.toolCall || message.tool_call || message.serverContent?.toolCall;
          console.log("🔧 TOOL CALL DETECTED:", JSON.stringify(toolCallData));

          // Store the user's question that triggered this tool call
          if (lastUserText) {
            await storeTurn('user', lastUserText);
          }

          // Get conversation history for richer context
          const history = await getConversationHistory();

          const functionCalls = toolCallData.functionCalls || toolCallData.function_calls || [];
          const toolResponses: any[] = [];

          for (const call of functionCalls) {
            const toolName = call.name;
            const args = call.args || {};

            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ type: "tool_call", tool: toolName, args }));
            }

            // Pass conversation history as additional context for the KB query
            const enrichedContext = {
              ...(lastUserContext || {}),
              conversationHistory: history,
            };
            const result = await executeToolCall(toolName, args, lastUserText, enrichedContext);
            
            // Store tool result for memory
            await storeTurn('tool_result', result.slice(0, 1000), toolName);

            toolResponses.push({
              functionResponses: [{
                id: call.id,
                name: toolName,
                response: { result }
              }]
            });
          }

          for (const toolResponse of toolResponses) {
            if (geminiSession) {
              console.log("📤 Sending tool response to Gemini, expecting audio reply...");
              await geminiSession.sendToolResponse(toolResponse);
              console.log("📤 Tool response sent — waiting for Gemini audio output");
            }
          }
          return;
        }

        // Handle audio/text responses
        if (message.serverContent?.modelTurn?.parts) {
          for (const part of message.serverContent.modelTurn.parts) {
            if (socket.readyState !== WebSocket.OPEN) continue;

            if (part.inlineData?.mimeType?.includes("audio")) {
              const chunkLen = part.inlineData.data?.length || 0;
              console.log(`🔊 Audio chunk from Gemini: ${chunkLen} base64 chars, mimeType=${part.inlineData.mimeType}`);
              socket.send(JSON.stringify({
                type: "assistant_audio",
                chunk: part.inlineData.data,
                mimeType: part.inlineData.mimeType
              }));
            }
          }
        }

        // Handle output transcription — store assistant responses for memory
        if (message.serverContent?.outputTranscription?.text) {
          if (socket.readyState === WebSocket.OPEN) {
            const rawText = message.serverContent.outputTranscription.text;
            console.log('[GEMINI RAW TEXT]:', rawText);
            const sanitized = sanitizeAssistantText(rawText);
            console.log('[SANITIZED TEXT]:', sanitized);
            if (!sanitized) return;
            // Store assistant response for conversation continuity
            await storeTurn('assistant', sanitized);
            socket.send(JSON.stringify({ type: "assistant_text", text: sanitized }));
          }
        }

        // Handle turn completion
        if (message.serverContent?.turnComplete) {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "turn_complete" }));
          }
        }

        // Handle interruption
        if (message.serverContent?.interrupted) {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "interrupted" }));
          }
        }
      } catch (e) {
        console.error("Error processing Gemini message:", e);
      }
    };

    const modelName = "gemini-2.5-flash-native-audio-preview-12-2025";
    console.log(`Attempting Gemini Live connect with model: ${modelName}, attempt: ${reconnectAttempts + 1}`);

    // Inject conversation history into system prompt for continuity
    const history = await getConversationHistory();
    const historyBlock = history
      ? `\n\nCONVERSATION HISTORY (use this to maintain context — do NOT repeat greetings):\n${history}`
      : '';

    try {
      geminiSession = await ai.live.connect({
        model: modelName,
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: {
            parts: [{ text: JANE_SYSTEM_PROMPT + historyBlock }]
          },
          tools: [{ functionDeclarations: gardeningTools }],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Aoede"
              }
            }
          },
          realtimeInputConfig: {
            automaticActivityDetection: {
              disabled: false,
              startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_HIGH,
              endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_LOW,
              prefixPaddingMs: 300,
              silenceDurationMs: 800
            }
          }
        },
        callbacks: {
          onopen: () => {
            console.log("Gemini Live connection opened");
          },
          onmessage: handleGeminiMessage,
          onerror: (e: any) => {
            console.error("Gemini session error:", JSON.stringify(e, Object.getOwnPropertyNames(e || {})));
            console.error("Gemini error type:", typeof e, "keys:", e ? Object.keys(e) : 'null');
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({
                type: "error",
                message: "Voice session error: " + (e?.message || e?.reason || JSON.stringify(e) || "Unknown error")
              }));
            }
          },
          onclose: async (e: any) => {
            const sessionAge = Date.now() - sessionStartedAt;
            console.log(`Gemini session closed after ${sessionAge}ms`);
            console.log(`Gemini onclose event:`, JSON.stringify(e, Object.getOwnPropertyNames(e || {})));
            console.log(`Gemini onclose code: ${e?.code}, reason: ${e?.reason}, wasClean: ${e?.wasClean}`);
            isConnected = false;

            // Auto-reconnect if the session died prematurely (within 5s)
            if (sessionAge < 5000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS && socket.readyState === WebSocket.OPEN) {
              reconnectAttempts++;
              const backoffMs = 1000 * reconnectAttempts; // 1s, 2s, 3s
              console.log(`Gemini session died early (${sessionAge}ms), auto-reconnecting in ${backoffMs}ms (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
              await sleep(backoffMs);
              try {
                await initGeminiSession();
              } catch (err) {
                console.error("Gemini reconnect failed:", err);
                if (socket.readyState === WebSocket.OPEN) {
                  socket.send(JSON.stringify({ type: "session_ended", message: "Voice session ended" }));
                }
              }
              return;
            }

            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ type: "session_ended", message: "Voice session ended" }));
            }
          }
        }
      });
    } catch (connectError: unknown) {
      const errMsg = connectError instanceof Error ? connectError.message : String(connectError);
      console.error(`Gemini Live connect FAILED: ${errMsg}`, connectError);
      
      // If this is a reconnect attempt, try again
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS && socket.readyState === WebSocket.OPEN) {
        reconnectAttempts++;
        const backoffMs = 1000 * reconnectAttempts;
        console.log(`Connect failed, retrying in ${backoffMs}ms (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
        await sleep(backoffMs);
        await initGeminiSession();
        return;
      }
      
      throw connectError;
    }

    isConnected = true;
    sessionStartedAt = Date.now();
    reconnectAttempts = 0;
    console.log("Gemini Live session established with tools:", gardeningTools.map(t => t.name).join(", "));

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "session_ready",
        message: "Jane is ready to listen",
        tools: gardeningTools.map(t => t.name)
      }));
    }
  }

  socket.onopen = async () => {
    console.log("Client WebSocket connected");

    try {
      await initGeminiSession();
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
      const rawMessage = JSON.parse(event.data);
      
      // Validate WebSocket message
      const validationResult = wsMessageSchema.safeParse(rawMessage);
      if (!validationResult.success) {
        const errors = (validationResult as { success: false; error: z.ZodError }).error.errors.map(e => e.message).join(', ');
        console.warn("Invalid WebSocket message:", errors);
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: "error",
            message: `Invalid message format: ${errors}`
          }));
        }
        return;
      }
      
      const message = validationResult.data;
      console.log("Received valid message type:", message.type);

      // Only handle audio input (voice-only interface)
      if (message.type === "audio") {
        // Allow client to attach context (location, coords, etc.) alongside audio.
        if (message.context && typeof message.context === 'object') {
          lastUserContext = message.context as Record<string, unknown>;
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
      }

    } catch (error: unknown) {
      console.error("Error processing client message:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      socket.send(JSON.stringify({
        type: "error",
        message: "Failed to process message: " + errorMessage
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
