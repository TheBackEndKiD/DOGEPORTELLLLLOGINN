# 🔧 Supabase Connection Guide

## Current Issue
Your app is not connecting to Supabase. This guide will help you fix it.

## Step 1: Check Your Environment Variables

Your app needs these environment variables in a `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 2: Get Your Supabase Credentials

1. **Go to** https://supabase.com/dashboard
2. **Sign in** or create account
3. **Create a new project** or select existing
4. **Go to Settings** → **API**
5. **Copy these values:**
   - Project URL (for VITE_SUPABASE_URL)
   - Anon/Public key (for VITE_SUPABASE_ANON_KEY)

## Step 3: Create .env File

Create a `.env` file in your project root with your credentials:

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY4...
```

## Step 4: Apply Database Migrations

After connecting, your database needs tables. In your Supabase dashboard:

1. **Go to** SQL Editor
2. **Run each migration file** in order:
   - `supabase/migrations/20250930215013_create_initial_schema.sql`
   - `supabase/migrations/20250930215038_insert_sample_data.sql`
   - `supabase/migrations/20250930223856_fix_security_and_performance_issues.sql`
   - `supabase/migrations/20250930233800_dry_meadow.sql`
   - `supabase/migrations/20251001000000_add_missing_profile_fields.sql`

## Step 5: Verify Connection

After adding credentials:

1. **Refresh your app**
2. **Check browser console** for connection messages
3. **Look for** "✅ Supabase client created successfully"
4. **Test login** with these credentials:

### Admin Login
- URL: `/admin/login`  
- Email: `admin@doge.com`
- Password: `admin123`

### User Signup
- URL: `/signup`
- Create any new account

## Troubleshooting

### ❌ "Missing environment variables"
- Make sure `.env` file exists in project root
- Check variable names match exactly (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- Restart your development server

### ❌ "Connection test failed"
- Verify your Supabase project is running
- Check your URL and key are correct
- Make sure you haven't exceeded Supabase limits

### ❌ "Tables don't exist"
- Run the database migrations in Supabase SQL Editor
- Check that all tables were created successfully

## Debug Information

The app now shows detailed connection info in:
- **Browser console** (F12 → Console)
- **Yellow warning banner** (if connection issues)
- **Login page errors** (if database not connected)

## Success Indicators

You'll know it's working when you see:
- ✅ No yellow warning banner
- ✅ "Supabase client created successfully" in console
- ✅ Admin login works
- ✅ User signup works
- ✅ No connection errors on pages

## Need Help?

Check the browser console (F12) for detailed error messages and connection status.