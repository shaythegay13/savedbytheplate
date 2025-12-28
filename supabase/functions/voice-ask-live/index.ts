import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Modality, Type } from "https://esm.sh/@google/genai@latest";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================================================
// Render API Configuration (Gardening Knowledge Base)
// ============================================================================

const RENDER_API_BASE = Deno.env.get('RENDER_API_URL') || 'https://your-render-service.onrender.com';

// ============================================================================
// Tool Definitions for Gemini Function Calling
// ============================================================================

const gardeningTools = [
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
];

// ============================================================================
// Tool Execution - Calls Render API
// ============================================================================

async function executeToolCall(toolName: string, args: Record<string, any>): Promise<string> {
  console.log(`Executing tool: ${toolName}`, args);
  
  try {
    let endpoint = '';
    let queryParams = new URLSearchParams();

    switch (toolName) {
      case 'getPlantInfo':
        endpoint = '/api/plants/info';
        queryParams.set('plant', args.plantName);
        if (args.infoType) queryParams.set('type', args.infoType);
        break;
        
      case 'getCompanionPlants':
        endpoint = '/api/plants/companions';
        queryParams.set('plant', args.plantName);
        break;
        
      case 'getDiseaseInfo':
        endpoint = '/api/plants/diseases';
        queryParams.set('query', args.query);
        if (args.plantName) queryParams.set('plant', args.plantName);
        break;
        
      case 'getPlantingCalendar':
        endpoint = '/api/plants/calendar';
        if (args.month) queryParams.set('month', args.month);
        if (args.plantName) queryParams.set('plant', args.plantName);
        break;
        
      default:
        return JSON.stringify({ error: `Unknown tool: ${toolName}` });
    }

    const url = `${RENDER_API_BASE}${endpoint}?${queryParams.toString()}`;
    console.log(`Calling Render API: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth header if needed
        // 'Authorization': `Bearer ${Deno.env.get('RENDER_API_KEY')}`
      }
    });

    if (!response.ok) {
      console.error(`Render API error: ${response.status}`);
      // Return fallback so Jane can still respond gracefully
      return JSON.stringify({
        error: "Could not fetch from knowledge base",
        fallback: true,
        suggestion: "I couldn't access my plant database right now, but I can share general knowledge."
      });
    }

    const data = await response.json();
    console.log(`Tool result for ${toolName}:`, JSON.stringify(data).slice(0, 200));
    return JSON.stringify(data);

  } catch (error) {
    console.error(`Tool execution error for ${toolName}:`, error);
    return JSON.stringify({
      error: error.message,
      fallback: true,
      suggestion: "I'm having trouble accessing my plant database, but I can help with general advice."
    });
  }
}

// ============================================================================
// Jane's System Prompt for Live Voice Interaction
// ============================================================================

const JANE_SYSTEM_PROMPT = `You are Jane, a friendly and knowledgeable garden planning assistant for Saved By The Plate, a community-focused urban gardening platform in NYC.

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
- NYC-specific growing advice (Zone 7a/7b, April-October growing season)

IMPORTANT - Using Tools:
- You have access to a gardening knowledge base through tools. USE THEM to give accurate, specific information.
- When someone asks about a plant, ALWAYS call getPlantInfo first to get accurate data.
- When asked about companion planting, call getCompanionPlants.
- When someone describes plant problems, call getDiseaseInfo.
- When asked about timing, call getPlantingCalendar.
- Base your spoken responses on the tool results, not just your general knowledge.

Voice interaction style:
- Keep responses SHORT and conversational (1-2 sentences per thought)
- Speak naturally as if having a friendly chat
- Ask follow-up questions to understand their situation
- Be encouraging and celebrate small wins
- If a tool returns an error, gracefully fall back to general advice`;

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

  socket.onopen = async () => {
    console.log("Client WebSocket connected");
    
    try {
      // Initialize Gemini Live client
      const ai = new GoogleGenAI({ apiKey: GOOGLE_AI_API_KEY });
      
      // Create Live session with native audio model and tools
      geminiSession = await ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-12-2025",
        config: {
          responseModalities: [Modality.AUDIO, Modality.TEXT],
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
          // Audio format specifications
          realtimeInputConfig: {
            mediaResolution: "MEDIA_RESOLUTION_LOW",
            automaticActivityDetection: {
              disabled: false,
              startOfSpeechSensitivity: "START_OF_SPEECH_SENSITIVITY_HIGH",
              endOfSpeechSensitivity: "END_OF_SPEECH_SENSITIVITY_HIGH",
              prefixPaddingMs: 300,
              silenceDurationMs: 1000
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

      // Handle responses from Gemini
      geminiSession.on("message", async (message: any) => {
        console.log("Gemini message received:", JSON.stringify(message).slice(0, 300));
        
        try {
          // Handle tool calls from Gemini
          if (message.toolCall) {
            console.log("Tool call received:", message.toolCall);
            
            const functionCalls = message.toolCall.functionCalls || [];
            const toolResponses: any[] = [];
            
            for (const call of functionCalls) {
              const toolName = call.name;
              const args = call.args || {};
              
              // Notify client that we're fetching data
              socket.send(JSON.stringify({
                type: "tool_call",
                tool: toolName,
                args: args
              }));
              
              // Execute the tool call against Render API
              const result = await executeToolCall(toolName, args);
              
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
              await geminiSession.sendToolResponse(toolResponse);
            }
            
            return;
          }

          // Handle audio/text responses
          if (message.serverContent?.modelTurn?.parts) {
            for (const part of message.serverContent.modelTurn.parts) {
              // Text response
              if (part.text) {
                socket.send(JSON.stringify({
                  type: "assistant_text",
                  text: part.text
                }));
              }
              
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

          // Handle turn completion
          if (message.serverContent?.turnComplete) {
            socket.send(JSON.stringify({
              type: "turn_complete"
            }));
          }

          // Handle interruption
          if (message.serverContent?.interrupted) {
            socket.send(JSON.stringify({
              type: "interrupted"
            }));
          }

        } catch (e) {
          console.error("Error processing Gemini message:", e);
        }
      });

      geminiSession.on("error", (error: any) => {
        console.error("Gemini session error:", error);
        socket.send(JSON.stringify({
          type: "error",
          message: "Voice session error: " + (error.message || "Unknown error")
        }));
      });

      geminiSession.on("close", () => {
        console.log("Gemini session closed");
        isConnected = false;
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: "session_ended",
            message: "Voice session ended"
          }));
        }
      });

    } catch (error) {
      console.error("Failed to initialize Gemini Live:", error);
      socket.send(JSON.stringify({
        type: "error",
        message: "Failed to start voice session: " + (error.message || "Unknown error")
      }));
      socket.close();
    }
  };

  socket.onmessage = async (event) => {
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
        // Send audio chunk to Gemini Live
        // Expecting base64 encoded PCM audio at 16kHz
        await geminiSession.sendRealtimeInput({
          media: {
            mimeType: "audio/pcm;rate=16000",
            data: message.chunk
          }
        });
      } else if (message.type === "end_turn") {
        // Client signals end of speech (optional, VAD handles this automatically)
        console.log("Client signaled end of turn");
      } else {
        console.log("Ignoring non-audio message type:", message.type);
      }

    } catch (error) {
      console.error("Error processing client message:", error);
      socket.send(JSON.stringify({
        type: "error",
        message: "Failed to process audio: " + (error.message || "Unknown error")
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

  socket.onerror = (error) => {
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
