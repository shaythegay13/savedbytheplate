-- Create tables for agentic garden planning system

-- Table to store user garden plans and preferences
CREATE TABLE public.garden_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  space_type TEXT NOT NULL,
  space_size TEXT NOT NULL,
  sunlight TEXT NOT NULL,
  hardiness_zone TEXT NOT NULL,
  soil_type TEXT NOT NULL,
  rainfall TEXT NOT NULL,
  season TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  goals TEXT NOT NULL,
  space_description TEXT,
  preferred_plants TEXT,
  time_commitment TEXT NOT NULL,
  plan_data JSONB NOT NULL, -- Store the generated plan
  notification_preferences JSONB DEFAULT '{}', -- Store notification settings
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to store user feedback on their garden outcomes
CREATE TABLE public.garden_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  garden_plan_id UUID NOT NULL REFERENCES public.garden_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  plant_name TEXT NOT NULL,
  success_rating INTEGER CHECK (success_rating >= 1 AND success_rating <= 5),
  yield_rating INTEGER CHECK (yield_rating >= 1 AND yield_rating <= 5),
  growth_issues TEXT,
  harvest_notes TEXT,
  would_plant_again BOOLEAN,
  feedback_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  season_planted TEXT,
  actual_harvest_time TEXT
);

-- Table to track successful plant combinations and patterns
CREATE TABLE public.garden_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hardiness_zone TEXT NOT NULL,
  soil_type TEXT NOT NULL,
  sunlight TEXT NOT NULL,
  plant_name TEXT NOT NULL,
  companion_plants TEXT[], -- Plants that work well together
  success_rate DECIMAL(5,2) DEFAULT 0, -- Percentage of successful grows
  average_yield_rating DECIMAL(3,2) DEFAULT 0,
  common_issues TEXT[],
  best_planting_months TEXT[],
  total_attempts INTEGER DEFAULT 0,
  successful_attempts INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for notification schedules
CREATE TABLE public.garden_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  garden_plan_id UUID NOT NULL REFERENCES public.garden_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  notification_type TEXT NOT NULL, -- 'planting', 'care', 'harvest', 'seasonal'
  plant_name TEXT,
  scheduled_date DATE NOT NULL,
  message TEXT NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.garden_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garden_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garden_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garden_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for garden_plans
CREATE POLICY "Users can view their own garden plans" 
ON public.garden_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own garden plans" 
ON public.garden_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own garden plans" 
ON public.garden_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for garden_feedback
CREATE POLICY "Users can view their own garden feedback" 
ON public.garden_feedback 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own garden feedback" 
ON public.garden_feedback 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own garden feedback" 
ON public.garden_feedback 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for garden_insights (public read, system write)
CREATE POLICY "Everyone can read garden insights" 
ON public.garden_insights 
FOR SELECT 
USING (true);

-- RLS Policies for garden_notifications
CREATE POLICY "Users can view their own notifications" 
ON public.garden_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.garden_notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_garden_plans_updated_at
BEFORE UPDATE ON public.garden_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update garden insights when feedback is added
CREATE OR REPLACE FUNCTION public.update_garden_insights()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger to update insights when feedback is added
CREATE TRIGGER garden_feedback_update_insights
    AFTER INSERT ON public.garden_feedback
    FOR EACH ROW
    EXECUTE FUNCTION public.update_garden_insights();