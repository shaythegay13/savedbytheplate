-- Fix security issue: Restrict user_roles visibility to prevent admin enumeration
-- Users should only be able to see their own role, not list all admins/moderators

DROP POLICY IF EXISTS "Authenticated users can view user roles" ON public.user_roles;

-- Users can only view their own role
CREATE POLICY "Users can view own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Add trigger context validation to SECURITY DEFINER functions to prevent misuse
-- These functions should only be called from their intended trigger context

CREATE OR REPLACE FUNCTION public.update_discussion_reply_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Verify this is being called from a valid trigger context
  IF TG_TABLE_NAME IS NULL OR TG_TABLE_NAME != 'discussion_replies' THEN
    RAISE EXCEPTION 'This function can only be called as a trigger on discussion_replies table';
  END IF;
  
  IF TG_OP = 'INSERT' THEN
    UPDATE public.discussions
    SET reply_count = reply_count + 1,
        updated_at = now()
    WHERE id = NEW.discussion_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.discussions
    SET reply_count = GREATEST(reply_count - 1, 0)
    WHERE id = OLD.discussion_id;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.award_engagement_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Verify this is being called from a valid trigger context
  IF TG_TABLE_NAME IS NULL THEN
    RAISE EXCEPTION 'This function can only be called as a trigger';
  END IF;
  
  -- Award 10 points for creating a discussion
  IF TG_TABLE_NAME = 'discussions' AND TG_OP = 'INSERT' THEN
    UPDATE public.profiles
    SET points = points + 10
    WHERE id = NEW.user_id;
  -- Award 5 points for creating a reply
  ELSIF TG_TABLE_NAME = 'discussion_replies' AND TG_OP = 'INSERT' THEN
    UPDATE public.profiles
    SET points = points + 5
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_garden_insights()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    plan_record RECORD;
BEGIN
    -- Verify this is being called from a valid trigger context
    IF TG_TABLE_NAME IS NULL OR TG_TABLE_NAME != 'garden_feedback' THEN
      RAISE EXCEPTION 'This function can only be called as a trigger on garden_feedback table';
    END IF;
    
    -- Get the garden plan details
    SELECT hardiness_zone, soil_type, sunlight INTO plan_record
    FROM public.garden_plans 
    WHERE id = NEW.garden_plan_id;
    
    -- Update or insert garden insights
    INSERT INTO public.garden_insights (
        hardiness_zone, soil_type, sunlight, plant_name, 
        total_attempts, successful_attempts, success_rate, average_yield_rating
    )
    VALUES (
        plan_record.hardiness_zone, plan_record.soil_type, plan_record.sunlight, 
        NEW.plant_name, 1, 
        CASE WHEN NEW.success_rating >= 4 THEN 1 ELSE 0 END,
        CASE WHEN NEW.success_rating >= 4 THEN 100.0 ELSE 0.0 END,
        NEW.yield_rating
    )
    ON CONFLICT ON CONSTRAINT garden_insights_pkey 
    DO UPDATE SET
        total_attempts = garden_insights.total_attempts + 1,
        successful_attempts = garden_insights.successful_attempts + 
            CASE WHEN NEW.success_rating >= 4 THEN 1 ELSE 0 END,
        success_rate = (garden_insights.successful_attempts + 
            CASE WHEN NEW.success_rating >= 4 THEN 1 ELSE 0 END) * 100.0 / 
            (garden_insights.total_attempts + 1),
        average_yield_rating = (garden_insights.average_yield_rating * garden_insights.total_attempts + NEW.yield_rating) / 
            (garden_insights.total_attempts + 1),
        last_updated = now();
    
    RETURN NEW;
END;
$function$;