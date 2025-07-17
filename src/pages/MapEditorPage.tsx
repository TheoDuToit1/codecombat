import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

// Example asset list (replace with your actual asset data)
const ASSETS = [
  { id: "tree", name: "Tree", src: "/assets/sprites/tree.png" },
  { id: "rock", name: "Rock", src: "/assets/sprites/rock.png" },
  { id: "hero", name: "Hero", src: "/assets/sprites/hero.png" },
  // Add more assets as needed
];

// Example background gallery
// const BACKGROUND_GALLERY = [ ... ];

// Example layout assets (tiles, walls, etc.)
// const LAYOUT_ASSETS = [
//   { id: "floor", name: "Floor", src: "/assets/tiles/floor.png", category: "Ground" },
//   { id: "wall", name: "Wall", src: "/assets/tiles/wall.png", category: "Wall" },
//   { id: "water", name: "Water", src: "/assets/tiles/water.png", category: "Water" },
//   // Add more layout assets as needed
// ];

const LAYOUT_TOOLS = [
  { id: "rect", name: "Rectangle", icon: "▭" },
  { id: "erase", name: "Eraser", icon: "🧹" },
  { id: "collision", name: "Collision Marker", icon: "🚧" },
];

const LAYERS = [
  { id: "background", name: "Background" },
  { id: "layout", name: "Layout" },
  { id: "sprite", name: "Sprite" },
  { id: "ui", name: "UI Overlay" },
];

const DEFAULT_BACKGROUND = ""; // or a fallback color/image if you want

// Example sprite assets (characters, items, etc.)
type SpriteAsset = {
  id: string;
  name: string;
  src: string;
  category?: string;
  categories?: string[];
  tags?: string[];
};

const SPRITE_ASSETS: SpriteAsset[] = [
  { id: "hero", name: "Hero", src: "/assets/sprites/hero.png", category: "Player" },
  { id: "enemy", name: "Enemy", src: "/assets/sprites/enemy.png", category: "Enemy" },
  { id: "coin", name: "Coin", src: "/assets/sprites/coin.png", category: "Collectible" },
  // Add more sprite assets as needed
];

const SPRITE_TOOLS = [
  { id: "erase", name: "Eraser", icon: "🧹" },
  { id: "rect", name: "Rectangle", icon: "▭" },
  { id: "collision", name: "Collision Marker", icon: "🚧" },
];

// Example UI overlay assets (HUD, labels, triggers, etc.)
const UI_ASSETS = [
  { id: "label", name: "Label", src: "/assets/ui/label.png", category: "Label" },
  { id: "trigger", name: "Trigger", src: "/assets/ui/trigger.png", category: "Trigger" },
  { id: "hud", name: "HUD Icon", src: "/assets/ui/hud_icon.png", category: "HUD" },
  // Add more UI assets as needed
];

const UI_TOOLS = [
  { id: "place", name: "Place", icon: "➕" },
  { id: "move", name: "Move", icon: "✋" },
  { id: "erase", name: "Eraser", icon: "🧹" },
  { id: "edit", name: "Edit", icon: "✏️" },
];

