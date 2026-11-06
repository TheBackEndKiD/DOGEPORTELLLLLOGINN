# Quick Debug & Access Guide

## All Login Credentials - At a Glance

### User Login (`/login`)
```
Email: testuser@example.com
Password: TestPassword123!
Access: User Dashboard
```

### Admin Login (`/admin/login`)
```
Email: admin@doge.com
Password: admin123
Access: Admin Dashboard
```

---

## Important: Your Project Uses Supabase (NOT "Bolt Database")

### What You Have:
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS

### What You DON'T Have:
- ❌ Bolt Database
- ❌ `db.get()` or `db.set()` functions
- ❌ Traditional backend server
- ❌ Express.js endpoints

---

## Your Authentication Architecture

### User Authentication:
```
Login Form → Supabase Auth → profiles table → Dashboard
```

**Files:**
- `src/pages/Login.tsx` - Login UI
- `src/pages/Signup.tsx` - Signup UI
- `src/contexts/AuthContext.tsx` - Auth logic
- Database: `profiles` table

### Admin Authentication:
```
Login Form → Supabase Auth → admin_users table → Admin Dashboard
```

**Files:**
- `src/pages/Admin/AdminLogin.tsx` - Admin login UI
- `src/contexts/AdminAuthContext.tsx` - Admin auth logic
- Database: `admin_users` table

---

## Code You Shared Won't Work - Here's Why

### ❌ This Won't Work (from your message):
```javascript
import { db } from './bolt-config'; // ❌ Doesn't exist
const adminData = await db.get('admin:credentials'); // ❌ Wrong approach
```

### ✅ What Actually Works (your current code):
```typescript
import { supabase } from './lib/supabase'; // ✅ Correct
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
}); // ✅ Supabase Auth
```

---

## How to Actually Implement Features

### Adding New Features:

**Don't do this:**
```javascript
// ❌ Wrong - Bolt Database approach
await db.set('key', value);
const data = await db.get('key');
```

**Do this:**
```typescript
// ✅ Correct - Supabase approach
const { data, error } = await supabase
  .from('table_name')
  .insert({ column: value });

const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('id', userId);
```

---

## Setting Up Users (Step by Step)

### User Account Setup:

**Method 1: Quick (15 seconds)**
1. Go to `/signup`
2. Click "Auto-fill Test Credentials"
3. Click "Sign Up"
4. Done!

**Method 2: Manual (2 minutes)**
1. Supabase Dashboard → Auth → Users → Add User
2. Email: testuser@example.com, Password: TestPassword123!
3. Check "Auto Confirm User"
4. Profile created automatically via trigger

### Admin Account Setup:

**Step 1: Create Auth User**
1. Supabase Dashboard → Auth → Users → Add User
2. Email: admin@doge.com, Password: admin123
3. Check "Auto Confirm User"
4. Copy User ID

**Step 2: Add to admin_users**
```sql
INSERT INTO admin_users (
  id, email, username, password_hash, 
  role, is_active, permissions
) VALUES (
  'PASTE_USER_ID',
  'admin@doge.com',
  'admin',
  'admin123',
  'super_admin',
  true,
  '["all"]'::jsonb
);
```

---

## Common Issues & Solutions

### "Database not initialized"
**Cause**: Missing Supabase credentials  
**Fix**: Check `.env` file:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### "Import error: cannot find module"
**Cause**: Trying to import non-existent files  
**Fix**: Use correct imports:
```typescript
// ✅ Correct
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// ❌ Wrong
import { db } from './bolt-config'; // Doesn't exist
```

### "Invalid credentials" on login
**User Login:**
- User doesn't exist → Use signup page
- Profile not created → Check database trigger

**Admin Login:**
- Auth user doesn't exist → Create in Supabase Dashboard
- Not in admin_users table → Run SQL to add entry

---

## File Structure Reference

### Authentication Files:
```
src/
├── contexts/
│   ├── AuthContext.tsx          # User auth logic
│   └── AdminAuthContext.tsx     # Admin auth logic
├── lib/
│   └── supabase.ts              # Supabase client
├── pages/
│   ├── Login.tsx                # User login UI
│   ├── Signup.tsx               # User signup UI
│   ├── Dashboard.tsx            # User dashboard
│   └── Admin/
│       ├── AdminLogin.tsx       # Admin login UI
│       └── AdminDashboard.tsx   # Admin dashboard
└── types/
    └── index.ts                 # TypeScript types
```

### Database Tables:
- `auth.users` - Supabase Auth (auto-managed)
- `profiles` - User profiles and balances
- `admin_users` - Admin roles and permissions
- `transactions` - Financial transactions
- `user_investments` - Investment records
- `investment_plans` - Available plans
- `notifications` - User notifications
- `kyc_verifications` - KYC documents
- `referrals` - Referral tracking

---

## Quick Commands

### Development:
```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

### Checking Issues:
```bash
# Check if Supabase is configured
cat .env | grep VITE_SUPABASE

# Check for TypeScript errors
npm run typecheck

# Check for linting issues
npm run lint
```

---

## Testing Your Changes

### Test User Login:
1. Open `/login`
2. Click credentials in cyan box
3. Click Login
4. Should see user dashboard with $5,000 balance

### Test Admin Login:
1. Open `/admin/login`
2. Click credentials in cyan box
3. Click Login
4. Should see admin dashboard with stats

### Test Signup:
1. Open `/signup`
2. Click "Auto-fill Test Credentials"
3. Click Sign Up
4. Should create user and redirect to dashboard

---

## When You Get Stuck

### Check These First:
1. **Browser Console** (F12) - Look for errors
2. **Network Tab** - Check API calls to Supabase
3. **Supabase Dashboard** - Verify users exist
4. **Database Tables** - Check if data is there
5. **.env File** - Ensure credentials are correct

### Common Console Errors:
```
"Cannot read property 'auth' of undefined"
→ Supabase not initialized, check .env

"Invalid API key"
→ Wrong ANON_KEY in .env

"User not found"
→ Profile doesn't exist, check profiles table

"Access denied"
→ RLS policy blocking access, check policies
```

---

## Key Differences: Traditional vs Your Setup

### Traditional Backend:
```javascript
// Express.js style
app.post('/login', (req, res) => {
  // Check database
  // Create session
  // Send response
});
```

### Your Setup (Supabase):
```typescript
// React + Supabase
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
});
// Session managed automatically
```

---

## Summary

### What Works:
✅ User login with visible credentials at `/login`  
✅ User signup with auto-fill at `/signup`  
✅ Admin login with visible credentials at `/admin/login`  
✅ Supabase authentication and database  
✅ React Router navigation  
✅ TypeScript type safety  

### What Doesn't Exist:
❌ Bolt Database  
❌ `db.get()` or `db.set()`  
❌ Traditional backend server  
❌ `/admin/login` POST endpoint  

### Remember:
- Your app uses **Supabase** for everything
- Authentication is handled by **Supabase Auth**
- All database operations use **Supabase client**
- Never try to import non-existent files

---

**Need Help?**
1. Check this guide
2. Look at existing code in the project
3. Read `QUICK_ACCESS_GUIDE.md`
4. Check `ADMIN_LOGIN_SETUP.md`

**Last Updated**: 2025-10-04  
**Project Type**: React + Supabase  
**No Backend Server**: Everything runs client-side with Supabase
