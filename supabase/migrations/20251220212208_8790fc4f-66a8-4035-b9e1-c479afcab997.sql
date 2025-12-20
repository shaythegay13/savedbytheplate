-- Drop the existing policy
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create security definer function to check if a profile has public activity
CREATE OR REPLACE FUNCTION public.profile_has_public_activity(_profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.discussions WHERE user_id = _profile_id
    UNION
    SELECT 1 FROM public.discussion_replies WHERE user_id = _profile_id
    UNION
    SELECT 1 FROM public.location_reviews WHERE user_id = _profile_id
  )
$$;

-- Policy: Users can always view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Policy: Authenticated users can view profiles with public activity
CREATE POLICY "Authenticated users can view profiles with public activity"
ON public.profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND public.profile_has_public_activity(id)
);

-- Policy: Admins and moderators can view all profiles
CREATE POLICY "Admins and moderators can view all profiles"
ON public.profiles
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'moderator'::app_role)
);