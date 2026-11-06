/*
  # Database Error Fixes and Standardization

  ## Critical Issues Fixed
  1. Remove invalid/duplicate tables (auth.user.id, client_users)
  2. Standardize foreign key references
  3. Add missing columns to profiles table
  4. Fix admin_audit_log structure
  5. Add missing constraints
  6. Add app_role enum type

  ## Changes Made
  - Drop invalid/redundant tables
  - Add missing profile columns (role, total_deposit, profit)
  - Standardize admin_audit_log structure
  - Add proper indexes and constraints
  - Update RLS policies
*/

-- ============================================
-- SECTION 1: Clean Up Invalid Tables
-- ============================================

-- Drop invalid table if it exists (invalid name syntax)
DROP TABLE IF EXISTS "public.auth.user.id" CASCADE;

-- Drop redundant client_users table (we use profiles + auth.users)
DROP TABLE IF EXISTS client_users CASCADE;

-- ============================================
-- SECTION 2: Create Enum Types
-- ============================================

-- Create app_role enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('client', 'admin', 'super_admin');
  END IF;
END $$;

-- ============================================
-- SECTION 3: Add Missing Columns to Profiles
-- ============================================

-- Add role column to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role app_role DEFAULT 'client'::app_role NOT NULL;
  END IF;
END $$;

-- Add total_deposit column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'total_deposit'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_deposit decimal(20,8) DEFAULT 0;
  END IF;
END $$;

-- Add profit column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'profit'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profit decimal(20,8) DEFAULT 0;
  END IF;
END $$;

-- ============================================
-- SECTION 4: Fix Admin Users Structure
-- ============================================

-- Add auth_user_id to admin_users if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'auth_user_id'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN auth_user_id uuid UNIQUE REFERENCES auth.users(id);
  END IF;
END $$;

-- Add updated_at to admin_users if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Make password_hash nullable for admin_users (they use auth.users)
ALTER TABLE admin_users ALTER COLUMN password_hash DROP NOT NULL;

-- ============================================
-- SECTION 5: Fix Admin Audit Log Structure
-- ============================================

-- Drop existing admin_audit_log to recreate with correct structure
DROP TABLE IF EXISTS admin_audit_log CASCADE;

-- Recreate with standardized structure
CREATE TABLE admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource text,
  resource_id text,
  target_table text,
  target_id uuid,
  metadata jsonb,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_audit_admin_id ON admin_audit_log(admin_id);
CREATE INDEX idx_audit_actor_user_id ON admin_audit_log(actor_user_id);
CREATE INDEX idx_audit_created_at ON admin_audit_log(created_at DESC);
CREATE INDEX idx_audit_action ON admin_audit_log(action);

-- Enable RLS
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON admin_audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.auth_user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- ============================================
-- SECTION 6: Fix Foreign Key References
-- ============================================

-- Ensure transactions reference profiles(id) not auth.users(id)
DO $$
BEGIN
  -- Drop old constraint if exists
  ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_user_id_fkey;

  -- Add correct constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'transactions_user_id_profiles_fkey'
  ) THEN
    ALTER TABLE transactions
    ADD CONSTRAINT transactions_user_id_profiles_fkey
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure user_investments reference profiles(id) not auth.users(id)
DO $$
BEGIN
  -- Drop old constraint if exists
  ALTER TABLE user_investments DROP CONSTRAINT IF EXISTS user_investments_user_id_fkey;

  -- Add correct constraint if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_investments_user_id_profiles_fkey'
  ) THEN
    ALTER TABLE user_investments
    ADD CONSTRAINT user_investments_user_id_profiles_fkey
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================
-- SECTION 7: Add Missing Constraints
-- ============================================

-- Ensure referral_code is always generated
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles'
    AND column_name = 'referral_code'
    AND column_default IS NOT NULL
  ) THEN
    ALTER TABLE profiles
    ALTER COLUMN referral_code
    SET DEFAULT generate_referral_code();
  END IF;
END $$;

-- Ensure email is synced from auth.users
CREATE OR REPLACE FUNCTION sync_profile_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email := (SELECT email FROM auth.users WHERE id = NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger if not exists
DROP TRIGGER IF EXISTS sync_profile_email_trigger ON profiles;
CREATE TRIGGER sync_profile_email_trigger
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_profile_email();

-- ============================================
-- SECTION 8: Add Trigger for Admin Updated_At
-- ============================================

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SECTION 9: Update Existing Data
-- ============================================

-- Set default values for any NULL columns
UPDATE profiles
SET
  total_deposit = COALESCE(total_deposit, 0),
  profit = COALESCE(profit, 0),
  balance = COALESCE(balance, 0),
  total_invested = COALESCE(total_invested, 0),
  total_withdrawn = COALESCE(total_withdrawn, 0)
WHERE
  total_deposit IS NULL
  OR profit IS NULL
  OR balance IS NULL
  OR total_invested IS NULL
  OR total_withdrawn IS NULL;

-- ============================================
-- SECTION 10: Add Additional Useful Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_kyc_status ON profiles(kyc_status);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_auth_user_id ON admin_users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- ============================================
-- SECTION 11: Validate Data Integrity
-- ============================================

-- Check for orphaned records
DO $$
DECLARE
  orphaned_count integer;
BEGIN
  -- Check for user_investments without valid profiles
  SELECT COUNT(*) INTO orphaned_count
  FROM user_investments ui
  LEFT JOIN profiles p ON ui.user_id = p.id
  WHERE p.id IS NULL;

  IF orphaned_count > 0 THEN
    RAISE WARNING 'Found % orphaned user_investments records', orphaned_count;
  END IF;

  -- Check for transactions without valid profiles
  SELECT COUNT(*) INTO orphaned_count
  FROM transactions t
  LEFT JOIN profiles p ON t.user_id = p.id
  WHERE p.id IS NULL;

  IF orphaned_count > 0 THEN
    RAISE WARNING 'Found % orphaned transactions records', orphaned_count;
  END IF;
END $$;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database fixes completed successfully!';
  RAISE NOTICE '🗑️  Removed invalid/duplicate tables';
  RAISE NOTICE '📊 Added missing columns to profiles';
  RAISE NOTICE '🔗 Standardized foreign key references';
  RAISE NOTICE '🔒 Fixed admin_audit_log structure';
  RAISE NOTICE '⚡ Added performance indexes';
  RAISE NOTICE '✔️  Validated data integrity';
END $$;
