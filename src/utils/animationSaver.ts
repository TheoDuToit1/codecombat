import { supabase } from '../lib/supabase';

/**
 * Save animation data to Supabase
 * @param name Animation name
 * @param animationData Animation data to save
 * @returns Saved animation data with ID
 */
export const saveAnimationToSupabase = async (name: string, animationData: unknown) => {
  try {
    // Get user ID
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'anonymous';
    
    // Save to sprites table
    const { data, error } = await supabase
      .from('sprites')
      .insert({
        name,
        animations: animationData,
        user_id: userId
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Failed to save animation:', error);
    throw error;
  }
};

/**
 * Update existing animation in Supabase
 * @param id Animation ID
 * @param name Animation name
 * @param animationData Animation data to update
 * @returns Updated animation data
 */
export const updateAnimationInSupabase = async (id: string, name: string, animationData: unknown) => {
  try {
    // Update existing animation
    const { data, error } = await supabase
      .from('sprites')
      .update({
        name,
        animations: animationData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Failed to update animation:', error);
    throw error;
  }
};

/**
 * Save or update animation based on whether ID is provided
 * @param params Object containing id (optional), name, and animations
 * @returns Saved or updated animation data
 */
export const saveOrUpdateAnimation = async (params: {
  id?: string;
  name: string;
  animations: unknown;
}) => {
  const { id, name, animations } = params;
  
  if (id) {
    return await updateAnimationInSupabase(id, name, animations);
  } else {
    return await saveAnimationToSupabase(name, animations);
  }
}; 