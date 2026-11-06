/*
# Fix profiles INSERT policy and backfill orphaned users

## Problem
The `profiles` table had SELECT and UPDATE RLS policies but was missing
an INSERT policy. New users who signed up had their auth.users row created
successfully, but the profiles INSERT was silently rejected by RLS —
the user was never told, and the app's login flow later signed them out
because no profile row existed.

## Changes
1. Add an INSERT policy on `profiles` so an authenticated user can insert
   their own profile row (id = auth.uid()).
2. Backfill a profile for the existing auth user whose profile was never
   created, so they can log in immediately.
3. GRANT INSERT on profiles TO authenticated (required for the policy to
   take effect through the Data API).

## Security
- INSERT policy scoped to `TO authenticated` with `WITH CHECK (id = auth.uid())`
  — a user can only insert a row whose id matches their own auth uid.
- No existing policies are modified or dropped.
*/

-- 1. Grant INSERT to authenticated (SELECT/UPDATE already granted)
GRANT INSERT ON public.profiles TO authenticated;

-- 2. Add the missing INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

-- 3. Backfill the orphaned user (worldbankmanager555@gmail.com)
--    Uses ON CONFLICT so it is idempotent and safe to re-run.
INSERT INTO public.profiles (id, username, email, referral_code, balance, total_deposit, profit, total_invested, total_withdrawn, kyc_status, is_active)
SELECT
  au.id,
  split_part(au.email, '@', 1),
  au.email,
  upper(substr(md5(random()::text || au.id::text), 1, 8)),
  0, 0, 0, 0, 0, 'pending', true
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = au.id)
ON CONFLICT (id) DO NOTHING;
