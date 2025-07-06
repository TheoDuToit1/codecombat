import { supabase } from '../lib/supabase';

// Gauntlet sections
export const GAUNTLET_SECTIONS = [
  {
    id: 1,
    name: 'Dungeon Depths',
    table: 'gauntlet_objects1',
    levels: '1-25'
  },
  {
    id: 2,
    name: 'Crystal Caverns',
    table: 'gauntlet_objects2',
    levels: '26-50'
  },
  {
    id: 3,
    name: 'Logic Labyrinth',
    table: 'gauntlet_objects3',
    levels: '51-75'
  },
  {
    id: 4,
    name: 'Master\'s Tower',
    table: 'gauntlet_objects4',
    levels: '76-100'
  }
];

// Available categories for gauntlet objects
export const GAUNTLET_OBJECT_TYPES = [
  'terrain',
  'enemy',
  'item',
  'special'
];

// Ensure essential objects exist
export const ensureEssentialObjects = async (sectionId: number) => {
  const section = GAUNTLET_SECTIONS.find(s => s.id === sectionId);
  if (!section) {
    console.error(`Invalid section ID: ${sectionId}`);
    return;
  }
  
  const tableName = section.table;
  
  // Define the essential objects that should exist in every section
  const essentialObjects = [
    {
      code: 'LT',
      name: 'wall, left top',
      type: 'terrain',
      color: '#8B4513'
    },
    {
      code: 'WH',
      name: 'Wall (horizontal)',
      type: 'terrain',
      color: '#555555'
    },
    {
      code: 'WV',
      name: 'Wall (vertical)',
      type: 'terrain',
      color: '#666666'
    },
    {
      code: 'WL',
      name: 'Wall (left)',
      type: 'terrain',
      color: '#555555'
    },
    {
      code: 'WR',
      name: 'Wall (right)',
      type: 'terrain',
      color: '#555555'
    },
  ];
  
  // Get all existing objects for batch checking
  const { data: existingObjects, error: listError } = await supabase
    .from(tableName)
    .select('code, id')
    .in('code', essentialObjects.map(o => o.code));
  
  if (listError) {
    console.error(`Error checking for existing objects: ${listError.message}`);
    return;
  }
  
  const existingCodes = new Set((existingObjects || []).map(obj => obj.code));
  
  for (const obj of essentialObjects) {
    try {
      // Skip if object exists
      if (existingCodes.has(obj.code)) {
        console.log(`Essential object ${obj.code} already exists.`);
        continue;
      }
      
      console.log(`Creating essential object ${obj.code} in section ${sectionId}`);
      
      // Create a simple colored square as placeholder
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = obj.color;
        ctx.fillRect(0, 0, 32, 32);
        
        // Add a border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 30, 30);
        
        // Add text identifier
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obj.code, 16, 16);
        
        // Convert to data URL
        const imageData = canvas.toDataURL('image/png');
        
        try {
          // Save directly to the database without relying on the storage bucket
          const { error: insertError } = await supabase
            .from(tableName)
            .insert({
              code: obj.code,
              name: obj.name,
              type: obj.type,
              color: obj.color,
              image_url: imageData  // Use data URL directly for reliability
            });
            
          if (insertError) {
            console.error(`Failed to insert essential object ${obj.code}:`, insertError);
          } else {
            console.log(`Essential object ${obj.code} created successfully`);
          }
        } catch (e) {
          console.error(`Failed to create essential object ${obj.code}:`, e);
        }
      }
    } catch (err) {
      console.error(`Error processing essential object ${obj.code}:`, err);
      // Continue with next object even if one fails
    }
  }
  
  // Handle legacy wall codes conversion
  try {
    // Remove legacy wall codes if they exist
    const legacyCodesToRemove = ['WA', 'W1', 'W2'];
    
    for (const code of legacyCodesToRemove) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('id')
          .eq('code', code)
          .maybeSingle();
          
        if (error) {
          console.error(`Error checking for ${code}:`, error);
          continue;
        }
        
        // If legacy object exists, delete it
        if (data) {
          console.log(`Removing legacy object ${code} from section ${sectionId}`);
          
          const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .eq('code', code);
            
          if (deleteError) {
            console.error(`Error deleting legacy object ${code}:`, deleteError);
          } else {
            console.log(`Legacy object ${code} removed successfully`);
          }
        }
      } catch (e) {
        console.error(`Error processing legacy code ${code}:`, e);
      }
    }
  } catch (legacyError) {
    console.error('Error handling legacy codes:', legacyError);
  }
};

// Object code mapping for 3-char to 2-char conversion
const CODE_MAPPING: Record<string, string> = {
  // Add mappings as needed
  'WHL': 'WH', // Horizontal wall
  'WAL': 'WL', // Left wall
  'WRI': 'WR', // Right wall
  'VER': 'WV', // Vertical wall
};

/**
 * Upload a sprite image to the gauntletsprites bucket
 */
