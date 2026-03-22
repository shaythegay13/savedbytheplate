-- Fix 1: Make user_roles ALL policy explicit with WITH CHECK
DROP POLICY "Only admins can manage user roles" ON user_roles;

CREATE POLICY "Only admins can manage user roles" ON user_roles
  FOR ALL
  TO public
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));