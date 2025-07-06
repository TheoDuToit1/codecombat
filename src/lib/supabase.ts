import { createClient } from '@supabase/supabase-js';

// Hardcode the URL and key since we can't modify the .env file
const supabaseUrl = 'https://uxnmlfvjjmgbhjyxfuyq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4bm1sZnZqam1nYmhqeXhmdXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTg2ODEsImV4cCI6MjA2NjA5NDY4MX0.QiKyZ1Hhyy2_j-MmbsJk8iA98CDm49c3eN6xipg7vx8';

// Create client with basic configuration - no auth requirements
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
});

// Initialize storage without authentication
export const initializeStorage = async () => {
  try {
    // Test connection first
    const { data, error } = await supabase
      .from('sprites')
      .select('count')
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    throw error;
  }
};

// Storage bucket for assets
export const STORAGE_BUCKET = 'sprites';

// Add a function to fetch gauntlet objects from the database
export const fetchGauntletObjects = async (section: number = 1) => {
  // Validate section number (1-4)
  if (section < 1 || section > 4) {
    return [];
  }
  
  const tableName = `gauntlet_objects${section}`;
  
  const { data, error } = await supabase
    .from(tableName)
    .select('*');
  
  if (error) {
    return [];
  }
  
  return data || [];
};

// Force refresh of gauntlet objects cache
export const refreshGauntletObjects = async (section: number = 1) => {
  // Fetch fresh data from the database
  return await fetchGauntletObjects(section);
};

// Fetch gauntlet levels from the database
export const fetchGauntletLevels = async (section?: number) => {
  try {
    let query = supabase.from('gauntlet_levels').select('*');
    
    // Filter by section if provided
    if (section !== undefined) {
      query = query.eq('section', section);
    }
    
    // Order by section and level_number
    query = query.order('section').order('level_number');
    
    const { data, error } = await query;
    
    if (error) {
      return [];
    }
    
    // Format the data for use in the application
    const formattedLevels = data.map(level => ({
      id: level.id,
      name: level.name,
      description: level.description || '',
      difficulty: level.difficulty || 'medium',
      width: level.width,
      height: level.height,
      section: level.section,
      level_number: level.level_number,
      // Convert grid_data to tiles format
      tiles: level.grid_data || [],
      playerStart: { x: 1, y: 1 }, // Default value - will be updated to EN tile position when processed
      created_at: level.created_at,
      updated_at: level.updated_at
    }));
    
    return formattedLevels;
  } catch (error) {
    return [];
  }
};

// Fetch a specific gauntlet level by ID
export const fetchGauntletLevelById = async (levelId: string) => {
  try {
    const { data, error } = await supabase
      .from('gauntlet_levels')
      .select('*')
      .eq('id', levelId)
      .single();
    
    if (error) {
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    // Format the level data
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      difficulty: data.difficulty || 'medium',
      width: data.width,
      height: data.height,
      section: data.section,
      level_number: data.level_number,
      // Convert grid_data to tiles format
      tiles: data.grid_data || [],
      playerStart: { x: 1, y: 1 }, // Default value - will be updated to EN tile position when processed
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    return null;
  }
};

// Delete a gauntlet level by ID
export const deleteGauntletLevelById = async (levelId: string) => {
  try {
    const { error } = await supabase
      .from('gauntlet_levels')
      .delete()
      .eq('id', levelId);
    if (error) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}; 