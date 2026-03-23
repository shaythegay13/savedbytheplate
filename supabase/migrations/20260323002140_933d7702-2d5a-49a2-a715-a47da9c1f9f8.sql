
-- Drop the existing ALL policy
DROP POLICY "Only admins can manage user roles" ON user_roles;

-- Admins can view all roles
CREATE POLICY "Admins can select all user roles" ON user_roles
  FOR SELECT TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update roles
CREATE POLICY "Admins can update user roles" ON user_roles
  FOR UPDATE TO public
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete roles
CREATE POLICY "Admins can delete user roles" ON user_roles
  FOR DELETE TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Block all client-side INSERT — roles must be managed via service role or direct SQL
CREATE POLICY "No client insert on user roles" ON user_roles
  FOR INSERT TO public
  WITH CHECK (false);
