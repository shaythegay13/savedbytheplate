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
    const { text_question, audio_data, context } = await req.json();

    if (!text_question && !audio_data) {
      throw new Error('No question text or audio provided');
    }

    console.log('Forwarding request to Python backend...');

    // Call your existing Python backend that has Claude + AWS Polly working
    const backendUrl = 'https://agenticaigardenplanner.onrender.com/api/voice/ask';
    
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text_question,
        audio_data,
        context: context || {}
      }),
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.text();
      console.error('Backend error:', error);
      throw new Error(`Backend error: ${backendResponse.status}`);
    }

    const result = await backendResponse.json();
    console.log('Backend response received');

    return new Response(
      JSON.stringify(result),
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
