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
    const formData = await req.formData();
    const text = formData.get('text') as string;
    
    if (!text) {
      throw new Error('No text provided');
    }

    console.log('Generating speech for text:', text);

    // Call your Python backend for TTS
    const backendUrl = 'https://agenticaigardenplanner.onrender.com/api/voice/speak';
    
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.text();
      console.error('Backend TTS error:', error);
      throw new Error(`Backend TTS error: ${backendResponse.status}`);
    }

    const result = await backendResponse.json();
    console.log('Speech generated successfully');

    return new Response(
      JSON.stringify({
        audio_base64: result.audio_base64 || result.audioContent,
        synthesized_text: text,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in voice-speak function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
