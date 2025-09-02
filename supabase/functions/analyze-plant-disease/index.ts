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

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.log('OpenAI API key not found, using mock response');
      // Return mock analysis for demo purposes
      return new Response(
        JSON.stringify({
          disease: 'Tomato Early Blight',
          confidence: 0.85,
          description: 'Early blight is a common fungal disease affecting tomato plants, characterized by dark spots with concentric rings on leaves.',
          treatment: [
            'Remove affected leaves immediately',
            'Apply fungicide containing copper or chlorothalonil',
            'Ensure proper air circulation around plants',
            'Water at soil level to avoid wetting leaves'
          ],
          prevention: [
            'Rotate crops annually',
            'Provide adequate spacing between plants',
            'Water early in the day',
            'Apply mulch to prevent soil splash',
            'Choose disease-resistant varieties'
          ],
          severity: 'medium'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call OpenAI Vision API for plant disease analysis
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert plant pathologist. Analyze the plant image and identify any diseases or problems. Return a JSON response with:
            {
              "disease": "Disease name or 'Healthy' if no issues",
              "confidence": 0.0-1.0,
              "description": "Detailed description of the condition",
              "treatment": ["Array of treatment steps"],
              "prevention": ["Array of prevention tips"],
              "severity": "low|medium|high"
            }`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this plant image for any diseases or problems. Focus on leaf spots, discoloration, wilting, pests, or other issues.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;

    // Parse JSON response from OpenAI
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      // If JSON parsing fails, create structured response from text
      analysis = {
        disease: 'Analysis Complete',
        confidence: 0.75,
        description: analysisText,
        treatment: ['Follow general plant care guidelines', 'Monitor plant closely'],
        prevention: ['Maintain good plant hygiene', 'Ensure proper growing conditions'],
        severity: 'medium'
      };
    }

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