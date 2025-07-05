import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get pending notifications for today
    const today = new Date().toISOString().split('T')[0];
    
    const { data: notifications, error } = await supabase
      .from('garden_notifications')
      .select(`
        *,
        garden_plans!inner(
          notification_preferences,
          user_id
        )
      `)
      .eq('scheduled_date', today)
      .eq('sent', false);

    if (error) {
      console.error('Error fetching notifications:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let sentCount = 0;
    const apiKey = Deno.env.get('BEEHIIV_API_KEY');

    for (const notification of notifications || []) {
      const preferences = notification.garden_plans.notification_preferences;
      
      // Check if user wants email notifications
      if (preferences?.emailNotifications) {
        try {
          // Send email notification using Beehiiv or similar service
          // For now, just log the notification
          console.log(`Sending notification to user ${notification.user_id}:`, notification.message);
          
          // Mark as sent
          await supabase
            .from('garden_notifications')
            .update({ sent: true })
            .eq('id', notification.id);
          
          sentCount++;
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      }
    }

    return new Response(JSON.stringify({ 
      message: `Processed ${notifications?.length || 0} notifications, sent ${sentCount}`,
      processed: notifications?.length || 0,
      sent: sentCount
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error in notification function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});