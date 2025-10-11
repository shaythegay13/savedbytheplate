import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Support multiple possible secret names just in case
    const possibleKeys = [
      "Google_Maps",
      "GOOGLE_MAPS",
      "GOOGLE_MAPS_API_KEY",
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