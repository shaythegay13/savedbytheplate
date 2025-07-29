-- Create weather_alerts table to store weather alerts for users
CREATE TABLE public.weather_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  alert_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  headline TEXT NOT NULL,
  description TEXT,
  garden_impact TEXT,
  recommendations TEXT[],
  onset TIMESTAMP WITH TIME ZONE,
  expires TIMESTAMP WITH TIME ZONE,
  area_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(alert_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for weather alerts
CREATE POLICY "Users can view their own weather alerts" 
ON public.weather_alerts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weather alerts" 
ON public.weather_alerts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weather alerts" 
ON public.weather_alerts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weather alerts" 
ON public.weather_alerts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_weather_alerts_updated_at
BEFORE UPDATE ON public.weather_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();