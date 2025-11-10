# Troubleshooting Poll Creation Timeout

## Current Issue
Poll creation times out after 5 seconds even with RLS disabled.

## Diagnostic Steps

### 1. Check Browser Console
Open browser DevTools (F12) → Console tab, then try creating a poll. Look for:
- `[pollApi] Supabase config check:` - Should show `hasConfig: true` and `url: 'set'`
- `[pollApi] Testing table connection...` - This will tell us if the table is reachable
- Any error messages with specific details

### 2. Verify Supabase Connection
Check your `.env` or `.env.local` file has:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Important:** After changing `.env` files, **restart your dev server** (stop and run `npm run dev` again).

### 3. Test Direct SQL Insert
Run `check_supabase_connection.sql` in Supabase SQL Editor:
- If the INSERT works there, the table is fine → issue is in app connection
- If it fails, you'll see the exact SQL error

### 4. Check Network Tab
In browser DevTools → Network tab:
- Filter by "polls" or "rest"
- Try creating a poll
- Look for the request to Supabase
- Check if it's:
  - Pending (hanging)
  - Failed with error code
  - Completed but with error response

### 5. Verify Table Exists
Run in Supabase SQL Editor:
```sql
SELECT * FROM public.polls LIMIT 1;
```
- If this works, table exists
- If it errors, table doesn't exist → run `supabase_migration.sql`

### 6. Test Simple Query from App
Open browser console and run:
```javascript
// Test if Supabase client works
const { supabase } = await import('/src/lib/supabase.ts');
const { data, error } = await supabase.from('polls').select('id').limit(1);
console.log('Test query result:', { data, error });
```

## Common Causes

1. **Missing/Invalid Supabase URL/Key**
   - Check `.env` file
   - Restart dev server after changing `.env`

2. **Table Doesn't Exist**
   - Run `supabase_migration.sql` completely

3. **Network/Firewall Blocking**
   - Check if Supabase URL is accessible
   - Try accessing `https://your-project.supabase.co` in browser

4. **CORS Issues**
   - Shouldn't happen with Supabase, but check browser console for CORS errors

5. **Supabase Project Paused/Deleted**
   - Check Supabase dashboard to ensure project is active

## Quick Test: Bypass Supabase Entirely

Temporarily test with local storage to confirm the app logic works:

1. In browser console, run:
```javascript
localStorage.setItem('univote_use_supabase', 'false');
```

2. Refresh page and try creating poll
3. If it works, the issue is definitely Supabase connection
4. If it still fails, issue is in the app code

