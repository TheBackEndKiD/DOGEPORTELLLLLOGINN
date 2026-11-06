-- 🔍 Database Verification Script
-- Run this in your Supabase SQL Editor to verify everything is working

-- 1. Check all tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Verify sample data
SELECT 'Investment Plans' as table_name, COUNT(*) as record_count FROM investment_plans
UNION ALL
SELECT 'Admin Users', COUNT(*) FROM admin_users
UNION ALL
SELECT 'Profiles', COUNT(*) FROM profiles;

-- 3. Test investment plans data
SELECT 
  name,
  min_amount,
  max_amount,
  interest_rate,
  duration_days,
  is_active
FROM investment_plans
ORDER BY min_amount;

-- 4. Test admin user
SELECT 
  email,
  username,
  role,
  is_active
FROM admin_users;

-- 5. Test analytics functions
SELECT * FROM get_signup_stats();

-- 6. Test views
SELECT COUNT(*) as daily_signup_records FROM daily_signups;
SELECT COUNT(*) as weekly_signup_records FROM weekly_signups;
SELECT COUNT(*) as monthly_signup_records FROM monthly_signups;

-- 7. Check RLS policies
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 8. Verify indexes
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;