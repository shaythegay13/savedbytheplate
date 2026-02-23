import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const MAX_REQUESTS_PER_HOUR_AUTHENTICATED = 100;
const MAX_REQUESTS_PER_HOUR_ANONYMOUS = 20; // Stricter for anonymous
const MAX_GLOBAL_ANONYMOUS_PER_HOUR = 500; // Global cap across all anonymous requests
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const GLOBAL_ANON_IDENTIFIER = "global:anonymous";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine identity: prefer authenticated user ID, fall back to IP
    const authHeader = req.headers.get("authorization");
    let identifier: string;
    let isAuthenticated = false;
    let maxRequests = MAX_REQUESTS_PER_HOUR_ANONYMOUS;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (user && !error) {
        identifier = user.id;
        isAuthenticated = true;
        maxRequests = MAX_REQUESTS_PER_HOUR_AUTHENTICATED;
      } else {
        // Invalid token — treat as anonymous with IP
        const ip = getClientIP(req);
        identifier = `ip:${ip}`;
      }
    } else {
      const ip = getClientIP(req);
      identifier = `ip:${ip}`;
    }

    console.log(`Rate limiting: ${isAuthenticated ? 'user' : 'anon'}:${identifier.substring(0, 8)}...`);

    const now = new Date();

    // For anonymous users, also enforce a global anonymous request budget
    if (!isAuthenticated) {
      const { data: globalLimit } = await supabase
        .from("google_maps_rate_limits")
        .select("*")
        .eq("user_id", GLOBAL_ANON_IDENTIFIER)
        .single();

      if (globalLimit) {
        const timeSince = now.getTime() - new Date(globalLimit.last_request_at).getTime();
        if (timeSince < RATE_LIMIT_WINDOW_MS && globalLimit.request_count >= MAX_GLOBAL_ANONYMOUS_PER_HOUR) {
          console.log(`Global anonymous rate limit exceeded: ${globalLimit.request_count}`);
          return new Response(
            JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        // Update global counter
        if (timeSince >= RATE_LIMIT_WINDOW_MS) {
          await supabase.from("google_maps_rate_limits")
            .update({ request_count: 1, last_request_at: now.toISOString() })
            .eq("user_id", GLOBAL_ANON_IDENTIFIER);
        } else {
          await supabase.from("google_maps_rate_limits")
            .update({ request_count: globalLimit.request_count + 1, last_request_at: now.toISOString() })
            .eq("user_id", GLOBAL_ANON_IDENTIFIER);
        }
      } else {
        await supabase.from("google_maps_rate_limits")
          .insert({ user_id: GLOBAL_ANON_IDENTIFIER, request_count: 1, last_request_at: now.toISOString() });
      }
    }

    // Per-user/IP rate limit check
    const { data: rateLimit } = await supabase
      .from("google_maps_rate_limits")
      .select("*")
      .eq("user_id", identifier)
      .single();

    if (rateLimit) {
      const timeSince = now.getTime() - new Date(rateLimit.last_request_at).getTime();

      if (timeSince < RATE_LIMIT_WINDOW_MS && rateLimit.request_count >= maxRequests) {
        console.log(`Per-identity rate limit exceeded for ${identifier.substring(0, 8)}..., count: ${rateLimit.request_count}`);
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (timeSince >= RATE_LIMIT_WINDOW_MS) {
        await supabase.from("google_maps_rate_limits")
          .update({ request_count: 1, last_request_at: now.toISOString() })
          .eq("user_id", identifier);
      } else {
        await supabase.from("google_maps_rate_limits")
          .update({ request_count: rateLimit.request_count + 1, last_request_at: now.toISOString() })
          .eq("user_id", identifier);
      }
    } else {
      await supabase.from("google_maps_rate_limits")
        .insert({ user_id: identifier, request_count: 1, last_request_at: now.toISOString() });
    }

    // Support multiple possible secret names
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

    const isApiKey = value.startsWith("AIza");
    const type = isApiKey ? "apiKey" : "clientId";

    console.log(`Google Maps key retrieved for ${isAuthenticated ? 'user' : 'anon'}:${identifier.substring(0, 8)}...`);

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

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) return cfIP;
  return 'unknown';
}
