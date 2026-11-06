# Test Your Login - Step by Step

## ⚠️ CRITICAL: This Project Uses Supabase (NOT Bolt Database)

**Stop looking for:** Bolt Dashboard, Bolt Database, Bolt Users
**Start using:** Supabase Dashboard, Supabase PostgreSQL, Supabase Auth

---

## Quick Test (30 Seconds)

### Option 1: Use Signup Page (Recommended)

1. **Open your app**
2. **Go to `/signup`** (click "Sign Up" link on login page)
3. **Click "Auto-fill Test Credentials"** (big green button)
4. **Click "Sign Up"**
5. **Done!** You'll be logged in automatically

### Option 2: Use Login Page (If User Already Exists)

1. **Open your app at `/login`**
2. **Click the email** in the cyan box (testuser@example.com)
3. **Click the password** in the cyan box (TestPassword123!)
4. **Click "Login"** button
5. **Should redirect to dashboard**

---

## If Login Doesn't Work

### Check #1: Does User Exist?

**Access Supabase Dashboard:**
```
1. Go to https://supabase.com/dashboard
2. Login to your account
3. Find project: 0ec90b57d6e95fcbda19832f
4. Click "Authentication" → "Users"
5. Look for testuser@example.com
```

**User not there?** → Use signup page to create it

### Check #2: Is Supabase Connected?

**Open browser console (F12):**
```
1. Go to /login
2. Open DevTools (F12)
3. Console tab
4. Look for: "Auth Context - Connection Status"
5. Should show: isInitialized: true
```

**Shows false?** → Check `.env` file has credentials

### Check #3: What's the Error?

**Try to login and watch console:**
```
1. F12 → Console tab
2. Click Login button
3. Read error message
```

**Common errors:**

```
"Invalid login credentials"
→ User doesn't exist, use signup page

"Database not connected"
→ Check .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

"User not found"
→ Auth user exists but no profile, use signup to create complete user
```

---

## The Easiest Way: Just Use Signup!

**Why signup is better:**
- ✅ Creates auth user automatically
- ✅ Creates profile automatically
- ✅ Sets initial balance ($5,000)
- ✅ Auto-fills form with one click
- ✅ Logs you in immediately
- ✅ No Supabase Dashboard needed

**How to do it:**
```
1. Click "Sign Up" on login page
2. Click "Auto-fill Test Credentials"
3. Click "Sign Up"
4. DONE!
```

---

## What You Should See After Login

### User Dashboard Should Show:
- **Balance:** $5,000.00
- **Username:** testuser
- **Email:** testuser@example.com
- **Navigation menu** with Dashboard, Portfolio, Deposit, etc.
- **No error messages**

### If You See Instead:
- **Blank page** → Check console for errors
- **"Not authenticated"** → Session not created, try again
- **Login page again** → Auth failed, user may not exist
- **Loading forever** → API request stuck, check Network tab

---

## Your Database Architecture

```
Supabase Auth (auth.users)
         ↓
    Creates JWT Token
         ↓
Profile in Database (profiles table)
         ↓
    User Dashboard
```

**NOT:**
```
Bolt Database ❌ (doesn't exist in your project)
```

---

## Need to Start Fresh?

### Reset Everything:

**1. Clear Browser Data:**
```
DevTools (F12) → Application → Clear site data
```

**2. Delete Test User (if exists):**
```
Supabase Dashboard → Auth → Users → Find testuser@example.com → Delete
```

**3. Create New User:**
```
Your app → /signup → Auto-fill → Sign Up
```

---

## Credentials Reference

**User Login:**
```
Email: testuser@example.com
Password: TestPassword123!
URL: /login
```

**Admin Login:**
```
Email: admin@doge.com
Password: admin123
URL: /admin/login
(Requires setup in Supabase first)
```

---

## What NOT to Look For

❌ Bolt Database
❌ Bolt Dashboard
❌ Bolt Users
❌ `/admin/login` POST endpoint
❌ `bolt-config.js` file
❌ `db.get()` or `db.set()` functions

## What to ACTUALLY Use

✅ Supabase Dashboard (supabase.com/dashboard)
✅ Supabase PostgreSQL
✅ Supabase Authentication
✅ React + TypeScript frontend
✅ Supabase client library
✅ `supabase.auth.signInWithPassword()`

---

## Summary

**Fastest way to test login:**
1. Go to `/signup`
2. Click "Auto-fill Test Credentials"
3. Click "Sign Up"
4. You're in!

**If that doesn't work:**
1. Open DevTools Console (F12)
2. Look for error message
3. Share exact error in troubleshooting

**Remember:**
- Your project uses **Supabase** (not Bolt Database)
- Signup creates complete user automatically
- Login credentials are visible and clickable
- Everything is already set up correctly

---

**Project Type:** React + Supabase
**Database:** Supabase PostgreSQL
**Auth:** Supabase Authentication
**No Backend:** Everything client-side with Supabase
