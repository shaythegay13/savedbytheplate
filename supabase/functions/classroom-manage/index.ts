import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify the caller
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, session_id, student_user_id, badge_name, badge_type, badge_description } = await req.json();

    if (action === 'award_badge') {
      // Verify caller is the teacher of the session
      const { data: session } = await supabase
        .from('classroom_sessions')
        .select('teacher_id')
        .eq('id', session_id)
        .single();

      if (!session || session.teacher_id !== user.id) {
        return new Response(JSON.stringify({ error: "Only the session teacher can award badges" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify the student is a participant
      const { data: participant } = await supabase
        .from('classroom_participants')
        .select('id')
        .eq('session_id', session_id)
        .eq('user_id', student_user_id)
        .single();

      if (!participant) {
        return new Response(JSON.stringify({ error: "Student not in session" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Insert badge using service role (bypasses RLS)
      const { data: badge, error: badgeError } = await supabase
        .from('user_badges')
        .insert({
          user_id: student_user_id,
          badge_name,
          badge_type,
          badge_description,
        })
        .select()
        .single();

      if (badgeError) {
        return new Response(JSON.stringify({ error: "Failed to award badge" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true, badge }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
