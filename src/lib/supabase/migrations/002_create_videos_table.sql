-- Migration: Create videos table for workflow
-- Version: 002
-- Date: 2026-01-30

-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  
  -- Video metadata
  title TEXT NOT NULL,
  episode_number INTEGER NOT NULL,
  
  -- Script data (Step 1: Gemini API)
  script_text TEXT,
  scenes JSONB, -- Array of { sceneNumber, text, imagePrompt, duration }
  
  -- Image data (Step 2: Future - Image Generation)
  image_urls TEXT[],
  
  -- Audio data (Step 3: Future - Audio Generation)
  voice_url TEXT,
  final_audio_url TEXT, -- Voice + music mixed
  
  -- Final video (Step 4: Future - Video Assembly)
  video_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  
  -- Workflow status
  status TEXT DEFAULT 'pending', 
  -- Status values: pending, generating_script, generating_images, generating_audio, assembling, completed, failed
  error_message TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(series_id, episode_number)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_videos_series_id ON public.videos(series_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);

-- Enable RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Disable RLS for development
ALTER TABLE public.videos DISABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_videos_updated_at ON public.videos;
CREATE TRIGGER set_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_videos_updated_at();
