-- ============================================
-- COMPLETE DATABASE SETUP FOR SUPABASE
-- ============================================
-- Run this in your Supabase SQL Editor:
-- https://fvkaanjjivjcylfjjqev.supabase.co
-- ============================================

-- ============================================
-- STEP 1: CREATE ALL TABLES
-- ============================================

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  email text UNIQUE NOT NULL,
  phone text,
  country text,
  balance decimal(20,8) DEFAULT 0,
  total_deposit decimal(20,8) DEFAULT 0,
  profit decimal(20,8) DEFAULT 0,
  total_invested decimal(20,8) DEFAULT 0,
  total_withdrawn decimal(20,8) DEFAULT 0,
  referral_code text UNIQUE NOT NULL,
  referred_by uuid REFERENCES profiles(id),
  kyc_status text DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create investment_plans table
CREATE TABLE IF NOT EXISTS investment_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  min_amount decimal(20,8) NOT NULL,
  max_amount decimal(20,8) NOT NULL,
  interest_rate decimal(10,4) NOT NULL,
  duration_days integer NOT NULL,
  is_active boolean DEFAULT true,
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create user_investments table
CREATE TABLE IF NOT EXISTS user_investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES investment_plans(id),
  amount decimal(20,8) NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  start_date timestamptz DEFAULT now(),
  end_date timestamptz NOT NULL,
  total_earned decimal(20,8) DEFAULT 0,
  last_interest_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deposit', 'withdraw', 'interest', 'referral_bonus')),
  amount decimal(20,8) NOT NULL CHECK (amount > 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_method text,
  transaction_hash text,
  notes text,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  commission_amount decimal(20,8) DEFAULT 0,
  commission_paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create kyc_verifications table
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('passport', 'drivers_license', 'national_id')),
  document_front_url text,
  document_back_url text,
  selfie_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid
);

-- Create admin_users table (using auth.users IDs)
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'support' CHECK (role IN ('super_admin', 'manager', 'support')),
  permissions jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin audit log table
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admin_users(id),
  action text NOT NULL,
  target_table text,
  target_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- STEP 2: CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON profiles(referred_by);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_investments_user_id ON user_investments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_investments_status ON user_investments(status);
CREATE INDEX IF NOT EXISTS idx_user_investments_user_status ON user_investments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_investments_end_date ON user_investments(end_date);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type_status ON transactions(user_id, type, status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_kyc_status ON kyc_verifications(status);
CREATE INDEX IF NOT EXISTS idx_audit_admin_id ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON admin_audit_log(created_at DESC);

-- ============================================
-- STEP 3: ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: CREATE RLS POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can view active investment plans" ON investment_plans;
DROP POLICY IF EXISTS "Users can view own investments" ON user_investments;
DROP POLICY IF EXISTS "Users can create own investments" ON user_investments;
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can create own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can view own referrals" ON referrals;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view own KYC submissions" ON kyc_verifications;
DROP POLICY IF EXISTS "Users can create own KYC submissions" ON kyc_verifications;
DROP POLICY IF EXISTS "No public access to admin_users" ON admin_users;
DROP POLICY IF EXISTS "Users can check own admin status" ON admin_users;
DROP POLICY IF EXISTS "Admins can view audit logs" ON admin_audit_log;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Investment plans policies (public read)
CREATE POLICY "Anyone can view active investment plans"
  ON investment_plans FOR SELECT
  TO authenticated
  USING (is_active = true);

-- User investments policies
CREATE POLICY "Users can view own investments"
  ON user_investments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own investments"
  ON user_investments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Referrals policies
CREATE POLICY "Users can view own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- KYC policies
CREATE POLICY "Users can view own KYC submissions"
  ON kyc_verifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own KYC submissions"
  ON kyc_verifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Admin users policies (allow checking own admin status)
CREATE POLICY "Users can check own admin status"
  ON admin_users FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Audit log policies
CREATE POLICY "Admins can view audit logs"
  ON admin_audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND admin_users.is_active = true
    )
  );

-- ============================================
-- STEP 5: CREATE HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    code := upper(substr(md5(random()::text), 1, 8));
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to get user dashboard statistics
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_deposit', COALESCE(SUM(CASE WHEN type = 'deposit' AND status = 'approved' THEN amount ELSE 0 END), 0),
    'total_withdraw', COALESCE(SUM(CASE WHEN type = 'withdraw' AND status = 'approved' THEN amount ELSE 0 END), 0),
    'total_profit', COALESCE(SUM(CASE WHEN type = 'interest' AND status = 'approved' THEN amount ELSE 0 END), 0),
    'pending_transactions', COUNT(CASE WHEN status = 'pending' THEN 1 END)
  )
  INTO result
  FROM transactions
  WHERE user_id = user_id_param;

  RETURN result;
END;
$$;

-- Function to get admin dashboard statistics
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  total_users_count integer;
  active_users_count integer;
  deactive_users_count integer;
  total_invest_amount numeric;
  pending_invest_amount numeric;
  total_interest_amount numeric;
  total_withdraw_amount numeric;
  pending_withdraw_amount numeric;
