import { removeStorkkieCharacter } from './utils/removeStokkie';

/**
 * Script to remove the "stokkie" character from Gauntlet Level 1
 */
const main = async () => {
  console.log('Starting to remove stokkie character from database...');
  
  try {
    const result = await removeStorkkieCharacter();
    
    if (result.success) {
      console.log('✅ SUCCESS:', result.message);
    } else {
      console.log('❌ FAILED:', result.message);
    }
  } catch (error) {
    console.error('❌ ERROR:', error instanceof Error ? error.message : String(error));
  }
};

// Run the script
main().catch(console.error); 