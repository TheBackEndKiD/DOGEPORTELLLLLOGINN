# User Setup Guide for DOGE Investment Platform

## Active Test Account - Ready to Use! ✅

### Quick Access Credentials (Visible on Login Page):

**Email:** testuser@example.com
**Password:** TestPassword123!

**Account Details:**
- Name: John Doe
- Username: testuser
- Starting Balance: $5,000.00
- Account Level: STARTER
- Status: Active

---

## How to Access Your Account (3 Methods)

### Method 1: One-Click Login ⚡ (FASTEST)

1. **Go to `/login`** page
2. **Look for the cyan info box** at the top
3. **Click on the email** → Auto-fills: testuser@example.com
4. **Click on the password** → Auto-fills: TestPassword123!
5. **Click "Login"** button
6. **Dashboard loads automatically!**

### Method 2: One-Click Signup (If user doesn't exist yet)

1. **Go to `/signup`** page
2. **Click "Auto-fill Test Credentials"** button (cyan box)
3. All fields fill automatically:
   - Email: testuser@example.com
   - Username: testuser
   - Password: TestPassword123!
   - Confirm Password: TestPassword123!
4. **Click "Sign Up"**
5. **Automatically logged in** and redirected to dashboard

### Method 3: Manual Entry

1. Navigate to `/login`
2. Type manually:
   - Email: `testuser@example.com`
   - Password: `TestPassword123!`
3. Click "Login"
4. Access dashboard

---

## What You'll See After Login

### Dashboard Overview:

**User Info Card (Top):**
- Avatar with initial "J"
- Name: John Doe
- UID: USR##### (randomly generated)
- Status: Active (green indicator)
- Email: testuser@example.com

**Balance Display:**
- Total Balance: $5,000.00
- Available Balance: $2,500.00
- Quick action buttons: Deposit | Withdraw

**Metrics Dashboard - Row 1:**
1. Account Level: STARTER (Pink)
2. Profit: $350.00 (Green)
3. Withdraws: $0.00 (Blue)
4. Available Balance: $2,500.00 (Cyan)

**Metrics Dashboard - Row 2:**
1. Total Withdraw: $0.00
2. Total Deposit: $5,000.00
3. Total Invest: $2,500.00
4. Current Invest: $2,500.00

---

## Alternative: Manual Setup via Supabase Dashboard

If you need to create the user manually in Supabase:

### Step 1: Create Auth User
1. Go to **Supabase Dashboard**: https://0ec90b57d6e95fcbda19832f.supabase.co
2. Navigate to **Authentication** → **Users**
3. Click **"Add User"**
4. Enter:
   - Email: `testuser@example.com`
   - Password: `TestPassword123!`
5. ✅ Check **"Auto Confirm User"**
6. Click **"Create User"**
7. Copy the User ID

### Step 2: Create Profile (SQL Editor)
1. Go to **SQL Editor**
2. Run this query (replace USER_ID):

```sql
INSERT INTO profiles (
  id,
  uid,
  email,
  first_name,
  last_name,
  username,
  account_level,
  account_status,
  total_balance,
  available_balance,
  total_deposit,
  current_invest,
  profit,
  kyc_status,
  referral_code
) VALUES (
  'PASTE_USER_ID_HERE',
  'USR' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0'),
  'testuser@example.com',
  'John',
  'Doe',
  'testuser',
  'STARTER',
  'active',
  5000.00,
  2500.00,
  5000.00,
  2500.00,
  350.00,
  'verified',
  'REF' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0')
);
```

---

## Login Pages

### User Login
- **URL:** `/` or `/login`
- **Access:** User dashboard, portfolio, deposits, withdrawals

### Admin Login
- **URL:** `/admin` or `/admin/login`
- **Credentials:** admin@doge.com / admin123
- **Access:** Admin dashboard, user management, settings

---

## Database Schema

The following tables are already set up in your Supabase database:

- **profiles** - User accounts and balances
- **investment_plans** - Investment tiers (Starter, Professional, Premium, VIP)
- **user_investments** - Active user investments
- **transactions** - Deposits, withdrawals, and earnings
- **referrals** - Referral tracking
- **notifications** - User notifications
- **kyc_verifications** - KYC document submissions
- **admin_users** - Admin accounts (separate from Supabase Auth)

---

## Troubleshooting

### If login keeps loading endlessly:

1. **Check if user exists in Supabase Auth:**
   - Go to Supabase Dashboard → Authentication → Users
   - Verify your email is listed

2. **Check if profile exists:**
   - Go to Database → Table Editor → profiles
   - Search for your email
   - If missing, create the profile record manually (see Option 2 above)

3. **Clear browser cache:**
   - Open browser DevTools (F12)
   - Go to Application/Storage tab
   - Clear site data and reload

4. **Check browser console for errors:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for any red error messages

### If you get "Invalid credentials" error:

- Make sure you're using the correct email and password
- Password is case-sensitive: `Lolly3399`
- Try resetting your password in Supabase Dashboard

---

## Next Steps After Login

Once logged in, you can:

1. **Complete KYC verification** (Profile → KYC Verification)
2. **View investment plans** (Investment Plans page)
3. **Make a deposit** (Deposit page)
4. **Track your portfolio** (Portfolio page)
5. **View transaction history** (Transaction Log page)

---

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your Supabase database is running
3. Ensure all migrations have been applied
4. Check the `_redirects` file is in the project root

**Database URL:** https://0ec90b57d6e95fcbda19832f.supabase.co
