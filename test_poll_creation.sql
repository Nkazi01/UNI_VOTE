-- Test Script: Verify Poll Creation Setup
-- Run this in Supabase SQL Editor to check your setup

-- 1. Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('polls', 'votes', 'invites');

-- 2. Check if published column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'polls' 
  AND column_name = 'published';

-- 3. Check if is_admin() function exists
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'is_admin';

-- 4. Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'polls';

-- 5. Check current user and role
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'name' as name
FROM auth.users
WHERE id = auth.uid();

-- 6. Test is_admin() function (should return true/false)
SELECT public.is_admin() as is_admin;

-- 7. Check existing RLS policies on polls
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

