-- ============================================
-- ADD ADMIN PRIVILEGES TO USER
-- ============================================
-- This script adds admin privileges to an existing Supabase Auth user
--
-- PREREQUISITES:
-- 1. User must already exist in auth.users table
-- 2. You must have the user's ID from Supabase Dashboard
--
-- INSTRUCTIONS:
-- 1. Replace 'YOUR_USER_ID_HERE' with the actual user ID
-- 2. Replace 'worldvibemanager@gmail.com' with your email if different
-- 3. Run this script in Supabase SQL Editor
-- ============================================

-- First, let's check if the user exists in auth.users
DO $$
DECLARE
  user_exists boolean;
  user_email text := 'worldvibemanager@gmail.com';
  user_id_to_check uuid := 'YOUR_USER_ID_HERE'; -- REPLACE THIS WITH ACTUAL USER ID
BEGIN
  -- Check if user exists in auth.users
  SELECT EXISTS(
    SELECT 1 FROM auth.users
    WHERE id = user_id_to_check AND email = user_email
  ) INTO user_exists;

  IF NOT user_exists THEN
    RAISE EXCEPTION 'User with ID % and email % does not exist in auth.users. Please create the user first in Supabase Dashboard.',
      user_id_to_check, user_email;
  ELSE
    RAISE NOTICE '✓ User found in auth.users';
  END IF;
END $$;

-- Insert admin user into admin_users table
INSERT INTO admin_users (
  id,
  email,
  role,
  is_active,
  created_at,
  updated_at
)
VALUES (
  'YOUR_USER_ID_HERE', -- REPLACE THIS WITH ACTUAL USER ID
  'worldvibemanager@gmail.com',
  'super_admin', -- Options: 'super_admin', 'manager', 'support'
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id)
DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Insert profile for the admin user
INSERT INTO profiles (
  id,
  username,
  email,
  full_name,
  referral_code,
  balance,
  total_deposit,
  profit,
  total_invested,
  total_withdrawn,
  kyc_status,
  is_active,
  created_at,
  updated_at
)
VALUES (
  'YOUR_USER_ID_HERE', -- REPLACE THIS WITH ACTUAL USER ID
  'admin', -- You can change this username
  'worldvibemanager@gmail.com',
  'Admin User', -- You can change this name
  'ADMIN001', -- Unique referral code
  0,
  0,
  0,
  0,
  0,
  'approved', -- Auto-approve KYC for admin
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id)
DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = NOW();

-- Verify the admin was created successfully
DO $$
DECLARE
  admin_count integer;
  user_email text := 'worldvibemanager@gmail.com';
BEGIN
  SELECT COUNT(*) INTO admin_count
  FROM admin_users
  WHERE email = user_email AND is_active = true;

  IF admin_count > 0 THEN
    RAISE NOTICE '✓ SUCCESS: Admin privileges granted to %', user_email;
    RAISE NOTICE '✓ You can now login at /admin/login';
  ELSE
    RAISE EXCEPTION '✗ FAILED: Could not create admin user';
  END IF;
END $$;

-- Display admin user details
SELECT
  id,
  email,
  role,
  is_active,
  created_at
FROM admin_users
WHERE email = 'worldvibemanager@gmail.com';
