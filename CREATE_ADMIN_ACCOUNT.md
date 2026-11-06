# Create Admin Account for worldvibemanager@gmail.com

## Step 1: Create User in Supabase Auth

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Users** in the left sidebar
4. Click **"Add user"** button
5. Fill in:
   - **Email**: `worldvibemanager@gmail.com`
   - **Password**: Choose a secure password (you'll use this to login)
   - **Auto Confirm User**: YES (enable this toggle)
6. Click **"Create user"**
7. **Copy the User ID** that appears (it looks like: `abc123def-4567-89ab-cdef-0123456789ab`)

## Step 2: Add Admin Privileges

After creating the user, run this SQL in your Supabase SQL Editor:

1. Go to **SQL Editor** in your Supabase Dashboard
2. Click **"New query"**
3. Paste the SQL from `ADD_ADMIN_PRIVILEGES.sql` file
4. **Replace `YOUR_USER_ID_HERE`** with the actual User ID from Step 1
5. Click **"Run"**

## Step 3: Login

1. Go to your app: `/admin/login`
2. Login with:
   - **Email**: `worldvibemanager@gmail.com`
   - **Password**: The password you set in Step 1

## Troubleshooting

### "You do not have admin privileges" Error
- Make sure you ran the SQL script from Step 2
- Verify the user_id matches exactly
- Check that `is_active = true` in the admin_users table

### "Invalid credentials" Error
- Double-check the password you set
- Make sure you enabled "Auto Confirm User"
- Try resetting the password in Supabase Dashboard

### Login Loop or Blank Page
- Clear browser cache and cookies
- Try incognito/private browsing mode
- Check browser console for errors (F12)

## Alternative: Use Existing Test Admin

If you want to test immediately, use the pre-configured test admin:
- **Email**: `admin@doge.com`
- **Password**: `admin123`

This account should already exist in your database.
