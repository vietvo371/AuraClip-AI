-- ============================================
-- SERIES TABLE SCHEMA FOR SUPABASE
-- Run this in Supabase SQL Editor
-- ============================================

-- Create series table
CREATE TABLE IF NOT EXISTS public.series (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  
  -- Series Info
  name TEXT NOT NULL,
  
  -- Step 1: Niche
  niche TEXT NOT NULL,
  custom_niche TEXT,
  
  -- Step 2: Voice
  language TEXT NOT NULL,
  voice_id TEXT NOT NULL,
  
  -- Step 3: Music
  music_url TEXT NOT NULL,
  
  -- Step 4: Style
  image_style TEXT NOT NULL,
  
  -- Step 5: Captions
  caption_style TEXT NOT NULL,
  
  -- Step 6: Schedule
  schedule_time TIME NOT NULL,
  platforms TEXT[] NOT NULL,
  
  -- Metadata
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_series_user_id ON public.series(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;

-- IMPORTANT: Disable RLS temporarily for testing
-- You can enable it later when you set up proper authentication
ALTER TABLE public.series DISABLE ROW LEVEL SECURITY;

-- Create updated_at trigger for series
CREATE OR REPLACE FUNCTION public.handle_series_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_series_updated_at
  BEFORE UPDATE ON public.series
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_series_updated_at();

-- Verify table was created
SELECT 'Series table created successfully!' as message;
