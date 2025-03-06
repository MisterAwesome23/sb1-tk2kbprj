/*
  # Create applications table

  1. New Tables
    - `applications`
      - `id` (uuid, primary key)
      - `job_id` (uuid, foreign key to job_listings)
      - `candidate_id` (uuid, foreign key to profiles)
      - `status` (text, not null)
      - `cover_letter` (text)
      - `ai_score` (integer)
      - `game_score` (integer)
      - `feedback` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `applications` table
    - Add policies for candidates to read and create their own applications
    - Add policies for employers to read applications for their job listings
*/

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES profiles(id),
  status text NOT NULL CHECK (status IN ('applied', 'standby', 'selected', 'rejected')) DEFAULT 'applied',
  cover_letter text,
  ai_score integer,
  game_score integer,
  feedback text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Candidates can read their own applications
CREATE POLICY "Candidates can read their own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (candidate_id = auth.uid());

-- Candidates can create their own applications
CREATE POLICY "Candidates can create their own applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    candidate_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'employee'
    )
  );

-- Employers can read applications for their job listings
CREATE POLICY "Employers can read applications for their job listings"
  ON applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM job_listings
      WHERE job_listings.id = applications.job_id
      AND job_listings.employer_id = auth.uid()
    )
  );

-- Employers can update applications for their job listings
CREATE POLICY "Employers can update applications for their job listings"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM job_listings
      WHERE job_listings.id = applications.job_id
      AND job_listings.employer_id = auth.uid()
    )
  );

-- Add trigger to update the updated_at timestamp
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();