// --- GameGrid Component ---
const GameGrid = ({
  gridSize,
  placedAssets,
  onDropAsset,
  selectedSprite,
  onDeleteSprite,
  onStartDragSprite,
  isPainting,
  paintingAsset,
  onPaintCell,
  onSpriteContextMenu,
  onSpriteClick,
  onCellClick,
  onTileRotate,
  onCellHover,
  isDrawingRectangle,
  rectangleStart,
  rectangleEnd,
  background,
  activeArea,
  toggleActiveCell,
  bgBrightness,
  bgBlur,
  bgOpacity,
  showGridOverlay,
  activeLayer,
  selectedSprites,
  handleLayoutCellErase,
  handleLayoutCellClick,
}: {
  gridSize: { w: number; h: number },
  placedAssets: { asset: any, x: number, y: number, rotation?: number, layer?: string }[],
  onDropAsset: (asset: any, x: number, y: number, layer: string) => void,
  selectedSprite: { x: number, y: number } | null,
  onDeleteSprite: (x: number, y: number) => void,
  onStartDragSprite: (sprite: { asset: any, x: number, y: number, rotation?: number, layer?: string }) => void,
  isPainting: boolean,
  paintingAsset: any,
  onPaintCell: (x: number, y: number) => void,
  onSpriteContextMenu: (e: React.MouseEvent, x: number, y: number) => void,
  onSpriteClick: (e: React.MouseEvent, x: number, y: number, placed: any) => void,
  onCellClick: (e: React.MouseEvent, x: number, y: number) => void,
  onTileRotate: (x: number, y: number) => void,
  onCellHover: (x: number, y: number) => void,
  isDrawingRectangle: boolean,
  rectangleStart: { x: number, y: number } | null,
  rectangleEnd: { x: number, y: number } | null,
  background: string,
  activeArea: boolean[][],
  toggleActiveCell: (x: number, y: number) => void,
  bgBrightness: number,
  bgBlur: number,
  bgOpacity: number,
  showGridOverlay: boolean,
  activeLayer: string,
  selectedSprites: { x: number, y: number }[],
  handleLayoutCellErase: (x: number, y: number) => void,
  handleLayoutCellClick: (x: number, y: number) => void,
}) => {
  const cellSize = 32; // px
  const containerRef = useRef<HTMLDivElement>(null);

  // Render column numbers
  const renderColNumbers = () => (
    <div style={{ height: 20, marginLeft: 36, display: 'flex' }}>
      {Array.from({ length: gridSize.w }).map((_, col) => (
        <div key={col} style={{ width: cellSize, textAlign: 'center', color: '#60a5fa', fontSize: 12 }}>{col}</div>
      ))}
    </div>
  );

  // Group assets by layer
  const getLayerAssets = (layer: string) => {
    return placedAssets.filter(a => a.layer === layer);
  };

  // Function to check if a cell is part of the rectangle preview
  const isInRectanglePreview = (col: number, row: number) => {
    if (!isDrawingRectangle || !rectangleStart || !rectangleEnd) return false;
    
    const minX = Math.min(rectangleStart.x, rectangleEnd.x);
    const maxX = Math.max(rectangleStart.x, rectangleEnd.x);
    const minY = Math.min(rectangleStart.y, rectangleEnd.y);
    const maxY = Math.max(rectangleStart.y, rectangleEnd.y);
    
    return col >= minX && col <= maxX && row >= minY && row <= maxY;
  };

  // Render row numbers and grid
  const renderRows = () => (
    <div style={{ display: 'flex' }}>
      {/* Row numbers */}
      <div style={{ display: 'flex', flexDirection: 'column', marginRight: 4 }}>
        {Array.from({ length: gridSize.h }).map((_, row) => (
          <div key={row} style={{ height: cellSize, width: 32, textAlign: 'right', color: '#60a5fa', fontSize: 12, lineHeight: `${cellSize}px` }}>{row}</div>
        ))}
      </div>
      {/* Grid */}
      <div
        style={{
          position: 'relative',
          width: gridSize.w * cellSize,
          height: gridSize.h * cellSize,
          backgroundImage: background ? `url(${background})` : undefined,
          backgroundSize: `${gridSize.w * cellSize}px ${gridSize.h * cellSize}px`,
          backgroundPosition: 'left top',
          backgroundRepeat: 'no-repeat',
          filter: `brightness(${bgBrightness}) blur(${bgBlur}px)`,
          opacity: bgOpacity,
        }}
      >
        {Array.from({ length: gridSize.h }).map((_, row) => (
          <div key={row} className="flex">
            {Array.from({ length: gridSize.w }).map((_, col) => {
              const isActive = activeArea[row]?.[col] || false;
              const isSelected = (activeLayer === 'sprite' && selectedSprites.some(s => s.x === col && s.y === row)) ||
                                (activeLayer !== 'sprite' && selectedSprite && selectedSprite.x === col && selectedSprite.y === row);
              const isInRectangle = isInRectanglePreview(col, row);

              // Get assets for each layer at this position
              const layoutAssets = getLayerAssets('layout').filter(a => a.x === col && a.y === row);
              const spriteAssets = getLayerAssets('sprite').filter(a => a.x === col && a.y === row);
              const uiAssets = getLayerAssets('ui').filter(a => a.x === col && a.y === row);

              return (
                <div
                  key={col}
                  className={`transition-colors relative ${isSelected ? 'ring-2 ring-blue-400 z-10' : ''}`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: isInRectangle ? 'rgba(96, 165, 250, 0.3)' : (isActive ? 'rgba(255, 192, 203, 0.4)' : 'rgba(0, 0, 0, 0.4)'),
                    border: showGridOverlay ? '1px solid #374151' : 'none',
                    boxShadow: isInRectangle ? 'inset 0 0 0 2px rgba(96, 165, 250, 0.8)' : 'none',
                  }}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    const assetData = e.dataTransfer.getData('asset');
                    const layerData = e.dataTransfer.getData('layer');
                    if (assetData) {
                      const asset = JSON.parse(assetData);
                      onDropAsset(asset, col, row, layerData || 'sprite');
                    }
                  }}
                  onClick={e => {
                    // Only handle left clicks (button 0)
                    if (e.button !== 0) return;
                    
                    if (e.altKey) {
                      // Alt+click toggles active area
                      toggleActiveCell(col, row);
                    } else if (spriteAssets.length > 0) {
                      onSpriteClick(e, col, row, spriteAssets[0]);
                    } else {
                      onCellClick(e, col, row);
                    }
                  }}
                  onContextMenu={e => {
                    e.preventDefault(); // Prevent default context menu
                    if (layoutAssets.length > 0) {
                      // If there's a layout tile, rotate it
                      onTileRotate(col, row);
                    } else if (spriteAssets.length > 0) {
                      // Otherwise use the sprite context menu handler
                      onSpriteContextMenu(e, col, row);
                    }
                  }}
                  onMouseEnter={() => {
                    if (isPainting && paintingAsset) {
                      onPaintCell(col, row);
                    }
                    // Update rectangle end position when hovering during rectangle drawing
                    onCellHover(col, row);
                  }}
                >
                  {/* Layer 2: Map Layout */}
                  {layoutAssets.map((placed, idx) => (
                    <img
                      key={`layout-${idx}`}
                      src={placed.asset?.data?.frames?.[0] || placed.asset?.imageUrl || placed.asset?.spriteSheet}
                      alt={placed.asset?.name}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        objectFit: 'contain',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        opacity: 0.9,
                        transform: `rotate(${placed.rotation || 0}deg)`
                      }}
                      draggable
                      onDragStart={e => {
                        e.dataTransfer.setData('placedSprite', JSON.stringify({ x: col, y: row }));
                        e.dataTransfer.setData('layer', 'layout');
                        onStartDragSprite(placed);
                      }}
                    />
                  ))}

                  {/* Layer 3: Interactive Sprites */}
                  {spriteAssets.map((placed, idx) => (
                    <img
                      key={`sprite-${idx}`}
                      src={placed.asset?.data?.frames?.[0] || placed.asset?.imageUrl || placed.asset?.spriteSheet}
                      alt={placed.asset?.name}
                      style={{
                        width: 28,
                        height: 28,
                        objectFit: 'contain',
                        position: 'absolute',
                        left: 2,
                        top: 2,
                        cursor: 'pointer',
                        opacity: isSelected ? 0.8 : 1,
                        transform: `rotate(${placed.rotation || 0}deg)`,
                        zIndex: 10
                      }}
                      draggable
                      onDragStart={e => {
                        e.dataTransfer.setData('placedSprite', JSON.stringify({ x: col, y: row }));
                        e.dataTransfer.setData('layer', 'sprite');
                        onStartDragSprite(placed);
                      }}
                      onMouseDown={e => {
                        if (e.shiftKey && e.button === 0) {
                          // Start painting with this placed sprite's asset
                          onStartDragSprite(placed);
                        }
                      }}
                      onContextMenu={e => {
                        e.preventDefault();
                        onTileRotate(col, row);
                      }}
                    />
                  ))}

                  {/* Layer 4: UI Overlays */}
                  {uiAssets.map((placed, idx) => (
                    <img
                      key={`ui-${idx}`}
                      src={placed.asset?.data?.frames?.[0] || placed.asset?.imageUrl || placed.asset?.spriteSheet}
                      alt={placed.asset?.name}
                      style={{
                        width: 32,
                        height: 32,
                        objectFit: 'contain',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        opacity: 1,
                        transform: `rotate(${placed.rotation || 0}deg)`,
                        zIndex: 20
                      }}
                      draggable
                      onDragStart={e => {
                        e.dataTransfer.setData('placedSprite', JSON.stringify({ x: col, y: row }));
                        e.dataTransfer.setData('layer', 'ui');
                        onStartDragSprite(placed);
                      }}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 border border-gray-700 rounded-lg m-4 flex flex-col items-center justify-center text-gray-400 overflow-auto relative"
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
        <div className="mb-2 text-sm text-blue-300 bg-gray-900 px-3 py-1 rounded-md">
          Grid Size: {gridSize.w} x {gridSize.h}
        </div>
        <div className="mb-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-md" style={{ fontSize: 12 }}>
          Recommended image size: {gridSize.w * 32 * 2} × {gridSize.h * 32 * 2} px
        </div>
      </div>
      <div style={{ display: 'inline-block', position: 'relative', paddingLeft: 0 }}>
        {renderColNumbers()}
        {renderRows()}
      </div>
    </div>
  );
};

// Add this type above your component
type TileAsset = {
  id: string;
  name: string;
  src?: string;
  imageUrl?: string;
  [key: string]: any;
};

const MapEditorPage: React.FC = () => {
  const [placedAssets, setPlacedAssets] = useState<{ asset: any, x: number, y: number, rotation?: number, layer?: string }[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [mapName, setMapName] = useState("");
  const [selectedMap, setSelectedMap] = useState("");
  const [gridSize, setGridSize] = useState({ w: 16, h: 12 });
  const [selectedSprite, setSelectedSprite] = useState<{ x: number, y: number } | null>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [paintingAsset, setPaintingAsset] = useState<any>(null);
  const [activeArea, setActiveArea] = useState<boolean[][]>([]);
  // --- Layer state ---
  const [activeLayer, setActiveLayer] = useState<string>('background');
  // --- File lock state ---
  const [isFileLocked, setIsFileLocked] = useState<boolean>(false);
  // --- Background state ---
  const [background, setBackground] = useState(DEFAULT_BACKGROUND);
  const [bgBrightness, setBgBrightness] = useState(1);
  const [bgOpacity, setBgOpacity] = useState(1);
  const [bgBlur, setBgBlur] = useState(0);
  // Layout layer state
  const [layoutAssets, setLayoutAssets] = useState<{ asset: any, x: number, y: number, rotation?: number }[]>([]);
  const [selectedLayoutAsset, setSelectedLayoutAsset] = useState<string | null>(null);
  const [selectedLayoutTool, setSelectedLayoutTool] = useState<string>('');
  // Add layout filter state
  const [layoutFilter, setLayoutFilter] = useState('');
  // Sprite layer state
  const [spriteAssets, setSpriteAssets] = useState<{ asset: any, x: number, y: number, rotation?: number }[]>([]);
  const [selectedSpriteAsset, setSelectedSpriteAsset] = useState<string | null>(null);
  const [selectedSpriteTool, setSelectedSpriteTool] = useState<string>('');
  // Add sprite filter state
  const [spriteFilter, setSpriteFilter] = useState('');
  // UI overlay layer state
  const [uiAssets, setUiAssets] = useState<{ asset: any, x: number, y: number, labelText?: string }[]>([]);
  const [selectedUiAsset, setSelectedUiAsset] = useState<string | null>(null);
  const [selectedUiTool, setSelectedUiTool] = useState<string>('place');
  const [editingUi, setEditingUi] = useState<{ x: number, y: number, labelText: string } | null>(null);
  // Manual grid size input state
  const [manualGridSize, setManualGridSize] = useState({ w: 16, h: 12 });
  // Add state for grid overlay toggle
  const [showGridOverlay, setShowGridOverlay] = useState(true);
  const [layerNumber, setLayerNumber] = useState<number | null>(null);
  // Add state for recent backgrounds
  const [recentBackgrounds, setRecentBackgrounds] = useState<string[]>(() => [DEFAULT_BACKGROUND]);
  const [zoomedIdx, setZoomedIdx] = useState<number | null>(null);
  const [supabaseMaps, setSupabaseMaps] = useState<any[]>([]);
  // Add state for database tile assets with correct type
  const [tileAssets, setTileAssets] = useState<TileAsset[]>([]);
  // Add state for loading tile assets
  const [tileAssetsLoading, setTileAssetsLoading] = useState(false);
  // Add state for save mode
  const [saveMode, setSaveMode] = useState<'create' | 'update'>('create');
  const [existingMapId, setExistingMapId] = useState<string | null>(null);
  // Add state for rectangle selection
  const [rectangleStart, setRectangleStart] = useState<{ x: number, y: number } | null>(null);
  const [rectangleEnd, setRectangleEnd] = useState<{ x: number, y: number } | null>(null);
  const [isDrawingRectangle, setIsDrawingRectangle] = useState(false);
  // 2. Add state for fetched sprites
  // Remove: const [dbSprites, setDbSprites] = useState<any[]>([]);
  // Remove: const [loadingSprites, setLoadingSprites] = useState(false);
  // Remove: const [spriteFetchError, setSpriteFetchError] = useState<string | null>(null);
  // 4. Add state for fetched animations
  const [dbAnimations, setDbAnimations] = useState<any[]>([]);
  const [loadingAnimations, setLoadingAnimations] = useState(false);
  const [animationFetchError, setAnimationFetchError] = useState<string | null>(null);
  // 1. Add a new state to track multiple selected sprites for rectangle tool
  const [selectedSprites, setSelectedSprites] = useState<{ x: number, y: number }[]>([]);

  // Function to deselect all selected assets
  const deselectAll = () => {
    setSelectedAsset(null);
    setSelectedLayoutAsset(null);
    setSelectedSpriteAsset(null);
    setSelectedUiAsset(null);
    setSelectedSprite(null);
    // Don't clear the tool selection, just the asset selections
    setIsPainting(false);
    setPaintingAsset(null);
    
    // Cancel rectangle drawing if active
    setRectangleStart(null);
    setRectangleEnd(null);
    setIsDrawingRectangle(false);
    
    console.log("All selections cleared");
  };

  // Add keyboard event listener for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        deselectAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Fetch maps from Supabase when Load modal opens
  useEffect(() => {
    if (showLoadModal) {
      supabase.from('maps').select('*').then(({ data, error }) => {
        if (!error && data) setSupabaseMaps(data);
      });
    }
  }, [showLoadModal]);

  // Fetch tile assets from Supabase when Layout tab is active
  useEffect(() => {
    if (activeLayer === 'layout') {
      setTileAssetsLoading(true);
      (async () => {
        const { data, error } = await supabase
          .from('animations')
          .select('*')
          .contains('categories', ['tiles']);
        if (!error && data) setTileAssets(data);
        setTileAssetsLoading(false);
      })();
    }
  }, [activeLayer]);

  // 3. Fetch sprites from Supabase on mount
  // Remove: const fetchSprites = async () => {
  //   setLoadingSprites(true);
  //   setSpriteFetchError(null);
  //   try {
  //     const { data, error } = await supabase
  //       .from('sprites')
  //       .select('*')
  //       .order('name', { ascending: true });
  //     if (error) throw error;
  //     setDbSprites(data || []);
  //   } catch (err: any) {
  //     setSpriteFetchError(err.message || 'Failed to fetch sprites');
  //     setDbSprites([]);
  //   } finally {
  //     setLoadingSprites(false);
  //   }
  // };
  // fetchSprites();

  // 4. Fetch animations from Supabase on mount
  useEffect(() => {
    const fetchAnimations = async () => {
      setLoadingAnimations(true);
      setAnimationFetchError(null);
      try {
        const { data, error } = await supabase
          .from('animations')
          .select('*')
          .order('name', { ascending: true });
        if (error) throw error;
        setDbAnimations(data || []);
      } catch (err: any) {
        setAnimationFetchError(err.message || 'Failed to fetch animations');
        setDbAnimations([]);
      } finally {
        setLoadingAnimations(false);
      }
    };
    fetchAnimations();
  }, []);

  const setBackgroundWithRecent = (bg: string) => {
    setBackground(bg);
    setRecentBackgrounds(prev => {
      const filtered = prev.filter(src => src !== bg);
      return [bg, ...filtered].slice(0, 5);
    });
  };

  const loadMapFromSupabase = async (mapId: string) => {
    const { data, error } = await supabase.from('maps').select('*').eq('id', mapId).single();
    if (error || !data) {
      alert('Error loading map from Supabase');
      return;
    }
    
    console.log("Loaded map data:", data);
    
    // Load all asset data into state
    setPlacedAssets(data.placed_assets || []);
    setBackgroundWithRecent(data.background || DEFAULT_BACKGROUND);
    setBgBrightness(data.bg_brightness || 1);
    setBgOpacity(data.bg_opacity || 1);
    setBgBlur(data.bg_blur || 0);
    
    // Ensure layout assets are properly loaded
    const layoutFromPlaced = (data.placed_assets || [])
      .filter((a: any) => a.layer === 'layout')
      .map((a: any) => ({ x: a.x, y: a.y, asset: a.asset }));
      
    setLayoutAssets(data.layout_assets || layoutFromPlaced);
    setSpriteAssets(data.sprite_assets || []);
    setUiAssets(data.ui_assets || []);
    
    console.log("Restored layout assets:", data.layout_assets?.length || layoutFromPlaced.length);
    
    setIsFileLocked(data.is_locked || false);
    setLayerNumber(data.layer_number || null);
    setMapName(data.name || "");
    if (data.grid_size) {
      setGridSize({ w: data.grid_size.w, h: data.grid_size.h });
      setManualGridSize({ w: data.grid_size.w, h: data.grid_size.h });
    }
    setShowLoadModal(false);
    setSelectedMap("");
  };

  // File lock/unlock functions
  const toggleFileLock = () => {
    setIsFileLocked(prev => !prev);
  };

  // Check if current file is locked
  const isCurrentFileLocked = isFileLocked;

  // Add function to fill a rectangle with tiles
  const fillRectangleWithTiles = (startX: number, startY: number, endX: number, endY: number) => {
    if (isCurrentFileLocked || !selectedLayoutAsset) return;
    
    console.log(`Filling rectangle from (${startX},${startY}) to (${endX},${endY})`);
    
    // Find the selected asset
    const asset = tileAssets.find(a => a.id === selectedLayoutAsset);
    if (!asset) return;
    
    // Ensure start coordinates are smaller than end coordinates
    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);
    
    // Create arrays to hold new assets
    const newLayoutAssets = [...layoutAssets];
    const newPlacedAssets = [...placedAssets];
    
    // Fill the rectangle
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        // Remove any existing assets at this position
        const layoutIndex = newLayoutAssets.findIndex(a => a.x === x && a.y === y);
        if (layoutIndex !== -1) {
          newLayoutAssets.splice(layoutIndex, 1);
        }
        
        const placedIndex = newPlacedAssets.findIndex(a => a.x === x && a.y === y && a.layer === 'layout');
        if (placedIndex !== -1) {
          newPlacedAssets.splice(placedIndex, 1);
        }
        
        // Add new assets
        newLayoutAssets.push({ x, y, asset });
        newPlacedAssets.push({ x, y, asset, layer: 'layout' });
      }
    }
    
    // Update state
    setLayoutAssets(newLayoutAssets);
    setPlacedAssets(newPlacedAssets);
    
    // Clear rectangle state
    setRectangleStart(null);
    setRectangleEnd(null);
    setIsDrawingRectangle(false);
  };

  // Add function to fill a rectangle with sprites
  const fillRectangleWithSprites = (startX: number, startY: number, endX: number, endY: number) => {
    if (isCurrentFileLocked || !selectedSpriteAsset) return;
    
    console.log(`Filling sprite rectangle from (${startX},${startY}) to (${endX},${endY})`);
    
    // Find the selected asset
    const asset = dbAnimations.find((a: any) => a.id === selectedSpriteAsset);
    if (!asset) return;
    
    // Ensure start coordinates are smaller than end coordinates
    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);
    
    // Create arrays to hold new assets
    const newSpriteAssets = [...spriteAssets];
    const newPlacedAssets = [...placedAssets];
    
    // Fill the rectangle
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        // Remove any existing assets at this position
        const spriteIndex = newSpriteAssets.findIndex(a => a.x === x && a.y === y);
        if (spriteIndex !== -1) {
          newSpriteAssets.splice(spriteIndex, 1);
        }
        
        const placedIndex = newPlacedAssets.findIndex(a => a.x === x && a.y === y && a.layer === 'sprite');
        if (placedIndex !== -1) {
          newPlacedAssets.splice(placedIndex, 1);
        }
        
        // Add new assets
        newSpriteAssets.push({ x, y, asset, rotation: 0 });
        newPlacedAssets.push({ x, y, asset, layer: 'sprite', rotation: 0 });
      }
    }
    
    // Update state
    setSpriteAssets(newSpriteAssets);
    setPlacedAssets(newPlacedAssets);
    
    // Clear rectangle state
    setRectangleStart(null);
    setRectangleEnd(null);
    setIsDrawingRectangle(false);
  };

  // Handle cell click with rectangle support
  const handleCellClick = (e: React.MouseEvent, x: number, y: number) => {
    if (isCurrentFileLocked) return; // Prevent editing locked file
    
    // Ensure this is a left click (button 0)
    if (e.button !== 0) return;
    
    console.log("Cell clicked at", x, y, "activeLayer:", activeLayer, "selectedLayoutTool:", selectedLayoutTool);
    
    // Check which layer is active and perform the appropriate action
    if (activeLayer === 'layout') {
      // Handle rectangle tool
      if (selectedLayoutTool === 'rect') {
        if (!isDrawingRectangle) {
          // Start drawing rectangle
          console.log("Starting rectangle at", x, y);
          setRectangleStart({ x, y });
          setRectangleEnd({ x, y }); // Initialize end to same as start
          setIsDrawingRectangle(true);
        } else {
          // Finish drawing rectangle
          console.log("Finishing rectangle at", x, y);
          if (rectangleStart) {
            fillRectangleWithTiles(rectangleStart.x, rectangleStart.y, x, y);
          }
        }
        return;
      }
      
      // ONLY allow erasing if the erase tool is explicitly selected
      if (selectedLayoutTool === 'erase') {
        console.log("Using ERASE tool");
        handleLayoutCellErase(x, y);
        return;
      }
      
      // Handle collision marker
      if (selectedLayoutTool === 'collision') {
        console.log("Using COLLISION MARKER tool");
        toggleActiveCell(x, y);
        return;
      }
      
      // Only allow painting if a tile is selected and we're not in erase mode
      if (selectedLayoutTool === 'paint' && selectedLayoutAsset) {
        console.log("Using PAINT tool");
        handleLayoutCellClick(x, y);
        return;
      }

      // If no tool is active or no tile is selected, deselect current selection
      if (selectedLayoutAsset) {
        console.log("Deselecting layout asset");
        setSelectedLayoutAsset(null);
        return;
      }

      // Log if no appropriate tool is selected
      console.log("Layout layer active but no appropriate tool selected");
    } else if (activeLayer === 'sprite') {
      // Sprite layer logic...
      if (!selectedSpriteAsset) {
        // If no sprite is selected, deselect any selected sprite
        setSelectedSprite(null);
        return;
      }
      
      // Handle rectangle tool for sprites
      if (selectedSpriteTool === 'rect') {
        if (!isDrawingRectangle) {
          // Start drawing rectangle
          console.log("Starting sprite rectangle at", x, y);
          setRectangleStart({ x, y });
          setRectangleEnd({ x, y }); // Initialize end to same as start
          setIsDrawingRectangle(true);
        } else {
          // Finish drawing rectangle and PLACE sprites in the area
          console.log("Finishing sprite rectangle at", x, y);
          if (rectangleStart) {
            fillRectangleWithSprites(rectangleStart.x, rectangleStart.y, x, y);
            const minX = Math.min(rectangleStart.x, x);
            const maxX = Math.max(rectangleStart.x, x);
            const minY = Math.min(rectangleStart.y, y);
            const maxY = Math.max(rectangleStart.y, y);
            const newSelected = [];
            for (let row = minY; row <= maxY; row++) {
              for (let col = minX; col <= maxX; col++) {
                newSelected.push({ x: col, y: row });
              }
            }
            setSelectedSprites(newSelected);
          }
        }
        return;
      }
      
      // Only handle erase with the erase tool - removed place/move/rotate tool handling
      if (selectedSpriteTool === 'erase') {
        handleSpriteCellErase(x, y);
        return;
      }
      
      // Handle collision marker in sprite layer
      if (selectedSpriteTool === 'collision') {
        console.log("Using COLLISION MARKER tool in sprite layer");
        toggleActiveCell(x, y);
        return;
      }
    } else if (activeLayer === 'ui') {
      // If UI layer is active, deselect any selected UI asset when clicking on empty cell
      if (selectedUiAsset) {
        setSelectedUiAsset(null);
      }
    } else {
      // Default logic for other layers
      if (!selectedAsset) {
        // Deselect if nothing is selected
        setSelectedSprite(null);
        return;
      }
      
    const asset = ASSETS.find(a => a.id === selectedAsset);
    if (!asset) return;
    
    setPlacedAssets((prev) => {
      // Remove any asset already at this cell
        const filtered = prev.filter((a: any) => !(a.x === x && a.y === y));
      return [...filtered, { x, y, asset, layer: 'sprite' }];
    });
      
      // Deselect after placement
      setSelectedAsset(null);
    }
  };

  // Save map to Supabase
  const saveMap = async () => {
    if (!mapName || !layerNumber) { alert('Please enter a name and select a layer number.'); return; }
    
    // First check if a map with this name and layer already exists
    const { data: existingMaps } = await supabase
      .from('maps')
      .select('id')
      .eq('name', mapName)
      .eq('layer_number', layerNumber);
    
    // Verify data before saving
    console.log("Saving map with:", {
      mapName,
      layerNumber,
      existingMaps: existingMaps?.length,
      layoutAssets: layoutAssets.length,
      placedAssets: placedAssets.length,
      background,
      grid_size: gridSize
    });
    
    const mapData = {
      name: mapName,
      grid_size: { w: gridSize.w, h: gridSize.h, label: `${gridSize.w} x ${gridSize.h}` },
      placed_assets: placedAssets,
      background,
      bg_brightness: bgBrightness,
      bg_opacity: bgOpacity,
      bg_blur: bgBlur,
      layout_assets: layoutAssets,
      sprite_assets: spriteAssets,
      ui_assets: uiAssets,
      is_locked: isFileLocked,
      layer_number: layerNumber,
    };
    
    let error;
    
    if (existingMaps && existingMaps.length > 0) {
      // Update existing map
      console.log("Updating existing map:", existingMaps[0].id);
      const result = await supabase
        .from('maps')
        .update(mapData)
        .eq('id', existingMaps[0].id);
      error = result.error;
    } else {
      // Create a new map
      console.log("Creating new map");
      const result = await supabase.from('maps').insert([mapData]);
      error = result.error;
    }
    
    if (error) {
      alert('Error saving map: ' + error.message);
    } else {
      alert(`Map ${existingMaps && existingMaps.length > 0 ? 'updated' : 'saved'} successfully!`);
      setShowSaveModal(false);
      setMapName("");
      setLayerNumber(null);
    }
  };

  // Add a function to check for existing maps with the same name and layer
  const checkExistingMap = async (name: string, layer: number) => {
    if (!name || !layer) return;
    
    const { data, error } = await supabase
      .from('maps')
      .select('id, name, layer_number')
      .eq('name', name)
      .eq('layer_number', layer);
      
    if (!error && data && data.length > 0) {
      console.log("Found existing map:", data[0]);
      setExistingMapId(data[0].id);
      setSaveMode('update');
    } else {
      setExistingMapId(null);
      setSaveMode('create');
    }
  };

  // Update the mapName and layerNumber effects to check for existing maps
  useEffect(() => {
    if (mapName && layerNumber) {
      checkExistingMap(mapName, layerNumber);
    }
  }, [mapName, layerNumber]);

  // Handle dropping an asset
  const handleDropAsset = (asset: any, x: number, y: number, layer: string) => {
    if (isCurrentFileLocked) return; // Prevent dropping on locked file
    
    console.log("Dropping asset on grid:", { asset, x, y, layer });
    
    if (layer === 'layout') {
      // Find the asset in tileAssets
      const droppedAsset = tileAssets.find(a => a.id === asset.id);
      if (!droppedAsset) return;
      // Update layoutAssets
      setLayoutAssets(prev => {
        const filtered = prev.filter(a => !(a.x === x && a.y === y));
        return [...filtered, { x, y, asset: droppedAsset }];
      });
      // Update placedAssets for consistency
      setPlacedAssets(prev => {
        const filtered = prev.filter(a => !(a.x === x && a.y === y && a.layer === 'layout'));
        return [...filtered, { x, y, asset: droppedAsset, layer: 'layout' }];
      });
      setSelectedLayoutAsset(null); // Deselect after placing
      return;
    } else {
      setPlacedAssets(prev => {
        const filtered = prev.filter(a => !(a.x === x && a.y === y && a.layer === layer));
      return [...filtered, { x, y, asset, layer }];
    });
      if (layer === 'sprite') {
        setSelectedSpriteAsset(null); // Deselect after placing
      } else if (layer === 'ui') {
        setSelectedUiAsset(null);
      }
    }
  };

  // Handle deleting a sprite
  // const handleDeleteSprite = (x: number, y: number) => {
  //   if (isCurrentFileLocked) return; // Prevent deleting from locked file
  //   setPlacedAssets((prev) => prev.filter((a) => !(a.x === x && a.y === y)));
  //   setSelectedSprite(null);
  // };

  // Handle starting drag on a sprite
  const handleStartDragSprite = (sprite: { asset: any, x: number, y: number, rotation?: number, layer?: string }) => {
    if (isCurrentFileLocked) return; // Prevent dragging from locked file
    setPaintingAsset(sprite.asset);
    setIsPainting(true);
  };

  // Handle painting cells
  const handlePaintCell = (x: number, y: number) => {
    if (isCurrentFileLocked) return; // Prevent painting on locked file
    if (!paintingAsset) return;
    setPlacedAssets((prev) => {
      // Remove any asset already at this cell
      const filtered = prev.filter((a) => !(a.x === x && a.y === y));
      return [...filtered, { x, y, asset: paintingAsset, layer: 'sprite' }];
    });
  };

  // Handle sprite context menu
  const handleSpriteContextMenu = (e: React.MouseEvent, _x: number, _y: number) => {
    e.preventDefault();
    // Add context menu logic here
  };

  // Handle sprite click
  const handleSpriteClick = (_e: React.MouseEvent, x: number, y: number) => {
    if (selectedSpriteTool === 'rect' && isDrawingRectangle && rectangleStart) {
      // Rectangle selection: fill rectangle with selected sprites
      const minX = Math.min(rectangleStart.x, x);
      const maxX = Math.max(rectangleStart.x, x);
      const minY = Math.min(rectangleStart.y, y);
      const maxY = Math.max(rectangleStart.y, y);
      const newSelected = [];
      for (let row = minY; row <= maxY; row++) {
        for (let col = minX; col <= maxX; col++) {
          newSelected.push({ x: col, y: row });
        }
      }
      setSelectedSprites(newSelected);
      setIsDrawingRectangle(false);
      setRectangleStart(null);
      setRectangleEnd(null);
    } else {
    setSelectedSprite({ x, y });
      setSelectedSprites([{ x, y }]);
    }
  };

  // Toggle active cell
  const toggleActiveCell = (x: number, y: number) => {
    setActiveArea((prev) => {
      const newArea = [...prev];
      if (!newArea[y]) newArea[y] = [];
      newArea[y][x] = !newArea[y][x];
      return newArea;
    });
  };

  // Layout layer painting logic (when not dragging)
  const handleLayoutCellClick = (x: number, y: number) => {
    if (isCurrentFileLocked) return; // Prevent editing locked file
    if (!selectedLayoutAsset) return;
    
    console.log("PAINTING cell at", x, y, "with tool:", selectedLayoutTool);
    
    // Find the selected asset in tileAssets instead of LAYOUT_ASSETS
    const asset = tileAssets.find(a => a.id === selectedLayoutAsset);
    if (!asset) return;
    
    // Update layoutAssets
    setLayoutAssets(prev => {
      // Remove any asset already at this cell
      const filtered = prev.filter(a => !(a.x === x && a.y === y));
      console.log("Adding tile to layoutAssets:", { x, y, asset: asset.name });
      return [...filtered, { x, y, asset }];
    });
    
    // Also update placedAssets for consistency
    setPlacedAssets(prev => {
      // Remove any asset already at this cell that is in the layout layer
      const filtered = prev.filter(a => !(a.x === x && a.y === y && a.layer === 'layout'));
      console.log("Adding tile to placedAssets:", { x, y, asset: asset.name });
      return [...filtered, { x, y, asset, layer: 'layout' }];
    });
  };

  // Layout layer erasing logic
  const handleLayoutCellErase = (x: number, y: number) => {
    if (isCurrentFileLocked) return; // Prevent editing locked file
    
    console.log("ERASING cell at", x, y, "with tool:", selectedLayoutTool);
    
    // Debug - log all layout assets to check what's actually in the state
    console.log("All layout assets:", layoutAssets);
    console.log("All placed assets:", placedAssets.filter((a: any) => a.layer === 'layout'));
    
    // Check for assets in both layoutAssets and placedAssets arrays
    const hasLayoutAsset = layoutAssets.some((a: any) => a.x === x && a.y === y);
    const hasPlacedAsset = placedAssets.some((a: any) => a.x === x && a.y === y && a.layer === 'layout');
    
    console.log("Found in layoutAssets:", hasLayoutAsset);
    console.log("Found in placedAssets:", hasPlacedAsset);
    
    // Remove from layoutAssets
    setLayoutAssets(prev => prev.filter((a: any) => !(a.x === x && a.y === y)));
    
    // Also remove from placedAssets if it exists there
    if (hasPlacedAsset) {
      setPlacedAssets(prev => prev.filter((a: any) => !(a.x === x && a.y === y && a.layer === 'layout')));
    }
  };

  // Sprite layer placing logic
  // Remove: const handleSpriteCellPlace = ...
  // Sprite layer erasing logic
  const handleSpriteCellErase = (x: number, y: number) => {
    if (isCurrentFileLocked) return; // Prevent editing locked file
    setSpriteAssets(prev => prev.filter(a => !(a.x === x && a.y === y)));
  };

  // Sprite layer move logic
  // Remove: const handleSpriteCellMoveStart = ...
  // Sprite layer rotate logic
  // Remove: const handleSpriteCellRotate = ...

  // UI overlay placing logic
  const handleUiCellPlace = (x: number, y: number) => {
    if (isCurrentFileLocked) return; // Prevent editing locked file
    if (!selectedUiAsset) return;
    const asset = UI_ASSETS.find(a => a.id === selectedUiAsset);
    if (!asset) return;
    setUiAssets(prev => {
      // Remove any UI asset already at this cell
      const filtered = prev.filter(a => !(a.x === x && a.y === y));
      // For label, default text
      if (asset.id === 'label') {
        return [...filtered, { x, y, asset, labelText: 'Label' }];
      }
      return [...filtered, { x, y, asset }];
    });
  };

  // UI overlay erasing logic
  const handleUiCellErase = (x: number, y: number) => {
    if (isCurrentFileLocked) return; // Prevent editing locked file
    setUiAssets(prev => prev.filter(a => !(a.x === x && a.y === y)));
  };

  // UI overlay move logic
  const handleUiCellMoveStart = (x: number, y: number) => {
    if (isCurrentFileLocked) return; // Prevent editing locked file
    setEditingUi({ x, y, labelText: '' });
  };

  // UI overlay edit logic (for labels)
  const handleUiCellEdit = (x: number, y: number) => {
    if (isCurrentFileLocked) return; // Prevent editing locked file
    const ui = uiAssets.find(a => a.x === x && a.y === y && a.asset.id === 'label');
    if (!ui) return;
    setEditingUi({ x, y, labelText: ui.labelText || '' });
  };
  const handleUiLabelChange = (text: string) => {
    if (isCurrentFileLocked) return; // Prevent editing locked file
    if (!editingUi) return;
    setUiAssets(prev => prev.map(a =>
      a.x === editingUi.x && a.y === editingUi.y && a.asset.id === 'label'
        ? { ...a, labelText: text }
        : a
    ));
    setEditingUi(editingUi ? { ...editingUi, labelText: text } : null);
  };
  const handleUiLabelSave = () => {
    if (isCurrentFileLocked) return; // Prevent editing locked file
    setEditingUi(null);
  };

  const handleClear = () => {
    setPlacedAssets([]);
    setBackground(DEFAULT_BACKGROUND);
    setBgBrightness(1);
    setBgOpacity(1);
    setBgBlur(0);
    setLayoutAssets([]);
    setSpriteAssets([]);
    setUiAssets([]);
    setIsFileLocked(false);
    setLayerNumber(null);
    setMapName("");
    setManualGridSize({ w: 16, h: 12 });
    setGridSize({ w: 16, h: 12 });
    setSelectedSprite(null);
    setSelectedAsset(null);
    setSelectedLayoutAsset(null);
    setSelectedLayoutTool('paint');
    setSelectedSpriteAsset(null);
    setSelectedSpriteTool('place');
    setSelectedUiAsset(null);
    setSelectedUiTool('place');
    setEditingUi(null);
    setShowSidebar(true);
    setShowSaveModal(false);
    setShowLoadModal(false);
    setActiveLayer('background');
    setShowGridOverlay(true);
  };

  // Make sure the tool selection persists
  // Add a function to explicitly set the tool and log it
  const setToolAndLog = (toolId: string) => {
    console.log("Setting tool to:", toolId);
    // Toggle tool off if it's already selected
    if (selectedLayoutTool === toolId) {
      setSelectedLayoutTool('');
      console.log("Tool deselected");
    } else {
      // Clear rectangle state when changing tools
      if (toolId !== 'rect') {
        setRectangleStart(null);
        setRectangleEnd(null);
        setIsDrawingRectangle(false);
      }
      setSelectedLayoutTool(toolId);
    }
  };
  
  // Add a function to explicitly set the sprite tool and log it
  const setSpriteToolAndLog = (toolId: string) => {
    console.log("Setting sprite tool to:", toolId);
    // Toggle tool off if it's already selected
    if (selectedSpriteTool === toolId) {
      setSelectedSpriteTool('');
      setRectangleStart(null);
      setRectangleEnd(null);
      setIsDrawingRectangle(false);
      setSelectedSprites([]);
      console.log("Sprite tool deselected");
    } else {
      // Clear rectangle state when changing tools
      if (toolId !== 'rect') {
        setRectangleStart(null);
        setRectangleEnd(null);
        setIsDrawingRectangle(false);
      }
      setSelectedSpriteTool(toolId);
    }
  };

  // Monitor changes to the layout tool selection
  useEffect(() => {
    console.log("Layout tool changed to:", selectedLayoutTool);
  }, [selectedLayoutTool]);

  // Monitor changes to the sprite tool selection
  useEffect(() => {
    console.log("Sprite tool changed to:", selectedSpriteTool);
  }, [selectedSpriteTool]);

  // Monitor changes to the painting state
  useEffect(() => {
    console.log("Painting state changed to:", isPainting);
  }, [isPainting]);

  // Handle tile rotation on right-click
  const handleTileRotate = (x: number, y: number) => {
    if (isCurrentFileLocked) return; // Prevent rotation on locked file

    if (activeLayer === 'sprite') {
      setPlacedAssets(prev => prev.map(asset => {
        if (asset.x === x && asset.y === y && asset.layer === 'sprite') {
          const newRotation = ((asset.rotation || 0) + 90) % 360;
          console.log(`Rotating sprite from ${asset.rotation || 0} to ${newRotation} degrees`);
          return { ...asset, rotation: newRotation };
        }
        return asset;
      }));
      setSpriteAssets(prev => prev.map(asset => {
        if (asset.x === x && asset.y === y) {
          const newRotation = ((asset.rotation || 0) + 90) % 360;
          return { ...asset, rotation: newRotation };
        }
        return asset;
      }));
    } else if (activeLayer === 'layout') {
      setPlacedAssets(prev => prev.map(asset => {
        if (asset.x === x && asset.y === y && asset.layer === 'layout') {
          const newRotation = ((asset.rotation || 0) + 90) % 360;
          console.log(`Rotating layout from ${asset.rotation || 0} to ${newRotation} degrees`);
          return { ...asset, rotation: newRotation };
        }
        return asset;
      }));
      setLayoutAssets(prev => prev.map(asset => {
        if (asset.x === x && asset.y === y) {
          const newRotation = ((asset.rotation || 0) + 90) % 360;
          return { ...asset, rotation: newRotation };
        }
        return asset;
      }));
    }
  };

  // In the MapEditorPage component, add the handler for cell hover
  const handleCellHover = (x: number, y: number) => {
    // Update rectangle end position during drawing
    if (isDrawingRectangle && rectangleStart) {
      setRectangleEnd({ x, y });
    }
  };

  return (
    <div className="map-editor-page" style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Sidebar: Layer Selector + Contextual Tools */}
      <div
        className="asset-sidebar"
        style={{
          width: showSidebar ? 380 : 32,
          background: "#222",
          color: "#fff",
          transition: "width 0.2s",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: 'relative',
        }}
      >
        {/* Back to Main Menu Link (moved inside sidebar) */}
        <Link
          to="/"
          style={{
            display: 'inline-block',
            margin: '16px 0 8px 12px',
            background: '#60a5fa',
            color: '#fff',
            padding: '8px 18px',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: 'none',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#2563eb', e.currentTarget.style.color = '#fff')}
          onMouseOut={e => (e.currentTarget.style.background = '#60a5fa', e.currentTarget.style.color = '#fff')}
        >
          ← Back to Main Menu
        </Link>
        {/* File Lock Indicator */}
        {isCurrentFileLocked && (
          <div style={{
            background: '#ff6b6b',
            color: '#fff',
            padding: '8px',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            borderBottom: '1px solid #333',
          }}>
            🔒 File is Locked - No Editing Allowed
          </div>
        )}
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setShowSidebar(v => !v)}
          style={{
            position: 'absolute',
            top: isCurrentFileLocked ? 130 : 102,
            right: showSidebar ? 6 : -18,
            zIndex: 20,
            width: 36,
            height: 36,
            background: '#60a5fa',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            fontSize: 26,
            fontWeight: 'bold',
            transition: 'right 0.2s, background 0.2s, border 0.2s, box-shadow 0.2s',
          }}
          title={showSidebar ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {showSidebar ? '\u25C0' : '\u25B6'}
        </button>
        {/* Layer Selector */}
        <div style={{ padding: 8, borderBottom: '1px solid #333', display: 'flex', gap: 4 }}>
          {LAYERS.map(layer => {
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                style={{
                  background: isActive ? '#444' : 'none',
                  color: isActive ? '#fff' : isCurrentFileLocked ? '#666' : '#aaa',
                  border: 'none',
                  borderRadius: 4,
                  padding: '4px 10px',
                  fontWeight: 600,
                  cursor: isCurrentFileLocked ? 'not-allowed' : 'pointer',
                  opacity: isCurrentFileLocked ? 0.6 : 1,
                  position: 'relative',
                }}
                disabled={isCurrentFileLocked}
                title={isCurrentFileLocked ? `${layer.name} (File Locked)` : layer.name}
              >
                {layer.name}
                {isCurrentFileLocked && (
                  <span style={{ 
                    position: 'absolute', 
                    top: -2, 
                    right: -2, 
                    fontSize: 10,
                    color: '#ff6b6b'
                  }}>
                    🔒
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {/* Contextual Panel: Background Layer Tools */}
        {showSidebar && activeLayer === 'background' && (
          <div style={{ padding: 12 }}>
            {isCurrentFileLocked && (
              <div style={{
                background: '#ff6b6b',
                color: '#fff',
                padding: '8px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                borderBottom: '1px solid #333',
              }}>
                🔒 Background Layer is Locked
              </div>
            )}
            <h3 style={{ margin: '8px 0' }}>Backgrounds</h3>
            {/* Recent Backgrounds */}
            {recentBackgrounds.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                {recentBackgrounds.map((src, idx) => (
                  <div
                    key={src + idx}
                    onClick={() => !isCurrentFileLocked && setBackgroundWithRecent(src)}
                    style={{
                      border: background === src ? '2px solid #fbbf24' : '2px solid transparent',
                      borderRadius: 6,
                      cursor: isCurrentFileLocked ? 'not-allowed' : 'pointer',
                      overflow: 'visible',
                      width: 40,
                      height: 40,
                      boxShadow: background === src ? '0 0 8px #fbbf24' : undefined,
                      opacity: isCurrentFileLocked ? 0.5 : 1,
                      position: 'relative',
                      zIndex: zoomedIdx === idx ? 100 : 1,
                    }}
                    title={isCurrentFileLocked ? 'Layer is locked' : 'Recent background'}
                    onMouseEnter={() => setZoomedIdx(idx)}
                    onMouseLeave={() => setZoomedIdx(null)}
                  >
                    <img
                      src={src}
                      alt="Recent background"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s',
                        transformOrigin: 'left center',
                        transform: zoomedIdx === idx ? 'scale(4)' : 'scale(1)',
                        boxShadow: zoomedIdx === idx ? '0 4px 32px rgba(0,0,0,0.4)' : undefined,
                        position: zoomedIdx === idx ? 'absolute' : 'static',
                        left: zoomedIdx === idx ? '40px' : undefined,
                        top: zoomedIdx === idx ? '-60px' : undefined,
                        zIndex: zoomedIdx === idx ? 200 : 1,
                        borderRadius: 8,
                        background: '#222',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {/* Remove any rendering or logic that uses BACKGROUND_GALLERY */}
            </div>
            {/* Manual Grid Creator */}
            <div style={{ margin: '16px 0', padding: '8px', background: '#181818', borderRadius: 6 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Manual Grid Size</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="number"
                  min={1}
                  max={64}
                  value={manualGridSize.w}
                  onChange={e => !isCurrentFileLocked && setManualGridSize(s => ({ ...s, w: Math.max(1, Math.min(64, Number(e.target.value))) }))}
                  style={{ width: 48, padding: 4, borderRadius: 4, border: '1px solid #444', background: '#222', color: '#fff', fontSize: 14 }}
                  disabled={isCurrentFileLocked}
                  placeholder="Width"
                />
                <span style={{ color: '#aaa', fontSize: 14 }}>x</span>
                <input
                  type="number"
                  min={1}
                  max={64}
                  value={manualGridSize.h}
                  onChange={e => !isCurrentFileLocked && setManualGridSize(s => ({ ...s, h: Math.max(1, Math.min(64, Number(e.target.value))) }))}
                  style={{ width: 48, padding: 4, borderRadius: 4, border: '1px solid #444', background: '#222', color: '#fff', fontSize: 14 }}
                  disabled={isCurrentFileLocked}
                  placeholder="Height"
                />
                <button
                  onClick={() => setGridSize({ w: manualGridSize.w, h: manualGridSize.h })}
                  style={{
                    marginLeft: 8,
                    background: '#60a5fa',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 12px',
                    fontWeight: 600,
                    cursor: isCurrentFileLocked ? 'not-allowed' : 'pointer',
                    opacity: isCurrentFileLocked ? 0.5 : 1,
                    fontSize: 14,
                  }}
                  disabled={isCurrentFileLocked}
                >
                  Apply
                </button>
              </div>
            </div>
            {/* End Manual Grid Creator */}
            <div style={{ marginTop: 8, marginBottom: 10 }}>
              <input
                id="bg-upload-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                disabled={isCurrentFileLocked}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = ev => {
                      setBackgroundWithRecent(ev.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <button
                style={{
                  width: '100%',
                  padding: 6,
                  borderRadius: 4,
                  background: '#60a5fa',
                  color: '#fff',
                  border: 'none',
                  cursor: isCurrentFileLocked ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  marginBottom: 0,
                  opacity: isCurrentFileLocked ? 0.5 : 1,
                }}
                disabled={isCurrentFileLocked}
                onClick={() => {
                  if (!isCurrentFileLocked) {
                    document.getElementById('bg-upload-input')?.click();
                  }
                }}
              >
                Upload Background
              </button>
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 13 }}>Brightness</label>
              <input 
                type="range" 
                min={0.5} 
                max={1.5} 
                step={0.01} 
                value={bgBrightness} 
                onChange={e => !isCurrentFileLocked && setBgBrightness(Number(e.target.value))} 
                style={{ width: '100%' }} 
                disabled={isCurrentFileLocked}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 13 }}>Opacity</label>
              <input 
                type="range" 
                min={0.2} 
                max={1} 
                step={0.01} 
                value={bgOpacity} 
                onChange={e => !isCurrentFileLocked && setBgOpacity(Number(e.target.value))} 
                style={{ width: '100%' }} 
                disabled={isCurrentFileLocked}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 13 }}>Blur</label>
              <input 
                type="range" 
                min={0} 
                max={8} 
                step={0.1} 
                value={bgBlur} 
                onChange={e => !isCurrentFileLocked && setBgBlur(Number(e.target.value))} 
                style={{ width: '100%' }} 
                disabled={isCurrentFileLocked}
              />
            </div>
            <button 
              style={{ 
                width: '100%', 
                marginTop: 14, 
                padding: 6, 
                borderRadius: 4, 
                background: '#444', 
                color: '#fff', 
                border: 'none', 
                cursor: isCurrentFileLocked ? 'not-allowed' : 'pointer',
                opacity: isCurrentFileLocked ? 0.5 : 1,
              }} 
              onClick={() => {
                if (!isCurrentFileLocked) {
                  setBackgroundWithRecent(DEFAULT_BACKGROUND);
                }
              }}
              disabled={isCurrentFileLocked}
            >
              Reset Background
            </button>
            <button
              style={{
                width: '100%',
                marginTop: 10,
                padding: 6,
                borderRadius: 4,
                background: showGridOverlay ? '#22c55e' : '#ef4444',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
                opacity: isCurrentFileLocked ? 0.5 : 1,
              }}
              onClick={() => setShowGridOverlay(v => !v)}
              disabled={isCurrentFileLocked}
              title={showGridOverlay ? 'Hide Grid Overlay' : 'Show Grid Overlay'}
            >
              {showGridOverlay ? 'Hide Grid' : 'Show Grid'}
            </button>
          </div>
        )}
        {/* Contextual Panel: Layout Layer Tools */}
        {showSidebar && activeLayer === 'layout' && (
          <div style={{ padding: 12 }}>
            {isCurrentFileLocked && (
              <div style={{ 
                background: '#ff6b6b', 
                color: '#fff', 
                padding: '8px', 
                borderRadius: '4px', 
                marginBottom: '12px',
                fontSize: '12px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                🔒 Layout Layer is Locked
              </div>
            )}
            {/* Compact Layout Asset Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 18, color: '#60a5fa', marginRight: 2 }}>🔍</span>
              <input
                type="text"
                placeholder="Search tiles..."
                value={layoutFilter}
                onChange={e => setLayoutFilter(e.target.value)}
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  borderRadius: 4,
                  border: '1px solid #444',
                  background: '#181818',
                  color: '#fff',
                  fontSize: 14,
                  minWidth: 0
                }}
                disabled={isCurrentFileLocked}
              />
            </div>
            {/* Asset Grid with loading and empty states */}
            {tileAssetsLoading ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p style={{ color: '#aaa', marginTop: 8 }}>Loading tiles...</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12, minHeight: 60 }}>
                  {layoutFilter && tileAssets
                    .filter(asset =>
                      asset.name?.toLowerCase().includes(layoutFilter.toLowerCase()) ||
                      asset.id?.toLowerCase().includes(layoutFilter.toLowerCase())
                    )
                    .map(asset => (
                <div
                  key={asset.id}
                  onClick={() => !isCurrentFileLocked && setSelectedLayoutAsset(asset.id)}
                        draggable={!isCurrentFileLocked}
                        onDragStart={(e) => {
                          if (isCurrentFileLocked) return;
                          e.dataTransfer.setData('asset', JSON.stringify(asset));
                          e.dataTransfer.setData('layer', 'layout');
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                  style={{
                    border: selectedLayoutAsset === asset.id ? '2px solid #60a5fa' : '2px solid transparent',
                          borderRadius: 8,
                          cursor: isCurrentFileLocked ? 'not-allowed' : 'grab',
                    overflow: 'hidden',
                          width: 72,
                          background: '#23272f',
                    opacity: isCurrentFileLocked ? 0.5 : 1,
                          boxShadow: selectedLayoutAsset === asset.id ? '0 0 8px #60a5fa' : undefined,
                          transition: 'box-shadow 0.2s, transform 0.1s',
                          padding: 4,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          transform: 'scale(1)',
                        }}
                        onDragOver={() => {}}
                        onDragEnd={() => {}}
                        onMouseDown={() => !isCurrentFileLocked && setSelectedLayoutAsset(asset.id)}
                        onMouseOver={(e) => {
                          if (!isCurrentFileLocked) {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                  }}
                  title={isCurrentFileLocked ? 'Layer is locked' : asset.name}
                >
                        <div style={{ width: 56, height: 56, background: '#444', borderRadius: 6, marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <img src={asset.data?.frames?.[0] || asset.src || asset.imageUrl} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} />
                        </div>
                        <div style={{ color: '#fff', fontSize: 12, textAlign: 'center', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: 60 }}>{asset.name}</div>
                        <div style={{ color: '#60a5fa', fontSize: 10, marginTop: 2 }}>{Array.isArray(asset.categories) ? asset.categories.join(', ') : ''}</div>
                </div>
              ))}
                  {/* Empty state */}
                  {layoutFilter && tileAssets.filter(asset =>
                    asset.name?.toLowerCase().includes(layoutFilter.toLowerCase()) ||
                    asset.id?.toLowerCase().includes(layoutFilter.toLowerCase())
                  ).length === 0 && (
                    <div style={{ textAlign: 'center', color: '#aaa', width: '100%', padding: '32px 0' }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>🖼️</div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>No tiles found</div>
                      <div style={{ fontSize: 12 }}>Try adjusting your search.</div>
            </div>
                  )}
                </div>
              </>
            )}
            <h4 style={{ margin: '12px 0 4px 0' }}>Tools</h4>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {LAYOUT_TOOLS.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => {
                    if ((tool.id === 'erase' || tool.id === 'rect') && !isCurrentFileLocked) {
                      setToolAndLog(tool.id);
                    }
                  }}
                  style={{
                    background: (tool.id === 'erase' || tool.id === 'rect') ? 
                      (selectedLayoutTool === tool.id ? 
                        (tool.id === 'erase' ? '#ef4444' : '#60a5fa') : '#333') : '#333',
                    color: (tool.id === 'erase' || tool.id === 'rect') && selectedLayoutTool === tool.id ? '#fff' : '#aaa',
                    border: 'none',
                    borderRadius: 4,
                    padding: '6px 10px',
                    fontWeight: 600,
                    cursor: (tool.id === 'erase' || tool.id === 'rect') && !isCurrentFileLocked ? 'pointer' : 'not-allowed',
                    fontSize: 16,
                    opacity: (tool.id === 'erase' || tool.id === 'rect') && !isCurrentFileLocked ? 1 : 0.5,
                    position: 'relative',
                  }}
                  title={(tool.id === 'erase' || tool.id === 'rect') ? 
                    (isCurrentFileLocked ? 'Layer is locked' : tool.name) : 
                    tool.name + ' (Coming soon)'}
                  disabled={!(tool.id === 'erase' || tool.id === 'rect') || isCurrentFileLocked}
                >
                  {tool.icon} {tool.name}
                  {tool.id === 'rect' && selectedLayoutTool === 'rect' && isDrawingRectangle && (
                    <span style={{ 
                      position: 'absolute', 
                      top: -8, 
                      right: -8, 
                      background: '#22c55e', 
                      color: 'white', 
                      borderRadius: '50%', 
                      width: 16, 
                      height: 16, 
                      fontSize: 12, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 0 0 2px white'
                    }}>
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
            {/* Rectangle Tool Instructions */}
            {selectedLayoutTool === 'rect' && (
              <div style={{ 
                background: '#111827', 
                padding: '8px 12px', 
                borderRadius: 6, 
                marginBottom: 12,
                fontSize: 13,
                border: '1px solid #374151'
              }}>
                {isDrawingRectangle ? (
                  <div>
                    <div style={{ fontWeight: 600, color: '#60a5fa', marginBottom: 4 }}>Drawing Rectangle</div>
                    <div>Hover to preview. Click again to place tiles.</div>
                    <div style={{ marginTop: 4, fontSize: 12, color: '#9ca3af' }}>Press ESC to cancel</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontWeight: 600, color: '#60a5fa', marginBottom: 4 }}>Rectangle Tool</div>
                    <div>Click to set starting corner, then click again to fill area with selected tile.</div>
                  </div>
                )}
              </div>
            )}
            <h4 style={{ margin: '12px 0 4px 0' }}>Grid Controls</h4>
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                style={{ 
                  background: showGridOverlay ? '#22c55e' : '#ef4444',
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 4, 
                  padding: '6px 10px', 
                  cursor: isCurrentFileLocked ? 'not-allowed' : 'pointer',
                  opacity: isCurrentFileLocked ? 0.5 : 1,
                  fontWeight: 600,
                  fontSize: 14,
                }} 
                onClick={() => !isCurrentFileLocked && setShowGridOverlay(v => !v)}
                disabled={isCurrentFileLocked}
                title={showGridOverlay ? 'Hide Grid Overlay' : 'Show Grid Overlay'}
              >
                {showGridOverlay ? 'Hide Grid' : 'Show Grid'}
              </button>
              <button 
                style={{ 
                  background: '#333', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 4, 
                  padding: '6px 10px', 
                  cursor: 'pointer',
                  opacity: isCurrentFileLocked ? 0.5 : 1,
                }} 
                disabled
              >
                Show/Hide Coords
              </button>
            </div>
          </div>
        )}
        {/* Contextual Panel: Sprite Layer Tools */}
        {showSidebar && activeLayer === 'sprite' && (
          <div style={{ padding: 12 }}>
            {isCurrentFileLocked && (
              <div style={{ 
                background: '#ff6b6b', 
                color: '#fff', 
                padding: '8px', 
                borderRadius: '4px', 
                marginBottom: '12px',
                fontSize: '12px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                🔒 Sprite Layer is Locked
              </div>
            )}
            {/* Compact Sprite Asset Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 18, color: '#60a5fa', marginRight: 2 }}>🔍</span>
              <input
                type="text"
                placeholder="Search sprites..."
                value={spriteFilter}
                onChange={e => setSpriteFilter(e.target.value)}
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  borderRadius: 4,
                  border: '1px solid #444',
                  background: '#181818',
                  color: '#fff',
                  fontSize: 14,
                  minWidth: 0
                }}
                disabled={isCurrentFileLocked}
              />
            </div>
            {/* Asset Grid with loading and empty states */}
            {loadingAnimations ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p style={{ color: '#aaa', marginTop: 8 }}>Loading sprites...</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12, minHeight: 60 }}>
                  {spriteFilter && dbAnimations
                    .filter(asset => {
                      // Exclude tile, tiles, and background categories
                      if (Array.isArray(asset.categories)) {
                        if (asset.categories.some((cat: string) => ['tile', 'tiles', 'background'].includes(cat))) return false;
                      } else if (['tile', 'tiles', 'background'].includes((asset.category as string))) {
                        return false;
                      }
                      return asset.name?.toLowerCase().includes(spriteFilter.toLowerCase()) ||
                             asset.id?.toLowerCase().includes(spriteFilter.toLowerCase());
                    })
                    .map(asset => (
                <div
                  key={asset.id}
                  onClick={() => !isCurrentFileLocked && setSelectedSpriteAsset(asset.id)}
                        draggable={!isCurrentFileLocked}
                        onDragStart={e => {
                          if (isCurrentFileLocked) return;
                          e.dataTransfer.setData('asset', JSON.stringify(asset));
                          e.dataTransfer.setData('layer', 'sprite');
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                  style={{
                    border: selectedSpriteAsset === asset.id ? '2px solid #60a5fa' : '2px solid transparent',
                          borderRadius: 8,
                          cursor: isCurrentFileLocked ? 'not-allowed' : 'grab',
                    overflow: 'hidden',
                          width: 72,
                          background: '#23272f',
                    opacity: isCurrentFileLocked ? 0.5 : 1,
                          boxShadow: selectedSpriteAsset === asset.id ? '0 0 8px #60a5fa' : undefined,
                          transition: 'box-shadow 0.2s, transform 0.1s',
                          padding: 4,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          transform: 'scale(1)',
                        }}
                        onDragOver={() => {}}
                        onDragEnd={() => {}}
                        onMouseDown={() => !isCurrentFileLocked && setSelectedSpriteAsset(asset.id)}
                        onMouseOver={e => {
                          if (!isCurrentFileLocked) {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.transform = 'scale(1)';
                  }}
                  title={isCurrentFileLocked ? 'Layer is locked' : asset.name}
                >
                        <div style={{ width: 56, height: 56, background: '#444', borderRadius: 6, marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <img src={asset.data?.frames?.[0] || asset.src || asset.imageUrl} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} />
                        </div>
                        <div style={{ color: '#fff', fontSize: 12, textAlign: 'center', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: 60 }}>{asset.name}</div>
                        <div style={{ color: '#60a5fa', fontSize: 10, marginTop: 2 }}>{Array.isArray(asset.categories) ? asset.categories.join(', ') : ''}</div>
                </div>
              ))}
                  {/* Empty state */}
                  {spriteFilter && dbAnimations.filter(asset =>
                    asset.name?.toLowerCase().includes(spriteFilter.toLowerCase()) ||
                    asset.id?.toLowerCase().includes(spriteFilter.toLowerCase())
                  ).length === 0 && (
                    <div style={{ textAlign: 'center', color: '#aaa', width: '100%', padding: '32px 0' }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>🖼️</div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>No sprites found</div>
                      <div style={{ fontSize: 12 }}>Try adjusting your search.</div>
            </div>
                  )}
                </div>
              </>
            )}
            <h4 style={{ margin: '12px 0 4px 0' }}>Tools</h4>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {SPRITE_TOOLS.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => {
                    if ((tool.id === 'erase' || tool.id === 'rect') && !isCurrentFileLocked) {
                      setSpriteToolAndLog(tool.id);
                    }
                  }}
                  style={{
                    background: (tool.id === 'erase' || tool.id === 'rect') ? 
                      (selectedSpriteTool === tool.id ? 
                        (tool.id === 'erase' ? '#ef4444' : '#60a5fa') : '#333') : '#333',
                    color: (tool.id === 'erase' || tool.id === 'rect') && selectedSpriteTool === tool.id ? '#fff' : '#aaa',
                    border: 'none',
                    borderRadius: 4,
                    padding: '6px 10px',
                    fontWeight: 600,
                    cursor: (tool.id === 'erase' || tool.id === 'rect') && !isCurrentFileLocked ? 'pointer' : 'not-allowed',
                    fontSize: 16,
                    opacity: (tool.id === 'erase' || tool.id === 'rect') && !isCurrentFileLocked ? 1 : 0.5,
                    position: 'relative',
                  }}
                  title={(tool.id === 'erase' || tool.id === 'rect') ? 
                    (isCurrentFileLocked ? 'Layer is locked' : tool.name) : 
                    tool.name + ' (Coming soon)'}
                  disabled={!(tool.id === 'erase' || tool.id === 'rect') || isCurrentFileLocked}
                >
                  {tool.icon} {tool.name}
                  {tool.id === 'rect' && selectedSpriteTool === 'rect' && isDrawingRectangle && (
                    <span style={{ 
                      position: 'absolute', 
                      top: -8, 
                      right: -8, 
                      background: '#22c55e', 
                      color: 'white', 
                      borderRadius: '50%', 
                      width: 16, 
                      height: 16, 
                      fontSize: 12, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 0 0 2px white'
                    }}>
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
            {/* Rectangle Tool Instructions */}
            {selectedSpriteTool === 'rect' && (
              <div style={{ 
                background: '#111827', 
                padding: '8px 12px', 
                borderRadius: 6, 
                marginBottom: 12,
                fontSize: 13,
                border: '1px solid #374151'
              }}>
                {isDrawingRectangle ? (
                  <div>
                    <div style={{ fontWeight: 600, color: '#60a5fa', marginBottom: 4 }}>Drawing Rectangle</div>
                    <div>Hover to preview. Click again to place sprites.</div>
                    <div style={{ marginTop: 4, fontSize: 12, color: '#9ca3af' }}>Press ESC to cancel</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontWeight: 600, color: '#60a5fa', marginBottom: 4 }}>Rectangle Tool</div>
                    <div>Click to set starting corner, then click again to fill area with selected sprite.</div>
                  </div>
                )}
              </div>
            )}
            {/* Grid Controls for Sprite Layer */}
            <div style={{ marginTop: 16 }}>
              <h4 style={{ margin: '12px 0 4px 0' }}>Grid Controls</h4>
              <button
                onClick={() => setShowGridOverlay(v => !v)}
                style={{
                  background: showGridOverlay ? '#22c55e' : '#374151',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 16px',
                  fontWeight: 600,
                  fontSize: 15,
                  marginRight: 8,
                  cursor: 'pointer',
                  marginBottom: 6
                }}
                title={showGridOverlay ? 'Hide Grid Overlay' : 'Show Grid Overlay'}
              >
                {showGridOverlay ? 'Hide Grid' : 'Show Grid'}
              </button>
            </div>
          </div>
        )}
        {/* Contextual Panel: UI Overlay Layer Tools */}
        {showSidebar && activeLayer === 'ui' && (
          <div style={{ padding: 12 }}>
            <h3 style={{ margin: '8px 0' }}>UI Overlay Assets</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {UI_ASSETS.map(asset => (
                <div
                  key={asset.id}
                  onClick={() => setSelectedUiAsset(asset.id)}
                  style={{
                    border: selectedUiAsset === asset.id ? '2px solid #60a5fa' : '2px solid transparent',
                    borderRadius: 6,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    width: 40,
                    height: 40,
                    boxShadow: selectedUiAsset === asset.id ? '0 0 8px #60a5fa' : undefined,
                    background: '#fff',
                  }}
                  title={asset.name}
                >
                  <img src={asset.src} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <h4 style={{ margin: '12px 0 4px 0' }}>Tools</h4>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {UI_TOOLS.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedUiTool(tool.id)}
                  style={{
                    background: selectedUiTool === tool.id ? '#60a5fa' : '#333',
                    color: selectedUiTool === tool.id ? '#fff' : '#aaa',
                    border: 'none',
                    borderRadius: 4,
                    padding: '6px 10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: 16,
                  }}
                  title={tool.name}
                >
                  {tool.icon} {tool.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* ... other contextual panels for other layers ... */}
        {showSidebar && activeLayer !== 'background' && activeLayer !== 'layout' && activeLayer !== 'sprite' && (
          <div style={{ padding: 12, color: '#aaa' }}>
            <p>Select a different layer to see its tools.</p>
          </div>
        )}
      </div>
      {/* Main Editor Area */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Layer 1: Artistic Background (with adjustments) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            background: background ? `url(${background}) center/cover no-repeat` : undefined,
            width: gridSize.w * 32,
            height: gridSize.h * 32,
            borderRadius: 16,
            boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            backgroundSize: `${gridSize.w * 32}px ${gridSize.h * 32}px`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            overflow: 'hidden',
          }}
        >
          {/* Render layout assets on the grid */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
            {layoutAssets.map(({ x, y, asset }) => (
              <img
                key={`layout-${x}-${y}`}
                src={asset.src}
                alt={asset.name}
                style={{
                  position: 'absolute',
                  left: x * 32,
                  top: y * 32,
                  width: 32,
                  height: 32,
                  opacity: 0.9,
                  pointerEvents: 'none',
                }}
              />
            ))}
          </div>
          {/* Pass layout painting handlers and tile rotation to GameGrid */}
          <GameGrid
            gridSize={gridSize}
            placedAssets={placedAssets}
            onDropAsset={handleDropAsset}
            selectedSprite={selectedSprite}
            onDeleteSprite={(x, y) => {
              // Only allow deletion if in the right mode and with the right tool
              if (activeLayer === 'layout' && selectedLayoutTool === 'erase') {
                handleLayoutCellErase(x, y);
              } else if (activeLayer === 'sprite' && selectedSpriteTool === 'erase') {
                handleSpriteCellErase(x, y);
              } else {
                console.log("Ignoring delete request - wrong tool selected");
              }
            }}
            onStartDragSprite={handleStartDragSprite}
            isPainting={isPainting}
            paintingAsset={paintingAsset}
            onPaintCell={handlePaintCell}
            onSpriteContextMenu={handleSpriteContextMenu}
            onSpriteClick={handleSpriteClick}
            onCellClick={handleCellClick}
            onTileRotate={handleTileRotate}
            onCellHover={handleCellHover}
            isDrawingRectangle={isDrawingRectangle}
            rectangleStart={rectangleStart}
            rectangleEnd={rectangleEnd}
            background={background}
            activeArea={activeArea}
            toggleActiveCell={toggleActiveCell}
            bgBrightness={bgBrightness}
            bgBlur={bgBlur}
            bgOpacity={bgOpacity}
            showGridOverlay={showGridOverlay}
            activeLayer={activeLayer}
            selectedSprites={selectedSprites}
            handleLayoutCellErase={handleLayoutCellErase}
            handleLayoutCellClick={handleLayoutCellClick}
          />
        </div>
        {/* Layer 3: Sprites (render sprite assets) */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
          {spriteAssets.map(({ x, y, asset, rotation }) => (
            <img
              key={`sprite-${x}-${y}`}
              src={asset.src}
              alt={asset.name}
              style={{
                position: 'absolute',
                left: x * 32,
                top: y * 32,
                width: 32,
                height: 32,
                transform: `rotate(${rotation || 0}deg)`,
                pointerEvents: 'none',
              }}
            />
          ))}
        </div>
        {/* Pass sprite placing/erasing/moving handlers to GameGrid if sprite layer is active */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            background: "rgba(255,255,255,0.7)",
            borderRadius: 16,
            boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <GameGrid
            gridSize={gridSize}
            placedAssets={placedAssets}
            onDropAsset={handleDropAsset}
            selectedSprite={selectedSprite}
            onDeleteSprite={(x, y) => {
              // Only allow deletion if in the right mode and with the right tool
              if (activeLayer === 'layout' && selectedLayoutTool === 'erase') {
                handleLayoutCellErase(x, y);
              } else if (activeLayer === 'sprite' && selectedSpriteTool === 'erase') {
                handleSpriteCellErase(x, y);
              } else {
                console.log("Ignoring delete request - wrong tool selected");
              }
            }}
            onStartDragSprite={handleStartDragSprite}
            isPainting={isPainting}
            paintingAsset={paintingAsset}
            onPaintCell={handlePaintCell}
            onSpriteContextMenu={handleSpriteContextMenu}
            onSpriteClick={handleSpriteClick}
            onCellClick={activeLayer === 'sprite' ? (_e, x, y) => {
              if (selectedSpriteTool === 'erase') handleSpriteCellErase(x, y);
              // Rectangle tool is handled in handleCellClick
            } : handleCellClick}
            onTileRotate={handleTileRotate}
            onCellHover={handleCellHover}
            isDrawingRectangle={isDrawingRectangle}
            rectangleStart={rectangleStart}
            rectangleEnd={rectangleEnd}
            background={background}
            activeArea={activeArea}
            toggleActiveCell={toggleActiveCell}
            bgBrightness={bgBrightness}
            bgBlur={bgBlur}
            bgOpacity={bgOpacity}
            showGridOverlay={showGridOverlay}
            activeLayer={activeLayer}
            selectedSprites={selectedSprites}
            handleLayoutCellErase={handleLayoutCellErase}
            handleLayoutCellClick={handleLayoutCellClick}
          />
        </div>
        {/* Layer 4: UI Overlay (render UI assets) */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
          {uiAssets.map(({ x, y, asset, labelText }) => (
            asset.id === 'label' ? (
              <div
                key={`ui-${x}-${y}`}
                style={{
                  position: 'absolute',
                  left: x * 32,
                  top: y * 32,
                  width: 64,
                  height: 32,
                  background: 'rgba(255,255,200,0.9)',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: 14,
                  pointerEvents: 'none',
                  zIndex: 4,
                }}
              >
                {labelText || 'Label'}
              </div>
            ) : (
              <img
                key={`ui-${x}-${y}`}
                src={asset.src}
                alt={asset.name}
                style={{
                  position: 'absolute',
                  left: x * 32,
                  top: y * 32,
                  width: 32,
                  height: 32,
                  pointerEvents: 'none',
                  zIndex: 4,
                }}
              />
            )
          ))}
        </div>
        {/* Pass UI overlay placing/erasing/moving/editing handlers to GameGrid if UI layer is active */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            background: "rgba(255,255,255,0.7)",
            borderRadius: 16,
            boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <GameGrid
            gridSize={gridSize}
            placedAssets={placedAssets}
            onDropAsset={handleDropAsset}
            selectedSprite={selectedSprite}
            onDeleteSprite={(x, y) => {
              // Only allow deletion if in the right mode and with the right tool
              if (activeLayer === 'layout' && selectedLayoutTool === 'erase') {
                handleLayoutCellErase(x, y);
              } else if (activeLayer === 'sprite' && selectedSpriteTool === 'erase') {
                handleSpriteCellErase(x, y);
              } else {
                console.log("Ignoring delete request - wrong tool selected");
              }
            }}
            onStartDragSprite={handleStartDragSprite}
            isPainting={isPainting}
            paintingAsset={paintingAsset}
            onPaintCell={handlePaintCell}
            onSpriteContextMenu={handleSpriteContextMenu}
            onSpriteClick={activeLayer === 'ui' && selectedUiTool === 'move' ? (_e, x, y) => handleUiCellMoveStart(x, y) : handleSpriteClick}
            onCellClick={activeLayer === 'ui' ? (_e, x, y) => {
              if (selectedUiTool === 'place') handleUiCellPlace(x, y);
              if (selectedUiTool === 'erase') handleUiCellErase(x, y);
              if (selectedUiTool === 'edit') handleUiCellEdit(x, y);
              // Move handled by onSpriteClick
            } : handleCellClick}
            onTileRotate={handleTileRotate}
            onCellHover={handleCellHover}
            isDrawingRectangle={isDrawingRectangle}
            rectangleStart={rectangleStart}
            rectangleEnd={rectangleEnd}
            background={background}
            activeArea={activeArea}
            toggleActiveCell={toggleActiveCell}
            bgBrightness={bgBrightness}
            bgBlur={bgBlur}
            bgOpacity={bgOpacity}
            showGridOverlay={showGridOverlay}
            activeLayer={activeLayer}
            selectedSprites={selectedSprites}
            handleLayoutCellErase={handleLayoutCellErase}
            handleLayoutCellClick={handleLayoutCellClick}
          />
          {/* Label editing modal (simple inline for now) */}
          {editingUi && (
            <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#fff', borderRadius: 8, padding: 24, minWidth: 320, boxShadow: '0 4px 32px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h3>Edit Label</h3>
                <input
                  type="text"
                  value={editingUi.labelText}
                  onChange={e => handleUiLabelChange(e.target.value)}
                  style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', fontSize: 16 }}
                />
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button onClick={handleUiLabelSave} style={{ fontWeight: 600, background: '#60a5fa', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>Save</button>
                  <button onClick={() => setEditingUi(null)} style={{ fontWeight: 600, background: '#eee', color: '#333', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Layer 4: UI Overlay (toolbar, modals, etc.) */}
        {/* Toolbar */}
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 32,
            zIndex: 10,
            display: "flex",
            gap: 12,
            background: "rgba(255,255,255,0.85)",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "8px 16px",
            alignItems: "center",
          }}
        >
          <button
            onClick={deselectAll}
            style={{
              background: '#60a5fa',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '6px 12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
            title="Deselect all (Esc)"
          >
            ✓ Deselect
          </button>
          <button
            onClick={toggleFileLock}
            style={{
              background: isCurrentFileLocked ? '#ff6b6b' : '#60a5fa',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '6px 12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
            title={isCurrentFileLocked ? 'Unlock File' : 'Lock File'}
          >
            {isCurrentFileLocked ? '🔓' : '🔒'} {isCurrentFileLocked ? 'Unlock' : 'Lock'}
          </button>
          <button
            onClick={() => setShowSaveModal(true)}
            className="btn btn-primary"
            style={{ fontWeight: 600 }}
            disabled={isCurrentFileLocked}
          >
            Save Map
          </button>
          <button
            onClick={() => setShowLoadModal(true)}
            className="btn btn-secondary"
            style={{ fontWeight: 600 }}
          >
            Load Map
          </button>
          <button
            onClick={handleClear}
            className="btn btn-danger"
            style={{ fontWeight: 600 }}
            disabled={isCurrentFileLocked}
          >
            Clear
          </button>
          {selectedAsset && (
            <span style={{ marginLeft: 16, color: "#333" }}>
              Selected: <b>{ASSETS.find(a => a.id === selectedAsset)?.name}</b>
            </span>
          )}
          {isCurrentFileLocked && (
            <span style={{ marginLeft: 16, color: "#ff6b6b", fontWeight: "bold" }}>
              🔒 File Locked
            </span>
          )}
        </div>

        {/* Save Modal */}
        {showSaveModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
            }}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 24,
                width: 400,
                maxHeight: '90vh',
                overflow: 'auto',
              }}
            >
              <h2 style={{ margin: '0 0 16px 0', color: '#000', textAlign: 'center' }}>Save Map</h2>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#000' }}>Map Name:</label>
              <input
                type="text"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                style={{
                    width: '100%',
                  padding: 8,
                    borderRadius: 8,
                    border: '1px solid #ddd',
                  }}
                  placeholder="Enter map name"
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#000' }}>Layer Number:</label>
                <select
                  value={layerNumber || ''}
                  onChange={(e) => setLayerNumber(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: 8,
                    borderRadius: 8,
                    border: '1px solid #ddd',
                  }}
                >
                  <option value="">Select a layer</option>
                  <option value="1">L1</option>
                  <option value="2">L2</option>
                  <option value="3">L3</option>
                  <option value="4">L4</option>
                </select>
              </div>
              
              {existingMapId && (
                <div style={{ 
                  marginBottom: 16, 
                  padding: 12, 
                  background: '#fff8e1', 
                  border: '1px solid #ffd54f',
                  borderRadius: 8,
                  color: '#ff8f00'
                }}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Warning: Map already exists!</p>
                  <p style={{ margin: '8px 0 0 0' }}>A map with this name and layer number already exists. Choose an option:</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="radio"
                        name="saveMode"
                        checked={saveMode === 'update'}
                        onChange={() => setSaveMode('update')}
                      />
                      <span style={{ marginLeft: 4 }}>Update existing</span>
                  </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                        type="radio"
                        name="saveMode"
                        checked={saveMode === 'create'}
                        onChange={() => setSaveMode('create')}
                      />
                      <span style={{ marginLeft: 4 }}>Create new copy</span>
                </label>
              </div>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button
                  onClick={saveMap}
                  style={{
                    padding: '8px 16px',
                    background: '#60a5fa',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  {saveMode === 'create' ? 'Save New Map' : 'Update Map'}
                </button>
                <button
                  onClick={() => {
                    setShowSaveModal(false);
                    setMapName("");
                    setLayerNumber(null);
                    setSaveMode('create');
                    setExistingMapId(null);
                  }}
                  style={{
                    padding: '8px 16px',
                    background: '#f87171',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Load Map Modal */}
        {showLoadModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
            }}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 24,
                width: 400,
                maxHeight: '90vh',
                overflow: 'auto',
              }}
            >
              <h2 style={{ margin: '0 0 16px 0', color: '#000', textAlign: 'center' }}>Load Map</h2>
              <select
                value={selectedMap}
                onChange={(e) => setSelectedMap(e.target.value)}
                style={{
                  width: '100%',
                  padding: 8,
                  marginBottom: 16,
                  borderRadius: 8,
                  border: '1px solid #ddd',
                }}
              >
                <option value="">Select a map</option>
                {supabaseMaps.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.layer_number ? `L${map.layer_number} - ` : ''}{map.name} ({map.grid_size?.label || '16 x 12'})
                  </option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button
                  onClick={() => loadMapFromSupabase(selectedMap)}
                  disabled={!selectedMap}
                  style={{
                    padding: '8px 16px',
                    background: selectedMap ? '#60a5fa' : '#ccc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    cursor: selectedMap ? 'pointer' : 'not-allowed',
                  }}
                >
                  Load
                </button>
                <button
                  onClick={() => setShowLoadModal(false)}
                  style={{
                    padding: '8px 16px',
                    background: '#f87171',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapEditorPage;
