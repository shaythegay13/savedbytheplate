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

    // Generate conversational response using GPT
    const systemPrompt = `You are a helpful garden planning assistant. You help users plan their gardens by asking questions and providing personalized advice based on their location, space, experience level, and preferences.

When users ask about growing specific plants, provide information about:
- Growing conditions (sunlight, soil, water needs)
- Best planting times for their location
- Companion plants
- Common pests and diseases
- Harvesting tips

Keep your responses conversational, friendly, and concise (2-3 sentences). If you need more information to give better advice, ask relevant follow-up questions.`;

    console.log('Generating response for:', questionText);

    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: questionText }
        ],
        temperature: 0.7,
        max_tokens: 300,
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
