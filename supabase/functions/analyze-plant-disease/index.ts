import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, analysisType = 'basic' } = await req.json();

    if (!imageData) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const PYTHON_API_URL = 'https://agenticaigardenplanner.onrender.com';
    
    console.log('Calling Python backend disease identifier at:', `${PYTHON_API_URL}/api/v1/disease/identify`);

    // Call Python backend disease identification endpoint
    const response = await fetch(`${PYTHON_API_URL}/api/v1/disease/identify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_data: imageData,
        analysis_type: analysisType
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Python API error:', response.status, errorText);
      throw new Error(`Python API error: ${response.status} - ${errorText}`);
    }

    const analysis = await response.json();
    console.log('Disease analysis successful:', analysis.disease);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Disease analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze plant image',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});