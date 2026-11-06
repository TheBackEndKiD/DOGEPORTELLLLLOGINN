# Database Issues and Fixes Summary

## Critical Issues Identified

### 1. **Invalid Table Name**
- **Issue**: Table named `public.auth.user.id` has invalid syntax (periods in name)
- **Impact**: Cannot be queried or accessed properly
- **Fix**: DROP this table (appears to be duplicate/error)

### 2. **Redundant `client_users` Table**
- **Issue**: Both `client_users` and `profiles` exist with overlapping purpose
- **Impact**: Data duplication, confusion, foreign key conflicts
- **Fix**: DROP `client_users`, use `profiles` + `auth.users` pattern

### 3. **Foreign Key Inconsistencies**
- **Issue**: Some tables reference `auth.users(id)`, others reference `profiles(id)`
- **Tables affected**: `transactions`, `user_investments`
- **Schema shows**: References to `auth.users(id)`
- **Actual migrations**: References to `profiles(id)`
- **Fix**: Standardize ALL references to `profiles(id)` since profiles extends auth.users

### 4. **Missing Columns in `profiles` Table**
- **Missing**:
  - `role` (app_role enum) - needed for client/admin distinction
  - `total_deposit` (decimal) - referenced in migration update
  - `profit` (decimal) - referenced in migration update
- **Fix**: Add these columns with proper defaults

### 5. **`admin_users` Missing Columns**
- **Missing**:
  - `auth_user_id` (uuid) - link to auth.users
  - `updated_at` (timestamptz) - for audit trail
- **Fix**: Add columns and update trigger

### 6. **`admin_audit_log` Structural Conflicts**
- **Issue**: Created twice with different column sets
- **Schema shows**: `actor_user_id`, `resource`, `metadata`
- **Migration shows**: `target_table`, `old_values`, `new_values`, `ip_address`
- **Fix**: DROP and recreate with merged structure

### 7. **Password Hash Constraint Issue**
- **Issue**: `admin_users.password_hash` is NOT NULL but should allow NULL
- **Reason**: Admins using `auth.users` don't need separate password_hash
- **Fix**: Make column nullable

## Files Created

### 1. `FIX_DATABASE_ERRORS.sql`
**Purpose**: Complete fix script to resolve all identified issues

**What it does**:
- Drops invalid/redundant tables
- Creates missing enum types
- Adds missing columns to profiles and admin_users
- Standardizes foreign key references
- Fixes admin_audit_log structure
- Adds proper indexes
- Updates RLS policies
- Validates data integrity

**Usage**:
```sql
-- Run in Supabase SQL Editor or via CLI
\i FIX_DATABASE_ERRORS.sql
```

### 2. `DIAGNOSE_DATABASE.sql`
**Purpose**: Diagnostic script to identify current database issues

**What it checks**:
- All tables and RLS status
- Invalid table names
- Foreign key relationships
- Missing columns
- Orphaned records
- RLS policies
- Indexes
- NULL values in required fields
- Data consistency (balance calculations)
- Admin user setup
- Enum types
- Summary statistics

**Usage**:
```sql
-- Run in Supabase SQL Editor
\i DIAGNOSE_DATABASE.sql
```

## Recommended Action Plan

### Step 1: Backup (IMPORTANT!)
```sql
-- Create backup of important tables
CREATE TABLE profiles_backup AS SELECT * FROM profiles;
CREATE TABLE transactions_backup AS SELECT * FROM transactions;
CREATE TABLE admin_users_backup AS SELECT * FROM admin_users;
```

### Step 2: Run Diagnostic
```bash
# Run DIAGNOSE_DATABASE.sql in Supabase SQL Editor
# Review output for current state
```

### Step 3: Apply Fixes
```bash
# Run FIX_DATABASE_ERRORS.sql in Supabase SQL Editor
# Monitor for errors or warnings
```

### Step 4: Verify
```bash
# Run DIAGNOSE_DATABASE.sql again
# Confirm all issues resolved
```

## Key Changes Summary

| Category | Change | Impact |
|----------|--------|--------|
| **Tables** | Removed invalid tables | Cleaner schema |
| **Profiles** | Added role, total_deposit, profit | Full functionality |
| **Admin Users** | Added auth_user_id, updated_at | Proper auth integration |
| **Foreign Keys** | Standardized to profiles(id) | Consistent references |
| **Audit Log** | Merged structures | Complete audit trail |
| **Constraints** | Fixed NOT NULL issues | Proper validation |
| **Indexes** | Added missing indexes | Better performance |

## Post-Fix Validation Checklist

- [ ] All tables have proper RLS enabled
- [ ] No orphaned records exist
- [ ] Foreign keys are consistent
- [ ] All required columns exist
- [ ] Enum types are defined
- [ ] Indexes are in place
- [ ] Triggers are working
- [ ] Admin users can authenticate
- [ ] Client users can authenticate
- [ ] Transactions calculate correctly

## Common Errors After Fix

### Error: "relation does not exist"
**Solution**: Table may have been renamed/dropped. Check DIAGNOSE output.

### Error: "column does not exist"
**Solution**: Ensure FIX script ran completely. Check profiles columns.

### Error: "violates foreign key constraint"
**Solution**: Orphaned records exist. Clean them before applying fixes:
```sql
DELETE FROM transactions WHERE user_id NOT IN (SELECT id FROM profiles);
DELETE FROM user_investments WHERE user_id NOT IN (SELECT id FROM profiles);
```

## Need Help?

1. Run `DIAGNOSE_DATABASE.sql` first
2. Review output for specific issues
3. Run `FIX_DATABASE_ERRORS.sql`
4. Run diagnostic again to verify

All scripts are idempotent (safe to run multiple times).
