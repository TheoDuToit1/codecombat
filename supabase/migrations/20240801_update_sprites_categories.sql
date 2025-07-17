-- Update the sprites table to use the new categories
COMMENT ON COLUMN public.sprites.categories IS 'One of: heroes, enemies, npcs, environments, objects, collectibles, weapons, powerups, ui, effects, tiles, icons';

-- Create an index on the categories column for faster filtering
CREATE INDEX IF NOT EXISTS idx_sprites_categories ON public.sprites(categories);

-- Create an index on the tags column for faster searching
CREATE INDEX IF NOT EXISTS idx_sprites_tags ON public.sprites(tags);

-- Add a description column for additional information
ALTER TABLE public.sprites ADD COLUMN IF NOT EXISTS description TEXT;

-- Add a thumbnail column for preview images
ALTER TABLE public.sprites ADD COLUMN IF NOT EXISTS thumbnail TEXT;

-- Add a metadata column for additional structured data
ALTER TABLE public.sprites ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb; 