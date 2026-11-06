# 🚀 Supabase Database Setup Guide

## Step 1: Connect to Supabase

1. **Click the Supabase button** in your project settings (⚙️ icon at the top of the preview)
2. This will automatically:
   - Create a new Supabase project
   - Set up your database
   - Configure environment variables
   - Run all database migrations

## Step 2: Verify Database Connection

After connecting, verify your setup:

### Check Environment Variables
Your `.env` file should contain:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Test Database Connection
The app includes a connection test function. Check the browser console for:
- ✅ "Database connection successful"
- ❌ "Database connection failed" (if there are issues)

## Step 3: Verify Tables and Data

Your database should have these tables with sample data:

### Core Tables
- `profiles` - User accounts and balances
- `investment_plans` - 4 investment tiers (Starter, Professional, Premium, VIP)
- `user_investments` - User investment tracking
- `transactions` - All financial transactions
- `referrals` - Referral system
- `notifications` - User notifications
- `kyc_verifications` - KYC document submissions
- `admin_users` - Admin accounts

### Analytics Views
- `daily_signups` - Daily user registration counts
- `weekly_signups` - Weekly signup trends
- `monthly_signups` - Monthly user acquisition

## Step 4: Test Login Credentials

### Admin Access
- **URL**: `/admin/login`
- **Email**: `admin@doge.com`
- **Password**: `admin123`

### Create User Account
- **URL**: `/signup`
- Create a new account or use the signup page

## Step 5: Verify Features

After setup, test these key features:

### User Features ✅
- [ ] User registration and login
- [ ] Dashboard with balance display
- [ ] Investment plans page
- [ ] Portfolio management
- [ ] Transaction history
- [ ] KYC verification
- [ ] Referral system

### Admin Features ✅
- [ ] Admin login
- [ ] User management
- [ ] User analytics (with signup tracking)
- [ ] Transaction management
- [ ] Investment plan management
- [ ] System settings

## Step 6: Database Health Check

Run these checks in your Supabase dashboard:

### SQL Health Check
```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check sample data
SELECT COUNT(*) as investment_plans FROM investment_plans;
SELECT COUNT(*) as admin_users FROM admin_users;

-- Test analytics function
SELECT * FROM get_signup_stats();
```

### Expected Results
- 8+ tables should exist
- 4 investment plans
- 1 admin user
- Analytics functions working

## Troubleshooting

### If Connection Fails
1. **Refresh the page** and try the Supabase button again
2. **Check browser console** for error messages
3. **Verify project limits** - ensure you haven't exceeded Supabase free tier limits

### If Tables Are Missing
1. **Check migrations** - all `.sql` files in `supabase/migrations/` should be applied
2. **Manual migration** - run migrations manually in Supabase SQL editor if needed

### If Login Doesn't Work
1. **Create admin user** manually in Supabase Auth dashboard
2. **Check RLS policies** - ensure Row Level Security is properly configured
3. **Verify environment variables** - ensure they're loaded correctly

## Success Indicators

Your database is live and working when:

✅ **Connection Test Passes**
✅ **All Tables Created** (8+ tables)
✅ **Sample Data Loaded** (4 investment plans, 1 admin user)
✅ **Admin Login Works** (admin@doge.com / admin123)
✅ **User Signup Works** (new account creation)
✅ **Analytics Dashboard Loads** (user signup tracking)
✅ **No Console Errors** (clean browser console)

## Next Steps

Once your database is live:

1. **Test user registration** - create a test account
2. **Explore admin features** - login as admin and check user analytics
3. **Verify data flow** - ensure user actions update the database
4. **Check analytics** - view user signup trends in admin dashboard

Your DOGE investment platform is now ready for use! 🎉