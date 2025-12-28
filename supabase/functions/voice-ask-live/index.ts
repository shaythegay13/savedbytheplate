import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Modality } from "https://esm.sh/@google/genai@latest";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

Voice interaction style:
- Keep responses SHORT and conversational (1-2 sentences per thought)
- Speak naturally as if having a friendly chat
- Ask follow-up questions to understand their situation
- Be encouraging and celebrate small wins
- If they sound unsure, offer simple first steps`;

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
      
      // Create Live session with native audio model
      geminiSession = await ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-12-2025",
        config: {
          responseModalities: [Modality.AUDIO, Modality.TEXT],
          systemInstruction: {
            parts: [{ text: JANE_SYSTEM_PROMPT }]
          },
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
      console.log("Gemini Live session established");

      // Send ready message to client
      socket.send(JSON.stringify({ 
        type: "session_ready",
        message: "Jane is ready to listen"
      }));

      // Handle responses from Gemini
      geminiSession.on("message", (message: any) => {
        console.log("Gemini message received:", message.type);
        
        try {
          // Handle audio responses
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
