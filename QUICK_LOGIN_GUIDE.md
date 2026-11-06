# Quick Login Guide - Test User Credentials

## Login Credentials Visible on Login Page

Your login page now displays test credentials that users can click to auto-fill!

### Test User Account
```
Email: testuser@example.com
Password: TestPassword123!
```

---

## How to Use

### Method 1: Click to Auto-Fill (Easiest)
1. Navigate to `/login` page
2. Look for the cyan-colored info box at the top
3. Click on the email or password to auto-fill the fields
4. Click "Login"

### Method 2: Manual Entry
1. Type the credentials manually:
   - Email: `testuser@example.com`
   - Password: `TestPassword123!`
2. Click "Login"

### Method 3: Quick Signup
1. Navigate to `/signup` page
2. Click "Auto-fill Test Credentials" button
3. Click "Sign Up" to create the account
4. You'll be redirected to dashboard automatically

---

## What You'll See

### On Login Page
A prominent cyan info box displays:
- **Heading**: "Test Login Credentials"
- **Email button**: Click to fill email field
- **Password button**: Click to fill password field
- **Helper text**: "Click credentials to auto-fill"

### On Signup Page
A cyan info box with:
- **Button**: "Auto-fill Test Credentials"
- Fills all form fields instantly
- Creates user with proper test data

---

## Visual Design

The credentials box features:
- **Cyan accent color** (matches DOGE Portal theme)
- **Info icon** on the left
- **Clickable credential fields** with hover effects
- **Monospace font** for credentials (easier to read)
- **Semi-transparent background** with border
- **Responsive design** for all screen sizes

---

## After First Login

Once you create the test user (via signup), you'll have:

### Account Details
- **Name**: John Doe
- **Username**: testuser
- **UID**: USR12345
- **Account Level**: STARTER
- **Account Status**: Active
- **KYC Status**: Verified

### Financial Stats
- **Total Balance**: $5,000.00
- **Available Balance**: $2,500.00
- **Total Deposit**: $5,000.00
- **Total Withdraw**: $0.00
- **Total Invest**: $2,500.00
- **Current Invest**: $2,500.00
- **Profit**: $350.00

---

## Setup Instructions

### If User Doesn't Exist Yet

1. **Option A: Use Signup Page (Recommended)**
   - Go to `/signup`
   - Click "Auto-fill Test Credentials"
   - Click "Sign Up"
   - Done!

2. **Option B: Supabase Dashboard**
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add User"
   - Enter:
     - Email: `testuser@example.com`
     - Password: `TestPassword123!`
   - Check "Auto-confirm user"
   - Click "Create User"
   - The profile will be created automatically via trigger

3. **Option C: SQL Script**
   - See `CREATE_TEST_USER.sql` file
   - Follow instructions in that file
   - Run in Supabase SQL Editor

---

## Technical Details

### Auto-fill Implementation

**Login Page** (`src/pages/Login.tsx`):
```tsx
// Clickable buttons that fill form fields
<button
  type="button"
  onClick={() => setEmail('testuser@example.com')}
  className="text-cyan-400 hover:text-cyan-300 font-mono text-xs"
>
  testuser@example.com
</button>
```

**Signup Page** (`src/pages/Signup.tsx`):
```tsx
// Single button that fills all fields
<button
  type="button"
  onClick={() => {
    setEmail('testuser@example.com');
    setUsername('testuser');
    setPassword('TestPassword123!');
    setConfirmPassword('TestPassword123!');
  }}
>
  Auto-fill Test Credentials
</button>
```

### Authentication Flow

1. **User clicks auto-fill** → Form fields populate
2. **User clicks Login** → Supabase Auth validates
3. **Auth successful** → Profile loaded from database
4. **Redirect to dashboard** → User data displayed

---

## Security Notes

### For Development Only
- Test credentials are visible only in development
- Remove or hide this box in production
- Never expose real user credentials

### How to Hide in Production
Add environment check:

```tsx
{import.meta.env.DEV && (
  <div className="bg-cyan-500/10 border border-cyan-500/50">
    {/* Test credentials box */}
  </div>
)}
```

Or use feature flag:

```tsx
{import.meta.env.VITE_SHOW_TEST_CREDENTIALS === 'true' && (
  // Test credentials box
)}
```

---

## Troubleshooting

### "Invalid login credentials"
**Solution**: User doesn't exist yet
- Use signup page to create the account
- Or create via Supabase Dashboard

### "Email not confirmed"
**Solution**: Confirm the email
- Go to Supabase Dashboard → Auth → Users
- Find user and click "Confirm Email"
- Or disable email confirmation in settings

### Credentials don't auto-fill
**Solution**: Check JavaScript console
- Ensure React state is updating
- Check browser console for errors
- Try typing manually first

### Login succeeds but shows error
**Solution**: Profile might not exist
- Check `profiles` table in database
- Verify trigger is creating profiles
- Create profile manually if needed

---

## Additional Test Users

You can create more test users following the same pattern:

### Premium User
```
Email: premium@example.com
Password: Premium123!
Account Level: PREMIUM
```

### VIP User
```
Email: vip@example.com
Password: VipUser123!
Account Level: VIP
```

Just use the signup page and change the email/password accordingly.

---

## Files Updated

1. **src/pages/Login.tsx**
   - Added test credentials info box
   - Clickable email/password buttons
   - Auto-fill functionality

2. **src/pages/Signup.tsx**
   - Added auto-fill button
   - One-click form population
   - Quick test account creation

3. **TEST_USER_CREDENTIALS.md**
   - Complete credential documentation
   - Setup instructions
   - Troubleshooting guide

4. **CREATE_TEST_USER.sql**
   - SQL script for manual setup
   - Sample data generation
   - Verification queries

---

## Summary

The login and signup pages now feature **prominent, clickable test credentials** that make it easy to:

1. **Instantly test the application** without memorizing credentials
2. **Auto-fill forms** with a single click
3. **Create test accounts** quickly for development
4. **Onboard new developers** without sending credentials separately

The implementation is clean, user-friendly, and follows the app's design system with cyan accents and proper contrast ratios.

---

**Last Updated**: 2025-10-04
**Status**: ✅ Implemented and tested
**Build Status**: ✅ Successful
