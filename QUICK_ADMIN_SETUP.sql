-- ============================================
-- QUICK ADMIN SETUP
-- Add worldvibemanager@gmail.com as Super Admin
-- ============================================

-- Step 1: Add to admin_users table
-- This works whether the user exists or not
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

-- Step 2: Verify the admin was added
SELECT
  id,
  email,
  role,
  is_active,
  created_at
FROM admin_users
WHERE email = 'worldvibemanager@gmail.com';
