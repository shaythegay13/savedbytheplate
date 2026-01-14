-- Remove the overly permissive RLS policy that exposes profiles based on "public activity"
DROP POLICY IF EXISTS "Authenticated users can view profiles with public activity" ON public.profiles;

-- Update the function to only reference existing tables and be more restrictive
-- Now it only returns true if user has location reviews (the only remaining public activity)
CREATE OR REPLACE FUNCTION public.profile_has_public_activity(_profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.location_reviews 
    WHERE user_id = _profile_id 
    AND deleted_at IS NULL
  )
$$;

-- Create a more restrictive policy: only allow viewing profiles of users who have left reviews
-- AND only expose the profile to those viewing the review (not bulk harvesting)
-- For now, we'll remove bulk access entirely - profiles are only visible to:
-- 1. The user themselves
-- 2. Admins/moderators
-- This prevents harvesting while still allowing profile management