// AssetLibraryService.ts - Service for managing game assets

import { Asset } from "../types/game";

export interface SpriteAsset extends Asset {
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  animations: {
    [key: string]: {
      frames: number[];
      frameRate: number;
      loop: boolean;
    }
  };
}

class AssetLibraryService {
  private static instance: AssetLibraryService;
  private storageKey = 'asset-library';

  private constructor() {}

  public static getInstance(): AssetLibraryService {
    if (!AssetLibraryService.instance) {
      AssetLibraryService.instance = new AssetLibraryService();
    }
    return AssetLibraryService.instance;
  }

  public async getAllAssets(): Promise<Asset[]> {
    try {
      const assetsJson = localStorage.getItem(this.storageKey);
      return assetsJson ? JSON.parse(assetsJson) : [];
    } catch (error) {
      console.error("Error getting assets:", error);
      return [];
    }
  }

  public async getAssetById(id: string): Promise<Asset | null> {
    try {
      const assets = await this.getAllAssets();
      return assets.find(asset => asset.id === id) || null;
    } catch (error) {
      console.error("Error getting asset by ID:", error);
      return null;
    }
  }

  public async saveAsset(asset: Asset): Promise<void> {
    try {
      const assets = await this.getAllAssets();
      const existingIndex = assets.findIndex(a => a.id === asset.id);
      
      if (existingIndex >= 0) {
        // Update existing asset
        assets[existingIndex] = asset;
      } else {
        // Add new asset
        assets.push(asset);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(assets));
    } catch (error) {
      console.error("Error saving asset:", error);
      throw error;
    }
  }

  public async updateAsset(asset: Asset): Promise<void> {
    try {
      const assets = await this.getAllAssets();
      const existingIndex = assets.findIndex(a => a.id === asset.id);
      
      if (existingIndex >= 0) {
        assets[existingIndex] = asset;
        localStorage.setItem(this.storageKey, JSON.stringify(assets));
      } else {
        throw new Error(`Asset with ID ${asset.id} not found`);
      }
    } catch (error) {
      console.error("Error updating asset:", error);
      throw error;
    }
  }

  public async deleteAsset(id: string): Promise<void> {
    try {
      const assets = await this.getAllAssets();
      const filteredAssets = assets.filter(asset => asset.id !== id);
      
      if (filteredAssets.length === assets.length) {
        throw new Error(`Asset with ID ${id} not found`);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(filteredAssets));
    } catch (error) {
      console.error("Error deleting asset:", error);
      throw error;
    }
  }

  public async searchAssets(query: string): Promise<Asset[]> {
    try {
      const assets = await this.getAllAssets();
      const lowerQuery = query.toLowerCase();
      
      return assets.filter(asset => 
        asset.name.toLowerCase().includes(lowerQuery) || 
        asset.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error("Error searching assets:", error);
      return [];
    }
  }

  public async filterAssetsByTag(tag: string): Promise<Asset[]> {
    try {
      const assets = await this.getAllAssets();
      const lowerTag = tag.toLowerCase();
      
      return assets.filter(asset => 
        asset.tags.some(t => t.toLowerCase() === lowerTag)
      );
    } catch (error) {
      console.error("Error filtering assets by tag:", error);
      return [];
    }
  }

  // Helper method to create a data URL from a sprite sheet
  public async createSpriteAsset(
    file: File,
    name: string,
    tags: string[],
    frameWidth: number,
    frameHeight: number,
    behaviorCode?: string
  ): Promise<SpriteAsset> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const imageUrl = reader.result as string;
        
        // Create a temporary image to get dimensions
        const img = new Image();
        img.onload = () => {
          const cols = Math.floor(img.width / frameWidth);
          const rows = Math.floor(img.height / frameHeight);
          const frameCount = cols * rows;
          
          const asset = this.addAsset({
            name,
            type: 'sprite',
            tags,
            imageUrl,
            behaviorCode,
          }) as SpriteAsset;
          
          // Add sprite-specific properties
          const spriteAsset: SpriteAsset = {
            ...asset,
            frameWidth,
            frameHeight,
            frameCount,
            animations: {
              default: {
                frames: Array.from({ length: frameCount }, (_, i) => i),
                frameRate: 10,
                loop: true
              }
            }
          };
          
          this.updateAsset(spriteAsset);
          resolve(spriteAsset);
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        img.src = imageUrl;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  }
}

export default AssetLibraryService;
export type { Asset }; 