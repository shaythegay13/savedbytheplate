import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validation schemas
const checkoutRequestSchema = z.object({
  price_id: z.string()
    .regex(/^price_[a-zA-Z0-9]{24,}$/, "Invalid Stripe price ID format")
    .max(100, "Price ID too long")
});

const authHeaderSchema = z.string()
  .min(1, "Authorization header is required")
  .regex(/^Bearer\s+[\w-]+\.[\w-]+\.[\w-]+$/, "Invalid JWT format in Authorization header");

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header is required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate Authorization header format
    const authValidation = authHeaderSchema.safeParse(authHeader);
    if (!authValidation.success) {
      const authErrorDetails = authValidation.error.format();
      logStep("Authorization validation failed", authErrorDetails);
      return new Response(
        JSON.stringify({ 
          error: "Invalid authorization format", 
          details: authErrorDetails 
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse and validate request body
    const requestBody = await req.json();
    const bodyValidation = checkoutRequestSchema.safeParse(requestBody);
    if (!bodyValidation.success) {
      const bodyErrorDetails = bodyValidation.error.format();
      logStep("Request body validation failed", bodyErrorDetails);
      return new Response(
        JSON.stringify({ 
          error: "Invalid request body", 
          details: bodyErrorDetails 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { price_id } = bodyValidation.data;
    logStep("Price ID validated", { price_id });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No existing customer, will create at checkout");
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/calendar?success=true`,
      cancel_url: `${origin}/premium?canceled=true`,
    });
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
