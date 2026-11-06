-- ============================================
-- CHECK AND ADD ADMIN USER
-- ============================================
-- Email: worldvibemanager@gmail.com
-- UID: 423bd9e2-f4c8-4021-893c-3d5696865113
-- ============================================

-- STEP 1: Verify user exists in auth.users
SELECT
  id,
  email,
  created_at,
  email_confirmed_at,
  CASE
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Email Confirmed'
    ELSE '⚠️ Email Not Confirmed'
  END as status
FROM auth.users
WHERE id = '423bd9e2-f4c8-4021-893c-3d5696865113'
   OR email = 'worldvibemanager@gmail.com';

-- ============================================
-- STEP 2: Check if user is in admin_users table
-- ============================================
SELECT
  au.id,
  au.email,
  au.role,
  au.is_active,
  au.created_at,
  au.updated_at
FROM admin_users au
WHERE au.id = '423bd9e2-f4c8-4021-893c-3d5696865113'
   OR au.email = 'worldvibemanager@gmail.com';

-- ============================================
-- STEP 3: Add user to admin_users table
-- ============================================
-- This will add the user or update if they already exist

INSERT INTO admin_users (id, email, role, is_active, created_at, updated_at)
VALUES (
  '423bd9e2-f4c8-4021-893c-3d5696865113',
  'worldvibemanager@gmail.com',
  'super_admin',
  true,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = 'super_admin',
  is_active = true,
  updated_at = now();

-- ============================================
-- STEP 4: Verify admin was added successfully
-- ============================================
SELECT
  au.id,
  au.email,
  au.role,
  au.is_active,
  au.created_at,
  u.email_confirmed_at,
  CASE
    WHEN au.is_active = true THEN '✅ Active Admin'
    ELSE '❌ Inactive'
  END as admin_status
FROM admin_users au
JOIN auth.users u ON au.id = u.id
WHERE au.email = 'worldvibemanager@gmail.com';

-- ============================================
-- STEP 5: View all active admins
-- ============================================
SELECT
  au.email,
  au.role,
  au.is_active,
  au.created_at,
  u.email_confirmed_at
FROM admin_users au
JOIN auth.users u ON au.id = u.id
WHERE au.is_active = true
ORDER BY au.created_at DESC;
