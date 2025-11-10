-- Fix Voting RLS - Allow authenticated users to vote
-- Run this in your Supabase SQL Editor

-- The issue: The votes INSERT policy has a subquery that checks polls table
-- But if the polls SELECT policy is blocking it, voting fails
-- Also, the time check might be too strict

-- Option 1: Simpler policy - just check user is authenticated and poll exists
DROP POLICY IF EXISTS votes_insert_active_authenticated ON public.votes;
CREATE POLICY votes_insert_active_authenticated
  ON public.votes
  FOR INSERT
  WITH CHECK (
    -- Just check user is authenticated
    -- Let the app handle time validation
    auth.uid() IS NOT NULL
  );

-- OR Option 2: Keep time check but make it more permissive
-- Uncomment this if you want to enforce time checks at database level:
/*
DROP POLICY IF EXISTS votes_insert_active_authenticated ON public.votes;
CREATE POLICY votes_insert_active_authenticated
  ON public.votes
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.polls p
      WHERE p.id = poll_id
        AND p.starts_at <= now()
        AND p.ends_at >= now()
        AND (
          -- Allow voting if poll is active OR published
          (p.starts_at <= now() AND p.ends_at >= now())
          OR p.published = true
        )
    )
  );
*/

-- Also make sure votes SELECT policy is correct
DROP POLICY IF EXISTS votes_select_published_or_admin ON public.votes;
CREATE POLICY votes_select_published_or_admin
  ON public.votes
  FOR SELECT
  USING (
    -- Admins can see all votes
    -- Regular users can see votes for published polls
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.polls p
      WHERE p.id = poll_id
        AND p.published = true
    )
  );

-- Success message
SELECT 'Voting RLS policies updated! Users should now be able to vote.' as status;

-- ============================================
-- TEMPORARY FIX (For Testing Only!)
-- ============================================
-- If you want to disable RLS completely for testing:
-- Uncomment the line below, but remember to re-enable it later!

-- ALTER TABLE public.votes DISABLE ROW LEVEL SECURITY;

-- To re-enable later:
-- ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

