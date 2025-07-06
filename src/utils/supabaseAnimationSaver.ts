import { supabase } from '../lib/supabase';

/**
 * Save animation data to Supabase (name, categories, tags, data)
 */
export const saveAnimationToSupabase = async (name: string, categories: string[], tags: string[], data: unknown) => {
  try {
    const { data: result, error } = await supabase
      .from('animations')
      .insert({
        name,
        categories,
        tags,
        data
      })
      .select()
      .single();
    if (error) {
      console.error('Error saving animation to Supabase:', error);
      throw error;
    }
    console.log('Animation saved successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to save animation:', error);
    throw error;
  }
};

/**
 * Update an existing animation in Supabase (name, categories, tags, data)
 */
export const updateAnimationInSupabase = async (id: string, name: string, categories: string[], tags: string[], data: unknown) => {
  try {
    const { data: result, error } = await supabase
      .from('animations')
      .update({
        name,
        categories,
        tags,
        data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Error updating animation in Supabase:', error);
      throw error;
    }
    console.log('Animation updated successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to update animation:', error);
    throw error;
  }
};

/**
 * Save or update animation based on whether ID is provided (name, categories, tags, data)
 */
export const saveOrUpdateAnimation = async (params: {
  id?: string;
  name: string;
  categories: string[];
  tags: string[];
  data: unknown;
}) => {
  const { id, name, categories, tags, data } = params;
  if (id) {
    return await updateAnimationInSupabase(id, name, categories, tags, data);
  } else {
    return await saveAnimationToSupabase(name, categories, tags, data);
  }
};

/**
 * Get a single animation by ID (name, categories, tags, data)
 */
export const getAnimationById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('animations')
      .select('id, name, categories, tags, data, created_at, updated_at')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Error getting animation from Supabase:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Failed to get animation:', error);
    throw error;
  }
};

/**
 * List all animations (name, categories, tags, data)
 */
export const listAnimations = async () => {
  try {
    const { data, error } = await supabase
      .from('animations')
      .select('id, name, categories, tags, data, created_at, updated_at')
      .order('updated_at', { ascending: false });
    if (error) {
      console.error('Error listing animations from Supabase:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Failed to list animations:', error);
    throw error;
  }
};

/**
 * Delete an animation by ID
 */
export const deleteAnimation = async (id: string) => {
  try {
    const { error } = await supabase
      .from('animations')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting animation from Supabase:', error);
      throw error;
    }
    console.log('Animation deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete animation:', error);
    throw error;
  }
}; 