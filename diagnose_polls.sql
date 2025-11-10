-- Diagnostic Script: Check Polls and User Permissions
-- Run this in your Supabase SQL Editor

-- 1. Check if polls exist in the database (bypasses RLS)
SELECT 
  id,
  title,
  type,
  published,
  created_by,
  created_at
FROM public.polls
ORDER BY created_at DESC;

-- 2. Check your user info and role
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'name' as name
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 3. Test the is_admin() function with your user
SELECT public.is_admin() as am_i_admin;

-- 4. Check RLS policies on polls table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'polls';

-- 5. Quick fix: Set your user as admin (REPLACE EMAIL!)
-- Uncomment and run if you're not showing as admin above:
/*
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'YOUR_EMAIL_HERE@example.com';
*/

-- 6. Alternative quick fix: Temporarily disable RLS (for testing only!)
-- Uncomment to disable RLS:
/*
ALTER TABLE public.polls DISABLE ROW LEVEL SECURITY;
*/

