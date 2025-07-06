import { supabase, STORAGE_BUCKET } from '../lib/supabase';
import { Animation, AnimationFolder } from '../types/game';

interface AnimationSettings {
  speed: number;
  loop: boolean;
  pingPong: boolean;
  reverse: boolean;
}

interface AnimationData {
  name: string;
  frames: string[];
  settings: AnimationSettings;
}

export interface SpriteData {
  id: string;
  name: string;
  animations: AnimationData[];
  createdAt: string;
  updatedAt: string;
}

export interface SaveSpriteOptions {
  id?: string;
  name: string;
  animations: Animation[];
  folders: AnimationFolder[];
}

// Initialize storage and database
export const initializeStorage = async () => {
  try {
    // Check if we have valid Supabase configuration
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Authentication error:', authError);
      return;
    }

    // Create the storage bucket if it doesn't exist
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);
    
    if (!bucketExists) {
      console.log('Creating storage bucket...');
      const { error: createBucketError } = await supabase
        .storage
        .createBucket(STORAGE_BUCKET, {
          public: false,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
          fileSizeLimit: '5MB',
        });

      if (createBucketError) {
        console.error('Error creating bucket:', createBucketError);
        return;
      }
    }

    // Create the sprites table if it doesn't exist
    const { error: createTableError } = await supabase
      .from('sprites')
      .select()
      .limit(1);

    if (createTableError?.message?.includes('relation "sprites" does not exist')) {
      console.log('Creating sprites table...');
      const { error: createTableError } = await supabase.rpc('create_sprites_table');
      if (createTableError) {
        console.error('Error creating table:', createTableError);
        return;
      }
    }

    console.log('Storage initialized successfully');
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Convert base64 to blob
const base64ToBlob = async (base64: string) => {
  try {
    const response = await fetch(base64);
    return await response.blob();
  } catch (error) {
    console.error('Error converting base64 to blob:', error);
    throw error;
  }
};

