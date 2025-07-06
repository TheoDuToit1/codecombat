# Enemies Directory

This directory contains enemy classes for the game. Enemy classes are automatically generated and integrated into the game loop by the aiFeatureBuilder.js script.

## Structure

Each enemy class should:

1. Implement the GameObject interface
2. Have update and render methods
3. Use animations from the SpriteLibrary
4. Have AI behavior to interact with the hero

## Example

```typescript
import { SpriteLibrary } from "../game/SpriteLibrary";
import { Character } from "../types/game";

export class EnemyName {
  position: { x: number; y: number };
  private hero: Character;
  
  constructor(options: { x: number; y: number }) {
    this.position = options;
    // Additional initialization
  }
  
  update(dt: number) {
    // Update logic
  }
  
  render() {
    // Rendering logic using SpriteLibrary
  }
}
``` 