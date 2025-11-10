# Diagnostic Steps for Poll Creation Timeout

## Issue
Poll creation is timing out after 5 seconds. This is typically caused by Row Level Security (RLS) blocking the database insert.

## Quick Fix (Test First)

1. **Run this in Supabase SQL Editor** (`quick_fix_rls.sql`):
   ```sql
   -- Temporarily allow authenticated users to insert polls
   DROP POLICY IF EXISTS polls_insert_test ON public.polls;
   CREATE POLICY polls_insert_test
     ON public.polls
     FOR INSERT
     WITH CHECK (auth.uid() IS NOT NULL);
   ```

2. **Try creating a poll again** - if it works, RLS was the issue.

3. **If it still times out**, try disabling RLS completely (for testing only):
   ```sql
   ALTER TABLE public.polls DISABLE ROW LEVEL SECURITY;
   ```

## Proper Fix (After Testing)

Once you confirm RLS is the issue, follow these steps:

### Step 1: Verify Your User Role
Run in Supabase SQL Editor:
```sql
SELECT id, email, raw_user_meta_data->>'role' as role 
FROM auth.users 
WHERE email = 'YOUR_EMAIL_HERE';
```

### Step 2: Set Admin Role (if missing)
```sql
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'YOUR_EMAIL_HERE';
```

### Step 3: Run Full Migration
Run the complete `supabase_migration.sql` script which includes:
- The `is_admin()` function
- Proper RLS policies

### Step 4: Test the is_admin() Function
```sql
SELECT public.is_admin();
-- Should return true if you're logged in as admin
```

### Step 5: Re-enable Proper RLS
```sql
-- Remove test policy
DROP POLICY IF EXISTS polls_insert_test ON public.polls;

-- Re-enable RLS
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
```

## Common Issues

1. **User role not set**: Your user needs `role: 'admin'` in `raw_user_meta_data`
2. **is_admin() function missing**: Run the full migration script
3. **RLS policies too restrictive**: Use the quick fix temporarily, then fix properly

## Check Supabase Connection

Also verify your Supabase connection is working:
- Check browser console for network errors
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
- Test a simple query in Supabase SQL Editor

