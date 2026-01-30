-- Migration 003: Add media columns to videos table
-- This migration adds columns for storing audio, captions, and image URLs

-- Add audio URL column
ALTER TABLE videos ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Add caption URL column
ALTER TABLE videos ADD COLUMN IF NOT EXISTS caption_url TEXT;

-- Add image URLs array column
ALTER TABLE videos ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- Add word timestamps JSONB column for caption generation
ALTER TABLE videos ADD COLUMN IF NOT EXISTS word_timestamps JSONB;

-- Add comment
COMMENT ON COLUMN videos.audio_url IS 'URL to the generated voiceover MP3 file in Supabase Storage';
COMMENT ON COLUMN videos.caption_url IS 'URL to the generated caption JSON file in Supabase Storage';
COMMENT ON COLUMN videos.image_urls IS 'Array of URLs to generated scene images in Supabase Storage';
COMMENT ON COLUMN videos.word_timestamps IS 'Word-level timestamps from Deepgram TTS for caption generation';
