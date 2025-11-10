-- QUICK FIX: Temporarily allow authenticated users to insert polls
-- Run this in Supabase SQL Editor to test if RLS is the issue

-- Option 1: Temporarily disable RLS on polls table (for testing only!)
ALTER TABLE public.polls DISABLE ROW LEVEL SECURITY;

-- OR Option 2: Add a permissive policy for testing (better than disabling)
-- This allows any authenticated user to insert polls temporarily
DROP POLICY IF EXISTS polls_insert_test ON public.polls;
CREATE POLICY polls_insert_test
  ON public.polls
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- After testing, remove the test policy and re-enable proper RLS:
-- DROP POLICY IF EXISTS polls_insert_test ON public.polls;
-- ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;

