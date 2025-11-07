-- Security enhancement: Reduce find_nearby_locations result limit to prevent systematic database scanning
-- This addresses the info-level security finding about unlimited queries
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
  LIMIT 50; -- Reduced from 100 to 50 to limit systematic scanning
END;
$$;