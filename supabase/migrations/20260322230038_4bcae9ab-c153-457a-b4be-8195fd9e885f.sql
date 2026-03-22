DROP POLICY "Badges are viewable by everyone" ON user_badges;

CREATE POLICY "Users can view own badges" ON user_badges
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all badges" ON user_badges
  FOR SELECT TO public
  USING (has_role(auth.uid(), 'admin'::app_role));