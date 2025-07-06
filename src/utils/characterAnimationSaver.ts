import { supabase } from '../lib/supabase';
import { ACTIONS, DIRECTIONS } from '../data/classes';
import { createClient } from '@supabase/supabase-js';

type ActionKey = typeof ACTIONS[number];
type DirectionKey = typeof DIRECTIONS[number];

export type FramesState = Record<ActionKey, Record<DirectionKey, string[]>>;

export interface CharacterAnimation {
  id?: string;
  name: string;
  character_class: string;
  character_type: 'player' | 'enemy';
  // Old structure - kept for backward compatibility
  animations?: FramesState;
  // New structure - individual action columns
  Idle?: Record<DirectionKey, string[]>;
  Walk?: Record<DirectionKey, string[]>;
  Run?: Record<DirectionKey, string[]>;
  Attack?: Record<DirectionKey, string[]>;
  Hurt?: Record<DirectionKey, string[]>;
  Die?: Record<DirectionKey, string[]>;
  Interact?: Record<DirectionKey, string[]>;
  Guard?: Record<DirectionKey, string[]>;
  Punch?: Record<DirectionKey, string[]>;
  Dance?: Record<DirectionKey, string[]>;
  thumbnail?: string;
  user_id?: string;
  is_template?: boolean;
  metadata?: {
    tags?: string[];
    categories?: string[];
    description?: string;
    [key: string]: any;
  };
  created_at?: string;
  updated_at?: string;
}

/**
 * Convert from the old animations structure to the new individual action columns
 */
const convertToNewStructure = (animation: CharacterAnimation): Partial<CharacterAnimation> => {
  const result: Partial<CharacterAnimation> = {};
  
  // If using old structure, convert to new structure
  if (animation.animations) {
    for (const action of ACTIONS) {
      if (animation.animations[action]) {
        // Use type assertion to handle the dynamic property assignment
        (result as any)[action] = animation.animations[action];
      }
    }
  }
  
  return result;
};

/**
 * Save a new character animation to Supabase
 */
export const saveCharacterAnimation = async (animation: CharacterAnimation): Promise<CharacterAnimation> => {
  try {
    // Ensure user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    // Build insert data, only include user_id if logged in
    const insertData: any = {
      name: animation.name,
      character_class: animation.character_class,
      character_type: animation.character_type,
      thumbnail: animation.thumbnail,
      is_template: animation.is_template || false,
      metadata: animation.metadata || {}
    };
    
    // Add individual action columns
    for (const action of ACTIONS) {
      if (animation.animations?.[action]) {
        insertData[action] = animation.animations[action];
      } else if (animation[action as keyof CharacterAnimation]) {
        insertData[action] = animation[action as keyof CharacterAnimation];
      }
    }
    
    if (user?.id) {
      insertData.user_id = user.id;
    }

    const { data, error } = await supabase
      .from('character_animations')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error saving character animation:', error);
      throw error;
    }

    console.log('Character animation saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to save character animation:', error);
    throw error;
  }
};

/**
 * Update an existing character animation in Supabase
 */
export const updateCharacterAnimation = async (id: string, animation: Partial<CharacterAnimation>): Promise<CharacterAnimation> => {
  try {
    const updateData: any = {
      ...animation,
      updated_at: new Date().toISOString()
    };
    
    // Convert from old to new structure if needed
    if (animation.animations) {
      const convertedData = convertToNewStructure(animation);
      Object.assign(updateData, convertedData);
    }

    const { data, error } = await supabase
      .from('character_animations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating character animation:', error);
      throw error;
    }

    console.log('Character animation updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to update character animation:', error);
    throw error;
  }
};

/**
 * Save or update character animation based on whether ID is provided
 */
export const saveOrUpdateCharacterAnimation = async (animation: CharacterAnimation): Promise<CharacterAnimation> => {
  if (animation.id) {
    return await updateCharacterAnimation(animation.id, animation);
  } else {
    return await saveCharacterAnimation(animation);
  }
};

/**
 * Get a single character animation by ID
 */
export const getCharacterAnimationById = async (id: string): Promise<CharacterAnimation | null> => {
  try {
    const { data, error } = await supabase
      .from('character_animations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting character animation:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to get character animation:', error);
    throw error;
  }
};

/**
 * List character animations with filtering options
 */
