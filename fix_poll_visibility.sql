-- Fix Poll Visibility for Voters
-- Run this in your Supabase SQL Editor

-- Option 1: Allow voters to see ACTIVE polls (recommended)
-- This lets voters see and vote on polls, but results stay hidden until published
DROP POLICY IF EXISTS polls_select_all ON public.polls;
CREATE POLICY polls_select_all
  ON public.polls
  FOR SELECT
  USING (
    -- Voters can see active polls OR published polls
    -- Admins can see everything
    (
      (starts_at <= now() AND ends_at >= now()) -- Active polls
      OR published = true  -- Or published polls
    )
    OR public.is_admin()
    OR (created_by = auth.uid())
  );

-- Note: Results are still controlled by the results page logic
-- Voters can see active polls but can't see results until published

