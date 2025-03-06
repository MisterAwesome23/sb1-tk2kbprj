/*
  # Create job listings table

  1. New Tables
    - `job_listings`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `requirements` (text[], not null)
      - `employer_id` (uuid, foreign key to profiles)
      - `location` (text, not null)
      - `type` (text, not null)
      - `status` (text, not null)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `job_listings` table
    - Add policies for authenticated users to read all job listings
    - Add policies for employers to create and update their own job listings
*/

CREATE TABLE IF NOT EXISTS job_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  requirements text[] NOT NULL,
  employer_id uuid NOT NULL REFERENCES profiles(id),
  location text NOT NULL,
  type text NOT NULL CHECK (type IN ('full-time', 'part-time', 'contract')),
  status text NOT NULL CHECK (status IN ('open', 'closed', 'in-progress')) DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;

-- Everyone can read job listings
CREATE POLICY "Anyone can read job listings"
  ON job_listings
  FOR SELECT
  USING (true);

-- Employers can create their own job listings
CREATE POLICY "Employers can create their own job listings"
  ON job_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    employer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'employer'
    )
  );

-- Employers can update their own job listings
CREATE POLICY "Employers can update their own job listings"
  ON job_listings
  FOR UPDATE
  TO authenticated
  USING (
    employer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'employer'
    )
  );

-- Employers can delete their own job listings
CREATE POLICY "Employers can delete their own job listings"
  ON job_listings
  FOR DELETE
  TO authenticated
  USING (
    employer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'employer'
    )
  );

-- Add trigger to update the updated_at timestamp
CREATE TRIGGER update_job_listings_updated_at
  BEFORE UPDATE ON job_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();