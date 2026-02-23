import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const MAX_REQUESTS_PER_HOUR = 100;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Require authentication — no anonymous access
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (!user || authError) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired authentication token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit by authenticated user ID (cannot be spoofed)
    const identifier = user.id;
    
    console.log(`Rate limiting for user: ${identifier.substring(0, 8)}...`);

    // Check rate limit using the google_maps_rate_limits table
    const { data: rateLimit } = await supabase
      .from("google_maps_rate_limits")
      .select("*")
      .eq("user_id", identifier)
      .single();

    const now = new Date();

    if (rateLimit) {
      const lastRequest = new Date(rateLimit.last_request_at);
      const timeSinceFirst = now.getTime() - lastRequest.getTime();

      // If within rate limit window and exceeded limit
      if (timeSinceFirst < RATE_LIMIT_WINDOW_MS && rateLimit.request_count >= MAX_REQUESTS_PER_HOUR) {
        console.log(`Rate limit exceeded for user: ${identifier.substring(0, 8)}..., count: ${rateLimit.request_count}`);
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Reset counter if window has passed, otherwise increment
      if (timeSinceFirst >= RATE_LIMIT_WINDOW_MS) {
        await supabase
          .from("google_maps_rate_limits")
          .update({ request_count: 1, last_request_at: now.toISOString() })
          .eq("user_id", identifier);
      } else {
        await supabase
          .from("google_maps_rate_limits")
          .update({ request_count: rateLimit.request_count + 1, last_request_at: now.toISOString() })
          .eq("user_id", identifier);
      }
    } else {
      // Create new rate limit entry
      await supabase
        .from("google_maps_rate_limits")
        .insert({ user_id: identifier, request_count: 1, last_request_at: now.toISOString() });
    }

    // Support multiple possible secret names just in case
    const possibleKeys = [
      "Google_Maps_API_Key",
      "GOOGLE_MAPS_API_KEY",
      "Google_Maps",
      "GOOGLE_MAPS",
      "GOOGLE_MAPS_KEY",
    ];

    let value: string | undefined;
    for (const name of possibleKeys) {
      const v = Deno.env.get(name);
      if (v && v.trim().length > 0) {
        value = v.trim();
        break;
      }
    }

    if (!value) {
      return new Response(
        JSON.stringify({ error: "Google Maps key not configured in Supabase secrets" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Heuristically determine type
    const isApiKey = value.startsWith("AIza");
    const type = isApiKey ? "apiKey" : "clientId";

    console.log(`Google Maps key retrieved successfully for user: ${identifier.substring(0, 8)}...`);
    
    return new Response(
      JSON.stringify({ value, type }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: unknown) {
    console.error("Error in get-google-maps-key:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
