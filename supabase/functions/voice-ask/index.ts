import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AWS Bedrock helper function
async function invokeClaude(prompt: string, systemPrompt?: string) {
  const AWS_ACCESS_KEY_ID = Deno.env.get('AWS_ACCESS_KEY_ID');
  const AWS_SECRET_ACCESS_KEY = Deno.env.get('AWS_SECRET_ACCESS_KEY');
  const AWS_REGION = Deno.env.get('AWS_REGION') || 'us-east-1';

  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials not configured');
  }

  const endpoint = `https://bedrock-runtime.${AWS_REGION}.amazonaws.com/model/anthropic.claude-3-haiku-20240307-v1:0/invoke`;
  const canonicalUri = '/model/anthropic.claude-3-haiku-20240307-v1%3A0/invoke'; // URL-encoded :0
  
  // Create AWS Signature V4
  const service = 'bedrock';
  const host = `bedrock-runtime.${AWS_REGION}.amazonaws.com`;
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.substring(0, 8);
  
  const payload = JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1024,
    messages: [
      { role: "user", content: prompt }
    ],
    ...(systemPrompt && { system: systemPrompt })
  });

  // Create canonical request
  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${AWS_REGION}/${service}/aws4_request`;
  
  const encoder = new TextEncoder();
  
  async function hmac(key: Uint8Array, data: string): Promise<Uint8Array> {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
    return new Uint8Array(signature);
  }

  async function hash(data: string): Promise<string> {
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  const payloadHash = await hash(payload);
  const canonicalHeaders = `host:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-date';
  const canonicalRequest = `POST\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${await hash(canonicalRequest)}`;
  
  // Calculate signature
  let kDate = await hmac(encoder.encode(`AWS4${AWS_SECRET_ACCESS_KEY}`), dateStamp);
  let kRegion = await hmac(kDate, AWS_REGION);
  let kService = await hmac(kRegion, service);
  let kSigning = await hmac(kService, 'aws4_request');
  let signature = await hmac(kSigning, stringToSign);
  
  const signatureHex = Array.from(signature)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  const authorizationHeader = `${algorithm} Credential=${AWS_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signatureHex}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Amz-Date': amzDate,
      'Authorization': authorizationHeader,
    },
    body: payload,
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('AWS Bedrock error:', error);
    throw new Error(`AWS Bedrock error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text_question, audio_data, context } = await req.json();

    let questionText = text_question;

    // If audio data is provided, transcribe it first using OpenAI Whisper
    if (audio_data && !text_question) {
      console.log('Transcribing audio...');
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      
      if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured for transcription');
      }
      
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

    // Step 1: Fast intent extraction using Claude 3 Haiku
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

    console.log('Extracting intent with Claude...');
    const intentText = await invokeClaude(intentPrompt);
    const intent = JSON.parse(intentText);
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

    // Step 3: Generate answer with Claude 3 Haiku
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

    console.log('Generating answer with Claude...');
    const answerText = await invokeClaude(contextData, systemPrompt);

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
