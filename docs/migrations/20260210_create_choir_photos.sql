-- Migration: Create choir_photos table
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- Created: 2026-02-10

-- Create choir_photos table
CREATE TABLE IF NOT EXISTS choir_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index for display_order for faster sorting
CREATE INDEX IF NOT EXISTS idx_choir_photos_display_order 
ON choir_photos(display_order);

-- Enable RLS
ALTER TABLE choir_photos ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to read photos
CREATE POLICY "Public can read photos"
ON choir_photos
FOR SELECT
USING (true);

-- Policy: Allow all operations for anon (admin protected by middleware)
CREATE POLICY "Allow all operations for anon"
ON choir_photos
FOR ALL
USING (true)
WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_choir_photos_updated_at
  BEFORE UPDATE ON choir_photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Note: You need to manually create the Storage bucket in Supabase Dashboard:
-- 1. Go to Storage → Create new bucket
-- 2. Name: choir-photos
-- 3. Public bucket: Yes
-- 4. Allowed MIME types: image/jpeg, image/png, image/webp
-- 5. Max file size: 5MB (5242880 bytes)