export const uploadGauntletSprite = async (
  imageData: string,
  fileName: string
): Promise<string> => {
  try {
    // Convert base64 to blob
    const base64Data = imageData.split(',')[1];
    if (!base64Data) {
      throw new Error('Invalid image data format');
    }
    
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    
    const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/png' });
    
    console.log(`Attempting to upload sprite: ${fileName}`);
    
    // Try with data URL fallback strategy
    try {
      // Simplified approach - just upload to the root folder
    const { data, error } = await supabase.storage
      .from('gauntletsprites')
        .upload(fileName, blob, {
        contentType: 'image/png',
        upsert: true
      });
      
    if (error) {
        console.error('Error uploading sprite:', error);
        // Don't throw, fall back to data URL
        return imageData;
    }
    
    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('gauntletsprites')
        .getPublicUrl(fileName);
        
      if (!publicUrl || !publicUrl.publicUrl) {
        console.error('Failed to get public URL, using data URL as fallback');
        return imageData;
      }
      
      console.log(`Sprite uploaded successfully: ${publicUrl.publicUrl}`);
    return publicUrl.publicUrl;
    } catch (error) {
      console.error('Upload failed, using data URL as fallback:', error);
      return imageData;
    }
  } catch (error) {
    console.error('Error in uploadGauntletSprite:', error);
    return imageData; // Use data URL as fallback
  }
};

/**
 * Save a gauntlet sprite to the database
 */
export const saveGauntletSprite = async (
  sectionId: number,
  code: string,
  name: string,
  type: string,
  color: string,
  imageData: string
): Promise<void> => {
  try {
    // Trim and validate code
    code = code.trim().toUpperCase();
    if (!code) {
      throw new Error('Code is required');
    }

    // Use mapping for 3-character codes to make them database compatible
    let dbCode = code;
    if (code.length > 2) {
      // Check if we have a specific mapping for this code
      if (CODE_MAPPING[code]) {
        dbCode = CODE_MAPPING[code];
        console.log(`Mapped 3-char code ${code} to 2-char code ${dbCode}`);
      } else {
        // Auto-shorten to 2 characters if no mapping exists
        dbCode = code.substring(0, 2);
        console.log(`Auto-shortened code ${code} to ${dbCode} for database compatibility`);
      }
    }

    // Find the correct table name based on section ID
    const section = GAUNTLET_SECTIONS.find(s => s.id === sectionId);
    if (!section) {
      throw new Error(`Invalid section ID: ${sectionId}`);
    }
    
    const tableName = section.table;
    const fileName = `${dbCode.toLowerCase()}_${Date.now()}.png`;
    
    // Check if the object already exists
    const { data: existingObject, error: checkError } = await supabase
      .from(tableName)
      .select('id, image_url')
      .eq('code', dbCode)
      .maybeSingle();
      
    if (checkError) {
      console.warn(`Error checking for existing object: ${checkError.message}`);
      // Continue anyway - we'll try to insert
    }
    
    // Upload the image with safer error handling
    let imageUrl = '';
    try {
      imageUrl = await uploadGauntletSprite(imageData, fileName);
      console.log(`Image uploaded with URL: ${imageUrl.substring(0, 50)}...`);
    } catch (uploadError) {
      console.error('Failed to upload sprite image, using fallback:', uploadError);
      // Use data URL as fallback so we can still save the object
      imageUrl = imageData;
    }
    
    // Create the object data
    const objectData = {
      name: name + (code !== dbCode ? ` (${code})` : ''), // Add original code to name if mapped
        type,
        color,
      image_url: imageUrl,
      updated_at: new Date().toISOString()
    };

    if (existingObject) {
      // Update existing object
      console.log(`Updating existing object with code ${dbCode} in ${tableName}`);
      const { error: updateError } = await supabase
        .from(tableName)
        .update(objectData)
        .eq('code', dbCode);
      
      if (updateError) {
        console.error(`Error updating ${tableName}:`, updateError);
        throw updateError;
      }
      
      console.log(`Updated existing object with code ${dbCode} in ${tableName}`);
    } else {
      // Insert new object
      console.log(`Creating new object with code ${dbCode} in ${tableName}`);
      const { error: insertError } = await supabase
        .from(tableName)
        .insert({
          code: dbCode,
          ...objectData
        });
        
      if (insertError) {
        console.error(`Error saving to ${tableName}:`, insertError);
        throw insertError;
      }
      
      console.log(`Inserted new object with code ${dbCode} in ${tableName}`);
    }
  } catch (error) {
    console.error('Error in saveGauntletSprite:', error);
    throw error;
  }
};

/**
 * List all gauntlet objects for a specific section
 */
export const listGauntletObjects = async (sectionId: number): Promise<any[]> => {
  try {
    // Find the correct table name based on section ID
    const section = GAUNTLET_SECTIONS.find(s => s.id === sectionId);
    if (!section) {
      throw new Error(`Invalid section ID: ${sectionId}`);
    }
    
    const tableName = section.table;
    
    // Ensure LT exists before listing objects
    await ensureEssentialObjects(sectionId);
    
    // Query the database for all objects
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('name');
      
    if (error) {
      console.error(`Error fetching gauntlet objects from ${tableName}:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in listGauntletObjects:', error);
    return [];
  }
};

/**
 * Delete a gauntlet object from the database
 */
export const deleteGauntletObject = async (sectionId: number, code: string): Promise<void> => {
  try {
    // Find the correct table name based on section ID
    const section = GAUNTLET_SECTIONS.find(s => s.id === sectionId);
    if (!section) {
      throw new Error(`Invalid section ID: ${sectionId}`);
    }
    
    const tableName = section.table;
    
    // Delete the object
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('code', code);
      
    if (error) {
      console.error(`Error deleting object with code ${code} from ${tableName}:`, error);
      throw error;
    }
    
    console.log(`Legacy object ${code} removed successfully`);
  } catch (error) {
    console.error('Error in deleteGauntletObject:', error);
    throw error;
  }
}; 