// Save a sprite with its animations to Supabase
export const saveSprite = async ({ id, name, animations, folders }: SaveSpriteOptions) => {
  try {
    // Try to use Supabase first
    try {
      // Get the current user after ensuring we have a session
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';
      
      console.log('Saving sprite with user ID:', userId);

      // Save or update sprite
      const spriteResult = id 
        ? await supabase
            .from('sprites')
            .update({ 
              name, 
              animations,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()
        : await supabase
            .from('sprites')
            .insert({ 
              name, 
              animations,
              user_id: userId
            })
            .select()
            .single();

      if (spriteResult.error) throw spriteResult.error;
      
      const spriteId = spriteResult.data.id;
      console.log('Sprite saved with ID:', spriteId);

      // Delete existing folders for this sprite
      const deleteFoldersResult = await supabase
        .from('animation_folders')
        .delete()
        .eq('sprite_id', spriteId);

      if (deleteFoldersResult.error) throw deleteFoldersResult.error;

      // Save new folders
      if (folders && folders.length > 0) {
        for (const folder of folders) {
          // Create folder
          const folderResult = await supabase
            .from('animation_folders')
            .insert({
              name: folder.name,
              sprite_id: spriteId
            })
            .select()
            .single();

          if (folderResult.error) throw folderResult.error;

          // Save folder items
          if (folder.animations && folder.animations.length > 0) {
            const folderItems = folder.animations.map(animationIndex => ({
              folder_id: folderResult.data.id,
              animation_index: animationIndex,
              sprite_id: spriteId
            }));

            const itemsResult = await supabase
              .from('animation_folder_items')
              .insert(folderItems);

            if (itemsResult.error) throw itemsResult.error;
          }
        }
      }

      return spriteResult.data;
    } catch (supabaseError) {
      console.warn('Supabase save failed, falling back to local storage:', supabaseError);
      return saveToLocalStorage({ id, name, animations, folders });
    }
  } catch (error) {
    console.error('Error saving sprite:', error);
    throw error;
  }
};

// Save sprite to local storage as a fallback
const saveToLocalStorage = ({ id, name, animations, folders }: SaveSpriteOptions) => {
  try {
    // Generate a unique ID if one doesn't exist
    const spriteId = id || `sprite_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Create the sprite object
    const spriteData = {
      id: spriteId,
      name,
      animations,
      folders,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Get existing sprites from local storage
    const existingSpritesJson = localStorage.getItem('sprites') || '[]';
    const existingSprites = JSON.parse(existingSpritesJson);
    
    // Update or add the sprite
    const spriteIndex = existingSprites.findIndex((s: unknown) => (s as {id: string}).id === spriteId);
    if (spriteIndex >= 0) {
      existingSprites[spriteIndex] = spriteData;
    } else {
      existingSprites.push(spriteData);
    }
    
    // Save back to local storage
    localStorage.setItem('sprites', JSON.stringify(existingSprites));
    console.log('Sprite saved to local storage with ID:', spriteId);
    
    return spriteData;
  } catch (error) {
    console.error('Error saving to local storage:', error);
    throw new Error('Failed to save sprite locally');
  }
};

export const loadSprite = async (id: string) => {
  try {
    // Try to load from Supabase first
    try {
      // Load sprite data
      const spriteResult = await supabase
        .from('sprites')
        .select('*')
        .eq('id', id)
        .single();

      if (spriteResult.error) throw spriteResult.error;

      // Load folders
      const foldersResult = await supabase
        .from('animation_folders')
        .select(`
          id,
          name,
          animation_folder_items (
            animation_index
          )
        `)
        .eq('sprite_id', id);

      if (foldersResult.error) throw foldersResult.error;

      // Convert to AnimationFolder format
      const folders: AnimationFolder[] = foldersResult.data.map(folder => ({
        id: folder.id,
        name: folder.name,
        animations: folder.animation_folder_items.map(item => item.animation_index),
        isOpen: false // Default to closed
      }));

      return {
        ...spriteResult.data,
        folders
      };
    } catch (supabaseError) {
      console.warn('Supabase load failed, falling back to local storage:', supabaseError);
      return loadFromLocalStorage(id);
    }
  } catch (error) {
    console.error('Error loading sprite:', error);
    throw error;
  }
};

// Load sprite from local storage as a fallback
const loadFromLocalStorage = (id: string) => {
  try {
    const spritesJson = localStorage.getItem('sprites') || '[]';
    const sprites = JSON.parse(spritesJson);
    
    const sprite = sprites.find((s: unknown) => (s as {id: string}).id === id);
    if (!sprite) {
      throw new Error(`Sprite with ID ${id} not found in local storage`);
    }
    
    return sprite;
  } catch (error) {
    console.error('Error loading from local storage:', error);
    throw new Error('Failed to load sprite from local storage');
  }
};

// Delete a sprite and all its assets
export const deleteSprite = async (spriteId: string): Promise<void> => {
  try {
    // Try to delete from Supabase first
    try {
      // Delete all files in the sprite's folder
      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([`sprites/${spriteId}`]);

      if (storageError) {
        console.error('Error deleting sprite files:', storageError);
        throw storageError;
      }

      // Delete sprite metadata from the database
      const { error: dbError } = await supabase
        .from('sprites')
        .delete()
        .match({ id: spriteId });

      if (dbError) {
        console.error('Error deleting sprite metadata:', dbError);
        throw dbError;
      }
    } catch (supabaseError) {
      console.warn('Supabase delete failed, falling back to local storage:', supabaseError);
      deleteFromLocalStorage(spriteId);
    }
  } catch (error) {
    console.error('Error deleting sprite:', error);
    throw error;
  }
};

// Delete sprite from local storage
const deleteFromLocalStorage = (id: string): void => {
  try {
    const spritesJson = localStorage.getItem('sprites') || '[]';
    const sprites = JSON.parse(spritesJson);
    
    const updatedSprites = sprites.filter((s: unknown) => (s as {id: string}).id !== id);
    localStorage.setItem('sprites', JSON.stringify(updatedSprites));
    
    console.log(`Sprite with ID ${id} deleted from local storage`);
  } catch (error) {
    console.error('Error deleting from local storage:', error);
    throw new Error('Failed to delete sprite from local storage');
  }
};

export const saveAnimationToStorage = async (
  folderName: string,
  animationName: string,
  frames: string[],
  settings: AnimationSettings
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Try to use Supabase storage
    try {
      // Get the current user - no need for authentication first
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';
      
      // Create folder path
      const folderPath = `${userId}/${folderName}`;
      
      // Save animation data as JSON
      const animationData = {
        name: animationName,
        frames,
        settings,
        createdAt: new Date().toISOString()
      };
      
      // Convert to blob
      const animationBlob = new Blob([JSON.stringify(animationData)], { type: 'application/json' });
      
      // Save to Supabase storage
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(`${folderPath}/${animationName}.json`, animationBlob, {
          upsert: true,
          contentType: 'application/json'
        });
      
      if (error) {
        console.error('Error saving animation to Supabase:', error);
        throw error;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(`${folderPath}/${animationName}.json`);
      
      return {
        success: true,
        url: urlData.publicUrl
      };
    } catch (supabaseError) {
      console.warn('Supabase save failed, falling back to local storage:', supabaseError);
      
      // Save to local storage as fallback
      const animationData = {
        name: animationName,
        frames,
        settings,
        createdAt: new Date().toISOString()
      };
      
      // Create a unique key for local storage
      const storageKey = `animation_${folderName}_${animationName}`;
      localStorage.setItem(storageKey, JSON.stringify(animationData));
      
      return {
        success: true,
        url: `local://${storageKey}`
      };
    }
  } catch (error) {
    console.error('Error saving animation to storage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}; 