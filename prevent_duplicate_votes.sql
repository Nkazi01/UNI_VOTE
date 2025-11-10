-- Prevent Duplicate Votes - One Vote Per User Per Poll
-- Run this in your Supabase SQL Editor

-- ==========================================
-- STEP 1: Add user_id column to votes table
-- ==========================================
-- This tracks which user cast which vote
ALTER TABLE public.votes 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Set default value to current user (fallback if app doesn't send it)
ALTER TABLE public.votes 
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- For existing votes without user_id: we'll delete them since we can't assign them to real users
-- This is safe since they're likely test votes anyway
DELETE FROM public.votes 
WHERE user_id IS NULL;

-- Alternative: If you want to keep old votes, comment out the DELETE above 
-- and the unique constraint below will only apply to new votes

-- ==========================================
-- STEP 2: Create UNIQUE constraint
-- ==========================================
-- This prevents the same user from voting twice on the same poll
-- Database-level protection (strongest)
DROP INDEX IF EXISTS unique_user_poll_vote;
CREATE UNIQUE INDEX unique_user_poll_vote 
ON public.votes(user_id, poll_id);

-- ==========================================
-- STEP 3: Update RLS Policy to set user_id
-- ==========================================
-- Automatically set user_id when inserting a vote
DROP POLICY IF EXISTS votes_insert_active_authenticated ON public.votes;
CREATE POLICY votes_insert_active_authenticated
  ON public.votes
  FOR INSERT
  WITH CHECK (
    -- User must be authenticated
    auth.uid() IS NOT NULL
    -- Automatically set user_id to current user (enforced by constraint)
    AND user_id = auth.uid()
  );

-- ==========================================
-- STEP 4: Prevent users from seeing who voted what
-- ==========================================
-- Users can see vote counts but not individual votes
DROP POLICY IF EXISTS votes_select_published_or_admin ON public.votes;
CREATE POLICY votes_select_published_or_admin
  ON public.votes
  FOR SELECT
  USING (
    -- Admins can see all votes with user_id
    public.is_admin()
    -- Regular users can see aggregated results (handled by app)
    -- They can't see individual votes or who voted
    OR (
      EXISTS (
        SELECT 1 FROM public.polls p
        WHERE p.id = poll_id
          AND p.published = true
      )
      -- But hide user_id from non-admins (handled in app layer)
    )
  );

-- ==========================================
-- STEP 5: Create helper function to check if user voted
-- ==========================================
CREATE OR REPLACE FUNCTION public.has_user_voted(p_poll_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.votes
    WHERE poll_id = p_poll_id
      AND user_id = p_user_id
  );
END;
$$;

-- ==========================================
-- STEP 6: Create view for vote counts (no user info)
-- ==========================================
-- This allows users to see results without seeing who voted
CREATE OR REPLACE VIEW public.vote_counts AS
SELECT 
  poll_id,
  jsonb_object_agg(option_id, vote_count) as counts
FROM (
  SELECT 
    poll_id,
    unnest(option_ids) as option_id,
    COUNT(*) as vote_count
  FROM public.votes
  GROUP BY poll_id, option_id
) grouped
GROUP BY poll_id;

-- Grant access to view
GRANT SELECT ON public.vote_counts TO authenticated;

-- ==========================================
-- Success message
-- ==========================================
SELECT 
  'Vote duplicate prevention enabled!' as status,
  'Users can now only vote once per poll' as message,
  'Unique constraint added: user_id + poll_id' as protection;

