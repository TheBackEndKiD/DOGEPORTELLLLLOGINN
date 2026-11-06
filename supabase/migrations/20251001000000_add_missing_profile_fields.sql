/*
  # Add Missing Profile Fields

  ## Summary
  This migration adds missing fields to the profiles table that are used by the application
  but were not included in the initial schema.

  ## 1. New Columns
  - `profiles.total_deposit` (decimal) - Total amount deposited by user
  - `profiles.profit` (decimal) - Total profit earned from investments

  ## 2. Changes Made
  - Add `total_deposit` column with default value of 0
  - Add `profit` column with default value of 0
  - Both fields use DECIMAL(20,8) for monetary precision

  ## 3. Important Notes
  - Uses IF NOT EXISTS to safely add columns without errors
  - Default values ensure existing records work correctly
  - No data loss or breaking changes
*/

-- Add total_deposit column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'total_deposit'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_deposit decimal(20,8) DEFAULT 0;
  END IF;
END $$;

-- Add profit column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'profit'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profit decimal(20,8) DEFAULT 0;
  END IF;
END $$;
