# Testing Troubleshooting Guide

This guide helps you resolve common issues when running Supabase integration tests.

## Common Issues

### 1. Environment Variables Not Set

**Symptoms:**
- Tests log warnings about missing environment variables
- Connection tests are skipped

**Solution:**
1. Create a `.env.local` file in the project root if it doesn't exist
2. Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Restart your terminal/IDE to reload environment variables
4. Run tests again: `bun test`

### 2. Invalid Supabase URL Format

**Symptoms:**
- Test fails with "invalid format" error
- Environment validation fails

**Solution:**
- Ensure `NEXT_PUBLIC_SUPABASE_URL` starts with `https://` or `http://`
- Format should be: `https://your-project-id.supabase.co`
- Find the correct URL in Supabase Dashboard → Project Settings → API → Project URL

### 3. Connection Test Fails

**Symptoms:**
- `testSupabaseConnection()` returns `success: false`
- Error message about connection failure

**Possible Causes & Solutions:**

#### Invalid Credentials
- Verify your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Get it from Supabase Dashboard → Project Settings → API → Project API keys → `anon` `public` key
- Ensure you're using the `anon` key, not the `service_role` key

#### Network Issues
- Check your internet connection
- Verify Supabase project is not paused (free tier projects pause after inactivity)
- Try accessing your Supabase project in the browser dashboard

#### Project Not Found
- Verify the project ID in your URL matches your actual project
- Check that the project hasn't been deleted

### 4. CRUD Tests Fail - Table Doesn't Exist

**Symptoms:**
- Tests fail with error: "relation 'songs' does not exist"
- Query tests are skipped

**Solution:**
1. Run database migrations to create the `songs` table
2. In Supabase Dashboard → SQL Editor, run:
   ```sql
   CREATE TABLE songs (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     lyrics TEXT NOT NULL,
     artist_composer TEXT,
     language TEXT,
     genre TEXT,
     year INTEGER,
     is_visible BOOLEAN DEFAULT true,
     is_archived BOOLEAN DEFAULT false,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```
3. Or use Supabase migrations if you have them set up

### 5. Permission Errors (RLS Policies)

**Symptoms:**
- Tests fail with "permission denied" or "new row violates row-level security policy"
- CRUD operations fail even though table exists
- Error: "new row violates row-level security policy for table 'songs'"

**Solution:**
1. **Set up RLS policies** - Run the SQL in `docs/supabase-rls-policies.sql` in your Supabase Dashboard → SQL Editor
2. **Verify RLS is enabled** - Go to Supabase Dashboard → Table Editor → songs → Settings → RLS should be enabled
3. **Check existing policies** - Go to Supabase Dashboard → Authentication → Policies → songs table
4. **Quick fix for testing** - If you need to temporarily disable RLS for testing:
   ```sql
   ALTER TABLE songs DISABLE ROW LEVEL SECURITY;
   ```
   ⚠️ **Warning**: Only disable RLS for testing. Re-enable it and add proper policies before production.

**Recommended Policies:**
- Public SELECT: Allow reading visible, non-archived songs
- Anon ALL: Allow all operations (INSERT, UPDATE, DELETE) since admin auth is handled via password middleware

See `docs/supabase-rls-policies.sql` for complete policy setup.

### 6. Tests Create Test Data

**Symptoms:**
- Test data remains in database after tests run
- Multiple test runs create duplicate test records

**Solution:**
- CRUD tests create a test song with title "Test Song for CRUD"
- The test should clean up after itself, but if it fails, you may need to manually delete:
  ```sql
  DELETE FROM songs WHERE title LIKE 'Test Song%';
  ```

## Manual Validation

You can manually validate your Supabase setup:

### 1. Check Environment Variables

```bash
# In your terminal
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

If these are empty, your `.env.local` file may not be loaded. Ensure it's in the project root.

### 2. Test Connection Manually

Create a test file `test-connection.ts`:

```typescript
import { supabase } from "./shared/lib/supabase";

async function test() {
  const { data, error } = await supabase.from("songs").select("count").limit(1);
  console.log("Connection test:", error ? "FAILED" : "SUCCESS");
  if (error) console.error(error);
}

test();
```

Run with: `bun test-connection.ts`

### 3. Verify Credentials in Supabase Dashboard

1. Go to Supabase Dashboard
2. Project Settings → API
3. Compare:
   - Project URL with `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key with `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Getting Help

If issues persist:

1. Check Supabase status: [https://status.supabase.com](https://status.supabase.com)
2. Review Supabase logs in Dashboard → Logs
3. Verify your Supabase project is active (not paused)
4. Check Bun version: `bun --version` (should be recent)
5. Try running tests with verbose output: `bun test --verbose`

## Test Utilities

The project includes test utilities you can use:

- `validateSupabaseEnv()` - Validates environment variables
- `testSupabaseConnection()` - Tests database connection
- `testClientInitialization()` - Tests client setup

These are located in `shared/lib/test-utils/` and can be imported for manual testing.
