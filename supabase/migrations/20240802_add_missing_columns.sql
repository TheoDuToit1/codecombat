-- Add missing columns to sprites table if they don't exist
ALTER TABLE public.sprites ADD COLUMN IF NOT EXISTS categories TEXT;
ALTER TABLE public.sprites ADD COLUMN IF NOT EXISTS tags TEXT;

-- Create indices for faster queries
CREATE INDEX IF NOT EXISTS idx_sprites_categories ON public.sprites(categories);
CREATE INDEX IF NOT EXISTS idx_sprites_tags ON public.sprites(tags);

-- Create functions for dynamically adding columns
-- This allows our JavaScript code to add columns if needed
CREATE OR REPLACE FUNCTION column_exists(table_name text, column_name text)
RETURNS boolean AS $$
DECLARE
  exists boolean;
BEGIN
  SELECT COUNT(*) > 0 INTO exists
  FROM information_schema.columns
  WHERE table_name = $1
    AND column_name = $2;
  RETURN exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION add_column_if_not_exists(
  table_name text,
  column_name text,
  column_type text
)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = $1
      AND column_name = $2
  ) THEN
    EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', $1, $2, $3);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 