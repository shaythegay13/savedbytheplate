import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RATE_LIMIT_WINDOW_MINUTES = 60;
const MAX_REQUESTS_PER_WINDOW = 10;

const diseaseAnalysisSchema = z.object({
  imageData: z.string().min(1, "Image data is required").max(10000000, "Image data too large"),
  analysisType: z.enum(['basic', 'detailed']).optional(),
});

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get JWT from Authorization header for authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client for auth and rate limiting
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) {
      console.error("Authentication failed:", authError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limiting check
    const identifier = user.id;
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
          error: "Rate limit exceeded. You can analyze 10 images per hour. Please try again later.",
          retryAfter: RATE_LIMIT_WINDOW_MINUTES * 60
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate request body
    const rawData = await req.json();
    const validationResult = diseaseAnalysisSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      const validationError = (validationResult as { success: false; error: z.ZodError }).error;
      const errorDetails = validationError.format();
      console.error("Validation failed:", errorDetails);
      return new Response(
        JSON.stringify({ 
          error: "Invalid request data", 
          details: errorDetails 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { imageData, analysisType = 'basic' } = validationResult.data;

    // Update rate limit counter
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

    const PYTHON_API_URL = Deno.env.get('BACKEND_API_URL') || 'https://voiceagentrender.onrender.com';
    
    console.log('Calling Python backend disease identifier at:', `${PYTHON_API_URL}/api/v1/disease/identify`);

    // Call Python backend disease identification endpoint
    const response = await fetch(`${PYTHON_API_URL}/api/v1/disease/identify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_data: imageData,
        analysis_type: analysisType
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Python API error:', response.status, errorText);
      throw new Error(`Python API error: ${response.status} - ${errorText}`);
    }

    const analysis = await response.json();
    console.log('Disease analysis successful:', analysis.disease);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Disease analysis error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze plant image',
        details: errorMessage 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});