-- Update gauntlet_objects1 table to allow 3-character codes
ALTER TABLE public.gauntlet_objects1
ALTER COLUMN code TYPE VARCHAR(3);

-- Update gauntlet_objects2 table to allow 3-character codes
ALTER TABLE public.gauntlet_objects2
ALTER COLUMN code TYPE VARCHAR(3);

-- Update gauntlet_objects3 table to allow 3-character codes
ALTER TABLE public.gauntlet_objects3
ALTER COLUMN code TYPE VARCHAR(3);

-- Update gauntlet_objects4 table to allow 3-character codes
ALTER TABLE public.gauntlet_objects4
ALTER COLUMN code TYPE VARCHAR(3);

-- Add comment to document this change
COMMENT ON COLUMN public.gauntlet_objects1.code IS 'Object code identifier, up to 3 characters';
COMMENT ON COLUMN public.gauntlet_objects2.code IS 'Object code identifier, up to 3 characters';
COMMENT ON COLUMN public.gauntlet_objects3.code IS 'Object code identifier, up to 3 characters';
COMMENT ON COLUMN public.gauntlet_objects4.code IS 'Object code identifier, up to 3 characters'; 