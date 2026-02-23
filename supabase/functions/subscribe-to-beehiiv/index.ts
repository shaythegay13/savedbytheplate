
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubscriptionRequest {
  email: string;
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW_HOURS = 1;
const MAX_ATTEMPTS_PER_WINDOW = 3;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: SubscriptionRequest = await req.json();
    console.log("Processing subscription request");
    console.log("Environment check - BEEHIIV_API_KEY exists:", !!Deno.env.get("BEEHIIV_API_KEY"));

    // Initialize Supabase client for rate limiting
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const ipIdentifier = `${clientIP}:${email}`;
    // Email-only identifier prevents bypass via IP rotation
    const emailIdentifier = `email:${email.toLowerCase()}`;

    const windowCutoff = new Date(Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000).toISOString();

    // Check both IP:email and email-only rate limits in parallel
    const [ipRateResult, emailRateResult] = await Promise.all([
      supabase
        .from('newsletter_rate_limits')
        .select('*')
        .eq('identifier', ipIdentifier)
        .gte('last_attempt_at', windowCutoff)
        .single(),
      supabase
        .from('newsletter_rate_limits')
        .select('*')
        .eq('identifier', emailIdentifier)
        .gte('last_attempt_at', windowCutoff)
        .single(),
    ]);

    const rateLimitData = ipRateResult.data;
    const emailRateLimitData = emailRateResult.data;

    // Log non-expected errors
    if (ipRateResult.error && ipRateResult.error.code !== 'PGRST116') {
      console.error('IP rate limit check error:', ipRateResult.error);
    }
    if (emailRateResult.error && emailRateResult.error.code !== 'PGRST116') {
      console.error('Email rate limit check error:', emailRateResult.error);
    }

    // Enforce rate limit on EITHER identifier (IP:email OR email-only)
    const ipExceeded = rateLimitData && rateLimitData.attempt_count >= MAX_ATTEMPTS_PER_WINDOW;
    const emailExceeded = emailRateLimitData && emailRateLimitData.attempt_count >= MAX_ATTEMPTS_PER_WINDOW;
    
    if (ipExceeded || emailExceeded) {
      console.log(`Rate limit exceeded - IP: ${ipExceeded}, Email: ${emailExceeded}`);
      return new Response(
        JSON.stringify({ 
          error: "Too many subscription attempts. Please try again later." 
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Server-side validation
    if (!email || typeof email !== 'string') {
      console.log("Email is required");
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate email format and length
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 255) {
      console.log("Invalid email format or length");
      return new Response(
        JSON.stringify({ error: "Invalid email address format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get Beehiiv API key from environment variables
    const beehiivApiKey = Deno.env.get("BEEHIIV_API_KEY");
    if (!beehiivApiKey) {
      console.error("BEEHIIV_API_KEY not found in environment variables");
      console.error("Available env vars:", Object.keys(Deno.env.toObject()));
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("API key found, making request to Beehiiv...");
    console.log("Using publication ID: pub_7c9ca1e0-7a3f-49e3-8d2a-9c4ae8bb963e");

    // Make request to Beehiiv API with correct headers and endpoint
    const beehiivUrl = `https://api.beehiiv.com/v2/publications/pub_7c9ca1e0-7a3f-49e3-8d2a-9c4ae8bb963e/subscriptions`;
    
    const beehiivResponse = await fetch(beehiivUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${beehiivApiKey}`,
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email: email,
        reactivate_existing: false,
        send_welcome_email: true,
      }),
    });

    console.log("Beehiiv API response status:", beehiivResponse.status);

    if (!beehiivResponse.ok) {
      const errorData = await beehiivResponse.json();
      console.error("Beehiiv API error:", {
        status: beehiivResponse.status,
        statusText: beehiivResponse.statusText,
        errors: errorData.errors || errorData
      });
      
      // Handle specific Beehiiv errors
      if (beehiivResponse.status === 400 && errorData.errors?.some((e: any) => e.message?.includes("already exists"))) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "You're already subscribed to our newsletter!" 
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Handle 401 unauthorized error specifically
      if (beehiivResponse.status === 401) {
        console.error("Authentication failed - please check your API key");
        return new Response(
          JSON.stringify({ error: "Authentication failed. Please contact support." }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to subscribe to newsletter" }),
        {
          status: beehiivResponse.status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const result = await beehiivResponse.json();
    console.log("Successfully subscribed email to Beehiiv:", email);

    // Update rate limit counters for both IP:email and email-only identifiers
    const nowISO = new Date().toISOString();
    
    // Helper to upsert a rate limit entry
    const upsertRateLimit = async (id: string, existing: typeof rateLimitData) => {
      if (existing) {
        await supabase
          .from('newsletter_rate_limits')
          .update({ attempt_count: existing.attempt_count + 1, last_attempt_at: nowISO })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('newsletter_rate_limits')
          .insert({ identifier: id, attempt_count: 1, first_attempt_at: nowISO, last_attempt_at: nowISO });
      }
    };

    // Update both identifiers in parallel
    await Promise.all([
      upsertRateLimit(ipIdentifier, rateLimitData),
      upsertRateLimit(emailIdentifier, emailRateLimitData),
    ]);

    // Cleanup old rate limit entries (async, don't wait)
    supabase.rpc('cleanup_newsletter_rate_limits').then(() => {
      console.log('Cleaned up old rate limit entries');
    }, (err: unknown) => {
      console.error('Cleanup error (non-critical):', err);
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Successfully subscribed to newsletter!",
        data: result 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in subscribe-to-beehiiv function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
