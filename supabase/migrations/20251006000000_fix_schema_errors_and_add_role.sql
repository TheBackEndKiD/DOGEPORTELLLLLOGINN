/*
  # Fix Schema Errors and Add User Role System

  ## Summary
  This migration addresses critical schema issues identified in the database:
  1. Creates the missing `app_role` enum type for user role management
  2. Adds the `role` column to profiles table with proper type
  3. Ensures all dependencies are correctly ordered
  4. Maintains data integrity and security

  ## Changes Made

  ### 1. Create app_role Enum Type
  - Defines user roles: 'client' (regular users) and 'admin' (admin users)
  - Uses IF NOT EXISTS to prevent errors if already created
  - Can be extended with additional roles in the future

  ### 2. Add Role Column to Profiles
  - Column: `role` with type `app_role`
  - Default value: 'client' (all new users are clients by default)
  - NOT NULL constraint ensures every user has a role
  - Safe addition using IF NOT EXISTS pattern

  ## Security Notes
  - Role column enables future role-based access control (RBAC)
  - Default 'client' role ensures least privilege by default
  - Can be used to enhance RLS policies for fine-grained access control

  ## Data Integrity
  - Existing users will be assigned 'client' role automatically
  - No data loss or breaking changes
  - All changes are idempotent (safe to run multiple times)
*/

-- ============================================
-- SECTION 1: Create app_role Enum Type
-- ============================================

-- Create the enum type if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('client', 'admin');
  END IF;
END $$;

-- ============================================
-- SECTION 2: Add Role Column to Profiles
-- ============================================

-- Add role column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN role app_role NOT NULL DEFAULT 'client'::app_role;

    -- Add a comment explaining the column
    COMMENT ON COLUMN public.profiles.role IS 'User role: client (regular user) or admin (admin user)';
  END IF;
END $$;

-- ============================================
-- SECTION 3: Create Index for Role Queries
-- ============================================

-- Add index on role column for efficient role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ============================================
-- SECTION 4: Update RLS Policies (Optional)
-- ============================================

-- This section can be extended to add role-based RLS policies
-- Example: Allow admins to view all profiles
-- (Commented out for now, implement when admin dashboard is ready)

/*
CREATE POLICY IF NOT EXISTS "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    role = 'admin' OR
    id = auth.uid()
  );
*/

-- ============================================
-- SECTION 5: Verification
-- ============================================

-- Verify the enum type was created
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    RAISE EXCEPTION 'Failed to create app_role enum type';
  END IF;

  RAISE NOTICE 'app_role enum type verified successfully';
END $$;

-- Verify the role column was added
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'role'
  ) THEN
    RAISE EXCEPTION 'Failed to add role column to profiles table';
  END IF;

  RAISE NOTICE 'role column verified successfully';
END $$;
