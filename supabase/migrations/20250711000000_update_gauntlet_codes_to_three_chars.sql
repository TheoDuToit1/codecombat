-- Update gauntlet_enemies table
ALTER TABLE gauntlet_enemies 
  ALTER COLUMN code TYPE character varying(3);

-- Update gauntlet_walls table
ALTER TABLE gauntlet_walls
  ALTER COLUMN code TYPE character varying(3);
  
-- Update gauntlet_items table
ALTER TABLE gauntlet_items
  ALTER COLUMN code TYPE character varying(3);
  
-- Update gauntlet_goals table
ALTER TABLE gauntlet_goals
  ALTER COLUMN code TYPE character varying(3);
  
-- Update gauntlet_heroes table
ALTER TABLE gauntlet_heroes
  ALTER COLUMN code TYPE character varying(3);

-- Add migration comment
COMMENT ON TABLE gauntlet_enemies IS 'Updated code field to support 3 characters';
COMMENT ON TABLE gauntlet_walls IS 'Updated code field to support 3 characters';
COMMENT ON TABLE gauntlet_items IS 'Updated code field to support 3 characters';
COMMENT ON TABLE gauntlet_goals IS 'Updated code field to support 3 characters';
COMMENT ON TABLE gauntlet_heroes IS 'Updated code field to support 3 characters'; 