import { SpriteAnimation } from '../types/game';

/**
 * Creates animation frames from sprite sheets for character animations
 * @param frameCount Number of frames per animation (default: 6)
 * @returns Animation data in the format expected by AnimatedCharacter
 */
export function loadCharacterSpriteSheets(frameCount: number = 6): Record<string, Record<string, string[]>> {
  // Define the sprite sheet paths
  const spriteSheets = {
    north: '/images/character-sprite-north.png',
    south: '/images/character=sprite-south.png',
    east: '/images/charcter=sprite-east.png',
    west: '/images/character=sprite-west.png',
  };

  // Define frame dimensions
  const frameWidth = 64;
  const frameHeight = 64;

  // Create animation data structure
  const animations: Record<string, Record<string, string[]>> = {
    idle: {
      up: [],
      down: [],
      left: [],
      right: []
    },
    walk: {
      up: [],
      down: [],
      left: [],
      right: []
    }
  };

  // Generate CSS for each frame in each direction
  for (let i = 0; i < frameCount; i++) {
    // Calculate the X position for this frame
    const frameX = i * frameWidth;

    // Add frames for each direction
    animations.walk.up.push(createSpriteDataUrl(spriteSheets.north, frameX, 0, frameWidth, frameHeight));
    animations.walk.down.push(createSpriteDataUrl(spriteSheets.south, frameX, 0, frameWidth, frameHeight));
    animations.walk.right.push(createSpriteDataUrl(spriteSheets.east, frameX, 0, frameWidth, frameHeight));
    animations.walk.left.push(createSpriteDataUrl(spriteSheets.west, frameX, 0, frameWidth, frameHeight));
    
    // Use the same frames for idle state (could be different in a more complex implementation)
    animations.idle.up.push(createSpriteDataUrl(spriteSheets.north, 0, 0, frameWidth, frameHeight));
    animations.idle.down.push(createSpriteDataUrl(spriteSheets.south, 0, 0, frameWidth, frameHeight));
    animations.idle.right.push(createSpriteDataUrl(spriteSheets.east, 0, 0, frameWidth, frameHeight));
    animations.idle.left.push(createSpriteDataUrl(spriteSheets.west, 0, 0, frameWidth, frameHeight));
  }

  return animations;
}

/**
 * Creates a CSS background-position style for a sprite sheet frame
 * @param spriteSheetPath Path to the sprite sheet
 * @param x X position of the frame in the sprite sheet
 * @param y Y position of the frame in the sprite sheet
 * @param width Width of the frame
 * @param height Height of the frame
 * @returns CSS style string for the background position
 */
function createSpriteDataUrl(spriteSheetPath: string, x: number, y: number, width: number, height: number): string {
  // For sprite sheets, we'll use the full image URL and position it with CSS
  return spriteSheetPath;
} 