/*
  # Fix Security and Performance Issues

  ## Changes Made

  ### 1. Add Missing Foreign Key Indexes
  - Add index on `kyc_verifications.user_id`
  - Add index on `referrals.referred_id`
  - Add index on `user_investments.plan_id`

  ### 2. Optimize RLS Policies (Auth Function Initialization)
  Replace `auth.uid()` with `(select auth.uid())` in all RLS policies to prevent
  re-evaluation for each row, improving query performance at scale.

  Tables updated:
  - `profiles` (2 policies)
  - `user_investments` (2 policies)
  - `transactions` (2 policies)
  - `referrals` (1 policy)
  - `notifications` (2 policies)
  - `kyc_verifications` (2 policies)

  ### 3. Fix Function Search Path Mutability
  - Add `SET search_path = public` to `update_updated_at_column` function
  - Add `SET search_path = public` to `generate_referral_code` function

  ### 4. Note on Unused Indexes
  Indexes marked as "unused" are kept because:
  - The database is new with minimal data/queries
  - These indexes will be essential for production workload
  - Premature removal would hurt performance at scale
*/

-- =====================================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_kyc_verifications_user_id_fkey 
  ON public.kyc_verifications(user_id);

CREATE INDEX IF NOT EXISTS idx_referrals_referred_id_fkey 
  ON public.referrals(referred_id);

CREATE INDEX IF NOT EXISTS idx_user_investments_plan_id_fkey 
  ON public.user_investments(plan_id);

-- =====================================================
-- 2. OPTIMIZE RLS POLICIES
-- =====================================================

-- Drop and recreate all RLS policies with optimized auth function calls

-- profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- user_investments table
DROP POLICY IF EXISTS "Users can view own investments" ON public.user_investments;
CREATE POLICY "Users can view own investments"
  ON public.user_investments
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own investments" ON public.user_investments;
CREATE POLICY "Users can create own investments"
  ON public.user_investments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- transactions table
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own transactions" ON public.transactions;
CREATE POLICY "Users can create own transactions"
  ON public.transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- referrals table
DROP POLICY IF EXISTS "Users can view own referrals" ON public.referrals;
CREATE POLICY "Users can view own referrals"
  ON public.referrals
  FOR SELECT
  TO authenticated
  USING (referrer_id = (select auth.uid()) OR referred_id = (select auth.uid()));

-- notifications table
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- kyc_verifications table
DROP POLICY IF EXISTS "Users can view own KYC submissions" ON public.kyc_verifications;
CREATE POLICY "Users can view own KYC submissions"
  ON public.kyc_verifications
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own KYC submissions" ON public.kyc_verifications;
CREATE POLICY "Users can create own KYC submissions"
  ON public.kyc_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- =====================================================
-- 3. FIX FUNCTION SEARCH PATH MUTABILITY
-- =====================================================

-- Recreate update_updated_at_column with immutable search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate generate_referral_code with immutable search_path
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;