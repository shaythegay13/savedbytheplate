/// <reference lib="dom" />
/// <reference lib="es2021" />

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

declare const Deno: any;

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

// Remove special characters that shouldn't be read aloud
const sanitizeForSpeech = (text: string): string => {
  return text
    // Remove markdown-style formatting
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/_/g, ' ')
    .replace(/`/g, '')
    .replace(/#+\s*/g, '')
    // Remove brackets and parentheses
    .replace(/\[|\]/g, '')
    .replace(/\(|\)/g, '')
    .replace(/\{|\}/g, '')
    // Remove other special characters
    .replace(/[~^<>|\\]/g, '')
    // Replace dashes with spaces for natural speech
    .replace(/\s*-\s*/g, ' ')
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
};

serve(async (req: Request) => {
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
    
    // Sanitize text for speech (remove special characters)
    processedText = sanitizeForSpeech(processedText);

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

    // Always use browser TTS - OpenAI TTS disabled to save costs
    // The browser TTS has been enhanced with better voice selection
    console.log('Using browser TTS (OpenAI TTS disabled)');
    return new Response(
      JSON.stringify({
        use_browser_tts: true,
        synthesized_text: processedText,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: unknown) {
    console.error('Error in voice-speak function:', error);
    const err = error instanceof Error ? error : new Error(String(error));
    
    // On any error, suggest browser TTS as fallback
    return new Response(
      JSON.stringify({ 
        use_browser_tts: true,
        error: err.message 
      }),
      {
        status: 200, // Return 200 so client can handle fallback
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
