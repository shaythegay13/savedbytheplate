
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubscriptionRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: SubscriptionRequest = await req.json();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
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
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Make request to Beehiiv API
    const beehiivResponse = await fetch(
      "https://api.beehiiv.com/v2/publications/pub_7c9ca1e0-7a3f-49e3-8d2a-9c4ae8bb963e/subscriptions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${beehiivApiKey}`,
        },
        body: JSON.stringify({
          email: email,
          reactivate_existing: false,
          send_welcome_email: true,
        }),
      }
    );

    if (!beehiivResponse.ok) {
      const errorData = await beehiivResponse.json();
      console.error("Beehiiv API error:", errorData);
      
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
