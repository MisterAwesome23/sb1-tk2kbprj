/*
  # Fix for subscriptions table

  This migration ensures the subscriptions table exists but avoids recreating
  policies that already exist.
*/

-- Check if the table exists first
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'subscriptions'
  ) THEN
    -- Create the table if it doesn't exist
    CREATE TABLE subscriptions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES profiles(id),
      plan text NOT NULL CHECK (plan IN ('free', 'basic', 'premium', 'enterprise')),
      status text NOT NULL CHECK (status IN ('active', 'canceled', 'expired')),
      start_date timestamptz NOT NULL DEFAULT now(),
      end_date timestamptz,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

    -- Create policy only if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'subscriptions' 
      AND policyname = 'Users can read their own subscriptions'
    ) THEN
      CREATE POLICY "Users can read their own subscriptions"
        ON subscriptions
        FOR SELECT
        TO authenticated
        USING (user_id = auth.uid());
    END IF;

    -- Add trigger to update the updated_at timestamp
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger 
      WHERE tgname = 'update_subscriptions_updated_at'
    ) THEN
      CREATE TRIGGER update_subscriptions_updated_at
        BEFORE UPDATE ON subscriptions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
  END IF;
END $$;