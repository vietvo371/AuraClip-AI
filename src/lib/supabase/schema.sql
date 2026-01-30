-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on clerk_user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON public.users(clerk_user_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT
  USING (auth.uid()::text = clerk_user_id);

-- Create policy to allow service role to insert/update
CREATE POLICY "Service role can insert users" ON public.users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update users" ON public.users
  FOR UPDATE
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

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
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_series_user_id ON public.series(user_id);

-- Enable Row Level Security
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own series
CREATE POLICY "Users can read own series" ON public.series
  FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create policy to allow users to insert their own series
CREATE POLICY "Users can insert own series" ON public.series
  FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create policy to allow users to update their own series
CREATE POLICY "Users can update own series" ON public.series
  FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create policy to allow users to delete their own series
CREATE POLICY "Users can delete own series" ON public.series
  FOR DELETE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create updated_at trigger for series
CREATE TRIGGER set_series_updated_at
  BEFORE UPDATE ON public.series
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
