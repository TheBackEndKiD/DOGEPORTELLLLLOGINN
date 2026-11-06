/*
  # User Signup Analytics

  ## Summary
  This migration adds views and functions to analyze user signups over time,
  providing easy access to signup metrics and trends.

  ## 1. Views Added
  - `daily_signups` - Daily user registration counts
  - `weekly_signups` - Weekly user registration counts  
  - `monthly_signups` - Monthly user registration counts
  - `signup_trends` - Comprehensive signup analytics

  ## 2. Functions Added
  - `get_signup_stats()` - Returns signup statistics
  - `get_signups_by_date_range()` - Get signups for specific date range

  ## 3. Security
  - Views are accessible to authenticated users
  - Functions can be called by authenticated users
*/

-- Daily signups view
CREATE OR REPLACE VIEW daily_signups AS
SELECT 
  DATE(created_at) as signup_date,
  COUNT(*) as signups,
  COUNT(*) OVER (ORDER BY DATE(created_at) ROWS UNBOUNDED PRECEDING) as cumulative_signups
FROM profiles 
GROUP BY DATE(created_at)
ORDER BY signup_date DESC;

-- Weekly signups view  
CREATE OR REPLACE VIEW weekly_signups AS
SELECT 
  DATE_TRUNC('week', created_at) as week_start,
  COUNT(*) as signups,
  COUNT(*) OVER (ORDER BY DATE_TRUNC('week', created_at) ROWS UNBOUNDED PRECEDING) as cumulative_signups
FROM profiles 
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week_start DESC;

-- Monthly signups view
CREATE OR REPLACE VIEW monthly_signups AS
SELECT 
  DATE_TRUNC('month', created_at) as month_start,
  COUNT(*) as signups,
  COUNT(*) OVER (ORDER BY DATE_TRUNC('month', created_at) ROWS UNBOUNDED PRECEDING) as cumulative_signups
FROM profiles 
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month_start DESC;

-- Comprehensive signup trends view
CREATE OR REPLACE VIEW signup_trends AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as daily_signups,
  AVG(COUNT(*)) OVER (ORDER BY DATE(created_at) ROWS 6 PRECEDING) as seven_day_avg,
  COUNT(*) OVER (ORDER BY DATE(created_at) ROWS UNBOUNDED PRECEDING) as total_users,
  CASE 
    WHEN DATE(created_at) = CURRENT_DATE THEN 'today'
    WHEN DATE(created_at) = CURRENT_DATE - INTERVAL '1 day' THEN 'yesterday'  
    WHEN DATE(created_at) >= CURRENT_DATE - INTERVAL '7 days' THEN 'this_week'
    WHEN DATE(created_at) >= CURRENT_DATE - INTERVAL '30 days' THEN 'this_month'
    ELSE 'older'
  END as period
FROM profiles 
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Function to get signup statistics
CREATE OR REPLACE FUNCTION get_signup_stats()
RETURNS TABLE (
  total_users bigint,
  today_signups bigint,
  yesterday_signups bigint,
  this_week_signups bigint,
  this_month_signups bigint,
  growth_rate_7d numeric
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH stats AS (
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today,
      COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day') as yesterday,
      COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as week,
      COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as month,
      COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as current_week,
      COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '14 days' AND created_at < CURRENT_DATE - INTERVAL '7 days') as previous_week
    FROM profiles
  )
  SELECT 
    total,
    today,
    yesterday, 
    week,
    month,
    CASE 
      WHEN previous_week > 0 THEN ROUND(((current_week::numeric - previous_week::numeric) / previous_week::numeric) * 100, 2)
      ELSE 0
    END as growth_rate_7d
  FROM stats;
$$;

-- Function to get signups by date range
CREATE OR REPLACE FUNCTION get_signups_by_date_range(start_date date, end_date date)
RETURNS TABLE (
  signup_date date,
  signups bigint,
  active_users bigint,
  kyc_approved bigint
)
LANGUAGE sql
SECURITY DEFINER  
SET search_path = public
AS $$
  SELECT 
    DATE(created_at) as signup_date,
    COUNT(*) as signups,
    COUNT(*) FILTER (WHERE is_active = true) as active_users,
    COUNT(*) FILTER (WHERE kyc_status = 'approved') as kyc_approved
  FROM profiles 
  WHERE DATE(created_at) BETWEEN start_date AND end_date
  GROUP BY DATE(created_at)
  ORDER BY signup_date;
$$;

-- Grant access to authenticated users
GRANT SELECT ON daily_signups TO authenticated;
GRANT SELECT ON weekly_signups TO authenticated;  
GRANT SELECT ON monthly_signups TO authenticated;
GRANT SELECT ON signup_trends TO authenticated;
GRANT EXECUTE ON FUNCTION get_signup_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_signups_by_date_range(date, date) TO authenticated;