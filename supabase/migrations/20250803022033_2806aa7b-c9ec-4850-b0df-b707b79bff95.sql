-- Fix function search path security warnings

-- Drop and recreate update_updated_at_column function with proper search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop and recreate find_nearby_locations function with proper search_path
DROP FUNCTION IF EXISTS public.find_nearby_locations(numeric, numeric, numeric, text);

CREATE OR REPLACE FUNCTION public.find_nearby_locations(
  search_lat DECIMAL,
  search_lng DECIMAL,
  radius_km DECIMAL DEFAULT 5.0,
  location_type TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  type TEXT,
  description TEXT,
  address TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  organization TEXT,
  website TEXT,
  distance_km DECIMAL
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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
  ORDER BY distance_km;
END;
$$;

-- Fix update_garden_insights function with proper search_path
DROP FUNCTION IF EXISTS public.update_garden_insights();

CREATE OR REPLACE FUNCTION public.update_garden_insights()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    plan_record RECORD;
BEGIN
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
$$;