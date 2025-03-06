/*
  # Game Results Table and Policies

  1. New Tables
    - `game_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `game_type` (text)
      - `score` (integer)
      - `data` (jsonb, optional)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `game_results` table
    - Add policies for:
      - Users reading their own results
      - Users creating their own results
      - Employers reading results of candidates who applied to their jobs
*/

-- Create the game_results table if it doesn't exist
CREATE TABLE IF NOT EXISTS game_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  game_type text NOT NULL,
  score integer NOT NULL,
  data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read their own game results" ON game_results;
  DROP POLICY IF EXISTS "Users can create their own game results" ON game_results;
  DROP POLICY IF EXISTS "Employers can read game results of candidates who applied to their jobs" ON game_results;
END $$;

-- Create policies
CREATE POLICY "Users can read their own game results"
  ON game_results
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own game results"
  ON game_results
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Employers can read game results of candidates who applied to their jobs"
  ON game_results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'employer'
    ) AND
    EXISTS (
      SELECT 1 FROM applications
      JOIN job_listings ON applications.job_id = job_listings.id
      WHERE applications.candidate_id = game_results.user_id
      AND job_listings.employer_id = auth.uid()
    )
  );