# 🗳️ One Vote Per User - Complete Implementation Guide

## ✅ **Implementation Complete!**

Your voting system now has **4 layers of protection** to ensure each user can only vote once per poll.

---

## 🛡️ **Four Layers of Protection**

### **Layer 1: Database UNIQUE Constraint** 🔒 (Strongest)
- **File:** `prevent_duplicate_votes.sql`
- **What:** Creates a unique index on `(user_id, poll_id)`
- **Protection:** Database physically prevents duplicate votes
- **Error:** Returns 409 Conflict if user tries to vote twice

### **Layer 2: RLS Policy Check** 🛡️
- **What:** Row Level Security enforces `user_id = auth.uid()`
- **Protection:** User can only insert votes with their own user_id
- **Error:** Returns 403 Forbidden if trying to vote as someone else

### **Layer 3: Pre-Submit API Check** ⚡
- **File:** `pollApi.ts` - `hasUserVoted()` function
- **What:** Checks if user voted BEFORE sending to database
- **Protection:** Prevents unnecessary API calls
- **Error:** Shows "You have already voted" message

### **Layer 4: UI Prevention** 🎨
- **File:** `VoteFlowScreen.tsx`
- **What:** Shows "Already Voted" screen if user has voted
- **Protection:** User never sees voting form if they already voted
- **UX:** Beautiful confirmation screen with checkmarks

---

## 📋 **Installation Steps**

### **Step 1: Run SQL Migration** (REQUIRED)

1. Open **Supabase SQL Editor**
2. Copy contents of `prevent_duplicate_votes.sql`
3. Click **Run**

This will:
- ✅ Add `user_id` column to votes table
- ✅ Create unique constraint (prevent duplicates)
- ✅ Update RLS policies
- ✅ Create helper function
- ✅ Create vote counts view

### **Step 2: Code is Already Updated** ✅

The following files have been updated:
- ✅ `src/api/pollApi.ts` - Added `hasUserVoted()` function
- ✅ `src/api/pollApi.ts` - Updated `submitVote()` with duplicate check
- ✅ `src/screens/VoteFlowScreen.tsx` - Shows "Already Voted" screen

---

## 🎨 **User Experience**

### **First Time Voting:** ✅
1. User clicks "Vote Now" on a poll
2. Sees voting options
3. Selects their choice
4. Submits vote successfully
5. Sees confirmation message

### **Trying to Vote Again:** 🚫
1. User clicks "Vote Now" on same poll
2. **Immediately sees "Already Voted" screen**
3. Cannot access voting form
4. Sees confirmation that their vote was recorded
5. Gets links to view results or other polls

---

## 🔍 **How Each Layer Works**

### **Layer 1 Example (Database):**
```sql
-- User tries to vote twice
INSERT INTO votes (user_id, poll_id, option_ids) 
VALUES ('user-123', 'poll-456', '{option-1}');
-- ✅ First vote succeeds

INSERT INTO votes (user_id, poll_id, option_ids) 
VALUES ('user-123', 'poll-456', '{option-2}');
-- ❌ ERROR: duplicate key value violates unique constraint
```

### **Layer 2 Example (RLS):**
```sql
-- User tries to vote as someone else
INSERT INTO votes (user_id, poll_id, option_ids) 
VALUES ('other-user-id', 'poll-456', '{option-1}');
-- ❌ ERROR: RLS policy violation (user_id must match auth.uid())
```

### **Layer 3 Example (API Check):**
```typescript
// Before submitting vote
const alreadyVoted = await hasUserVoted(pollId)
if (alreadyVoted) {
  throw new Error('You have already voted')
  // ❌ Vote never sent to database
}
```

### **Layer 4 Example (UI):**
```typescript
// On page load
const voted = await hasUserVoted(pollId)
if (voted) {
  // Show "Already Voted" screen
  // User never sees voting form
}
```

---

## 💡 **Key Features**

### **✅ Vote Tracking**
- Each vote is linked to a user via `user_id`
- Admin can see vote counts but not individual voters (privacy)
- Votes are anonymous to other users

### **✅ Error Messages**
- Clear, user-friendly messages
- Different messages for different scenarios:
  - "You have already voted" (duplicate)
  - "Poll may be closed" (timing)
  - "Permission denied" (RLS)

