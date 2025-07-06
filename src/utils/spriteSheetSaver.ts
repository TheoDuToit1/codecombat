import { supabase } from '../lib/supabase';

// Available categories for sprites
export const SPRITE_CATEGORIES = [
  // 'heroes',
  'enemies',
  'npcs',
  // 'environments',
  'objects',
  'collectibles',
  'weapons',
  'powerups',
  // 'ui',
  'effects',
  'tiles',
  'icons'
];

/**
 * Ensure the sprites table has the required columns
 */
export const ensureSpritesTableStructure = async () => {
  try {
    // Check if categories column exists
    const { error: categoriesError } = await supabase.rpc('column_exists', { 
      table_name: 'sprites', 
      column_name: 'categories' 
    });

    // If the RPC call fails, it likely means the function doesn't exist
    // Let's try to add the columns directly
    if (categoriesError) {
      console.log('Adding missing columns to sprites table...');
      
      try {
        // Add categories column if it doesn't exist
        await supabase.rpc('add_column_if_not_exists', {
          table_name: 'sprites',
          column_name: 'categories',
          column_type: 'TEXT'
        });
      } catch (err) {
        // If RPC fails, try direct SQL (this won't work in browser but keeping for reference)
        console.log('RPC failed, columns may need to be added manually');
      }
      
      try {
        // Add tags column if it doesn't exist
        await supabase.rpc('add_column_if_not_exists', {
          table_name: 'sprites',
          column_name: 'tags',
          column_type: 'TEXT'
        });
      } catch (err) {
        console.log('RPC failed for tags column');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring sprites table structure:', error);
    return false;
  }
};

/**
 * Save sprite sheet data to Supabase animations table
 */
export const saveSpriteSheet = async (
  name: string,
  category: string,
  tags: string[],
  data: unknown
) => {
  try {
    // Debug what's being saved
    console.log('Saving sprite sheet with data:', {
      name,
      category,
      tags,
      dataType: typeof data,
      dataStructure: data,
      framesCount: (data as any)?.frames?.length || 0
    });
    
    // Use animations table instead of sprites
    const { data: result, error } = await supabase
      .from('animations')
      .insert({
        name,
        categories: [category],
        tags,
        data
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error saving sprite sheet to Supabase:', error);
      throw error;
    }
    
    console.log('Sprite sheet saved successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to save sprite sheet:', error);
    throw error;
  }
};

/**
 * Update an existing sprite sheet in Supabase
 */
export const updateSpriteSheet = async (
  id: string,
  name: string,
  category: string,
  tags: string[],
  data: unknown
) => {
  try {
    // Use animations table instead of sprites
    const { data: result, error } = await supabase
      .from('animations')
      .update({
        name,
        categories: [category],
        tags,
        data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating sprite sheet in Supabase:', error);
      throw error;
    }
    
    console.log('Sprite sheet updated successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to update sprite sheet:', error);
    throw error;
  }
};

/**
 * Get a single sprite sheet by ID
 */
export const getSpriteSheetById = async (id: string) => {
  try {
    // Use animations table instead of sprites
    const { data, error } = await supabase
      .from('animations')
      .select('id, name, categories, tags, data, created_at, updated_at')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error getting sprite sheet from Supabase:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get sprite sheet:', error);
    throw error;
  }
};

/**
 * List all sprite sheets
 */
export const listSpriteSheets = async (category?: string) => {
  try {
    // Use animations table instead of sprites
    let query = supabase
      .from('animations')
      .select('id, name, categories, tags, data, created_at, updated_at')
      .order('updated_at', { ascending: false });
      
    if (category) {
      // For array column, use containedBy operator
      query = query.contains('categories', [category]);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error listing sprite sheets from Supabase:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to list sprite sheets:', error);
    throw error;
  }
};

/**
 * Delete a sprite sheet by ID
 */
export const deleteSpriteSheet = async (id: string) => {
  try {
    // Use animations table instead of sprites
    const { error } = await supabase
      .from('animations')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting sprite sheet from Supabase:', error);
      throw error;
    }
    
    console.log('Sprite sheet deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete sprite sheet:', error);
    throw error;
  }
}; 