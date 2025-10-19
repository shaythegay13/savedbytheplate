-- Fix: Remove the overly permissive subscriber policy that exposes contact information
-- This policy allowed premium subscribers to access ALL location data including phone and email
DROP POLICY IF EXISTS "Subscribers can view all location details" ON public.locations;

-- Note: public_locations is already a VIEW (not a table), so it cannot have RLS policies
-- Views inherit access control from their underlying tables
-- The existing policies (Admins, Submitters, Users can view own submissions) remain in place
-- Contact information (phone, email) is now only accessible to:
--   1. Admins (via "Admins can view all locations" policy)
--   2. The user who submitted the location (via "Submitters can view their own locations" policy)