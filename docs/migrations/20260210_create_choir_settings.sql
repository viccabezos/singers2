-- Migration: Create choir_settings table
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- Created: 2026-02-10

-- Create choir_settings table (singleton pattern)
CREATE TABLE IF NOT EXISTS choir_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  tagline TEXT,
  about_text TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE choir_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to read settings
CREATE POLICY "Public can read settings"
ON choir_settings
FOR SELECT
USING (true);

-- Policy: Allow all operations for anon (admin protected by middleware)
CREATE POLICY "Allow all operations for anon"
ON choir_settings
FOR ALL
USING (true)
WITH CHECK (true);

-- Seed initial row with default values
INSERT INTO choir_settings (
  id,
  tagline,
  about_text,
  contact_email
) VALUES (
  1,
  'Voices united in harmony, hearts connected through song',
  E'Les Chanteurs is a passionate community choir dedicated to bringing people together through the joy of music. Founded in the heart of our city, we celebrate the power of harmony and the beauty of collective voices.\n\nWhether you''re a seasoned singer or just starting your musical journey, our choir welcomes all who share a love for singing. We perform a diverse repertoire ranging from classical pieces to contemporary favorites, creating memorable experiences for both our members and our audiences.\n\nJoin us at our upcoming performances and discover the magic of choral music.',
  'contact@leschanteurs.example'
)
ON CONFLICT (id) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_choir_settings_updated_at
  BEFORE UPDATE ON choir_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (if needed)
-- GRANT ALL ON choir_settings TO anon;
-- GRANT ALL ON choir_settings TO authenticated;
