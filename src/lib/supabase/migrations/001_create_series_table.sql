-- Migration: Create series table
-- Version: 001
-- Date: 2026-01-30

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

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_series_status ON public.series(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_series_created_at ON public.series(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;

-- Temporarily disable RLS for development
-- TODO: Enable RLS in production with proper policies
ALTER TABLE public.series DISABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.handle_series_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS set_series_updated_at ON public.series;
CREATE TRIGGER set_series_updated_at
  BEFORE UPDATE ON public.series
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_series_updated_at();
