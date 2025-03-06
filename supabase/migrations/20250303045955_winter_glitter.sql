/*
  # Create interviews and notifications tables

  1. New Tables
    - `interviews`
      - `id` (uuid, primary key)
      - `application_id` (uuid, references applications)
      - `scheduled_at` (timestamptz)
      - `duration` (integer, minutes)
      - `location` (text, optional)
      - `meeting_link` (text, optional)
      - `notes` (text, optional)
      - `status` (text, check constraint)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `message` (text)
      - `type` (text, check constraint)
      - `read` (boolean)
      - `link` (text, optional)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for proper access control
*/

-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  duration integer NOT NULL CHECK (duration >= 15 AND duration <= 120),
  location text,
  meeting_link text,
  notes text,
  status text NOT NULL CHECK (status IN ('scheduled', 'completed', 'canceled')) DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Employers can read interviews for their job applications
CREATE POLICY "Employers can read interviews for their job applications"
  ON interviews
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications
      JOIN job_listings ON applications.job_id = job_listings.id
      WHERE applications.id = interviews.application_id
      AND job_listings.employer_id = auth.uid()
    )
  );

-- Candidates can read their own interviews
CREATE POLICY "Candidates can read their own interviews"
  ON interviews
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = interviews.application_id
      AND applications.candidate_id = auth.uid()
    )
  );

-- Employers can create interviews for their job applications
CREATE POLICY "Employers can create interviews for their job applications"
  ON interviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications
      JOIN job_listings ON applications.job_id = job_listings.id
      WHERE applications.id = interviews.application_id
      AND job_listings.employer_id = auth.uid()
    )
  );

-- Employers can update interviews for their job applications
CREATE POLICY "Employers can update interviews for their job applications"
  ON interviews
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications
      JOIN job_listings ON applications.job_id = job_listings.id
      WHERE applications.id = interviews.application_id
      AND job_listings.employer_id = auth.uid()
    )
  );

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
  read boolean NOT NULL DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "Users can read their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can update their own notifications (for marking as read)
CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Add trigger to update the updated_at timestamp for interviews
CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add new status to applications table
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;
ALTER TABLE applications ADD CONSTRAINT applications_status_check 
  CHECK (status IN ('applied', 'standby', 'selected', 'rejected', 'interview_scheduled'));