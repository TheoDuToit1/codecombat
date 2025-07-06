-- Create the animation_folders table
CREATE TABLE IF NOT EXISTS public.animation_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sprite_id UUID NOT NULL REFERENCES public.sprites(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create the animation_folder_items table
CREATE TABLE IF NOT EXISTS public.animation_folder_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID NOT NULL REFERENCES public.animation_folders(id) ON DELETE CASCADE,
  sprite_id UUID NOT NULL REFERENCES public.sprites(id) ON DELETE CASCADE,
  animation_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_animation_folders_sprite_id ON public.animation_folders(sprite_id);
CREATE INDEX IF NOT EXISTS idx_animation_folder_items_folder_id ON public.animation_folder_items(folder_id);
CREATE INDEX IF NOT EXISTS idx_animation_folder_items_sprite_id ON public.animation_folder_items(sprite_id); 