export const listCharacterAnimations = async (options: {
  characterClass?: string;
  characterType?: string;
  isTemplate?: boolean;
  userId?: string;
  limit?: number;
  searchTerm?: string;
} = {}): Promise<CharacterAnimation[]> => {
  try {
    let query = supabase
      .from('character_animations')
      .select('*')
      .order('updated_at', { ascending: false });

    // Apply filters if provided
    if (options.characterClass) {
      query = query.ilike('character_class', options.characterClass.toLowerCase());
    }
    
    if (options.characterType) {
      query = query.eq('character_type', options.characterType);
    }
    
    if (typeof options.isTemplate === 'boolean') {
      query = query.eq('is_template', options.isTemplate);
    }
    
    if (options.userId) {
      query = query.eq('user_id', options.userId);
    }
    
    if (options.searchTerm) {
      query = query.ilike('name', `%${options.searchTerm}%`);
    }
    
    // Apply limit if provided
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error listing character animations:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to list character animations:', error);
    throw error;
  }
};

/**
 * Delete a character animation by ID
 */
export const deleteCharacterAnimation = async (id: string): Promise<{ success: boolean }> => {
  try {
    const { error } = await supabase
      .from('character_animations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting character animation:', error);
      throw error;
    }

    console.log('Character animation deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete character animation:', error);
    throw error;
  }
};

/**
 * Get character animations by character class
 */
