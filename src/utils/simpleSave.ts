import { supabase } from '../lib/supabase';

/**
 * Simple function to save animation data to Supabase
 * This is a simplified version that should work reliably
 */
export const simpleSaveAnimation = async (name: string, animationData: unknown) => {
  try {
    console.log('Starting simple save animation process');
    
    // Skip authentication entirely and go straight to database insert
    console.log('Attempting direct database insert');
    
    // Simple direct insert to sprites table
    const { data, error } = await supabase
      .from('sprites')
      .insert({
        name,
        animations: animationData,
        user_id: 'anonymous' // Use a fixed user ID
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving to Supabase:', error);
      // If Supabase fails, fall back to local storage
      console.log('Falling back to local storage');
      return saveToLocalStorage(name, animationData);
    }
    
    console.log('Animation saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in simpleSaveAnimation:', error);
    // If any error occurs, fall back to local storage
    console.log('Error occurred, falling back to local storage');
    return saveToLocalStorage(name, animationData);
  }
};

/**
 * Save animation data to local storage
 */
export const saveToLocalStorage = (name: string, animationData: unknown) => {
  try {
    // Generate a unique ID
    const id = `anim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Create animation object
    const animation = {
      id,
      name,
      animations: animationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Get existing animations from local storage
    const existingAnimationsJson = localStorage.getItem('animations') || '[]';
    const existingAnimations = JSON.parse(existingAnimationsJson);
    
    // Add new animation
    existingAnimations.push(animation);
    
    // Save back to local storage
    localStorage.setItem('animations', JSON.stringify(existingAnimations));
    
    console.log('Animation saved to local storage with ID:', id);
    return animation;
  } catch (error) {
    console.error('Error saving to local storage:', error);
    throw new Error('Failed to save animation locally');
  }
};

/**
 * Helper function to check Supabase connection
 * Use this to test if Supabase is properly connected
 */
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('sprites').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test exception:', error);
    return { success: false, error };
  }
};

/**
 * Load animations from local storage
 */
export const loadAnimationsFromLocalStorage = () => {
  try {
    const animationsJson = localStorage.getItem('animations') || '[]';
    const animations = JSON.parse(animationsJson);
    return animations;
  } catch (error) {
    console.error('Error loading animations from local storage:', error);
    return [];
  }
};

/**
 * Load a specific animation by ID from local storage
 */
export const loadAnimationByIdFromLocalStorage = (id: string) => {
  try {
    const animations = loadAnimationsFromLocalStorage();
    const animation = animations.find((anim: unknown) => (anim as {id: string}).id === id);
    return animation || null;
  } catch (error) {
    console.error('Error loading animation by ID from local storage:', error);
    return null;
  }
}; 