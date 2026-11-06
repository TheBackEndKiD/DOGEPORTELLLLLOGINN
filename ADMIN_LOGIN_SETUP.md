# Admin Login - Complete Setup Guide

## Admin Credentials (Visible on Login Page)

```
Email: admin@doge.com
Password: admin123
```

**The admin login page now displays clickable credentials just like the user login!**

---

## How Your Admin System Works

### Two-Step Authentication:
1. **Supabase Auth** - Creates the auth user (handles login/logout)
2. **admin_users table** - Stores admin role and permissions

### Authentication Flow:
1. User enters credentials at `/admin/login`
2. Supabase Auth validates email/password
3. System checks `admin_users` table for role
4. If role is valid (super_admin/manager/support) → Access granted
5. Redirect to `/admin/dashboard`

---

## Quick Setup (2 Methods)

### Method 1: Use Supabase Dashboard (Easiest)

**Step 1: Create Auth User**
1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"**
3. Enter:
   ```
   Email: admin@doge.com
   Password: admin123
   ```
4. ✅ Check **"Auto Confirm User"**
5. Click **"Create User"**
6. **Copy the User ID**

**Step 2: Add to admin_users Table**
1. Go to **SQL Editor**
2. Run this query (paste the User ID from Step 1):

```sql
-- Create admin entry in admin_users table
INSERT INTO admin_users (
  id,
  email,
  username,
  password_hash,
  role,
  is_active,
  permissions,
  created_at
) VALUES (
  'PASTE_USER_ID_HERE',  -- Replace with Supabase Auth User ID
  'admin@doge.com',
  'admin',
  'admin123',  -- Note: This is stored for reference, actual auth uses Supabase
  'super_admin',
  true,
  '["all"]'::jsonb,
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Verify admin was created
SELECT id, email, username, role, is_active
FROM admin_users
WHERE email = 'admin@doge.com';
```

---

### Method 2: SQL Only (Advanced)

Run this in Supabase SQL Editor:

```sql
-- This requires the auth user to already exist in Supabase Auth
-- You must create it via Dashboard first, then get the ID

-- Example: If your auth user ID is 'abc123-def456-...'
INSERT INTO admin_users (
  id,
  email,
  username,
  password_hash,
  role,
  is_active,
  permissions
) VALUES (
  'YOUR_SUPABASE_AUTH_USER_ID',
  'admin@doge.com',
  'admin',
  'admin123',
  'super_admin',
  true,
  '["all"]'::jsonb
)
ON CONFLICT (email) DO UPDATE SET
  is_active = true,
  role = 'super_admin';
```

---

## Admin Login Page Features

### Visual Elements:
- **Blue gradient background** (different from user login)
- **Cyan credentials box** with:
  - Info icon
  - "Test Admin Credentials" heading
  - Clickable email field
  - Clickable password field
  - "Click credentials to auto-fill" helper

### How to Use:
1. Go to **`/admin/login`**
2. **Click email** in cyan box → Auto-fills
3. **Click password** in cyan box → Auto-fills
4. Click **"Sign In as Admin"**
5. **Admin dashboard loads!**

---

## Admin Roles & Permissions

### Role Hierarchy:
1. **super_admin** - Full access to everything
2. **manager** - Most features (can't manage other admins)
3. **support** - Limited access (customer support tasks)

### What Each Role Can Do:

**Super Admin:**
- Manage all users
- Manage other admins
- Access all settings
- View all analytics
- Approve/reject transactions
- Full system control

**Manager:**
- Manage users
- View analytics
- Approve/reject transactions
- Access most settings
- Cannot manage admins

**Support:**
- View user data
- Respond to tickets
- Basic user operations
- Limited analytics access

---

## What You'll See After Login

### Admin Dashboard:
- **User Statistics**
  - Total users
  - Active users
  - New signups
  - User growth chart

- **Financial Overview**
  - Total deposits
  - Total withdrawals
  - Total investments
  - Platform revenue

- **Recent Activity**
  - Latest transactions
  - New user registrations
  - Pending approvals
  - Support tickets

- **Quick Actions**
  - Manage users
  - Approve withdrawals
  - View analytics
  - System settings

### Navigation Menu:
- Dashboard
- User Management
- Transaction Logs
- Deposit Management
- Withdrawal Requests
- Investment Plans
- KYC Verifications
- Support Tickets
- Analytics
- Settings
- Profile

---

## Verification Queries

### Check if admin exists:
```sql
-- Check auth user
SELECT id, email, created_at
FROM auth.users
WHERE email = 'admin@doge.com';

-- Check admin_users entry
SELECT id, email, username, role, is_active
FROM admin_users
WHERE email = 'admin@doge.com';
```

### Check admin permissions:
```sql
SELECT
  email,
  role,
  is_active,
  permissions,
  created_at
FROM admin_users
WHERE email = 'admin@doge.com';
```

---

## Troubleshooting

### "Invalid credentials"
**Cause**: Auth user doesn't exist in Supabase  
**Fix**: Create user in Supabase Dashboard → Auth → Users

### "Access denied" or redirects to login
**Cause**: User exists but not in admin_users table  
**Fix**: Run Step 2 SQL to add to admin_users table

### Login succeeds but dashboard shows error
**Cause**: Role check failed or user inactive  
**Fix**:
```sql
UPDATE admin_users
SET is_active = true,
    role = 'super_admin'
WHERE email = 'admin@doge.com';
```

### "Database not connected" error
**Cause**: Supabase credentials missing  
**Fix**: Check `.env` file has:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

---

## Security Notes

### Important:
- Admin auth uses **Supabase Authentication** (secure)
- Passwords are **hashed by Supabase** (not stored in plain text)
- The `password_hash` field in `admin_users` is for reference only
- **Row Level Security** is enabled on all tables
- Sessions expire after inactivity

### Best Practices:
- Change default password after first login
- Use strong passwords (8+ characters, mixed case, numbers, symbols)
- Don't share admin credentials
- Regularly review admin user list
- Disable inactive admin accounts

---

## Creating Additional Admins

### Via Dashboard:
1. Create auth user in Supabase Dashboard
2. Get user ID
3. Run SQL:

```sql
INSERT INTO admin_users (
  id,
  email,
  username,
  password_hash,
  role,
  is_active
) VALUES (
  'AUTH_USER_ID',
  'manager@doge.com',
  'manager1',
  'stored_for_reference',
  'manager',  -- or 'support'
  true
);
```

---

## Comparison: User vs Admin Login

### User Login (`/login`):
- Cyan-themed
- For investors/customers
- Access to personal dashboard
- Manage own investments
- View own transactions

### Admin Login (`/admin/login`):
- Blue-themed
- For administrators
- Access to admin dashboard
- Manage all users
- View all system data
- Approve transactions
- System settings

---

## Quick Reference

**URL**: `/admin/login`  
**Credentials**: admin@doge.com / admin123  
**Database Tables**: 
- `auth.users` (Supabase Auth)
- `admin_users` (Role & permissions)

**Status**: ✅ Ready to use after setup  
**Setup Time**: 2-3 minutes  
**Required**: Supabase Auth user + admin_users entry

---

## Summary

1. **Create Supabase Auth user** (email: admin@doge.com)
2. **Add entry to admin_users table** with super_admin role
3. **Go to `/admin/login`**
4. **Click credentials** in cyan box to auto-fill
5. **Login** → Admin dashboard opens!

The admin credentials are now **visible and clickable** on the admin login page!

---

**Last Updated**: 2025-10-04  
**Credentials**: admin@doge.com / admin123  
**Access Level**: Super Admin  
**Status**: Configured
