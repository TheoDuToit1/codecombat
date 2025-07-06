import { supabase } from '../lib/supabase';

/**
 * Add corner pieces to the gauntlet_objects1 table
 */
export const addCornerPieces = async (): Promise<void> => {
  try {
    const cornerPieces = [
      {
        code: 'LT',
        name: 'Top-left corner',
        color: '#555555',
        type: 'terrain'
      },
      {
        code: 'RT',
        name: 'Top-right corner',
        color: '#555555',
        type: 'terrain'
      },
      {
        code: 'LB',
        name: 'Bottom-left corner',
        color: '#555555',
        type: 'terrain'
      },
      {
        code: 'RB',
        name: 'Bottom-right corner',
        color: '#555555',
        type: 'terrain'
      }
    ];

    // Insert corner pieces into the gauntlet_objects1 table
    for (const piece of cornerPieces) {
      // Check if the piece already exists
      const { data: existingPiece } = await supabase
        .from('gauntlet_objects1')
        .select('code')
        .eq('code', piece.code)
        .single();

      if (!existingPiece) {
        // Insert the piece if it doesn't exist
        const { error } = await supabase
          .from('gauntlet_objects1')
          .insert(piece);

        if (error) {
          console.error(`Error adding ${piece.code}:`, error);
        } else {
          console.log(`Added ${piece.code} to gauntlet_objects1`);
        }
      } else {
        console.log(`${piece.code} already exists in gauntlet_objects1`);
      }
    }

    console.log('Corner pieces added successfully');
  } catch (error) {
    console.error('Error adding corner pieces:', error);
    throw error;
  }
};

export default addCornerPieces; 