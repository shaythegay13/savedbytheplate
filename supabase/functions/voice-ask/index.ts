import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to call Claude via AWS Bedrock
async function askClaude(question: string, cropData: any[] = []) {
  const AWS_ACCESS_KEY_ID = Deno.env.get('AWS_ACCESS_KEY_ID');
  const AWS_SECRET_ACCESS_KEY = Deno.env.get('AWS_SECRET_ACCESS_KEY');
  const AWS_REGION = Deno.env.get('AWS_REGION') || 'us-east-1';
  
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials not configured');
  }

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
- If you have specific data, use it. If not, provide general guidance.`;

  let userPrompt = question;
  if (cropData.length > 0) {
    userPrompt += `\n\nRelevant crops from database:\n${JSON.stringify(cropData.slice(0, 5), null, 2)}`;
  }

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 500,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  };

  // AWS Signature Version 4
  const service = 'bedrock';
  const host = `bedrock-runtime.${AWS_REGION}.amazonaws.com`;
  const endpoint = `https://${host}/model/anthropic.claude-3-haiku-20240307-v1:0/invoke`;
  
  const dateNow = new Date();
  const amzDate = dateNow.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.substring(0, 8);

  const payloadString = JSON.stringify(payload);
  const payloadHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payloadString))
    .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));

  const canonicalHeaders = `host:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-date';
  const canonicalRequest = `POST\n/model/anthropic.claude-3-haiku-20240307-v1:0/invoke\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  const credentialScope = `${dateStamp}/${AWS_REGION}/${service}/aws4_request`;
  const canonicalRequestHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonicalRequest))
    .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${canonicalRequestHash}`;

  const getSignatureKey = async (key: string, dateStamp: string, regionName: string, serviceName: string) => {
    const kDate = await crypto.subtle.importKey('raw', new TextEncoder().encode('AWS4' + key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
      .then(k => crypto.subtle.sign('HMAC', k, new TextEncoder().encode(dateStamp)));
    const kRegion = await crypto.subtle.importKey('raw', kDate, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
      .then(k => crypto.subtle.sign('HMAC', k, new TextEncoder().encode(regionName)));
    const kService = await crypto.subtle.importKey('raw', kRegion, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
      .then(k => crypto.subtle.sign('HMAC', k, new TextEncoder().encode(serviceName)));
    const kSigning = await crypto.subtle.importKey('raw', kService, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
      .then(k => crypto.subtle.sign('HMAC', k, new TextEncoder().encode('aws4_request')));
    return kSigning;
  };

  const signingKey = await getSignatureKey(AWS_SECRET_ACCESS_KEY, dateStamp, AWS_REGION, service);
  const signature = await crypto.subtle.importKey('raw', signingKey, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    .then(k => crypto.subtle.sign('HMAC', k, new TextEncoder().encode(stringToSign)))
    .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));

  const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${AWS_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Amz-Date': amzDate,
      'Authorization': authorizationHeader,
    },
    body: payloadString,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AWS Bedrock error: ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text_question } = await req.json();

    if (!text_question) {
      throw new Error('No question text provided');
    }

    console.log('Question:', text_question);

    // Get crop data from deployed backend
    let cropData = [];
    try {
      const cropsResponse = await fetch('https://agenticaigardenplanner.onrender.com/api/crops', {
        signal: AbortSignal.timeout(2000),
      });
      
      if (cropsResponse.ok) {
        const allCrops = await cropsResponse.json();
        // Simple keyword matching
        const keywords = text_question.toLowerCase().split(' ');
        cropData = allCrops.filter((crop: any) => 
          keywords.some(kw => 
            crop.name?.toLowerCase().includes(kw) ||
            crop.description?.toLowerCase().includes(kw)
          )
        );
      }
    } catch (e) {
      console.warn('Crop fetch timeout, continuing without data');
    }

    // Generate answer with Claude
    const answerText = await askClaude(text_question, cropData);

    console.log('Generated answer');

    return new Response(
      JSON.stringify({
        transcript: text_question,
        answer_text: answerText,
        garden_plan: null,
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
