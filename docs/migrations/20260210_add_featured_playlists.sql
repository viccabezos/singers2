-- Migration: Add featured columns to playlists table
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- Created: 2026-02-10

-- Add featured boolean column (default false)
ALTER TABLE playlists 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Add featured_order integer column (nullable)
ALTER TABLE playlists 
ADD COLUMN IF NOT EXISTS featured_order INTEGER;

-- Add index for efficient featured playlist queries
CREATE INDEX IF NOT EXISTS idx_playlists_featured 
ON playlists(featured) 
WHERE featured = TRUE;

-- Add index for ordering featured playlists
CREATE INDEX IF NOT EXISTS idx_playlists_featured_order 
ON playlists(featured_order) 
WHERE featured = TRUE;

-- Add check constraint to ensure featured_order is positive when set
-- Note: This is a soft constraint - validation should happen in application layer
-- ALTER TABLE playlists 
-- ADD CONSTRAINT chk_featured_order_positive 
-- CHECK (featured_order IS NULL OR featured_order > 0);

-- Update RLS policies to allow updating featured fields
-- The existing policies should cover this since they allow ALL operations for anon role

-- Note: After running this migration, you need to:
-- 1. Update shared/types to include featured fields in Playlist type
-- 2. Update playlist forms to include featured toggle and order field
-- 3. Update server actions to handle featured fields
-- 4. Add validation to ensure max 3 featured playlists
