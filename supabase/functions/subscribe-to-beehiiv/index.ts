
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
    console.log("Processing subscription request for email:", email);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email);
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
