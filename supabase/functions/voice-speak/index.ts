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

    console.log('Text-to-speech request received, text length:', text.length);

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      // Return a flag telling client to use browser TTS
      console.log('No OpenAI API key, returning browser TTS flag');
      return new Response(
        JSON.stringify({
          use_browser_tts: true,
          synthesized_text: text,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Generating speech using OpenAI TTS');

    const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'nova',
        response_format: 'mp3',
      }),
    });

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('TTS error:', errorText);
      
      // Check for quota exceeded
      if (errorText.includes('insufficient_quota') || ttsResponse.status === 429) {
        console.log('OpenAI quota exceeded, returning browser TTS flag');
        return new Response(
          JSON.stringify({
            use_browser_tts: true,
            synthesized_text: text,
            error_reason: 'quota_exceeded',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      throw new Error('Failed to generate speech');
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioBuffer))
    );

    console.log('Speech generated successfully');

    return new Response(
      JSON.stringify({
        audio_base64: base64Audio,
        synthesized_text: text,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in voice-speak function:', error);
    
    // On any error, suggest browser TTS as fallback
    return new Response(
      JSON.stringify({ 
        use_browser_tts: true,
        error: error.message 
      }),
      {
        status: 200, // Return 200 so client can handle fallback
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
