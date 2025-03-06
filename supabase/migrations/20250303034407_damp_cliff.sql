/*
  # Create game results table

  1. New Tables
    - `game_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `game_type` (text, not null)
      - `score` (integer, not null)
      - `data` (jsonb)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `game_results` table
    - Add policies for users to read their own game results
    - Add policies for users to create their own game results
    - Add policies for employers to read game results of candidates who applied to their jobs
*/

CREATE TABLE IF NOT EXISTS game_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  game_type text NOT NULL,
  score integer NOT NULL,
  data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

-- Users can read their own game results
CREATE POLICY "Users can read their own game results"
  ON game_results
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can create their own game results
CREATE POLICY "Users can create their own game results"
  ON game_results
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Employers can read game results of candidates who applied to their jobs
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