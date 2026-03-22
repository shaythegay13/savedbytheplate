
DROP POLICY "Users can update own submissions" ON locations;

CREATE POLICY "Users can update own submissions" ON locations
  FOR UPDATE
  TO public
  USING (auth.uid() = submitted_by)
  WITH CHECK (
    auth.uid() = submitted_by
    AND status = 'pending'
    AND verified = false
  );
