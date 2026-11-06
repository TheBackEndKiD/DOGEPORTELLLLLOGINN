# Create Active Test User - Quick Setup

## EASIEST METHOD: Use the Signup Form ✅

### Steps to Create an Active User:
1. **Open your app in StackBlitz**
2. **Navigate to `/signup`** (or click "Sign Up" link on login page)
3. **Click "Auto-fill Test Credentials"** button (cyan box at top)
4. **Click "Sign Up"** button
5. **Done!** You're automatically logged in and redirected to dashboard

### What You Get:
```
Email: testuser@example.com
Password: TestPassword123!
Name: John Doe
Username: testuser
Balance: $5,000.00
Account Status: Active
```

This method:
- ✅ Creates Supabase Auth user automatically
- ✅ Creates profile in database via trigger
- ✅ Sets up all required fields
- ✅ Logs you in immediately
- ✅ Takes you straight to dashboard
- ✅ No SQL or manual steps needed!

---

## Alternative: Login with Existing Credentials

If the user already exists, use the **Login page**:

1. Go to `/login`
2. Click on email in cyan box → **testuser@example.com**
3. Click on password in cyan box → **TestPassword123!**
4. Click **"Login"**
5. Access dashboard instantly

---

## Manual Method: Supabase Dashboard

If you need to create the user manually:

### Step 1: Create Auth User
1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"**
3. Enter:
   ```
   Email: testuser@example.com
   Password: TestPassword123!
   ```
4. ✅ Check **"Auto Confirm User"**
5. Click **"Create User"**
6. Copy the **User ID**

### Step 2: Create Profile (SQL Editor)
Go to **SQL Editor** and run:

```sql
-- Replace 'PASTE_USER_ID_HERE' with the ID from Step 1
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
  referral_code,
  created_at,
  updated_at
) VALUES (
  'PASTE_USER_ID_HERE',
  'USR' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0'),
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
  'REF' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email;
```

---

## What You'll See on Dashboard

After successful login:

### User Info Card (Top)
- Avatar with initial "J"
- Name: John Doe
- UID: USR##### (random)
- Status: Active (green dot)
- Email: testuser@example.com

### Balance Display
- **Total Balance**: $5,000.00
- Quick action buttons: Deposit | Withdraw

### Metrics (Row 1)
1. Account Level: STARTER
2. Profit: $350.00
3. Withdraws: $0.00
4. Available Balance: $2,500.00

### Metrics (Row 2)
1. Total Withdraw: $0.00
2. Total Deposit: $5,000.00
3. Total Invest: $2,500.00
4. Current Invest: $2,500.00

---

## Troubleshooting

### "Invalid login credentials"
**Fix**: User doesn't exist. Use the **Signup page** method above to create it.

### "Email not confirmed"
**Fix**:
- Go to Supabase Dashboard → Authentication → Users
- Find testuser@example.com
- Click "Confirm Email"

### Dashboard shows $0 or blank
**Fix**: Profile wasn't created. Run the SQL from Step 2 above.

### Login works but shows error
**Fix**: Check Supabase connection in `.env` file.

---

## Additional Test Users

Create more users by changing the email on signup:

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

---

## Admin Login (Separate)

For admin access:
```
Email: admin@doge.com
Password: admin123
URL: /admin/login
```

(Admin login is separate from regular user login)

---

## Summary

**RECOMMENDED**: Use the **Signup page** with the "Auto-fill Test Credentials" button.

This creates a fully functional user account in one click with:
- ✅ Active authentication
- ✅ Complete profile
- ✅ Sample balance ($5,000)
- ✅ Transaction history
- ✅ Immediate dashboard access

No manual steps, no SQL, no configuration needed!

---

**Quick Access**:
- Signup: `/signup` → Click "Auto-fill Test Credentials" → Sign Up
- Login: `/login` → Click credentials in cyan box → Login

**Credentials**: testuser@example.com / TestPassword123!
