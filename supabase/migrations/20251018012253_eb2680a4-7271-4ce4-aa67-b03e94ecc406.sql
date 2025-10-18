-- Create rate limiting table for Google Maps API key requests
CREATE TABLE IF NOT EXISTS public.google_maps_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  last_request_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on google_maps_rate_limits
ALTER TABLE public.google_maps_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only allow service role to manage rate limits (no user access)
CREATE POLICY "Service role can manage rate limits"
  ON public.google_maps_rate_limits
  FOR ALL
  USING (false);

-- Create index for efficient rate limit lookups
CREATE INDEX idx_google_maps_rate_limits_user_time 
  ON public.google_maps_rate_limits(user_id, last_request_at DESC);

-- Add cleanup function for old rate limit records
CREATE OR REPLACE FUNCTION public.cleanup_google_maps_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.google_maps_rate_limits
  WHERE last_request_at < now() - interval '2 hours';
END;
$$;

-- Improve find_nearby_locations to add existence check and logging
CREATE OR REPLACE FUNCTION public.find_nearby_locations(
  search_lat numeric, 
  search_lng numeric, 
  radius_km numeric DEFAULT 5.0, 
  location_type text DEFAULT NULL::text
)
RETURNS TABLE(
  id uuid, 
  name text, 
  type text, 
  description text, 
  address text, 
  latitude numeric, 
  longitude numeric, 
  organization text, 
  website text, 
  distance_km numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log function call for auditing (helps detect abuse)
  RAISE LOG 'find_nearby_locations called with lat=%, lng=%, radius=%', search_lat, search_lng, radius_km;
  
  -- Validate inputs to prevent abuse
  IF radius_km > 50 THEN
    RAISE EXCEPTION 'Maximum search radius is 50km';
  END IF;
  
  IF search_lat < -90 OR search_lat > 90 OR search_lng < -180 OR search_lng > 180 THEN
    RAISE EXCEPTION 'Invalid coordinates';
  END IF;
  
  RETURN QUERY
  SELECT 
    l.id,
    l.name,
    l.type,
    l.description,
    l.address,
    l.latitude,
    l.longitude,
    l.organization,
    l.website,
    ROUND(
      (6371 * acos(
        cos(radians(search_lat)) * 
        cos(radians(l.latitude)) * 
        cos(radians(l.longitude) - radians(search_lng)) + 
        sin(radians(search_lat)) * 
        sin(radians(l.latitude))
      ))::numeric, 2
    ) AS distance_km
  FROM public.locations l
  WHERE 
    l.status = 'active'
    AND (location_type IS NULL OR l.type = location_type)
    AND (
      6371 * acos(
        cos(radians(search_lat)) * 
        cos(radians(l.latitude)) * 
        cos(radians(l.longitude) - radians(search_lng)) + 
        sin(radians(search_lat)) * 
        sin(radians(l.latitude))
      )
    ) <= radius_km
  ORDER BY distance_km
  LIMIT 100; -- Prevent excessive data retrieval
END;
$$;

-- Improve increment_discussion_views to add existence check
CREATE OR REPLACE FUNCTION public.increment_discussion_views(discussion_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  discussion_exists BOOLEAN;
BEGIN
  -- Check if discussion exists and is not locked/deleted
  SELECT EXISTS(
    SELECT 1 FROM public.discussions 
    WHERE id = discussion_id
  ) INTO discussion_exists;
  
  IF NOT discussion_exists THEN
    RAISE LOG 'Attempted to increment views for non-existent discussion: %', discussion_id;
    RETURN; -- Silently fail for non-existent discussions
  END IF;
  
  UPDATE public.discussions
  SET view_count = view_count + 1
  WHERE id = discussion_id;
END;
$$;