-- Add explicit restrictive policies to prevent any user manipulation of subscription data
-- Only the service role (used by edge functions like check-subscription) should manage subscriptions

-- Policy to explicitly deny all user INSERT operations
CREATE POLICY "Only service role can insert subscriptions"
ON public.user_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Policy to explicitly deny all user UPDATE operations  
CREATE POLICY "Only service role can update subscriptions"
ON public.user_subscriptions
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

-- Policy to explicitly deny all user DELETE operations
CREATE POLICY "Only service role can delete subscriptions"
ON public.user_subscriptions
FOR DELETE
TO authenticated
USING (false);