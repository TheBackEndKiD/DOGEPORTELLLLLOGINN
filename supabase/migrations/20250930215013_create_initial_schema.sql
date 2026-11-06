/*
  # Initial Database Schema for DOGE Investment Platform

  ## Overview
  This migration creates the core database schema for a cryptocurrency investment platform
  with user management, investment plans, transactions, referrals, KYC, and admin functionality.

  ## 1. New Tables

  ### `profiles`
  - User profile information extending Supabase auth.users
  - `id` (uuid, primary key, references auth.users)
  - `username` (text, unique)
  - `full_name` (text)
  - `email` (text)
  - `phone` (text)
  - `country` (text)
  - `balance` (decimal) - Available balance
  - `total_invested` (decimal) - Total amount invested
  - `total_withdrawn` (decimal) - Total amount withdrawn
  - `referral_code` (text, unique) - User's referral code
  - `referred_by` (uuid) - References profiles.id
  - `kyc_status` (text) - pending, approved, rejected
  - `is_active` (boolean) - Account status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `investment_plans`
  - Different investment tiers/plans
  - `id` (uuid, primary key)
  - `name` (text) - Plan name (e.g., "Starter", "Professional")
  - `min_amount` (decimal) - Minimum investment
  - `max_amount` (decimal) - Maximum investment
  - `interest_rate` (decimal) - Daily/monthly interest rate %
  - `duration_days` (integer) - Investment duration
  - `is_active` (boolean)
  - `features` (jsonb) - Plan features as JSON
  - `created_at` (timestamptz)

  ### `user_investments`
  - Tracks individual investments
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `plan_id` (uuid, references investment_plans)
  - `amount` (decimal) - Investment amount
  - `status` (text) - active, completed, cancelled
  - `start_date` (timestamptz)
  - `end_date` (timestamptz)
  - `total_earned` (decimal) - Total interest earned
  - `last_interest_date` (timestamptz)
  - `created_at` (timestamptz)

  ### `transactions`
  - All financial transactions (deposits, withdrawals, interest)
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `type` (text) - deposit, withdraw, interest, referral_bonus
  - `amount` (decimal)
  - `status` (text) - pending, approved, rejected
  - `payment_method` (text)
  - `transaction_hash` (text) - Crypto transaction hash
  - `notes` (text)
  - `admin_notes` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `referrals`
  - Referral tracking and commissions
  - `id` (uuid, primary key)
  - `referrer_id` (uuid, references profiles) - User who referred
  - `referred_id` (uuid, references profiles) - User who was referred
  - `commission_amount` (decimal)
  - `commission_paid` (boolean)
  - `created_at` (timestamptz)

  ### `notifications`
  - User notifications
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `title` (text)
  - `message` (text)
  - `type` (text) - info, success, warning, error
  - `is_read` (boolean)
  - `created_at` (timestamptz)

  ### `kyc_verifications`
  - KYC document submissions
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `document_type` (text) - passport, drivers_license, national_id
  - `document_front_url` (text)
  - `document_back_url` (text)
  - `selfie_url` (text)
  - `status` (text) - pending, approved, rejected
  - `rejection_reason` (text)
  - `submitted_at` (timestamptz)
  - `reviewed_at` (timestamptz)
  - `reviewed_by` (uuid)

  ### `admin_users`
  - Admin authentication and roles
  - `id` (uuid, primary key)
  - `email` (text, unique)
  - `username` (text, unique)
  - `password_hash` (text)
  - `role` (text) - super_admin, manager, support
  - `permissions` (jsonb)
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Add policies for authenticated user access
  - Add policies for admin access
  - Ensure users can only access their own data

  ## 3. Important Notes
  - All monetary values use DECIMAL(20,8) for precision
  - Foreign keys ensure data integrity
  - Timestamps use timestamptz for timezone awareness
  - Indexes added on frequently queried columns
*/

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  email text UNIQUE NOT NULL,
  phone text,
  country text,
  balance decimal(20,8) DEFAULT 0,
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
  amount decimal(20,8) NOT NULL,
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

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text DEFAULT 'support' CHECK (role IN ('super_admin', 'manager', 'support')),
  permissions jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON profiles(referred_by);
CREATE INDEX IF NOT EXISTS idx_user_investments_user_id ON user_investments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_investments_status ON user_investments(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for investment_plans (public read)
CREATE POLICY "Anyone can view active investment plans"
  ON investment_plans FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies for user_investments
CREATE POLICY "Users can view own investments"
  ON user_investments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own investments"
  ON user_investments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for referrals
CREATE POLICY "Users can view own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for kyc_verifications
CREATE POLICY "Users can view own KYC submissions"
  ON kyc_verifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own KYC submissions"
  ON kyc_verifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for admin_users (restrictive - no public access)
CREATE POLICY "No public access to admin_users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (false);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

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