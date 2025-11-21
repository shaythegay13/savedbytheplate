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

    // Step 1: Fast intent extraction (using gpt-4o-mini for speed)
    const intentPrompt = `Extract key information from this garden question. Reply ONLY with JSON.
Question: "${questionText}"

Return JSON with:
- crops: array of crop names mentioned (empty if none)
- cultural_context: detected cultural context (african/asian/latin/caribbean or null)
- needs_crop_data: boolean (true if question needs specific crop info)
- needs_companion_data: boolean (true if asking about companion planting)
- needs_disease_info: boolean (true if asking about plant diseases/problems)
- question_type: "general" | "companion_planting" | "disease" | "crop_info" | "planning"

Example: {"crops":["tomato"],"cultural_context":null,"needs_crop_data":true,"needs_companion_data":false,"needs_disease_info":false,"question_type":"crop_info"}`;

    console.log('Extracting intent...');
    const intentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: intentPrompt }],
        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    const intentData = await intentResponse.json();
    const intent = JSON.parse(intentData.choices[0].message.content);
    console.log('Intent:', intent);

    // Step 2: Query backend data in parallel (with timeouts for speed)
    const dataPromises: Promise<any>[] = [];
    let cropData = null;
    let enumData = null;
    
    // Query crops if needed
    if (intent.needs_crop_data) {
      console.log('Querying crop database...');
      dataPromises.push(
        fetch('https://agenticaigardenplanner.onrender.com/api/crops', {
          method: 'GET',
          signal: AbortSignal.timeout(1500),
        })
        .then(res => res.ok ? res.json() : null)
        .then(allCrops => {
          if (!allCrops) return null;
          
          if (intent.crops.length > 0) {
            return allCrops.filter((crop: any) => 
              intent.crops.some((searchCrop: string) => 
                crop.name?.toLowerCase().includes(searchCrop.toLowerCase()) ||
                crop.varieties?.some((v: any) => v.name?.toLowerCase().includes(searchCrop.toLowerCase()))
              )
            ).slice(0, 5);
          } else if (intent.cultural_context) {
            return allCrops.filter((crop: any) => 
              crop.cultural_origin?.toLowerCase().includes(intent.cultural_context)
            ).slice(0, 5);
          }
          return null;
        })
        .catch(err => {
          console.warn('Crop database timeout/error:', err);
          return null;
        })
      );
    }
    
    // Query enums for companion planting and environmental data
    if (intent.needs_companion_data || intent.question_type === 'companion_planting') {
      console.log('Querying companion planting data...');
      dataPromises.push(
        fetch('https://agenticaigardenplanner.onrender.com/api/enums', {
          method: 'GET',
          signal: AbortSignal.timeout(1500),
        })
        .then(res => res.ok ? res.json() : null)
        .catch(err => {
          console.warn('Enums query timeout/error:', err);
          return null;
        })
      );
    }
    
    // Wait for all parallel queries (max 1.5s each)
    const results = await Promise.all(dataPromises);
    
    if (intent.needs_crop_data && results.length > 0) {
      cropData = results[0];
      console.log(`Found ${cropData?.length || 0} relevant crops`);
    }
    
    if ((intent.needs_companion_data || intent.question_type === 'companion_planting') && results.length > 1) {
      enumData = results[1];
      console.log('Retrieved companion planting & environmental data');
    } else if ((intent.needs_companion_data || intent.question_type === 'companion_planting') && results.length === 1 && !intent.needs_crop_data) {
      enumData = results[0];
      console.log('Retrieved companion planting & environmental data');
    }

    // Step 3: Generate answer with rich context
    const systemPrompt = `You are a helpful garden planning assistant with access to:
- 270+ crops with 100+ varieties
- 300+ plant disease database
- Companion planting intelligence
- Environmental/climate data via Google APIs

When answering:
- Provide specific, data-driven advice using the available data
- Include growing conditions, planting times, companion plants, diseases/pests when relevant
- Mention cultural varieties (African, Asian, Latin, Caribbean) when appropriate
- Keep responses conversational, friendly, and concise (2-3 sentences max)
- If you have specific data, use it. If not, provide general guidance.

Available data: ${cropData ? 'Crop info' : ''}${enumData ? ', Companion planting & environmental data' : ''}${(!cropData && !enumData) ? 'General knowledge only' : ''}`;

    let contextData = `Question: ${questionText}`;
    
    if (cropData) {
      contextData += `\n\nRelevant crops (with varieties, diseases, companion plants):\n${JSON.stringify(cropData, null, 2)}`;
    }
    
    if (enumData) {
      contextData += `\n\nCompanion planting & environmental data:\n${JSON.stringify(enumData, null, 2)}`;
    }
    
    const userPrompt = contextData;

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
