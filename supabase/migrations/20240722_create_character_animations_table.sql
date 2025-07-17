-- Create the character_animations table for storing complete character animation sets
CREATE TABLE IF NOT EXISTS public.character_animations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  character_class TEXT NOT NULL,
  character_type TEXT NOT NULL, -- 'player' or 'enemy'
  animations JSONB NOT NULL, -- Will store the complete animation set with all actions and directions
  thumbnail TEXT, -- URL to a representative image
  user_id TEXT DEFAULT 'anonymous',
  is_template BOOLEAN DEFAULT false, -- Indicates if this is a template character
  metadata JSONB, -- Additional metadata like tags, categories, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indices for faster lookups
CREATE INDEX IF NOT EXISTS idx_character_animations_name ON public.character_animations(name);
CREATE INDEX IF NOT EXISTS idx_character_animations_character_class ON public.character_animations(character_class);
CREATE INDEX IF NOT EXISTS idx_character_animations_character_type ON public.character_animations(character_type);
CREATE INDEX IF NOT EXISTS idx_character_animations_user_id ON public.character_animations(user_id);
CREATE INDEX IF NOT EXISTS idx_character_animations_is_template ON public.character_animations(is_template);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.character_animations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to view all animations, but only edit their own
CREATE POLICY "Anyone can view character animations"
  ON public.character_animations
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own character animations"
  ON public.character_animations
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id = 'anonymous');

CREATE POLICY "Users can update their own character animations"
  ON public.character_animations
  FOR UPDATE
  USING (user_id = auth.uid() OR user_id = 'anonymous')
  WITH CHECK (user_id = auth.uid() OR user_id = 'anonymous');

CREATE POLICY "Users can delete their own character animations"
  ON public.character_animations
  FOR DELETE
  USING (user_id = auth.uid() OR user_id = 'anonymous'); 