# Database Documentation

## Overview

This document provides comprehensive information about the database schema, migrations, and how to work with the Supabase database for this DOGE investment platform.

## Database Connection

The application uses Supabase as the database backend. Connection details are stored in the `.env` file:

```env
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Database Schema

### Core Tables

#### 1. `profiles`
User profile information extending Supabase auth.users

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key, references auth.users |
| username | text | Unique username |
| full_name | text | User's full name |
| email | text | User's email (unique) |
| phone | text | Phone number |
| country | text | Country |
| balance | decimal(20,8) | Available balance |
| total_invested | decimal(20,8) | Total amount invested |
| total_withdrawn | decimal(20,8) | Total amount withdrawn |
| total_deposit | decimal(20,8) | Total amount deposited |
| profit | decimal(20,8) | Total profit earned |
| referral_code | text | Unique referral code |
| referred_by | uuid | References profiles.id |
| kyc_status | text | pending, approved, rejected, not_submitted |
| is_active | boolean | Account status |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### 2. `investment_plans`
Different investment tiers/plans

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Plan name |
| min_amount | decimal(20,8) | Minimum investment |
| max_amount | decimal(20,8) | Maximum investment |
| interest_rate | decimal(10,4) | Daily/monthly interest rate % |
| duration_days | integer | Investment duration |
| is_active | boolean | Plan availability |
| features | jsonb | Plan features as JSON |
| created_at | timestamptz | Creation timestamp |

#### 3. `user_investments`
Tracks individual investments

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References profiles |
| plan_id | uuid | References investment_plans |
| amount | decimal(20,8) | Investment amount |
| status | text | active, completed, cancelled |
| start_date | timestamptz | Investment start date |
| end_date | timestamptz | Investment end date |
| total_earned | decimal(20,8) | Total interest earned |
| last_interest_date | timestamptz | Last interest calculation |
| created_at | timestamptz | Creation timestamp |

#### 4. `transactions`
All financial transactions

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References profiles |
| type | text | deposit, withdraw, interest, referral_bonus |
| amount | decimal(20,8) | Transaction amount |
| status | text | pending, approved, rejected |
| payment_method | text | Payment method used |
| transaction_hash | text | Crypto transaction hash |
| notes | text | User notes |
| admin_notes | text | Admin notes |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### 5. `referrals`
Referral tracking and commissions

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| referrer_id | uuid | User who referred |
| referred_id | uuid | User who was referred |
| commission_amount | decimal(20,8) | Commission amount |
| commission_paid | boolean | Payment status |
| created_at | timestamptz | Creation timestamp |

#### 6. `notifications`
User notifications

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References profiles |
| title | text | Notification title |
| message | text | Notification message |
| type | text | info, success, warning, error |
| is_read | boolean | Read status |
| created_at | timestamptz | Creation timestamp |

#### 7. `kyc_verifications`
KYC document submissions

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References profiles |
| document_type | text | passport, drivers_license, national_id |
| document_front_url | text | Front document URL |
| document_back_url | text | Back document URL |
| selfie_url | text | Selfie URL |
| status | text | pending, approved, rejected |
| rejection_reason | text | Reason for rejection |
| submitted_at | timestamptz | Submission timestamp |
| reviewed_at | timestamptz | Review timestamp |
| reviewed_by | uuid | Admin who reviewed |

#### 8. `admin_users`
Admin authentication and roles

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| email | text | Admin email (unique) |
| username | text | Admin username (unique) |
| password_hash | text | Hashed password |
| role | text | super_admin, manager, support |
| permissions | jsonb | Role permissions |
| is_active | boolean | Account status |
| created_at | timestamptz | Creation timestamp |

#### 9. `admin_audit_log`
Admin action tracking

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| admin_id | uuid | References admin_users |
| action | text | Action performed |
| target_table | text | Table affected |
| target_id | uuid | Record affected |
| old_values | jsonb | Previous values |
| new_values | jsonb | New values |
| ip_address | inet | IP address |
| user_agent | text | Browser user agent |
| created_at | timestamptz | Creation timestamp |

## Helper Functions

### 1. `get_user_dashboard_stats(user_id uuid)`
Returns comprehensive dashboard statistics for a user.

**Returns:**
```json
{
  "total_deposit": 1000.00,
  "total_withdraw": 200.00,
  "total_profit": 150.00,
  "pending_transactions": 2
}
```

**Usage:**
```sql
SELECT * FROM get_user_dashboard_stats('user-uuid-here');
```

### 2. `get_admin_dashboard_stats()`
Returns comprehensive statistics for admin dashboard.

**Returns:**
```json
{
  "total_users": 100,
  "active_users": 95,
  "deactive_users": 5,
  "total_invest": 50000.00,
  "pending_invest": 5000.00,
  "total_interest": 2500.00,
  "total_withdraw": 10000.00,
  "pending_withdraw": 1500.00
}
```

**Usage:**
```sql
SELECT * FROM get_admin_dashboard_stats();
```

### 3. `calculate_investment_returns(investment_id uuid)`
Calculates the current returns for an investment based on days elapsed.

**Returns:** numeric (calculated return amount)

**Usage:**
```sql
SELECT calculate_investment_returns('investment-uuid-here');
```

## Views

### 1. `active_investments_with_plans`
Shows all active investments with full plan and user details.

**Usage:**
```sql
SELECT * FROM active_investments_with_plans WHERE user_id = 'user-uuid';
```

### 2. `pending_transactions_with_users`
Shows all pending transactions with user information.

**Usage:**
```sql
SELECT * FROM pending_transactions_with_users ORDER BY created_at DESC;
```

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### User Policies
- Users can view and update their own profile
- Users can view their own transactions, investments, referrals
- Users can create their own transactions and investments
- Users can view active investment plans

### Admin Policies
- Authenticated users can check if they are admins by querying admin_users
- Admins can view audit logs
- Admin operations are logged automatically

## Indexes

The database includes comprehensive indexes for optimal performance:

### Primary Indexes
- `idx_profiles_referral_code` - Referral code lookups
- `idx_profiles_referred_by` - Referral chain queries
- `idx_profiles_is_active` - Active user filtering
- `idx_profiles_created_at` - User registration timeline

### Transaction Indexes
- `idx_transactions_user_id` - User transaction queries
- `idx_transactions_status` - Status filtering
- `idx_transactions_type` - Type filtering
- `idx_transactions_user_type_status` - Composite for complex queries
- `idx_transactions_created_at` - Timeline queries

### Investment Indexes
- `idx_user_investments_user_id` - User investment queries
- `idx_user_investments_status` - Status filtering
- `idx_user_investments_user_status` - Composite queries
- `idx_user_investments_end_date` - Maturity tracking

## Migrations

Migrations are located in `supabase/migrations/` and are applied in chronological order:

1. **20250930215013_create_initial_schema.sql** - Initial database schema
2. **20250930215038_insert_sample_data.sql** - Sample data for testing
3. **20250930223856_fix_security_and_performance_issues.sql** - Security fixes
4. **20250930233800_dry_meadow.sql** - Additional updates
5. **20251001000000_add_missing_profile_fields.sql** - Profile fields
6. **20251001174347_golden_thunder.sql** - Verification script
7. **20251003000000_comprehensive_database_update.sql** - Latest improvements

## Best Practices

### 1. Always Use RLS
Never bypass RLS policies. All queries should respect the security model.

### 2. Use Prepared Statements
Always use parameterized queries to prevent SQL injection:

```typescript
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId); // Good: parameterized
```

### 3. Handle Errors Gracefully
```typescript
const { data, error } = await supabase
  .from('transactions')
  .select('*');

if (error) {
  console.error('Database error:', error);
  // Handle error appropriately
}
```

### 4. Use Transactions for Multi-Step Operations
For operations that modify multiple tables, ensure atomicity.

### 5. Monitor Performance
Use the admin dashboard to monitor:
- Number of active users
- Transaction volumes
- Investment performance
- System health

## Backup and Recovery

Supabase provides automatic backups. For manual backups:

1. Export data through Supabase dashboard
2. Use pg_dump for full database backups
3. Store backups securely off-site

## Troubleshooting

### Connection Issues
- Verify `.env` file has correct credentials
- Check Supabase project status
- Verify network connectivity

### RLS Policy Issues
- Ensure user is authenticated
- Check policy conditions match query
- Review Supabase logs for RLS denials

### Performance Issues
- Review query execution plans
- Check if indexes are being used
- Monitor connection pool usage

## Support

For database-related issues:
1. Check Supabase dashboard logs
2. Review migration files for schema details
3. Use helper functions for common queries
4. Consult this documentation for best practices
