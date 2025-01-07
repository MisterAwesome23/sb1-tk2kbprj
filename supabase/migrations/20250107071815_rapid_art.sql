/*
  # Add Profile Management Policies

  1. Changes
    - Add DELETE policy for users to delete their own profiles
    - Add INSERT policy for new user registration
    - Add trigger to update the updated_at timestamp

  2. Security
    - Users can only delete their own profiles
    - New users can create their profile during registration
    - updated_at is automatically managed
*/

-- Allow users to delete their own profiles
CREATE POLICY "Users can delete own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Allow new users to create their profile
CREATE POLICY "Users can create their profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();