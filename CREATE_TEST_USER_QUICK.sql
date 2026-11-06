-- ============================================
-- CREATE TEST USER - QUICK SETUP
-- ============================================
-- This creates a test user you can login with immediately
--
-- ⚠️ IMPORTANT: You MUST first create the auth user manually:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add user"
-- 3. Email: testuser@doge.com
-- 4. Password: Test123!
-- 5. Enable "Auto Confirm User"
-- 6. Click "Create user"
-- 7. COPY THE USER ID
-- 8. Replace 'PASTE_USER_ID_HERE' below
-- 9. Run this SQL script
-- ============================================

-- ============================================
-- OPTION 1: If you have the User ID
-- ============================================

-- Replace 'PASTE_USER_ID_HERE' with the actual UUID from step 7 above
DO $$
DECLARE
  user_id_var uuid := 'PASTE_USER_ID_HERE'::uuid; -- REPLACE THIS
  user_email text := 'testuser@doge.com';
  user_exists boolean;
BEGIN
  -- Verify user exists in auth.users
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE id = user_id_var
  ) INTO user_exists;

  IF NOT user_exists THEN
    RAISE EXCEPTION 'User does not exist. Please create user in Dashboard first (Authentication → Users → Add user)';
  END IF;

  -- Create profile
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
    user_id_var,
    'testuser',
    user_email,
    'Test User',
    NULL,
    'United States',
    1000.00, -- Starting with $1000 for testing
    1000.00, -- Total deposit
    250.50,  -- Some profit for testing
    500.00,  -- Total invested
    0,       -- No withdrawals yet
    upper(substr(md5(random()::text), 1, 8)),
    NULL,
    'approved', -- Pre-approved KYC
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id)
  DO UPDATE SET
    username = EXCLUDED.username,
    email = EXCLUDED.email,
    balance = EXCLUDED.balance,
    total_deposit = EXCLUDED.total_deposit,
    profit = EXCLUDED.profit,
    kyc_status = 'approved',
    is_active = true,
    updated_at = NOW();

  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ TEST USER CREATED SUCCESSFULLY!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '📧 Email: testuser@doge.com';
  RAISE NOTICE '🔐 Password: Test123!';
  RAISE NOTICE '💰 Balance: $1000.00';
  RAISE NOTICE '✅ KYC Status: Approved';
  RAISE NOTICE '🌐 Login at: /login';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

-- Display the created user
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
  is_active
FROM profiles
WHERE email = 'testuser@doge.com';

-- ============================================
-- OPTION 2: Alternative - Find existing auth user
-- ============================================

-- If you already created the user but don't know the ID:
/*
DO $$
DECLARE
  found_user_id uuid;
  user_email text := 'testuser@doge.com';
BEGIN
  -- Find the user ID from auth.users
  SELECT id INTO found_user_id
  FROM auth.users
  WHERE email = user_email;

  IF found_user_id IS NULL THEN
    RAISE EXCEPTION 'User % not found in auth.users. Create it first in Dashboard.', user_email;
  END IF;

  -- Create profile using found ID
  INSERT INTO profiles (
    id, username, email, full_name, country, balance, total_deposit,
    profit, total_invested, total_withdrawn, referral_code, kyc_status, is_active
  )
  VALUES (
    found_user_id,
    'testuser',
    user_email,
    'Test User',
    'United States',
    1000.00,
    1000.00,
    250.50,
    500.00,
    0,
    upper(substr(md5(random()::text), 1, 8)),
    'approved',
    true
  )
  ON CONFLICT (id)
  DO UPDATE SET
    balance = EXCLUDED.balance,
    kyc_status = 'approved',
    is_active = true;

  RAISE NOTICE '✅ Profile created for existing auth user!';
  RAISE NOTICE '📧 Email: testuser@doge.com';
  RAISE NOTICE '🔐 Password: Test123!';
END $$;
*/
