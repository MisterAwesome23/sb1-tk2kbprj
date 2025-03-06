/*
  # Fix for game_results table

  This migration ensures the game_results table exists but avoids recreating
  policies that already exist.
*/

-- Check if the table exists first
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'game_results'
  ) THEN
    -- Create the table if it doesn't exist
    CREATE TABLE game_results (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES profiles(id),
      game_type text NOT NULL,
      score integer NOT NULL,
      data jsonb,
      created_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

    -- Create policies only if they don't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'game_results' 
      AND policyname = 'Users can read their own game results'
    ) THEN
      CREATE POLICY "Users can read their own game results"
        ON game_results
        FOR SELECT
        TO authenticated
        USING (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'game_results' 
      AND policyname = 'Users can create their own game results'
    ) THEN
      CREATE POLICY "Users can create their own game results"
        ON game_results
        FOR INSERT
        TO authenticated
        WITH CHECK (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'game_results' 
      AND policyname = 'Employers can read game results of candidates who applied to their jobs'
    ) THEN
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
    END IF;
  END IF;
END $$;