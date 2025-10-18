import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.9";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RATE_LIMIT_WINDOW_MINUTES = 60;
const MAX_REQUESTS_PER_WINDOW = 100;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client for rate limiting
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract user ID from JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check rate limit
    const identifier = user.id;
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000);

    const { data: rateLimitData } = await supabase
      .from("google_maps_rate_limits")
      .select("*")
      .eq("user_id", identifier)
      .gte("last_request_at", windowStart.toISOString())
      .single();

    if (rateLimitData && rateLimitData.request_count >= MAX_REQUESTS_PER_WINDOW) {
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: RATE_LIMIT_WINDOW_MINUTES * 60
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update rate limit
    if (rateLimitData) {
      await supabase
        .from("google_maps_rate_limits")
        .update({
          request_count: rateLimitData.request_count + 1,
          last_request_at: new Date().toISOString()
        })
        .eq("user_id", identifier);
    } else {
      await supabase
        .from("google_maps_rate_limits")
        .insert({
          user_id: identifier,
          request_count: 1,
          last_request_at: new Date().toISOString()
        });
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

    return new Response(
      JSON.stringify({ value, type }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message ?? "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});