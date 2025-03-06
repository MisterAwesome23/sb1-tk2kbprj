/*
  # Create interviews and notifications tables

  This migration ensures the interviews and notifications tables exist but avoids recreating
  policies that already exist.
*/

-- Check if the interviews table exists first
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'interviews'
  ) THEN
    -- Create interviews table
    CREATE TABLE interviews (
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

    -- Enable RLS
    ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

    -- Create policies only if they don't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'interviews' 
      AND policyname = 'Employers can read interviews for their job applications'
    ) THEN
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
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'interviews' 
      AND policyname = 'Candidates can read their own interviews'
    ) THEN
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
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'interviews' 
      AND policyname = 'Employers can create interviews for their job applications'
    ) THEN
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
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'interviews' 
      AND policyname = 'Employers can update interviews for their job applications'
    ) THEN
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
    END IF;

    -- Add trigger to update the updated_at timestamp for interviews
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger 
      WHERE tgname = 'update_interviews_updated_at'
    ) THEN
      CREATE TRIGGER update_interviews_updated_at
        BEFORE UPDATE ON interviews
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
  END IF;

  -- Check if the notifications table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'notifications'
  ) THEN
    -- Create notifications table
    CREATE TABLE notifications (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      title text NOT NULL,
      message text NOT NULL,
      type text NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
      read boolean NOT NULL DEFAULT false,
      link text,
      created_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

    -- Create policies only if they don't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'notifications' 
      AND policyname = 'Users can read their own notifications'
    ) THEN
      CREATE POLICY "Users can read their own notifications"
        ON notifications
        FOR SELECT
        TO authenticated
        USING (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'notifications' 
      AND policyname = 'Users can update their own notifications'
    ) THEN
      CREATE POLICY "Users can update their own notifications"
        ON notifications
        FOR UPDATE
        TO authenticated
        USING (user_id = auth.uid());
    END IF;
  END IF;
END $$;

-- Add new status to applications table (this is safe to run multiple times)
DO $$
BEGIN
  ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;
  ALTER TABLE applications ADD CONSTRAINT applications_status_check 
    CHECK (status IN ('applied', 'standby', 'selected', 'rejected', 'interview_scheduled'));
END $$;