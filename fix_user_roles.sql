-- Fix User Roles - Run this if polls are being blocked by RLS
-- This script helps verify and fix user roles in Supabase

-- 1) Check current user roles
select 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'name' as name
from auth.users;

-- 2) Set a specific user as admin (replace EMAIL with your admin email)
-- UPDATE auth.users 
-- SET raw_user_meta_data = jsonb_set(
--   COALESCE(raw_user_meta_data, '{}'::jsonb),
--   '{role}',
--   '"admin"'
-- )
-- WHERE email = 'YOUR_ADMIN_EMAIL@example.com';

-- 3) Set ALL existing users as admin (use with caution!)
-- UPDATE auth.users 
-- SET raw_user_meta_data = jsonb_set(
--   COALESCE(raw_user_meta_data, '{}'::jsonb),
--   '{role}',
--   '"admin"'
-- );

-- 4) Test the is_admin() function (run this while logged in as an admin)
-- SELECT public.is_admin();

-- 5) Temporarily disable RLS for testing (NOT recommended for production!)
-- ALTER TABLE public.polls DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.votes DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.invites DISABLE ROW LEVEL SECURITY;