BEGIN
  SELECT COUNT(*) INTO total_users_count FROM profiles;
  SELECT COUNT(*) INTO active_users_count FROM profiles WHERE is_active = true;
  SELECT COUNT(*) INTO deactive_users_count FROM profiles WHERE is_active = false;

  SELECT COALESCE(SUM(amount), 0) INTO total_invest_amount
  FROM user_investments WHERE status = 'active';

  SELECT COALESCE(SUM(amount), 0) INTO pending_invest_amount
  FROM user_investments WHERE status = 'active';

  SELECT COALESCE(SUM(amount), 0) INTO total_interest_amount
  FROM transactions WHERE type = 'interest' AND status = 'approved';

  SELECT COALESCE(SUM(amount), 0) INTO total_withdraw_amount
  FROM transactions WHERE type = 'withdraw' AND status = 'approved';

  SELECT COALESCE(SUM(amount), 0) INTO pending_withdraw_amount
  FROM transactions WHERE type = 'withdraw' AND status = 'pending';

  result := jsonb_build_object(
    'total_users', total_users_count,
    'active_users', active_users_count,
    'deactive_users', deactive_users_count,
    'total_invest', total_invest_amount,
    'pending_invest', pending_invest_amount,
    'total_interest', total_interest_amount,
    'total_withdraw', total_withdraw_amount,
    'pending_withdraw', pending_withdraw_amount
  );

  RETURN result;
END;
$$;

-- Function to calculate investment returns
CREATE OR REPLACE FUNCTION calculate_investment_returns(investment_id_param uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  investment_amount numeric;
  interest_rate numeric;
  days_elapsed integer;
  total_return numeric;
BEGIN
  SELECT
    ui.amount,
    ip.interest_rate,
    EXTRACT(DAY FROM (NOW() - ui.start_date))
  INTO
    investment_amount,
    interest_rate,
    days_elapsed
  FROM user_investments ui
  JOIN investment_plans ip ON ui.plan_id = ip.id
  WHERE ui.id = investment_id_param;

  IF investment_amount IS NULL THEN
    RETURN 0;
  END IF;

  total_return := investment_amount * POWER(1 + (interest_rate / 100), days_elapsed) - investment_amount;

  RETURN COALESCE(total_return, 0);
END;
$$;

-- Function to check investment amount constraints
CREATE OR REPLACE FUNCTION check_investment_amount()
RETURNS trigger AS $$
DECLARE
  plan_min numeric;
  plan_max numeric;
BEGIN
  SELECT min_amount, max_amount
  INTO plan_min, plan_max
  FROM investment_plans
  WHERE id = NEW.plan_id;

  IF NEW.amount < plan_min OR NEW.amount > plan_max THEN
    RAISE EXCEPTION 'Investment amount must be between % and %', plan_min, plan_max;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 6: CREATE TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS check_investment_amount_trigger ON user_investments;
CREATE TRIGGER check_investment_amount_trigger
  BEFORE INSERT OR UPDATE ON user_investments
  FOR EACH ROW
  EXECUTE FUNCTION check_investment_amount();

-- ============================================
-- STEP 7: CREATE VIEWS
-- ============================================

CREATE OR REPLACE VIEW active_investments_with_plans AS
SELECT
  ui.id,
  ui.user_id,
  ui.amount,
  ui.status,
  ui.start_date,
  ui.end_date,
  ui.total_earned,
  ip.name as plan_name,
  ip.interest_rate,
  ip.duration_days,
  p.username,
  p.email
FROM user_investments ui
JOIN investment_plans ip ON ui.plan_id = ip.id
JOIN profiles p ON ui.user_id = p.id
WHERE ui.status = 'active';

CREATE OR REPLACE VIEW pending_transactions_with_users AS
SELECT
  t.id,
  t.user_id,
  t.type,
  t.amount,
  t.status,
  t.payment_method,
  t.transaction_hash,
  t.notes,
  t.created_at,
  p.username,
  p.email,
  p.full_name
FROM transactions t
JOIN profiles p ON t.user_id = p.id
WHERE t.status = 'pending'
ORDER BY t.created_at DESC;

-- ============================================
-- STEP 8: GRANT PERMISSIONS
-- ============================================

GRANT EXECUTE ON FUNCTION get_user_dashboard_stats(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_investment_returns(uuid) TO authenticated;
GRANT SELECT ON active_investments_with_plans TO authenticated;
GRANT SELECT ON pending_transactions_with_users TO authenticated;

-- ============================================
-- STEP 9: ADD SAMPLE INVESTMENT PLANS
-- ============================================

INSERT INTO investment_plans (name, min_amount, max_amount, interest_rate, duration_days, is_active, features)
VALUES
  ('Starter Plan', 100, 999, 5.0, 30, true, '["Daily interest", "24/7 support", "Mobile app access"]'::jsonb),
  ('Professional Plan', 1000, 4999, 7.5, 60, true, '["Daily interest", "Priority support", "Advanced analytics", "Mobile app access"]'::jsonb),
  ('Premium Plan', 5000, 9999, 10.0, 90, true, '["Daily interest", "VIP support", "Advanced analytics", "Dedicated account manager", "Mobile app access"]'::jsonb),
  ('Elite Plan', 10000, 999999, 15.0, 180, true, '["Daily interest", "VIP support", "Advanced analytics", "Dedicated account manager", "Exclusive webinars", "Mobile app access"]'::jsonb)
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 10: ADD YOUR ADMIN USER
-- ============================================

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
-- VERIFICATION QUERIES
-- ============================================

-- Verify admin user
SELECT
  id,
  email,
  role,
  is_active,
  created_at
FROM admin_users
WHERE email = 'worldvibemanager@gmail.com';

-- Verify investment plans
SELECT name, min_amount, max_amount, interest_rate, duration_days
FROM investment_plans
WHERE is_active = true;

-- Check all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Complete database setup finished!';
  RAISE NOTICE '📊 All tables created with proper structure';
  RAISE NOTICE '🔒 RLS policies configured for security';
  RAISE NOTICE '⚡ Performance indexes added';
  RAISE NOTICE '🎯 Helper functions and views ready';
  RAISE NOTICE '👤 Admin user added: worldvibemanager@gmail.com';
  RAISE NOTICE '💼 Sample investment plans inserted';
END $$;
