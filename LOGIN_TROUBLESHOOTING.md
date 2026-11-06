# Login Troubleshooting Guide

## CRITICAL: Your Project Uses Supabase (NOT Bolt Database)

**Stop looking for "Bolt Dashboard" or "Bolt Database"**
Your project uses **Supabase** exclusively.

---

## Your Database Setup

**Connection Details:**
```
URL: https://0ec90b57d6e95fcbda19832f.supabase.co
Database: Supabase PostgreSQL
Auth: Supabase Authentication
```

**Test Credentials:**
```
Email: testuser@example.com
Password: TestPassword123!
```

---

## Step-by-Step Troubleshooting

### Step 1: Access Your Supabase Dashboard

1. Go to: **https://supabase.com/dashboard**
2. Login to your Supabase account
3. Find your project: `0ec90b57d6e95fcbda19832f`

### Step 2: Check if Test User Exists

**In Supabase Dashboard:**
1. Click **"Authentication"** in left sidebar
2. Click **"Users"**
3. Look for `testuser@example.com`

**User doesn't exist?** → Go to Step 3
**User exists?** → Go to Step 4

### Step 3: Create Test User (Quick Method)

**Option A: Use Signup Page (Easiest)**
1. Open your app at `/signup`
2. Click **"Auto-fill Test Credentials"** button
3. Click **"Sign Up"**
4. Done! User created automatically

**Option B: Via Supabase Dashboard**
1. Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add User"** button
3. Enter:
   - Email: `testuser@example.com`
   - Password: `TestPassword123!`
4. Check ✅ **"Auto Confirm User"**
5. Click **"Create User"**
6. Profile will be created automatically via database trigger

### Step 4: Verify Database Connection

**Open your app and check:**
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for messages like:
   ```
   🔍 Auth Context - Connection Status: { isInitialized: true }
   ```

**If you see `isInitialized: false`:**
- Problem: Supabase credentials missing or invalid
- Solution: Check `.env` file has correct values

### Step 5: Test Login Process

1. Go to `/login` in your app
2. Open DevTools (F12) → **Console** tab
3. Click credentials in cyan box to auto-fill
4. Click **"Login"** button
5. Watch console for messages

**Success looks like:**
```
✅ Auth Context - User logged in
Redirecting to /dashboard
```

**Error looks like:**
```
❌ Login error: Invalid login credentials
```

### Step 6: Check Network Requests

1. DevTools → **Network** tab
2. Click **"Login"** button
3. Look for request to Supabase:
   - URL contains: `supabase.co/auth/v1/token`
   - Method: POST
   - Status: Should be `200 OK`

**Common Issues:**

**Status 400 - Bad Request**
- Cause: Invalid credentials or user doesn't exist
- Fix: Create user via signup or Supabase Dashboard

**Status 401 - Unauthorized**
- Cause: Wrong password
- Fix: Reset password or use correct password

**Status 422 - Unprocessable Entity**
- Cause: Email format invalid
- Fix: Use valid email format

**No request at all**
- Cause: Supabase not connected
- Fix: Check `.env` file

---

## Common Error Messages & Fixes

### "Database not connected"
**What it means:** `.env` file missing Supabase credentials
**How to fix:**
1. Check `.env` file exists in project root
2. Verify it contains:
   ```
   VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbG...
   ```
3. Restart dev server

### "Invalid login credentials"
**What it means:** User doesn't exist or wrong password
**How to fix:**
1. Verify user exists in Supabase Dashboard → Auth → Users
2. If not, create user via `/signup` page
3. Make sure you're using exact credentials:
   - Email: `testuser@example.com`
   - Password: `TestPassword123!`

### "User not found"
**What it means:** Auth user exists but no profile in database
**How to fix:**
1. Check `profiles` table in Supabase Dashboard
2. Run this SQL in SQL Editor:
   ```sql
   SELECT * FROM profiles WHERE email = 'testuser@example.com';
   ```
3. If no profile exists, create one:
   ```sql
   INSERT INTO profiles (
     id,
     email,
     username,
     first_name,
     last_name,
     total_balance,
     available_balance
   ) VALUES (
     (SELECT id FROM auth.users WHERE email = 'testuser@example.com'),
     'testuser@example.com',
     'testuser',
     'Test',
     'User',
     5000.00,
     5000.00
   );
   ```

### Login succeeds but redirects back to login
**What it means:** Profile data missing or RLS blocking access
**How to fix:**
1. Check browser console for RLS errors
2. Verify profile exists with correct user ID
3. Check RLS policies allow authenticated users to read their profile

### Blank page after login
**What it means:** Dashboard component error or data loading issue
**How to fix:**
1. Check console for JavaScript errors
2. Verify profile data exists in database
3. Check `/dashboard` route is defined in App.tsx

