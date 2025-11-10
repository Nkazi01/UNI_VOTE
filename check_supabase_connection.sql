-- Quick Connection Test
-- Run this in Supabase SQL Editor to verify your setup

-- 1. Check if polls table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'polls'
) as polls_table_exists;

-- 2. Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'polls'
ORDER BY ordinal_position;

-- 3. Try a simple insert (this will help identify the exact issue)
-- Replace the values with test data
INSERT INTO public.polls (
  id,
  title,
  description,
  type,
  options,
  parties,
  starts_at,
  ends_at,
  published,
  created_at
) VALUES (
  gen_random_uuid(),
  'Test Poll',
  'This is a test',
  'single',
  '[]'::jsonb,
  NULL,
  now(),
  now() + interval '7 days',
  false,
  now()
) RETURNING id, title;

-- If the insert above works, the table is fine and the issue is in the app connection
-- If it fails, you'll see the exact error message

