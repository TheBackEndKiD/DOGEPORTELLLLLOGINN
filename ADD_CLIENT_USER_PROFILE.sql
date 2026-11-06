-- ============================================
-- CREATE CLIENT USER PROFILE
-- ============================================
-- This script creates a complete user profile for a regular client account
--
-- PREREQUISITES:
-- 1. User must already exist in auth.users table
-- 2. You must have the user's ID from Supabase Dashboard
--
-- INSTRUCTIONS:
-- 1. Replace 'YOUR_USER_ID_HERE' with the actual user ID
-- 2. Replace placeholder values (email, username, etc.)
-- 3. Run this script in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: VERIFY USER EXISTS IN AUTH.USERS
-- ============================================

DO $$
DECLARE
  user_exists boolean;
  user_email text := 'your-email@example.com'; -- CHANGE THIS
  user_id_to_check uuid := 'YOUR_USER_ID_HERE'::uuid; -- CHANGE THIS
BEGIN
  -- Check if user exists in auth.users
  SELECT EXISTS(
    SELECT 1 FROM auth.users
    WHERE id = user_id_to_check
  ) INTO user_exists;

  IF NOT user_exists THEN
    RAISE EXCEPTION 'User with ID % does not exist in auth.users. Please create the user first in Supabase Dashboard (Authentication → Users → Add user)', user_id_to_check;
  ELSE
    RAISE NOTICE '✓ User found in auth.users';
  END IF;
END $$;

-- ============================================
-- STEP 2: GENERATE REFERRAL CODE FUNCTION
-- ============================================

-- Helper function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_unique_referral_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    -- Generate random 8-character code
    new_code := upper(substr(md5(random()::text), 1, 8));

    -- Check if code already exists
    SELECT EXISTS(
      SELECT 1 FROM profiles WHERE referral_code = new_code
    ) INTO code_exists;

    -- Exit loop if unique
    EXIT WHEN NOT code_exists;
  END LOOP;

  RETURN new_code;
END;
$$;

-- ============================================
-- STEP 3: CREATE USER PROFILE
-- ============================================

INSERT INTO profiles (
  id,
  username,
  email,
  full_name,
  phone,
  country,
  balance,
  total_deposit,
  profit,
  total_invested,
  total_withdrawn,
  referral_code,
  referred_by,
  kyc_status,
  is_active,
  created_at,
  updated_at
)
VALUES (
  'YOUR_USER_ID_HERE'::uuid, -- CHANGE THIS: User ID from auth.users
  'desired_username', -- CHANGE THIS: Unique username (no spaces, lowercase recommended)
  'your-email@example.com', -- CHANGE THIS: Must match auth.users email
  'User Full Name', -- CHANGE THIS: User's full name (optional, can be NULL)
  NULL, -- Phone number (user can add later in profile settings)
  NULL, -- Country (user can add later in profile settings)
  0, -- Starting balance: $0
  0, -- Total deposits: $0
  0, -- Total profit: $0
  0, -- Total invested: $0
  0, -- Total withdrawn: $0
  generate_unique_referral_code(), -- Auto-generate unique referral code
  NULL, -- Referred by (NULL if not referred, or put referrer's code here)
  'pending', -- KYC status: pending (options: 'pending', 'approved', 'rejected')
  true, -- Account active: true
  NOW(),
  NOW()
)
ON CONFLICT (id)
DO UPDATE SET
  username = EXCLUDED.username,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  is_active = true,
  updated_at = NOW();

-- ============================================
-- STEP 4: VERIFY PROFILE CREATION
-- ============================================

DO $$
DECLARE
  profile_count integer;
  user_id_to_check uuid := 'YOUR_USER_ID_HERE'::uuid; -- CHANGE THIS
BEGIN
  SELECT COUNT(*) INTO profile_count
  FROM profiles
  WHERE id = user_id_to_check AND is_active = true;

  IF profile_count > 0 THEN
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE '✅ SUCCESS: User profile created successfully!';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE '👤 User can now login at /login';
    RAISE NOTICE '📧 Email: Check profiles table below';
    RAISE NOTICE '🔐 Password: Set in Supabase Dashboard';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  ELSE
    RAISE EXCEPTION '✗ FAILED: Could not create user profile';
  END IF;
END $$;

-- ============================================
-- STEP 5: DISPLAY USER DETAILS
-- ============================================

SELECT
  id,
  username,
  email,
  full_name,
  balance,
  total_deposit,
  profit,
  referral_code,
  kyc_status,
  is_active,
  created_at
FROM profiles
WHERE id = 'YOUR_USER_ID_HERE'::uuid; -- CHANGE THIS

-- ============================================
-- EXAMPLE: Create Multiple Test Users
-- ============================================

-- Uncomment and run this section to create multiple test users at once
-- Make sure to create the auth.users first in Supabase Dashboard

/*
-- Test User 1: testuser1@doge.com
INSERT INTO profiles (
  id, username, email, full_name, balance, total_deposit, profit,
  total_invested, total_withdrawn, referral_code, kyc_status, is_active
)
VALUES (
  'user-id-1'::uuid, -- Replace with actual UUID from auth.users
  'testuser1',
  'testuser1@doge.com',
  'Test User One',
  0, 0, 0, 0, 0,
  generate_unique_referral_code(),
  'pending',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Test User 2: investor@doge.com
INSERT INTO profiles (
  id, username, email, full_name, balance, total_deposit, profit,
  total_invested, total_withdrawn, referral_code, kyc_status, is_active
)
VALUES (
  'user-id-2'::uuid, -- Replace with actual UUID from auth.users
  'investor',
  'investor@doge.com',
  'Active Investor',
  1000, -- Starting balance $1000 for testing
  1000, -- Total deposit $1000
  0, 0, 0,
  generate_unique_referral_code(),
  'approved', -- Pre-approved KYC
  true
)
ON CONFLICT (id) DO NOTHING;

-- Verify created test users
SELECT username, email, balance, kyc_status, referral_code
FROM profiles
WHERE email IN ('testuser1@doge.com', 'investor@doge.com');
*/

-- ============================================
-- TROUBLESHOOTING TIPS
-- ============================================

-- If you see errors, check these common issues:
--
-- 1. "User does not exist in auth.users"
--    → Go to Supabase Dashboard → Authentication → Users
--    → Create the user first with "Add user" button
--    → Enable "Auto Confirm User" toggle
--    → Copy the User ID after creation
--
-- 2. "Duplicate key value violates unique constraint"
--    → User profile already exists
--    → Check: SELECT * FROM profiles WHERE email = 'your-email@example.com';
--    → If exists, use UPDATE instead of INSERT
--
-- 3. "Username already taken"
--    → Choose a different username
--    → Check: SELECT username FROM profiles WHERE username = 'desired_username';
--
-- 4. "Invalid UUID format"
--    → Make sure you copied the full UUID from Supabase Dashboard
--    → Format should be: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
--    → Example: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
--
-- 5. "Cannot login after creating profile"
--    → Verify email matches: SELECT email FROM auth.users WHERE id = 'your-id';
--    → Reset password in Supabase Dashboard if needed
--    → Make sure is_active = true in profiles table
--
-- ============================================
-- CLEANUP FUNCTION (Optional)
-- ============================================

-- Drop the helper function if you don't need it anymore
-- Uncomment to remove:
-- DROP FUNCTION IF EXISTS generate_unique_referral_code();
