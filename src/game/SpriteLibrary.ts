// SpriteLibrary.ts - Manages game sprites and animations

import { SpriteAnimation } from "../types/game";

export class SpriteLibrary {
  private static instance: SpriteLibrary;
  private animations: Map<string, SpriteAnimation> = new Map();
  
  private constructor() {
    // Initialize with default animations
    this.loadDefaultAnimations();
  }
  
  public static getInstance(): SpriteLibrary {
    if (!SpriteLibrary.instance) {
      SpriteLibrary.instance = new SpriteLibrary();
    }
    return SpriteLibrary.instance;
  }
  
  private loadDefaultAnimations(): void {
    // Example animations
    this.addAnimation("hero_idle_down", {
      name: "hero_idle_down",
      frames: ["hero_idle_down_1", "hero_idle_down_2", "hero_idle_down_3"],
      settings: {
        speed: 5,
        loop: true,
        pingPong: false,
        reverse: false
      }
    });
    
    this.addAnimation("hero_walk_down", {
      name: "hero_walk_down",
      frames: ["hero_walk_down_1", "hero_walk_down_2", "hero_walk_down_3", "hero_walk_down_4"],
      settings: {
        speed: 8,
        loop: true,
        pingPong: false,
        reverse: false
      }
    });
    
    // Add more default animations as needed
  }
  
  public addAnimation(id: string, animation: SpriteAnimation): void {
    this.animations.set(id, animation);
  }
  
  public getAnimation(id: string): SpriteAnimation | undefined {
    return this.animations.get(id);
  }
  
  public getAllAnimations(): Map<string, SpriteAnimation> {
    return this.animations;
  }
  
  public removeAnimation(id: string): boolean {
    return this.animations.delete(id);
  }
} 