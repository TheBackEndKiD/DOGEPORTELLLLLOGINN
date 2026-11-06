/*
  # Insert Sample Investment Plans and Admin User

  ## Summary
  This migration adds initial sample data to the database:
  - 4 investment plans with different tiers
  - 1 default admin user for testing

  ## 1. Investment Plans
  - **Starter Plan**: $100-$999, 5% daily, 30 days
  - **Professional Plan**: $1,000-$4,999, 7% daily, 45 days  
  - **Premium Plan**: $5,000-$19,999, 10% daily, 60 days
  - **VIP Plan**: $20,000+, 15% daily, 90 days

  ## 2. Admin User
  - Email: admin@doge.com
  - Username: admin
  - Password: admin123 (hashed)
  - Role: super_admin
*/

-- Insert sample investment plans
INSERT INTO investment_plans (name, min_amount, max_amount, interest_rate, duration_days, is_active, features)
VALUES 
  (
    'Starter Plan',
    100,
    999.99,
    5.0,
    30,
    true,
    '["5% Daily Returns", "30 Days Duration", "24/7 Support", "Email Notifications"]'::jsonb
  ),
  (
    'Professional Plan',
    1000,
    4999.99,
    7.0,
    45,
    true,
    '["7% Daily Returns", "45 Days Duration", "Priority Support", "SMS Notifications", "Dedicated Account Manager"]'::jsonb
  ),
  (
    'Premium Plan',
    5000,
    19999.99,
    10.0,
    60,
    true,
    '["10% Daily Returns", "60 Days Duration", "VIP Support", "Personal Advisor", "Early Withdrawal Option", "Bonus Rewards"]'::jsonb
  ),
  (
    'VIP Plan',
    20000,
    1000000,
    15.0,
    90,
    true,
    '["15% Daily Returns", "90 Days Duration", "Elite Support", "Personal Portfolio Manager", "Flexible Terms", "Exclusive Events", "Maximum Returns"]'::jsonb
  )
ON CONFLICT DO NOTHING;

-- Insert default admin user
-- Password: admin123 (this is a bcrypt hash)
INSERT INTO admin_users (email, username, password_hash, role, permissions, is_active)
VALUES (
  'admin@doge.com',
  'admin',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'super_admin',
  '["all"]'::jsonb,
  true
)
ON CONFLICT (email) DO NOTHING;