/*
  # Database Diagnostic Script

  Run this script to identify issues in your database.
  This script only reads data and won't modify anything.
*/

-- ============================================
-- CHECK 1: List All Tables
-- ============================================
SELECT
  'TABLES' as check_type,
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================
-- CHECK 2: Check for Invalid Table Names
-- ============================================
SELECT
  'INVALID_TABLES' as check_type,
  tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND (tablename LIKE '%.%' OR tablename ~ '[^a-z0-9_]');

-- ============================================
-- CHECK 3: Check Foreign Key Constraints
-- ============================================
SELECT
  'FOREIGN_KEYS' as check_type,
  conrelid::regclass AS table_name,
  conname AS constraint_name,
  confrelid::regclass AS referenced_table,
  a.attname AS column_name
FROM pg_constraint c
JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
WHERE c.contype = 'f'
  AND connamespace = 'public'::regnamespace
ORDER BY table_name, constraint_name;

-- ============================================
-- CHECK 4: Check for Missing Columns
-- ============================================

-- Check profiles table columns
SELECT
  'PROFILES_COLUMNS' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check admin_users table columns
SELECT
  'ADMIN_USERS_COLUMNS' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'admin_users'
ORDER BY ordinal_position;

-- ============================================
-- CHECK 5: Check for Orphaned Records
-- ============================================

-- Transactions without valid profiles
SELECT
  'ORPHANED_TRANSACTIONS' as check_type,
  COUNT(*) as count
FROM transactions t
LEFT JOIN profiles p ON t.user_id = p.id
WHERE p.id IS NULL;

-- User investments without valid profiles
SELECT
  'ORPHANED_USER_INVESTMENTS' as check_type,
  COUNT(*) as count
FROM user_investments ui
LEFT JOIN profiles p ON ui.user_id = p.id
WHERE p.id IS NULL;

-- Profiles without auth.users
SELECT
  'ORPHANED_PROFILES' as check_type,
  COUNT(*) as count
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;

-- ============================================
-- CHECK 6: Check RLS Policies
-- ============================================
SELECT
  'RLS_POLICIES' as check_type,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- CHECK 7: Check Indexes
-- ============================================
SELECT
  'INDEXES' as check_type,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================
-- CHECK 8: Check for NULL Values in Required Fields
-- ============================================

-- Profiles with missing required data
SELECT
  'PROFILES_NULL_CHECK' as check_type,
  'missing_username' as issue,
  COUNT(*) as count
FROM profiles
WHERE username IS NULL OR username = '';

SELECT
  'PROFILES_NULL_CHECK' as check_type,
  'missing_email' as issue,
  COUNT(*) as count
FROM profiles
WHERE email IS NULL OR email = '';

SELECT
  'PROFILES_NULL_CHECK' as check_type,
  'missing_referral_code' as issue,
  COUNT(*) as count
FROM profiles
WHERE referral_code IS NULL OR referral_code = '';

-- ============================================
-- CHECK 9: Check Data Consistency
-- ============================================

-- Check if balance matches transaction history
SELECT
  'BALANCE_MISMATCH' as check_type,
  p.id,
  p.username,
  p.balance as current_balance,
  COALESCE(SUM(
    CASE
      WHEN t.type = 'deposit' AND t.status = 'approved' THEN t.amount
      WHEN t.type = 'withdraw' AND t.status = 'approved' THEN -t.amount
      WHEN t.type IN ('interest', 'referral_bonus') AND t.status = 'approved' THEN t.amount
      ELSE 0
    END
  ), 0) as calculated_balance
FROM profiles p
LEFT JOIN transactions t ON p.id = t.user_id
GROUP BY p.id, p.username, p.balance
HAVING p.balance != COALESCE(SUM(
    CASE
      WHEN t.type = 'deposit' AND t.status = 'approved' THEN t.amount
      WHEN t.type = 'withdraw' AND t.status = 'approved' THEN -t.amount
      WHEN t.type IN ('interest', 'referral_bonus') AND t.status = 'approved' THEN t.amount
      ELSE 0
    END
  ), 0)
LIMIT 10;

-- ============================================
-- CHECK 10: Check Admin Users Setup
-- ============================================

SELECT
  'ADMIN_USERS_COUNT' as check_type,
  COUNT(*) as total_admins,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_admins,
  COUNT(CASE WHEN role = 'super_admin' THEN 1 END) as super_admins
FROM admin_users;

-- ============================================
-- CHECK 11: Check Enum Types
-- ============================================
SELECT
  'ENUM_TYPES' as check_type,
  t.typname as enum_name,
  e.enumlabel as enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'app_role'
ORDER BY e.enumsortorder;

-- ============================================
-- CHECK 12: Summary Statistics
-- ============================================
SELECT
  'SUMMARY_STATS' as check_type,
  'profiles' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_records
FROM profiles;

SELECT
  'SUMMARY_STATS' as check_type,
  'transactions' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_records
FROM transactions;

SELECT
  'SUMMARY_STATS' as check_type,
  'user_investments' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_records
FROM user_investments;
