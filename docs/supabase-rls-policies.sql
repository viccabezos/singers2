-- Row Level Security (RLS) Policies for Songs Table
-- Run this SQL in your Supabase Dashboard → SQL Editor

-- Enable RLS on songs table (if not already enabled)
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to read visible, non-archived songs
-- This allows anyone to view songs that are visible and not archived
CREATE POLICY "Public can read visible songs"
ON songs
FOR SELECT
USING (is_visible = true AND is_archived = false);

-- Policy: Allow all operations (INSERT, UPDATE, DELETE) for anon key
-- Since admin authentication is handled via password middleware (not Supabase Auth),
-- we allow all operations with the anon key. The password middleware protects admin routes.
CREATE POLICY "Allow all operations for anon"
ON songs
FOR ALL
USING (true)
WITH CHECK (true);

-- Alternative: If you want more restrictive policies, you can use:
-- 
-- Policy: Allow INSERT for anon key
-- CREATE POLICY "Allow insert for anon"
-- ON songs
-- FOR INSERT
-- WITH CHECK (true);
--
-- Policy: Allow UPDATE for anon key
-- CREATE POLICY "Allow update for anon"
-- ON songs
-- FOR UPDATE
-- USING (true)
-- WITH CHECK (true);
--
-- Policy: Allow DELETE for anon key
-- CREATE POLICY "Allow delete for anon"
-- ON songs
-- FOR DELETE
-- USING (true);

-- Note: If you want to use Supabase Auth instead of password middleware,
-- you would create policies that check auth.uid() instead of allowing all operations.
