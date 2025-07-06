# Collectibles Directory

This directory contains collectible item classes for the game. Collectible classes are automatically generated and integrated into the game loop by the aiFeatureBuilder.js script.

## Structure

Each collectible class should:

1. Implement the GameObject interface
2. Have update and render methods
3. Use animations from the SpriteLibrary
4. Have collection logic when the hero interacts with it

## Example

```typescript
import { SpriteLibrary } from "../game/SpriteLibrary";
import { Character } from "../types/game";

export class CollectibleItem {
  position: { x: number; y: number };
  private collected: boolean = false;
  private value: number = 10;
  
  constructor(options: { x: number; y: number }) {
    this.position = options;
    // Additional initialization
  }
  
  update(dt: number) {
    // Update logic, check for collision with hero
  }
  
  render() {
    // Rendering logic using SpriteLibrary
    if (!this.collected) {
      // Render the collectible
    }
  }
  
  collect() {
    this.collected = true;
    return this.value;
  }
}
``` 