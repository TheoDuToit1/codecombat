// Game map types for Gauntlet maps

export enum TileType {
  Empty = 0,
  Wall = 1,
  Floor = 2,
  Player = 3,
  Exit = 4,
  Spawner = 5,
  Key = 6,
  Food = 7,
  Treasure = 8
}

export interface MapObject {
  type: TileType;
  x: number;
  y: number;
  active?: boolean;
}

export interface GameMap {
  width: number;
  height: number;
  tiles: string[];
  objects: MapObject[];
} 