### **✅ Beautiful UI**
- Green checkmark icon
- Informative "Already Voted" screen
- Explains what happens next
- Links to results and other polls

### **✅ Security**
- Database-level protection (can't bypass)
- RLS ensures user can only vote as themselves
- API checks prevent unnecessary calls
- UI prevents accidental duplicate attempts

---

## 🧪 **Testing**

### **Test 1: Normal Voting**
1. Login as a user
2. Go to a poll
3. Vote → Should succeed ✅
4. Try to vote again → Should see "Already Voted" ✅

### **Test 2: Different Users**
1. Login as User A, vote on Poll 1 ✅
2. Logout, login as User B, vote on Poll 1 ✅
3. Both votes should be recorded ✅

### **Test 3: Multiple Polls**
1. Login as User A
2. Vote on Poll 1 ✅
3. Vote on Poll 2 ✅
4. User can vote once on each poll ✅

### **Test 4: Database Protection**
If you try to insert directly via SQL:
```sql
-- First insert (works)
INSERT INTO votes (user_id, poll_id, option_ids)
VALUES ('test-user', 'test-poll', '{option-1}');

-- Second insert (fails)
INSERT INTO votes (user_id, poll_id, option_ids)
VALUES ('test-user', 'test-poll', '{option-2}');
-- ERROR: duplicate key violates unique constraint
```

---

## 📊 **Database Schema**

### **votes table (after migration):**
```sql
CREATE TABLE public.votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid REFERENCES polls(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE, -- NEW
  option_ids text[],
  created_at timestamptz DEFAULT now()
);

-- Unique constraint
CREATE UNIQUE INDEX unique_user_poll_vote 
ON votes(user_id, poll_id);
```

---

## 🔧 **Troubleshooting**

### **"User can still vote twice"**
**Check:**
1. Did you run the SQL migration?
2. Is the unique constraint created?
   ```sql
   SELECT * FROM pg_indexes 
   WHERE tablename = 'votes' 
   AND indexname = 'unique_user_poll_vote';
   ```
3. Is `user_id` column populated?
   ```sql
   SELECT COUNT(*) as votes_with_user_id 
   FROM votes 
   WHERE user_id IS NOT NULL;
   ```

### **"Getting 403 error when voting"**
**Fix:** The votes RLS policy might be too strict. Run:
```sql
DROP POLICY IF EXISTS votes_insert_active_authenticated ON public.votes;
CREATE POLICY votes_insert_active_authenticated
  ON public.votes
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );
```

### **"Already Voted screen not showing"**
**Check:**
1. Is `hasUserVoted()` function working?
2. Open console, look for errors
3. Try clearing browser cache
4. Check if user is authenticated

---

## 🎯 **Benefits**

### **For Voters:**
- ✅ Fair voting (one person, one vote)
- ✅ Can't accidentally vote twice
- ✅ Clear feedback about vote status
- ✅ Vote privacy protected

### **For Admins:**
- ✅ Accurate vote counts
- ✅ No duplicate votes to clean up
- ✅ Can trust results
- ✅ Audit trail with user_id

### **For System:**
- ✅ Data integrity guaranteed
- ✅ Multiple layers of protection
- ✅ Can't bypass via API manipulation
- ✅ Database-level enforcement

---

## 📝 **Quick Reference**

| Scenario | What Happens | Where Prevented |
|----------|-------------|-----------------|
| User votes first time | ✅ Vote recorded | N/A |
| User tries to vote again via UI | 🚫 Shows "Already Voted" | VoteFlowScreen.tsx |
| User tries to vote again via API | 🚫 Error: "already voted" | pollApi.ts |
| User tries direct DB insert | 🚫 Unique constraint violation | Database |
| User tries to vote as someone else | 🚫 RLS policy violation | RLS Policy |

---

## 🚀 **Next Steps**

1. **Run the SQL migration** (`prevent_duplicate_votes.sql`)
2. **Test with multiple users**
3. **Verify unique constraint is working**
4. **Celebrate** - Your voting system is secure! 🎉

---

## 📞 **Support**

If you encounter issues:
1. Check console for errors (F12)
2. Verify SQL migration ran successfully
3. Test with different user accounts
4. Check Supabase logs for detailed errors

---

**Your voting system now ensures one vote per user!** 🗳️✅

Each user can vote once per poll, protected by multiple layers of security from the UI all the way down to the database.

