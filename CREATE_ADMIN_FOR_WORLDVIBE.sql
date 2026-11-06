-- ============================================
-- CREATE ADMIN USER FOR worldvibemanager@gmail.com
-- ============================================
-- This script adds admin privileges to worldvibemanager@gmail.com
--
-- IMPORTANT: You must FIRST create this user in Supabase Dashboard:
-- 1. Go to Authentication → Users in Supabase Dashboard
-- 2. Click "Add user"
-- 3. Email: worldvibemanager@gmail.com
-- 4. Password: (choose a secure password)
-- 5. Enable "Auto Confirm User"
-- 6. Click "Create user"
-- 7. COPY THE USER ID (you'll need it below)
-- 8. Then run this SQL script
-- ============================================

-- ============================================
-- STEP 1: VERIFY USER EXISTS IN AUTH.USERS
-- ============================================

DO $$
DECLARE
  user_exists boolean;
  user_email text := 'worldvibemanager@gmail.com';
  user_id_to_check uuid := 'YOUR_USER_ID_HERE'::uuid; -- REPLACE THIS
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
-- STEP 2: INSERT INTO ADMIN_USERS TABLE
-- ============================================

-- Add user to admin_users table with super_admin role
INSERT INTO admin_users (
  id,
  email,
  username,
  password_hash,
  role,
  permissions,
  is_active,
  created_at
)
VALUES (
  'YOUR_USER_ID_HERE'::uuid, -- REPLACE THIS with the user ID from Supabase Dashboard
  'worldvibemanager@gmail.com',
  'worldvibemanager',
  'MANAGED_BY_SUPABASE_AUTH', -- Password is managed by Supabase Auth (auth.users table)
  'super_admin', -- Role: super_admin (highest privileges)
  '["all"]'::jsonb, -- Full permissions
  true, -- Account active
  NOW()
)
ON CONFLICT (id)
DO UPDATE SET
  email = EXCLUDED.email,
  role = 'super_admin',
  permissions = '["all"]'::jsonb,
  is_active = true,
  username = EXCLUDED.username;

-- ============================================
-- STEP 3: CREATE USER PROFILE (Optional)
-- ============================================

-- This creates a regular user profile as well, so the admin can also access user features
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
  'YOUR_USER_ID_HERE'::uuid, -- REPLACE THIS with the same user ID
  'worldvibemanager',
  'worldvibemanager@gmail.com',
  'World Vibe Manager',
  NULL,
  NULL,
  0,
  0,
  0,
  0,
  0,
  upper(substr(md5(random()::text), 1, 8)), -- Generate random referral code
  NULL,
  'approved', -- Pre-approve KYC for admin
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id)
DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  kyc_status = 'approved',
  is_active = true,
  updated_at = NOW();

-- ============================================
-- STEP 4: VERIFY ADMIN SETUP
-- ============================================

DO $$
DECLARE
  admin_count integer;
  profile_count integer;
BEGIN
  -- Check admin_users table
  SELECT COUNT(*) INTO admin_count
  FROM admin_users
  WHERE email = 'worldvibemanager@gmail.com' AND is_active = true;

  -- Check profiles table
  SELECT COUNT(*) INTO profile_count
  FROM profiles
  WHERE email = 'worldvibemanager@gmail.com' AND is_active = true;

  IF admin_count > 0 THEN
    RAISE NOTICE '✓ Admin user created successfully in admin_users table';
  ELSE
    RAISE EXCEPTION '✗ Failed to create admin user in admin_users table';
  END IF;

  IF profile_count > 0 THEN
    RAISE NOTICE '✓ User profile created successfully in profiles table';
  ELSE
    RAISE WARNING '⚠ User profile not found in profiles table (optional)';
  END IF;

  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ ADMIN SETUP COMPLETE!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '📧 Email: worldvibemanager@gmail.com';
  RAISE NOTICE '👤 Role: Super Admin';
  RAISE NOTICE '🔐 Password: (set in Supabase Dashboard)';
  RAISE NOTICE '🌐 Login URL: /admin/login';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

-- ============================================
-- STEP 5: DISPLAY ADMIN DETAILS
-- ============================================

-- Display admin_users record
SELECT
  id,
  email,
  username,
  role,
  permissions,
  is_active,
  created_at
FROM admin_users
WHERE email = 'worldvibemanager@gmail.com';

-- Display profiles record (if exists)
SELECT
  id,
  email,
  username,
  full_name,
  balance,
  referral_code,
  kyc_status,
  is_active,
  created_at
FROM profiles
WHERE email = 'worldvibemanager@gmail.com';

-- ============================================
-- TROUBLESHOOTING TIPS
-- ============================================

-- If you see errors, check these common issues:
--
-- 1. "User does not exist in auth.users"
--    → Go to Supabase Dashboard → Authentication → Users
--    → Create the user first with "Add user" button
--
-- 2. "Duplicate key value violates unique constraint"
--    → Admin user already exists
--    → Check: SELECT * FROM admin_users WHERE email = 'worldvibemanager@gmail.com';
--
-- 3. "Password incorrect" when trying to login
--    → Reset password in Supabase Dashboard
--    → Go to Authentication → Users → Click user → Reset password
--
-- 4. "You do not have admin privileges"
--    → Verify role is set: SELECT role FROM admin_users WHERE email = 'worldvibemanager@gmail.com';
--    → Should be 'super_admin', not 'support' or 'manager'
--
-- ============================================
