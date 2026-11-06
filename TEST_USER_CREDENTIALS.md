# Test User Login Credentials

## 🔐 User Login Details

### Test User Account
```
Email: testuser@example.com
Password: TestPassword123!
```

---

## 📋 How to Create This User

Since this project uses **Supabase Authentication**, you need to create the user through Supabase Auth:

### Option 1: Use the Signup Page (Recommended)
1. Go to the signup page in your app
2. Register with the credentials above:
   - **Email**: testuser@example.com
   - **Password**: TestPassword123!
   - **Username**: testuser
   - **First Name**: John
   - **Last Name**: Doe

### Option 2: Supabase Dashboard
1. Go to your Supabase Dashboard: https://0ec90b57d6e95fcbda19832f.supabase.co
2. Navigate to **Authentication** → **Users**
3. Click **Add User**
4. Enter:
   - Email: `testuser@example.com`
   - Password: `TestPassword123!`
   - Auto-confirm: **Yes** (check this box)
5. Click **Create User**

### Option 3: SQL Script (Create User + Profile)
Run this SQL in your Supabase SQL Editor:

```sql
-- First, create the auth user
-- Note: You need to run this in Supabase Dashboard > SQL Editor
-- as it requires admin privileges

-- Create auth user (this is a sample - actual implementation varies)
-- You'll need to use Supabase Dashboard for this part

-- Then create the profile
INSERT INTO profiles (
  id,
  uid,
  email,
  first_name,
  last_name,
  username,
  phone,
  account_type,
  account_level,
  account_status,
  total_balance,
  available_balance,
  total_deposit,
  total_withdraw,
  total_invest,
  current_invest,
  profit,
  withdraws,
  kyc_status,
  kyc_document_url,
  referral_code,
  referred_by,
  created_at,
  updated_at
) VALUES (
  'USER_AUTH_ID_HERE', -- Replace with actual Supabase auth user ID
  'USR12345',
  'testuser@example.com',
  'John',
  'Doe',
  'testuser',
  '+1234567890',
  'individual',
  'STARTER',
  'active',
  5000.00,
  2500.00,
  5000.00,
  0.00,
  2500.00,
  2500.00,
  350.00,
  0.00,
  'verified',
  '',
  'REF12345',
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name;
```

---

## 🎯 Additional Test Users

### User 2 - Premium Account
```
Email: premium@example.com
Password: Premium123!
Name: Jane Smith
Account Level: PREMIUM
```

### User 3 - VIP Account
```
Email: vip@example.com
Password: VipUser123!
Name: Robert Johnson
Account Level: VIP
```

---

## ⚠️ Important Notes

1. **Email Confirmation**:
   - By default, Supabase requires email confirmation
   - You can disable this in Supabase Dashboard → Authentication → Settings → Email Auth
   - Or use the "Auto-confirm" option when creating users

2. **Password Requirements**:
   - Minimum 8 characters
   - Contains uppercase and lowercase letters
   - Contains numbers
   - Contains special characters

3. **After Creating User**:
   - The profile will be automatically created via database trigger
   - Default balance: $5,000
   - Available balance: $2,500
   - Account status: Active
   - KYC Status: Verified

4. **Admin Login** (Different from User Login):
   - Admin login is at `/admin/login`
   - Uses different authentication context
   - See separate admin credentials if needed

---

## 🔧 Quick Setup Script

To quickly set up a test user, you can use the signup form with these steps:

1. Navigate to `/signup` in your app
2. Fill in the form:
   ```
   Email: testuser@example.com
   Password: TestPassword123!
   Username: testuser
   First Name: John
   Last Name: Doe
   Phone: +1234567890
   ```
3. Click **Sign Up**
4. If email confirmation is enabled, check your email
5. Confirm the email link
6. Login at `/login` with the credentials

---

## 🎨 Test User Dashboard Preview

Once logged in, you'll see:
- **Total Balance**: $5,000.00
- **Available Balance**: $2,500.00
- **Account Level**: STARTER
- **KYC Status**: Verified
- **Account Status**: Active

---

## 🔍 Verification

To verify the user was created successfully:

### Via Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Look for `testuser@example.com`
3. Click on the user to see details

### Via SQL Query:
```sql
SELECT
  id,
  uid,
  email,
  first_name,
  last_name,
  account_level,
  account_status,
  total_balance,
  available_balance,
  kyc_status
FROM profiles
WHERE email = 'testuser@example.com';
```

---

## 📱 Login Page Location

**User Login**: `http://your-app-url/login`

Simply enter:
- Email: `testuser@example.com`
- Password: `TestPassword123!`

And click **Sign In**

---

## ⚡ Troubleshooting

### "Invalid login credentials"
- Check if user was created in Supabase Auth
- Verify email confirmation was completed
- Check if password matches exactly

### "User not found"
- Profile might not have been created
- Check if database trigger is working
- Manually create profile using SQL above

### "Email not confirmed"
- Go to Supabase Dashboard → Authentication → Users
- Find the user and click "Confirm Email"
- Or disable email confirmation in settings

---

**Last Updated**: 2025-10-04