---

## Quick Verification Checklist

Before asking for help, verify these:

- [ ] `.env` file exists with Supabase credentials
- [ ] Dev server restarted after editing `.env`
- [ ] User exists in Supabase Dashboard → Auth → Users
- [ ] User email is confirmed (no red warning in dashboard)
- [ ] Profile exists in `profiles` table
- [ ] Browser console shows no connection errors
- [ ] Network tab shows requests to Supabase
- [ ] Using exact credentials: `testuser@example.com` / `TestPassword123!`

---

## SQL Queries for Debugging

**Check if auth user exists:**
```sql
SELECT id, email, created_at, email_confirmed_at
FROM auth.users
WHERE email = 'testuser@example.com';
```

**Check if profile exists:**
```sql
SELECT id, email, username, total_balance
FROM profiles
WHERE email = 'testuser@example.com';
```

**Check profile with auth user ID:**
```sql
SELECT
  au.id as auth_id,
  au.email as auth_email,
  p.id as profile_id,
  p.email as profile_email,
  p.username,
  p.total_balance
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email = 'testuser@example.com';
```

**Create profile if missing:**
```sql
INSERT INTO profiles (
  id,
  uid,
  email,
  username,
  first_name,
  last_name,
  account_type,
  account_status,
  total_balance,
  available_balance,
  kyc_status
)
SELECT
  id,
  UPPER(SUBSTRING(id::text, 1, 8)),
  email,
  SPLIT_PART(email, '@', 1),
  'Test',
  'User',
  'standard',
  'active',
  5000.00,
  5000.00,
  'not_submitted'
FROM auth.users
WHERE email = 'testuser@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE email = 'testuser@example.com'
  );
```

---

## Where to Look for Errors

### 1. Browser Console (F12 → Console)
Shows JavaScript errors, auth state changes, and API responses

**Key messages to look for:**
- `🔍 Auth Context - Connection Status`
- `✅` or `❌` Login success/failure
- Supabase error messages
- Network request errors

### 2. Network Tab (F12 → Network)
Shows API requests to Supabase

**Look for:**
- POST to `supabase.co/auth/v1/token` (login request)
- Response status (200 = success, 400/401 = error)
- Response body (contains error details)

### 3. Supabase Dashboard Logs
Real-time logs of database operations

**Access:**
1. Supabase Dashboard → **Logs** → **API Logs**
2. Filter by timestamp
3. Look for failed auth attempts

### 4. Application Tab (F12 → Application)
Check stored session data

**Look for:**
- **Local Storage** → `supabase.auth.token`
- Should contain JWT if logged in
- Empty if logged out

---

## Testing Login Flow End-to-End

### Full Test Procedure:

**1. Clear Browser Data:**
```
1. Open DevTools (F12)
2. Application tab → Storage
3. Click "Clear site data"
4. Refresh page
```

**2. Verify User Exists:**
```
1. Supabase Dashboard
2. Authentication → Users
3. Find testuser@example.com
4. Status should be "Confirmed"
```

**3. Test Login:**
```
1. Go to /login
2. Open Console (F12)
3. Click email in cyan box
4. Click password in cyan box
5. Click "Login" button
6. Watch console messages
7. Should redirect to /dashboard
```

**4. Verify Dashboard Loads:**
```
1. Should see user dashboard
2. Balance should show $5,000
3. No error messages
4. Check console for errors
```

**5. Verify Session:**
```
1. F12 → Application tab
2. Local Storage → your domain
3. Look for supabase.auth.token
4. Should contain long JWT string
```

---

## Still Not Working?

### Provide These Details:

1. **Exact error message** from browser console
2. **Network request status** (200, 400, 401, etc.)
3. **Screenshot** of Supabase Users page
4. **Console output** when clicking login
5. **Whether user exists** in Supabase Dashboard

### Quick Fixes to Try:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Restart dev server** (Ctrl+C, then `npm run dev`)
3. **Use Signup page** to create fresh user
4. **Try incognito/private** browser window
5. **Check `.env` file** has correct values

---

## Summary

**Your app uses Supabase, not Bolt Database**

**To create test user:**
1. Go to `/signup` → Click "Auto-fill Test Credentials" → Sign Up
2. OR create in Supabase Dashboard → Auth → Users

**To debug login:**
1. Open DevTools Console (F12)
2. Watch for error messages
3. Check Network tab for failed requests
4. Verify user exists in Supabase Dashboard

**Most common issue:**
User doesn't exist in database → Create via signup page

---

**Last Updated:** 2025-10-04
**Database:** Supabase PostgreSQL
**No Bolt Database:** This project doesn't use Bolt Database
