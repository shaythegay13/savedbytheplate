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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    let questionText = text_question;

    // If audio data is provided, transcribe it first
    if (audio_data && !text_question) {
      console.log('Transcribing audio...');
      const audioBuffer = Uint8Array.from(atob(audio_data), c => c.charCodeAt(0));
      const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });
      
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');

      const transcribeResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
      });

      if (!transcribeResponse.ok) {
        const error = await transcribeResponse.text();
        console.error('Transcription error:', error);
        throw new Error('Failed to transcribe audio');
      }

      const transcription = await transcribeResponse.json();
      questionText = transcription.text;
      console.log('Transcribed text:', questionText);
    }

    if (!questionText) {
      throw new Error('No question text provided');
    }

    // Step 1: Fast intent extraction to identify relevant crops (using gpt-4o-mini for speed)
    const intentPrompt = `Extract key information from this garden question. Reply ONLY with JSON.
Question: "${questionText}"

Return JSON with:
- crops: array of crop names mentioned (empty if none)
- cultural_context: detected cultural context (african/asian/latin/caribbean or null)
- needs_data: boolean (true if question needs specific crop data)

Example: {"crops":["tomato","basil"],"cultural_context":null,"needs_data":true}`;

    console.log('Extracting intent...');
    const intentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Fast model for intent extraction
        messages: [{ role: 'user', content: intentPrompt }],
        temperature: 0.3,
        max_tokens: 150,
      }),
    });

    const intentData = await intentResponse.json();
    const intent = JSON.parse(intentData.choices[0].message.content);
    console.log('Intent:', intent);

    // Step 2: Query crop database if needed (with timeout for speed)
    let cropData = null;
    if (intent.needs_data) {
      console.log('Querying crop database...');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500); // 1.5s timeout
      
      try {
        const cropResponse = await fetch('https://agenticaigardenplanner.onrender.com/api/crops', {
          method: 'GET',
          signal: controller.signal,
        });
        clearTimeout(timeout);
        
        if (cropResponse.ok) {
          const allCrops = await cropResponse.json();
          // Filter relevant crops
          if (intent.crops.length > 0) {
            cropData = allCrops.filter((crop: any) => 
              intent.crops.some((searchCrop: string) => 
                crop.name?.toLowerCase().includes(searchCrop.toLowerCase()) ||
                crop.varieties?.some((v: any) => v.name?.toLowerCase().includes(searchCrop.toLowerCase()))
              )
            ).slice(0, 5); // Limit to 5 most relevant
          } else if (intent.cultural_context) {
            cropData = allCrops.filter((crop: any) => 
              crop.cultural_origin?.toLowerCase().includes(intent.cultural_context)
            ).slice(0, 5);
          }
          console.log(`Found ${cropData?.length || 0} relevant crops`);
        }
      } catch (error) {
        console.warn('Crop database query timeout/error, continuing without data:', error);
      }
    }

    // Step 3: Generate answer with crop data context
    const systemPrompt = `You are a helpful garden planning assistant with access to a database of 270+ crops.

When users ask about growing plants:
- Provide specific, data-driven advice using the crop database when available
- Include growing conditions, planting times, companion plants, pests/diseases
- Mention cultural varieties when relevant
- Keep responses conversational, friendly, and concise (2-3 sentences max)
- If you have specific crop data, use it. If not, provide general guidance.

Current crop data available: ${cropData ? 'Yes' : 'No'}`;

    const userPrompt = cropData 
      ? `Question: ${questionText}\n\nRelevant crop data:\n${JSON.stringify(cropData, null, 2)}`
      : questionText;

    console.log('Generating answer...');
    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Fast answer generation
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 250, // Shorter for speed
      }),
    });

    if (!chatResponse.ok) {
      const error = await chatResponse.text();
      console.error('Chat completion error:', error);
      throw new Error('Failed to generate response');
    }

    const chatData = await chatResponse.json();
    const answerText = chatData.choices[0].message.content;

    console.log('Generated answer:', answerText);

    return new Response(
      JSON.stringify({
        transcript: questionText,
        answer_text: answerText,
        garden_plan: null, // Could be extended to generate full plans
      }),
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
