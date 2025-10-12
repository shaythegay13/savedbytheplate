-- Create user_subscriptions table to cache Stripe subscription status
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  subscribed boolean NOT NULL DEFAULT false,
  product_id text,
  subscription_end timestamp with time zone,
  last_checked timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription status
CREATE POLICY "Users can view own subscription"
  ON public.user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Only the system (via edge functions with service role) can update subscriptions
-- No INSERT/UPDATE/DELETE policies for regular users

-- Create function to check if user has active subscription
CREATE OR REPLACE FUNCTION public.user_has_active_subscription(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT subscribed 
     FROM public.user_subscriptions 
     WHERE user_id = _user_id 
     AND (subscription_end IS NULL OR subscription_end > now())
     LIMIT 1),
    false
  );
$$;

-- Add RLS policy to allow subscribers to view full location details
CREATE POLICY "Subscribers can view all location details"
  ON public.locations
  FOR SELECT
  TO authenticated
  USING (user_has_active_subscription(auth.uid()));

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_subscribed ON public.user_subscriptions(subscribed) WHERE subscribed = true;