export const getCharacterAnimationsByClass = async (characterClass: string): Promise<any[]> => {
  try {
    console.log(`Attempting to load animations for character class: ${characterClass}`);
    
    // Hardcode the URL and key since we can't modify the .env file
    const supabaseUrl = 'https://uxnmlfvjjmgbhjyxfuyq.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4bm1sZnZqam1nYmhqeXhmdXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTg2ODEsImV4cCI6MjA2NjA5NDY4MX0.QiKyZ1Hhyy2_j-MmbsJk8iA98CDm49c3eN6xipg7vx8';
    
    console.log('Supabase client config:', {
      url: supabaseUrl,
      hasAnon: !!supabaseAnonKey,
      anonKeyPrefix: supabaseAnonKey.substring(0, 5) + '...'
    });
    
    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Query the character_animations table
    let { data, error } = await supabase
      .from('character_animations')
      .select('*')
      .eq('character_class', characterClass);
    
    if (error) {
      console.error('Error fetching character animations:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log(`No animations found for character class: ${characterClass}`);
      
      // Get a list of available character classes in the database for debugging
      const { data: classData } = await supabase
        .from('character_animations')
        .select('character_class')
        .limit(100);
      
      const availableClasses = classData ? 
        Array.from(new Set(classData.map(item => item.character_class))) : 
        [];
      
      console.log('Available character classes in database:', availableClasses);
      
      return [];
    }
    
    // Log the number of animations found
    console.log(`Found ${data.length} animations for ${characterClass}:`, data);
    
    // Process the data to ensure it's in the right format
    const processedData = data.map(item => {
      // Check if the animations field exists and is not null
      if (item.animations) {
        // If animations is a string (JSONB sometimes comes as string), parse it
        if (typeof item.animations === 'string') {
          try {
            item.animations = JSON.parse(item.animations);
          } catch (e) {
            console.error('Error parsing animations JSON:', e);
          }
        }
        
        // Ensure all animation actions are lowercase for consistency
        if (typeof item.animations === 'object') {
          const lowerCaseAnimations: Record<string, any> = {};
          
          Object.keys(item.animations).forEach(key => {
            lowerCaseAnimations[key.toLowerCase()] = item.animations[key];
          });
          
          item.animations = lowerCaseAnimations;
        }
      }
      
      return item;
    });
    
    return processedData;
  } catch (error) {
    console.error('Error in getCharacterAnimationsByClass:', error);
    return [];
  }
};

/**
 * Get template character animations
 */
export const getTemplateCharacterAnimations = async (): Promise<CharacterAnimation[]> => {
  return listCharacterAnimations({ isTemplate: true });
};

/**
 * Save animation section (one action) for a character
 */
export const saveAnimationSection = async (
  id: string,
  action: ActionKey,
  frames: Record<DirectionKey, string[]>
): Promise<CharacterAnimation> => {
  try {
    // First get the current animation
    const current = await getCharacterAnimationById(id);
    
    if (!current) {
      throw new Error(`Character animation with ID ${id} not found`);
    }
    
    // Update directly to the specific action column
    const updateData: any = {
      [action]: frames
    };
    
    // Save the updated animation
    return await updateCharacterAnimation(id, updateData);
  } catch (error) {
    console.error(`Failed to save ${action} animation section:`, error);
    throw error;
  }
};

/**
 * Check if a character name already exists
 */
export const checkCharacterNameDuplicate = async (name: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('character_animations')
      .select('id')
      .eq('name', name)
      .limit(1);
    
    if (error) {
      console.error('Error checking character name duplicate:', error);
      throw error;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Failed to check character name duplicate:', error);
    throw error;
  }
};

/**
 * Extract animation data for debugging
 */
export const extractAnimationData = async (characterClass: string) => {
  try {
    // Hardcode the URL and key since we can't modify the .env file
    const supabaseUrl = 'https://uxnmlfvjjmgbhjyxfuyq.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4bm1sZnZqam1nYmhqeXhmdXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTg2ODEsImV4cCI6MjA2NjA5NDY4MX0.QiKyZ1Hhyy2_j-MmbsJk8iA98CDm49c3eN6xipg7vx8';
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('Supabase connection test successful');
    
    // Query the character_animations table
    const { data, error } = await supabase
      .from('character_animations')
      .select('*')
      .eq('character_class', characterClass);
    
    if (error) {
      console.error('Error fetching character animations:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.log(`No animations found for character class: ${characterClass}`);
      return null;
    }
    
    // Log the table structure
    if (data.length > 0) {
      const firstRow = data[0];
      console.log('character_animations table structure:', Object.keys(firstRow));
      console.log('Sample row:', firstRow);
      
      // Log the structure of each field
      Object.keys(firstRow).forEach(field => {
        console.log(`Field '${field}' exists:`, field in firstRow);
        if (field in firstRow) {
          console.log(`Field '${field}' value:`, firstRow[field]);
        }
      });
      
      // Check if animations field is properly structured
      if (firstRow.animations) {
        // If animations is a string (JSONB sometimes comes as string), parse it
        let animationsObj = firstRow.animations;
        if (typeof animationsObj === 'string') {
          try {
            animationsObj = JSON.parse(animationsObj);
            console.log('Parsed animations JSON:', animationsObj);
          } catch (e) {
            console.error('Error parsing animations JSON:', e);
          }
        }
        
        // Check if animations has the expected structure
        if (typeof animationsObj === 'object') {
          // Log the available actions
          const actions = Object.keys(animationsObj);
          console.log('Available actions in animations:', actions);
          
          // Check the structure of each action
          actions.forEach(action => {
            const actionData = animationsObj[action];
            console.log(`Action '${action}' structure:`, {
              type: typeof actionData,
              isEmpty: !actionData || Object.keys(actionData).length === 0,
              keys: actionData ? Object.keys(actionData) : 'none'
            });
            
            // If the action has directions, check the first one
            if (actionData && typeof actionData === 'object') {
              const directions = Object.keys(actionData);
              if (directions.length > 0) {
                const firstDirection = directions[0];
                const frames = actionData[firstDirection];
                console.log(`First direction '${firstDirection}' for action '${action}':`, {
                  type: typeof frames,
                  isArray: Array.isArray(frames),
                  length: Array.isArray(frames) ? frames.length : 'not an array'
                });
              }
            }
          });
        }
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error extracting animation data:', error);
    return null;
  }
};

/**
 * Debug function to check character animations table
 */
export const debugCharacterAnimationsTable = async () => {
  try {
    console.log('Running debug checks for character animations...');
    
    // Hardcode the URL and key since we can't modify the .env file
    const supabaseUrl = 'https://uxnmlfvjjmgbhjyxfuyq.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4bm1sZnZqam1nYmhqeXhmdXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTg2ODEsImV4cCI6MjA2NjA5NDY4MX0.QiKyZ1Hhyy2_j-MmbsJk8iA98CDm49c3eN6xipg7vx8';
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Check if we can connect to Supabase - just select one row instead of using count()
    const { data: connectionTest, error: connectionError } = await supabase
      .from('character_animations')
      .select('id')
      .limit(1);
    
    if (connectionError) {
      console.error('Supabase connection error:', connectionError);
      return false;
    }
    
    console.log('Supabase connection test successful');
    
    // Get the table structure
    const { data, error } = await supabase
      .from('character_animations')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error fetching character animations:', error);
      return false;
    }
    
    if (!data || data.length === 0) {
      console.log('No animations found in character_animations table');
      return false;
    }
    
    // Log the table structure
    console.log('character_animations table structure:', Object.keys(data[0]));
    
    // Get available character classes
    const { data: classData, error: classError } = await supabase
      .from('character_animations')
      .select('character_class');
    
    if (classError) {
      console.error('Error fetching character classes:', classError);
      return false;
    }
    
    const availableClasses = classData ? 
      Array.from(new Set(classData.map(item => item.character_class))) : 
      [];
    
    console.log('Available character classes:', availableClasses);
    
    return true;
  } catch (error) {
    console.error('Error in debugCharacterAnimationsTable:', error);
    return false;
  }
}; 