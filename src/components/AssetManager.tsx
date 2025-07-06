import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Image, Layout, Monitor, Eye, Film, Square } from 'lucide-react';
import { AnimationEditor } from './AnimationEditor';
import { SpriteLibrary } from './SpriteLibrary';
import { AnimationLibrary } from './AnimationLibrary';
import { supabase } from '../lib/supabase';
import { initializeStorage } from '../utils/storageHelpers';
import { SpriteAnimation } from '../types/game';

interface AssetManagerProps {
  onBack: () => void;
}

interface AnimationData {
  name: string;
  frames: string[];
  settings: {
    speed: number;
    loop: boolean;
    pingPong: boolean;
    reverse: boolean;
  };
}

// Basic tile types for the palette
const TILE_TYPES = [
  { id: 'floor', label: 'Floor', color: 'bg-gray-200' },
  { id: 'wall', label: 'Wall', color: 'bg-gray-700' },
  { id: 'hero', label: 'Hero', color: 'bg-yellow-400' },
  { id: 'exit', label: 'Exit', color: 'bg-green-400' },
  { id: 'treasure', label: 'Treasure', color: 'bg-yellow-600' },
  { id: 'generator', label: 'Generator', color: 'bg-red-500' },
];

function TilemapEditor({ isOpen, onClose, initialData, onSave }: { isOpen: boolean; onClose: () => void; initialData?: any; onSave?: () => void }) {
  const [selectedTile, setSelectedTile] = useState('floor');
  const [width, setWidth] = useState(initialData?.width || 4);
  const [height, setHeight] = useState(initialData?.height || 4);
  const [grid, setGrid] = useState(
    initialData?.grid || Array.from({ length: 4 }, () => Array(4).fill('floor'))
  );
  const [mapName, setMapName] = useState(initialData?.name || '');
  const [success, setSuccess] = useState(false);
  const [editMode] = useState(!!initialData);
  const [showNameError, setShowNameError] = useState(false);
  const [duplicateNameError, setDuplicateNameError] = useState(false);
  const [originalId] = useState(initialData?.id || null);
  const [zoom, setZoom] = useState(1.0); // Zoom factor, 1.0 = 100%
  const [fullscreen, setFullscreen] = useState(false);
  const gridContainerRef = React.useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(null);
  const [scrollStart, setScrollStart] = useState<{ left: number; top: number } | null>(null);
  const [spacePressed, setSpacePressed] = useState(false);
  const [traceImage, setTraceImage] = useState<string | null>(null);
  const [traceOpacity, setTraceOpacity] = useState(0.4);
  const [traceVisible, setTraceVisible] = useState(true);

  // Update grid size when width/height changes
  React.useEffect(() => {
    setGrid((prev: string[][]) => {
      const newGrid: string[][] = [];
      for (let y = 0; y < height; y++) {
        if (prev[y]) {
          newGrid.push([...prev[y].slice(0, width), ...Array(Math.max(0, width - prev[y].length)).fill('floor')]);
        } else {
          newGrid.push(Array(width).fill('floor'));
        }
      }
      return newGrid;
    });
  }, [width, height]);

  React.useEffect(() => {
    if (initialData) {
      setWidth(initialData.width);
      setHeight(initialData.height);
      setGrid(initialData.grid);
      setMapName(initialData.name);
    }
  }, [initialData]);

  // Ensure grid matches width/height
  React.useEffect(() => {
    setGrid((prev: string[][]) => {
      const trimmed = prev.slice(0, height).map((row: string[]) => row.slice(0, width));
      // Add new rows if needed
      while (trimmed.length < height) trimmed.push(Array(width).fill('floor'));
      // Add new columns if needed
      for (let y = 0; y < trimmed.length; y++) {
        while (trimmed[y].length < width) trimmed[y].push('floor');
      }
      return trimmed;
    });
  }, [width, height]);

  const handleCellClick = (x: number, y: number) => {
    setGrid((prev: string[][]) => prev.map((row: string[], rowIdx: number) =>
      rowIdx === y ? row.map((cell: string, colIdx: number) => colIdx === x ? selectedTile : cell) : row
    ));
  };

  const handleSave = () => {
    if (!mapName.trim()) {
      setShowNameError(true);
      setDuplicateNameError(false);
      return;
    }
    let existing = JSON.parse(localStorage.getItem('tilemaps') || '[]');
    const isDuplicate = existing.some((tm: unknown) => (tm as {name: string, id: string}).name === mapName.trim() && (!editMode || (tm as {id: string}).id !== originalId));
    if (isDuplicate) {
      setDuplicateNameError(true);
      setShowNameError(false);
      return;
    }
    setShowNameError(false);
    setDuplicateNameError(false);
    let tilemap: unknown;
    if (editMode) {
      tilemap = { name: mapName.trim(), width, height, grid, id: originalId };
      existing = existing.map((tm: unknown) => (tm as {id: string}).id === originalId ? tilemap : tm);
    } else {
      tilemap = { name: mapName.trim(), width, height, grid, id: generateId() };
      existing = [...existing, tilemap];
    }
    localStorage.setItem('tilemaps', JSON.stringify(existing));
    if (onSave) onSave();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1000);
  };

  // Mouse event handlers for panning
  const handleGridMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!fullscreen || !spacePressed) return;
    e.preventDefault();
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
    if (gridContainerRef.current) {
      setScrollStart({
        left: gridContainerRef.current.scrollLeft,
        top: gridContainerRef.current.scrollTop,
      });
    }
  };
  const handleGridMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || !panStart || !scrollStart) return;
    if (gridContainerRef.current) {
      gridContainerRef.current.scrollLeft = scrollStart.left - (e.clientX - panStart.x);
      gridContainerRef.current.scrollTop = scrollStart.top - (e.clientY - panStart.y);
    }
  };
  const handleGridMouseUp = () => {
    setIsPanning(false);
    setPanStart(null);
    setScrollStart(null);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpacePressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpacePressed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  if (!isOpen) return null;
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 ${fullscreen ? 'p-0' : 'p-4'}`}>
      <div
        className={
          fullscreen
            ? 'bg-white w-screen h-screen max-w-none max-h-none flex flex-col rounded-none'
            : 'bg-white rounded-xl shadow-2xl p-6 w-[875px] h-[875px] max-w-full max-h-[95vh] flex flex-col'
        }
      >
        <div className="flex items-center justify-between mb-2 px-4 pt-2">
          <h2 className="text-xl font-bold">Tilemap Editor</h2>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
              onClick={() => setFullscreen(f => !f)}
            >
              {fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          </div>
        </div>
        {/* Controls Row: Map Name, Width/Height, Zoom, Trace Overlay */}
        <div className="flex flex-wrap items-center gap-3 mb-2 px-4">
          <div className="flex items-center gap-2">
            <label className="font-medium">Map Name:</label>
            <input
              type="text"
              value={mapName}
              onChange={e => { setMapName(e.target.value); setShowNameError(false); }}
              className="px-2 py-1 border rounded w-48"
              placeholder="Enter map name..."
              disabled={editMode}
              style={{ minWidth: 0 }}
            />
          </div>
          <div className="flex items-center gap-1">
            <label>Width:</label>
            <input
              type="number"
              min={5}
              max={30}
              value={width}
              onChange={e => setWidth(Math.max(5, Math.min(30, Number(e.target.value))))}
              className="w-14 px-2 py-1 border rounded"
            />
            <label>Height:</label>
            <input
              type="number"
              min={5}
              max={30}
              value={height}
              onChange={e => setHeight(Math.max(5, Math.min(30, Number(e.target.value))))}
              className="w-14 px-2 py-1 border rounded"
            />
          </div>
          <div className="flex items-center gap-2 ml-2">
            <span className="font-medium">Zoom:</span>
            <button
              className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setZoom(z => Math.max(0.2, z - 0.1))}
              type="button"
            >
              -
            </button>
            <input
              type="range"
              min={0.2}
              max={2}
              step={0.01}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              style={{ width: 80 }}
            />
            <button
              className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setZoom(z => Math.min(2, z + 0.1))}
              type="button"
            >
              +
            </button>
            <span className="w-10 text-right">{Math.round(zoom * 100)}%</span>
          </div>
          {/* Trace Overlay Controls */}
          <label className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg cursor-pointer">
            Upload Trace Image
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setTraceImage(ev.target?.result as string);
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
            />
          </label>
          {traceImage && (
            <>
              <button
                className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
                onClick={() => setTraceImage(null)}
              >
                Remove Trace
              </button>
              <label className="ml-2 flex items-center gap-1">
                Opacity:
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={traceOpacity}
                  onChange={e => setTraceOpacity(Number(e.target.value))}
                />
                {Math.round(traceOpacity * 100)}%
              </label>
              <label className="ml-2 flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={traceVisible}
                  onChange={e => setTraceVisible(e.target.checked)}
                />
                Show Trace
              </label>
            </>
          )}
        </div>
        {showNameError && <div className="mb-1" style={{ color: '#dc2626', fontSize: '1.125rem' }}>Add a file name</div>}
        {duplicateNameError && <div className="mb-1" style={{ color: '#dc2626', fontSize: '1.125rem' }}>File name already exists!</div>}
        {/* Palette */}
        <div className="flex space-x-2 mb-2 px-4">
          {TILE_TYPES.map(tile => (
            <button
              key={tile.id}
              onClick={() => setSelectedTile(tile.id)}
              className={`px-3 py-1 rounded ${tile.color} ${selectedTile === tile.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              {tile.label}
            </button>
          ))}
        </div>
        {/* Grid with Trace Overlay */}
        <div className="flex-1 w-full flex justify-center items-start overflow-y-auto bg-gray-100" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <div
            ref={gridContainerRef}
            className="relative"
            style={{
              padding: '8px',
              margin: '4px',
              background: 'white',
              borderRadius: '4px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            onMouseDown={handleGridMouseDown}
            onMouseMove={handleGridMouseMove}
            onMouseUp={handleGridMouseUp}
            onMouseLeave={handleGridMouseUp}
          >
            <div style={{ 
              position: 'relative',
              transform: `scale(${zoom})`,
              transformOrigin: 'center',
              margin: 'auto'
            }}>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div
                  className="grid gap-px bg-white rounded-lg shadow-md"
                  style={{
                    gridTemplateColumns: `repeat(${width + 1}, 32px)`,
                    padding: '8px',
                    boxSizing: 'border-box',
                    width: 'fit-content'
                  }}
                >
                  {/* Top-left empty cell */}
                  <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
                  {/* Column numbers */}
                  {Array.from({ length: width }).map((_, x) => (
                    <div
                      key={`colnum-${x}`}
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        color: '#bbb', 
                        fontSize: '0.875rem',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        userSelect: 'none'
                      }}
                    >
                      {x + 1}
                    </div>
                  ))}
                  {/* Grid cells */}
                  {Array.from({ length: height }).map((_, y) => [
                    <div
                      key={`rownum-${y}`}
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        color: '#bbb', 
                        fontSize: '0.875rem',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        userSelect: 'none'
                      }}
                    >
                      {y + 1}
                    </div>,
                    ...Array.from({ length: width }).map((_, x) => (
                      <div
                        key={`${x}-${y}`}
                        data-cell="1"
                        onClick={() => handleCellClick(x, y)}
                        className={`flex items-center justify-center border cursor-pointer ${TILE_TYPES.find(t => t.id === (grid[y] && grid[y][x]))?.color}`}
                        style={{ 
                          width: '32px', 
                          height: '32px',
                          boxSizing: 'border-box'
                        }}
                        title={grid[y] && grid[y][x]}
                      >
                        {(grid[y] && grid[y][x]) === 'hero' ? '🧑' : (grid[y] && grid[y][x]) === 'exit' ? '🚪' : (grid[y] && grid[y][x]) === 'treasure' ? '💰' : (grid[y] && grid[y][x]) === 'generator' ? 'GEN' : ''}
                      </div>
                    ))
                  ])}
                </div>
              </div>
              {traceImage && traceVisible && (
                <div
                  style={{
                    position: 'absolute',
                    top: '40px',
                    left: '40px',
                    width: `${(width * 32) + (width - 4)}px`,
                    height: `${(30 * 32) + 27}px`, // Reduced by 3px (from +30 to +27)
                    opacity: traceOpacity,
                    pointerEvents: 'none',
                    zIndex: 10,
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                  }}
                >
                  <img
                    src={traceImage}
                    alt="Trace Overlay"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'fill',
                      imageRendering: 'pixelated',
                      display: 'block'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
}

function exportTilemap(tilemap: unknown, format: 'json' | 'ascii') {
  const t = tilemap as { id: string; name: string; width?: number; height?: number; grid?: any };
  let data = '';
  let filename = t.name;
  if (format === 'json') {
    data = JSON.stringify(t, null, 2);
    filename += '.json';
  } else {
    // ASCII export
    const tileChar: Record<string, string> = {
      floor: ' ', wall: '#', hero: '@', exit: 'E', treasure: '+', generator: 'm',
    };
    data = t.grid.map((row: string[]) => row.map(cell => tileChar[cell] || '?').join('')).join('\n');
    filename += '.txt';
  }
  const blob = new Blob([data], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

function parseAsciiTilemap(ascii: string, name: string) {
  const lines = ascii.trim().split(/\r?\n/);
  const height = lines.length;
  const width = lines[0]?.length || 0;
  const charTile: Record<string, string> = {
    ' ': 'floor', '#': 'wall', '@': 'hero', 'E': 'exit', '+': 'treasure', 'm': 'generator',
  };
  const grid = lines.map(line => line.split('').map(char => charTile[char] || 'floor'));
  return { name, width, height, grid };
}

// Utility to generate a unique id
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export const AssetManager: React.FC<AssetManagerProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'sprites' | 'animations' | 'backgrounds' | 'ui' | 'icons'>('all');
  const [sprites, setSprites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [spriteName, setSpriteName] = useState('');
  const [animations, setAnimations] = useState<AnimationData[]>([]);
  const [isTilemapEditorOpen, setIsTilemapEditorOpen] = useState(false);
  const [savedTilemaps, setSavedTilemaps] = useState(() => {
    try {
      let maps = JSON.parse(localStorage.getItem('tilemaps') || '[]');
      let changed = false;
      maps = maps.map((tm: unknown) => {
        const t = tm as { id: string };
        if (!t.id) { changed = true; return { ...t, id: generateId() }; }
        return t;
      });
      if (changed) localStorage.setItem('tilemaps', JSON.stringify(maps));
      return maps;
    } catch {
      return [];
    }
  });
  const [editTilemap, setEditTilemap] = useState<unknown | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [bulkImportMessage, setBulkImportMessage] = useState<string | null>(null);
  const [ocrMessage, setOcrMessage] = useState<string | null>(null);
  const [ocrAscii, setOcrAscii] = useState<string | null>(null);
  const [ocrMapName, setOcrMapName] = useState<string>('Imported OCR Map');
  const [isOcrEditorOpen, setIsOcrEditorOpen] = useState(false);

  useEffect(() => {
    const loadSprites = async () => {
      try {
        setLoading(true);
        
        // Initialize storage connection
        await initializeStorage();
        
        // Fetch sprites from Supabase
        const { data, error } = await supabase
          .from('sprites')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (error) {
          setError('Failed to load sprites');
          setSprites([]);
        } else {
          setSprites(data || []);
        }
      } catch (err) {
        setError('Failed to load sprites');
        setSprites([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadSprites();
  }, []);

  const handleCreateSprite = () => {
    // Open the animation editor instead of navigating to another page
    setSpriteName('New Sprite');
    setAnimations([]);
    setIsEditorOpen(true);
  };

  const handleCreateTilemap = () => {
    // Navigate to tilemap creator
    // For now, we'll just show an alert
    alert('Tilemap creator not implemented yet');
  };

  const filteredSprites = sprites.filter(sprite => {
    if (searchQuery) {
      return sprite.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'all':
        return sprites.length;
      case 'sprites':
      case 'animations':
      case 'backgrounds':
      case 'ui':
      case 'icons':
        return 0; // For now, we don't have categorization
      default:
        return 0;
    }
  };

  // If the editor is open, render the AnimationEditor component
  if (isEditorOpen) {
    return (
      <AnimationEditor
        isOpen={true}
        onClose={() => setIsEditorOpen(false)}
        spriteName={spriteName}
        onSpriteNameChange={setSpriteName}
        animations={animations}
        onAnimationsUpdate={setAnimations}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-4 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <Image className="w-6 h-6 text-white" />
          <h1 className="text-2xl font-bold text-white">Asset Manager</h1>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleCreateSprite}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            Create Sprite
          </button>
          
          <button
            onClick={handleCreateTilemap}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Create Level/Tilemap
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-6 py-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-white bg-opacity-20 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:border-white"
          />
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-white opacity-60" />
          <button className="absolute right-3 top-2.5 p-1 rounded-md bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors">
            <Search className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Asset Tabs */}
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Assets', icon: Image },
            { id: 'sprites', label: 'Sprites', icon: Image },
            { id: 'animations', label: 'Animations', icon: Film },
            { id: 'backgrounds', label: 'Backgrounds', icon: Square },
            { id: 'ui', label: 'UI Elements', icon: Monitor },
            { id: 'icons', label: 'Icons', icon: Eye }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`
                flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors
                ${activeTab === id
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'bg-white bg-opacity-10 text-white text-opacity-70 hover:bg-opacity-15'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
              <span className="bg-white bg-opacity-20 text-xs px-2 py-0.5 rounded-full">
                {getTabCount(id)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      <div className="container mx-auto px-6 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-4">Loading assets...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-white">
            <p className="text-red-200">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : filteredSprites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredSprites.map((sprite) => (
              <div 
                key={sprite.id} 
                className="bg-white bg-opacity-10 rounded-lg overflow-hidden hover:bg-opacity-15 transition-all cursor-pointer"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
                  {sprite.animations && sprite.animations[0]?.frames?.length > 0 ? (
                    <img 
                      src={sprite.animations[0].frames[0]} 
                      alt={sprite.name}
                      className="max-w-full max-h-full object-contain"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  ) : (
                    <Image className="w-16 h-16 text-white opacity-30" />
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-white font-medium truncate">{sprite.name}</h3>
                  <p className="text-white text-opacity-60 text-sm">
                    {sprite.animations?.length || 0} animations
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-white opacity-30 mx-auto mb-4" />
            <p className="text-white text-opacity-80 text-lg">No sprites found</p>
            <p className="text-white text-opacity-60 mt-2">
              Create a new sprite or import existing ones
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={handleCreateSprite}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                Create New Sprite
              </button>
              <button
                onClick={() => {}}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Import Map
              </button>
              <button
                onClick={() => {}}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                Bulk Import Maps
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Saved Tilemaps Section */}
      <div className="container mx-auto px-6 py-6">
        <h2 className="text-xl font-bold text-white mb-4">Saved Tilemaps</h2>
        
        <div className="text-white">
          <p>No tilemaps saved yet.</p>
        </div>
      </div>
    </div>
  );
};