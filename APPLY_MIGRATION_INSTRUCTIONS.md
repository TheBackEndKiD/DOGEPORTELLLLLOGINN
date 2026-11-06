# Apply Schema Fix Migration - Instructions

## Confirmed Findings

✅ **Bolt's analysis was correct:**
- **Only 1 actual issue:** Missing `app_role` enum type for `profiles.role` column
- All other items were false positives or already correctly implemented:
  - ✅ `generate_referral_code()` function - already exists
  - ✅ Table dependencies - correctly ordered
  - ✅ Foreign key references - all valid
  - ✅ Data types - all matching correctly

## Migration File Ready

**File:** `supabase/migrations/20251006000000_fix_schema_errors_and_add_role.sql`

**What it does:**
1. Creates `app_role` enum type with values: `'client'`, `'admin'`
2. Adds `role` column to `profiles` table with type `app_role`
3. Sets default value: `'client'` (secure default)
4. Creates index for role-based queries
5. Includes verification checks

## How to Apply (Choose One Method)

### Method 1: Supabase Dashboard SQL Editor (Recommended) ⭐

1. **Login to Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Navigate to your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Execute**
   ```sql
   -- Copy the entire contents from:
   -- supabase/migrations/20251006000000_fix_schema_errors_and_add_role.sql

   -- Then click "Run" or press Ctrl+Enter
   ```

4. **Verify Success**
   - You should see notices:
     - "app_role enum type verified successfully"
     - "role column verified successfully"
   - No errors should appear

### Method 2: Direct SQL Execution

If you prefer to run the SQL directly, here's the minimal version:

```sql
-- Step 1: Create enum type
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('client', 'admin');
  END IF;
END $$;

-- Step 2: Add column to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN role app_role NOT NULL DEFAULT 'client'::app_role;

    COMMENT ON COLUMN public.profiles.role IS 'User role: client (regular user) or admin (admin user)';
  END IF;
END $$;

-- Step 3: Create index
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
```

### Method 3: Supabase CLI (If You Have It Installed)

```bash
# Make sure you're in the project directory
cd /path/to/project

# Apply all pending migrations
supabase db push

# Or run specific migration
supabase db execute < supabase/migrations/20251006000000_fix_schema_errors_and_add_role.sql
```

## Verification Steps

After applying the migration, verify it worked:

### Test 1: Check Enum Type

```sql
SELECT
  typname,
  array_agg(enumlabel ORDER BY enumsortorder) as values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE typname = 'app_role'
GROUP BY typname;
```

**Expected Result:**
```
typname  | values
---------|------------------
app_role | {client,admin}
```

### Test 2: Check Role Column

```sql
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name = 'role';
```

**Expected Result:**
```
column_name | data_type     | column_default       | is_nullable
------------|---------------|----------------------|-------------
role        | USER-DEFINED  | 'client'::app_role   | NO
```

### Test 3: Check Index

```sql
SELECT indexname
FROM pg_indexes
WHERE tablename = 'profiles'
  AND indexname = 'idx_profiles_role';
```

**Expected Result:**
```
indexname
-------------------
idx_profiles_role
```

## After Migration

### Update TypeScript Types (Optional)

If you want to use the role field in your app, update your type definitions:

**File:** `src/types/index.ts` or `src/lib/supabase.ts`

```typescript
export interface Profile {
  id: string;
  username: string;
  email: string;
  role: 'client' | 'admin'; // ⭐ Add this field
  // ... other fields
}
```

## Safety Notes

✅ **This migration is safe:**
- Uses `IF NOT EXISTS` checks (idempotent)
- No data loss
- No breaking changes
- All existing users get 'client' role by default
- Can be run multiple times safely

## Troubleshooting

### If you see: "type app_role already exists"
✅ Good! The enum already exists. The migration uses `IF NOT EXISTS` so it will skip this step safely.

### If you see: "column role already exists"
✅ Good! The column already exists. The migration will skip adding it again.

### If you see: "relation profiles does not exist"
❌ Problem: The profiles table hasn't been created yet. Run earlier migrations first:
```bash
# Apply all migrations in order
supabase db reset
```

## Summary

- **Status:** Migration file ready
- **Action Required:** Apply via Supabase Dashboard SQL Editor
- **Risk Level:** Low (safe, idempotent, no breaking changes)
- **Estimated Time:** < 1 minute

The migration is ready to apply. Choose your preferred method above and execute it.
