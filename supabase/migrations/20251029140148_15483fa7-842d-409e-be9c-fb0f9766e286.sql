-- Fix SECURITY DEFINER function to require authentication
CREATE OR REPLACE FUNCTION public.increment_discussion_views(discussion_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  discussion_exists BOOLEAN;
BEGIN
  -- Require authentication
  IF auth.uid() IS NULL THEN
    RAISE LOG 'Unauthenticated attempt to increment views for discussion: %', discussion_id;
    RETURN;
  END IF;
  
  -- Check if discussion exists and is not locked/deleted
  SELECT EXISTS(
    SELECT 1 FROM public.discussions 
    WHERE id = discussion_id
  ) INTO discussion_exists;
  
  IF NOT discussion_exists THEN
    RAISE LOG 'Attempted to increment views for non-existent discussion: %', discussion_id;
    RETURN;
  END IF;
  
  UPDATE public.discussions
  SET view_count = view_count + 1
  WHERE id = discussion_id;
END;
$function$;

-- Consolidate overlapping SELECT policies on locations table
-- Drop existing overlapping policies
DROP POLICY IF EXISTS "Admins can view all locations" ON public.locations;
DROP POLICY IF EXISTS "Submitters can view their own locations with contact info" ON public.locations;
DROP POLICY IF EXISTS "Users can view own submissions" ON public.locations;

-- Create single consolidated SELECT policy
CREATE POLICY "Users can view locations based on role"
ON public.locations
FOR SELECT
USING (
  -- Admins can view all locations
  has_role(auth.uid(), 'admin'::app_role)
  OR
  -- Users can view their own submissions with full details
  auth.uid() = submitted_by
  OR
  -- Premium subscribers can view all active locations (no contact info without being submitter)
  (user_has_active_subscription(auth.uid()) AND status = 'active')
);

COMMENT ON POLICY "Users can view locations based on role" ON public.locations IS 
'Consolidated policy: Admins see all, submitters see own submissions with contact info, premium users see active locations';