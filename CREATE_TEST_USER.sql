-- Create Test User for Login
-- Run this in your Supabase SQL Editor

-- IMPORTANT: First create the auth user in Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add User"
-- 3. Email: testuser@example.com
-- 4. Password: TestPassword123!
-- 5. Check "Auto-confirm user"
-- 6. Click "Create User"
-- 7. Copy the user ID from the created user
-- 8. Replace 'YOUR_AUTH_USER_ID_HERE' below with that ID

-- Then run this SQL to create the profile:

INSERT INTO profiles (
  id,
  uid,
  email,
  first_name,
  last_name,
  username,
  phone,
  account_type,
  account_level,
  account_status,
  total_balance,
  available_balance,
  total_deposit,
  total_withdraw,
  total_invest,
  current_invest,
  profit,
  withdraws,
  kyc_status,
  kyc_document_url,
  referral_code,
  referred_by,
  created_at,
  updated_at
) VALUES (
  'YOUR_AUTH_USER_ID_HERE', -- REPLACE THIS with actual Supabase auth user ID
  'USR12345',
  'testuser@example.com',
  'John',
  'Doe',
  'testuser',
  '+1234567890',
  'individual',
  'STARTER',
  'active',
  5000.00,
  2500.00,
  5000.00,
  0.00,
  2500.00,
  2500.00,
  350.00,
  0.00,
  'verified',
  '',
  'TEST' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (email)
DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  username = EXCLUDED.username,
  total_balance = EXCLUDED.total_balance,
  available_balance = EXCLUDED.available_balance,
  account_status = EXCLUDED.account_status;

-- Verify the profile was created
SELECT
  id,
  uid,
  email,
  first_name,
  last_name,
  account_level,
  account_status,
  total_balance,
  available_balance,
  kyc_status,
  created_at
FROM profiles
WHERE email = 'testuser@example.com';

-- Optional: Create some sample transactions for the test user
-- (Run this AFTER creating the profile)
INSERT INTO transactions (
  user_id,
  type,
  amount,
  status,
  payment_method,
  created_at
)
SELECT
  id,
  'deposit',
  5000.00,
  'approved',
  'bank_transfer',
  NOW() - INTERVAL '7 days'
FROM profiles
WHERE email = 'testuser@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO transactions (
  user_id,
  type,
  amount,
  status,
  payment_method,
  created_at
)
SELECT
  id,
  'interest',
  350.00,
  'approved',
  'system',
  NOW() - INTERVAL '3 days'
FROM profiles
WHERE email = 'testuser@example.com'
ON CONFLICT DO NOTHING;

-- Optional: Create a sample investment
INSERT INTO user_investments (
  user_id,
  plan_id,
  amount,
  status,
  roi_percent,
  duration_days,
  start_date,
  end_date,
  created_at
)
SELECT
  p.id,
  ip.id,
  2500.00,
  'active',
  ip.roi_percent,
  ip.duration_days,
  NOW(),
  NOW() + (ip.duration_days || ' days')::INTERVAL,
  NOW()
FROM profiles p
CROSS JOIN investment_plans ip
WHERE p.email = 'testuser@example.com'
  AND ip.name = 'Starter Plan'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Verify everything was created
SELECT
  'Profile' as type,
  email,
  account_status,
  total_balance
FROM profiles
WHERE email = 'testuser@example.com'

UNION ALL

SELECT
  'Transactions',
  t.type,
  t.status,
  t.amount::text
FROM transactions t
JOIN profiles p ON t.user_id = p.id
WHERE p.email = 'testuser@example.com'

UNION ALL

SELECT
  'Investments',
  'Investment',
  ui.status,
  ui.amount::text
FROM user_investments ui
JOIN profiles p ON ui.user_id = p.id
WHERE p.email = 'testuser@example.com';
