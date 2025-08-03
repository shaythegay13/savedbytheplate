-- Fix function search path security warnings by recreating functions with CASCADE

-- Drop triggers that depend on the functions
DROP TRIGGER IF EXISTS update_garden_plans_updated_at ON public.garden_plans;
DROP TRIGGER IF EXISTS update_weather_alerts_updated_at ON public.weather_alerts;
DROP TRIGGER IF EXISTS update_locations_updated_at ON public.locations;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.find_nearby_locations(numeric, numeric, numeric, text) CASCADE;
DROP FUNCTION IF EXISTS public.update_garden_insights() CASCADE;

-- Recreate update_updated_at_column function with proper search_path
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

-- Recreate find_nearby_locations function with proper search_path
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

-- Recreate update_garden_insights function with proper search_path
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

-- Recreate the triggers
CREATE TRIGGER update_garden_plans_updated_at
  BEFORE UPDATE ON public.garden_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weather_alerts_updated_at
  BEFORE UPDATE ON public.weather_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();