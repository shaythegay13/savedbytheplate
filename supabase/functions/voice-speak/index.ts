import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation configuration
const MAX_WORDS = 300; // Allow longer responses for detailed explanations
const COOLDOWN_MINUTES = 10;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;

// Simple word count function
const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting (works for unauthenticated users)
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const identifier = `voice-speak:${clientIP}`;

    // Create Supabase client for rate limiting
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cooldown using newsletter_rate_limits table
    const { data: rateLimit } = await supabase
      .from("newsletter_rate_limits")
      .select("*")
      .eq("identifier", identifier)
      .single();

    const now = new Date();

    if (rateLimit) {
      const lastAttempt = new Date(rateLimit.last_attempt_at);
      const timeSinceLast = now.getTime() - lastAttempt.getTime();
      
      if (timeSinceLast < COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((COOLDOWN_MS - timeSinceLast) / 1000);
        const remainingMinutes = Math.ceil(remainingSeconds / 60);
        
        console.log(`Cooldown active for ${identifier}, ${remainingMinutes} minutes remaining`);
        
        return new Response(
          JSON.stringify({ 
            use_browser_tts: true,
            error: 'cooldown',
            cooldown_remaining_seconds: remainingSeconds,
            message: `Cool down Phase: Please wait ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} before using voice again.`
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const formData = await req.formData();
    const text = formData.get('text') as string;
    
    if (!text) {
      throw new Error('No text provided');
    }

    // Validate word count - truncate if too long instead of erroring
    const wordCount = countWords(text);
    let processedText = text;
    
    if (wordCount > MAX_WORDS) {
      console.log(`Text too long: ${wordCount} words (max: ${MAX_WORDS}), truncating`);
      // Truncate to MAX_WORDS and add ellipsis
      processedText = text.split(/\s+/).slice(0, MAX_WORDS).join(' ') + '...';
    }

    // Update rate limit record
    if (rateLimit) {
      await supabase
        .from("newsletter_rate_limits")
        .update({ 
          last_attempt_at: now.toISOString(),
          attempt_count: rateLimit.attempt_count + 1 
        })
        .eq("identifier", identifier);
    } else {
      await supabase
        .from("newsletter_rate_limits")
        .insert({ 
          identifier, 
          first_attempt_at: now.toISOString(),
          last_attempt_at: now.toISOString(),
          attempt_count: 1 
        });
    }

    console.log(`Text-to-speech request from ${identifier}, word count: ${wordCount}`);

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      // Return a flag telling client to use browser TTS
      console.log('No OpenAI API key, returning browser TTS flag');
      return new Response(
        JSON.stringify({
          use_browser_tts: true,
          synthesized_text: processedText,
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
        input: processedText,
        voice: 'shimmer', // Female voice - warm and pleasant
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
            synthesized_text: processedText,
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
        synthesized_text: processedText,
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
