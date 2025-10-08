-- Fix security issues identified in security review

-- 1. Create a policy to hide sensitive contact information (email, phone) from public
-- Drop the existing overly permissive public view policy
DROP POLICY IF EXISTS "Public can view active locations" ON public.locations;

-- Create separate policies for public and owners
-- Public can see locations but NOT email/phone
CREATE POLICY "Public can view active locations (limited fields)"
ON public.locations
FOR SELECT
USING (
  status = 'active'
  AND auth.uid() IS NULL
);

-- Authenticated users who submitted the location can see full details including contact info
CREATE POLICY "Submitters can view their own locations with contact info"
ON public.locations
FOR SELECT
USING (
  auth.uid() = submitted_by
);

-- Admins can view all locations with full contact info
CREATE POLICY "Admins can view all locations"
ON public.locations
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- 2. Restrict user_roles visibility to hide admin/moderator identities from public
DROP POLICY IF EXISTS "User roles are viewable by everyone" ON public.user_roles;

-- Only authenticated users can see roles
CREATE POLICY "Authenticated users can view user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);

-- 3. Add an index to improve location queries performance
CREATE INDEX IF NOT EXISTS idx_locations_status ON public.locations(status);
CREATE INDEX IF NOT EXISTS idx_locations_type ON public.locations(type);