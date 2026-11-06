# Create Client User Account

## Overview
This guide helps you create a regular client/user account for the DOGE investment platform. Client users can access the main dashboard, make deposits, withdrawals, and manage investments.

---

## Method 1: Self-Registration (Recommended)

The easiest way to create a client account is through the signup page:

1. Go to your app: `/signup`
2. Fill in the registration form:
   - **Email**: Your email address
   - **Password**: Choose a secure password
   - **Username**: Your preferred username
3. Click **"Sign Up"**
4. Login at `/login` with your credentials

**That's it!** The system automatically creates your profile and sets up everything you need.

---

## Method 2: Manual Creation via Supabase Dashboard

If you need to create a user manually (for testing or admin purposes):

### Step 1: Create User in Supabase Auth

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Click **"Add user"** button
5. Fill in:
   - **Email**: `your-email@example.com`
   - **Password**: Choose a password
   - **Auto Confirm User**: YES (enable this toggle)
6. Click **"Create user"**
7. **Copy the User ID** (format: `abc123def-4567-89ab-cdef-0123456789ab`)

### Step 2: Add User Profile

Run the SQL script from `ADD_CLIENT_USER_PROFILE.sql`:

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"New query"**
3. Paste the SQL from `ADD_CLIENT_USER_PROFILE.sql`
4. **Replace these values**:
   - `YOUR_USER_ID_HERE` → Actual User ID from Step 1
   - `your-email@example.com` → User's email
   - `desired_username` → Desired username
   - `User Full Name` → User's full name (optional)
5. Click **"Run"**

### Step 3: Login

1. Go to `/login`
2. Login with:
   - **Email**: The email you set
   - **Password**: The password you set

---

## Quick Test Users

For testing purposes, you can create these test accounts:

### Test User 1
- **Email**: `testuser1@doge.com`
- **Password**: `testpass123`
- **Username**: `testuser1`

### Test User 2
- **Email**: `investor@doge.com`
- **Password**: `invest123`
- **Username**: `investor`

Use the SQL script and replace the placeholder values with these test credentials.

---

## User vs Admin Accounts

### Client User Account (Regular User)
- ✓ Access main dashboard at `/dashboard`
- ✓ Make deposits and withdrawals
- ✓ View investment plans and portfolio
- ✓ Manage profile and KYC verification
- ✓ View transaction logs and referrals
- ✗ Cannot access admin panel at `/admin`

### Admin Account
- ✓ Access admin panel at `/admin/dashboard`
- ✓ Manage all users, payments, and settings
- ✓ Approve/reject withdrawals and KYC
- ✗ Requires entry in `admin_users` table
- ✗ Different login page at `/admin/login`

---

## Troubleshooting

### "User already exists" Error
- The email is already registered
- Try logging in instead of creating new account
- Use password reset if you forgot password

### Login Shows Blank Screen
- Make sure profile was created (Step 2)
- Check that `is_active = true` in profiles table
- Clear browser cache and cookies

### "Invalid credentials" Error
- Double-check email and password
- Make sure "Auto Confirm User" was enabled
- Try resetting password in Supabase Dashboard

### Profile Not Loading
- Verify user_id matches in both auth.users and profiles tables
- Check that all required fields have values
- Run the verification query from the SQL script

---

## What Gets Created

When you create a client user, these records are created:

1. **auth.users** - Supabase authentication record
2. **profiles** - User profile with:
   - Username, email, full name
   - Balance: $0
   - Initial deposits/withdrawals: $0
   - Unique referral code
   - KYC status: pending
   - Account status: active

---

## Next Steps After Creating Account

1. **Login** at `/login`
2. **Complete Profile** - Add full name, phone, country
3. **KYC Verification** - Submit identification documents
4. **Make Deposit** - Fund your account
5. **Choose Investment Plan** - Start investing
6. **Refer Friends** - Share your referral code

---

## Security Notes

- Always use strong passwords (8+ characters, mixed case, numbers, symbols)
- Enable two-factor authentication when available
- Never share your login credentials
- Use unique passwords for each service
- Keep your recovery email updated
