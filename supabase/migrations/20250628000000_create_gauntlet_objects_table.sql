-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create gauntlet_objects1 table (Dungeon Depths: Levels 1-25)
CREATE TABLE IF NOT EXISTS public.gauntlet_objects1 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(2) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(50),
  image_url TEXT,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_gauntlet_objects1_code ON public.gauntlet_objects1(code);

-- Create gauntlet_objects2 table (Crystal Caverns: Levels 26-50)
CREATE TABLE IF NOT EXISTS public.gauntlet_objects2 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(2) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(50),
  image_url TEXT,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_gauntlet_objects2_code ON public.gauntlet_objects2(code);

-- Create gauntlet_objects3 table (Logic Labyrinth: Levels 51-75)
CREATE TABLE IF NOT EXISTS public.gauntlet_objects3 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(2) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(50),
  image_url TEXT,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_gauntlet_objects3_code ON public.gauntlet_objects3(code);

-- Create gauntlet_objects4 table (Master's Tower: Levels 76-100)
CREATE TABLE IF NOT EXISTS public.gauntlet_objects4 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(2) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(50),
  image_url TEXT,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_gauntlet_objects4_code ON public.gauntlet_objects4(code);

-- Migrate data from gauntlet_objects1 if it exists (for backward compatibility)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gauntlet_objects') THEN
    INSERT INTO gauntlet_objects1 (code, name, color, image_url, type, created_at, updated_at)
    SELECT code, name, color, image_url, type, created_at, updated_at
    FROM gauntlet_objects
    ON CONFLICT (code) DO NOTHING;
  END IF;
END $$;

-- Create the gauntlet_levels table
CREATE TABLE IF NOT EXISTS public.gauntlet_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  section INTEGER NOT NULL CHECK (section BETWEEN 1 AND 4),
  level_number INTEGER,
  grid_data JSONB NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  difficulty VARCHAR(50) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on name for faster searches
CREATE INDEX IF NOT EXISTS idx_gauntlet_levels_name ON public.gauntlet_levels(name);

-- Create index on section and level_number for faster filtering
CREATE INDEX IF NOT EXISTS idx_gauntlet_levels_section_level ON public.gauntlet_levels(section, level_number); 