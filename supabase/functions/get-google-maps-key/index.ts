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
    // Initialize Supabase client for rate limiting (no auth required)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Derive a best-effort identifier using Origin + IP for public requests
    const origin = req.headers.get("origin") ?? "unknown";
    const xff = req.headers.get("x-forwarded-for") ?? "";
    const ip = xff.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const identifier = `${origin}|${ip}`;

    // Check rate limit in a rolling window using newsletter_rate_limits
    const windowStartIso = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();

    const { data: rows } = await supabase
      .from("newsletter_rate_limits")
      .select("id, attempt_count, first_attempt_at")
      .eq("identifier", identifier)
      .gte("first_attempt_at", windowStartIso)
      .order("first_attempt_at", { ascending: false })
      .limit(1);

    const rateLimitData = rows && rows.length > 0 ? rows[0] : null;

    if (rateLimitData && rateLimitData.attempt_count >= MAX_REQUESTS_PER_WINDOW) {
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: RATE_LIMIT_WINDOW_MINUTES * 60
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update or insert rate limit record
    const nowIso = new Date().toISOString();
    if (rateLimitData) {
      await supabase
        .from("newsletter_rate_limits")
        .update({
          attempt_count: rateLimitData.attempt_count + 1,
          last_attempt_at: nowIso
        })
        .eq("id", rateLimitData.id);
    } else {
      await supabase
        .from("newsletter_rate_limits")
        .insert({
          identifier,
          attempt_count: 1,
          first_attempt_at: nowIso,
          last_attempt_at: nowIso
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