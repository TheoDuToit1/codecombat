import { useState, useEffect, useRef } from 'react';
import { listAnimations, deleteAnimation } from '../utils/supabaseAnimationSaver';
import { SPRITE_CATEGORIES } from '../utils/spriteSheetSaver';
import { Asset } from '../services/AssetLibraryService';
import AssetViewModal from './AssetViewModal';

// Use the new categories from spriteSheetSaver
const CATEGORIES = SPRITE_CATEGORIES;

interface AssetLibraryProps {
  onAssetSelect?: (asset: Asset) => void;
  onAssetDelete?: (asset: Asset) => void;
  selectedAssetId?: string;
  compact?: boolean;
}

export default function AssetLibrary({ 
  onAssetSelect, 
  onAssetDelete,
  selectedAssetId,
  compact = false
}: AssetLibraryProps = {}) {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewAsset, setViewAsset] = useState<any | null>(null);
  const [editAsset, setEditAsset] = useState<any | null>(null);
  const [deleteAsset, setDeleteAsset] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [animatedAssets, setAnimatedAssets] = useState<Record<string, number>>({});
  const animationTimers = useRef<Record<string, number>>({});

  const refreshAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Refreshing assets from Supabase...");
      const supabaseAssets = await listAnimations();
      console.log("Received assets:", supabaseAssets);
      setAssets(supabaseAssets || []);
    } catch (err) {
      console.error("Error loading assets:", err);
      setError('Failed to load assets from Supabase');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAssets();
  }, []);

  // Helper function to get frame sources from an asset
  const getFrameSources = (asset: any): string[] => {
    if (asset.data?.frames && Array.isArray(asset.data.frames) && asset.data.frames.length > 0) {
      return asset.data.frames.map((frame: any) => {
        if (typeof frame === 'string') return frame;
        return frame.data || '';
      });
    } else if (asset.animations?.frames) {
      return asset.animations.frames;
    }
    return [];
  };

  // Setup animation for thumbnails
  useEffect(() => {
    // Clear existing timers
    Object.values(animationTimers.current).forEach(timerId => window.clearInterval(timerId));
    animationTimers.current = {};
    
    // Initialize animation state for each asset
    const initialAnimState: Record<string, number> = {};
    
    assets.forEach(asset => {
      const frames = getFrameSources(asset);
      if (frames.length > 1) {
        initialAnimState[asset.id] = 0;
        
        // Create animation timer for this asset
        animationTimers.current[asset.id] = window.setInterval(() => {
          setAnimatedAssets(prev => ({
            ...prev,
            [asset.id]: (prev[asset.id] + 1) % frames.length
          }));
        }, 300) as unknown as number;
      }
    });
    
    setAnimatedAssets(initialAnimState);
    
    return () => {
      // Clean up all timers
      Object.values(animationTimers.current).forEach(timerId => window.clearInterval(timerId));
    };
  }, [assets]);

  // Unique tags from all assets
  const allTags = Array.from(
    new Set(assets.flatMap(asset => asset.tags || []))
  ).sort();

  // Filtering logic
  const filteredAssets = assets.filter(asset => {
    // Don't show any assets on startup, only when search or filters are applied
    if (selectedCategories.length === 0 && selectedTags.length === 0 && searchTerm === '') {
      return false;
    }
    // Category filter (AND logic: must match all selected categories)
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.every(cat => (asset.categories || []).includes(cat));
    // Tag filter (AND logic: must match all selected tags)
    const matchesTag =
      selectedTags.length === 0 ||
      selectedTags.every(tag => (asset.tags || []).includes(tag));
    // Search filter
    const matchesSearch =
      searchTerm === '' ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.tags || []).some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (asset.categories || []).some((cat: string) => cat.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesTag && matchesSearch;
  });

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSearchTerm('');
  };

  // Delete asset handler
  const handleDelete = async (asset: any) => {
    if (onAssetDelete) {
      onAssetDelete(asset);
      return;
    }
    
    // Default delete behavior if no onAssetDelete provided
    setDeleting(true);
    try {
      await deleteAnimation(asset.id);
      setDeleteAsset(null);
      await refreshAssets();
    } catch (err) {
      alert('Failed to delete asset.');
    } finally {
      setDeleting(false);
    }
  };

  // Handle view button click
  const handleViewClick = (asset: any) => {
    console.log("View button clicked for asset:", asset);
    if (onAssetSelect) {
      console.log("Using onAssetSelect handler");
      onAssetSelect(asset);
    } else {
      console.log("Setting viewAsset state:", asset);
      setViewAsset(asset);
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={clearFilters}
          className="ml-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
        >
          Clear Filters
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-4 overflow-x-auto">
        <div className="flex gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                selectedCategories.includes(cat)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (searchTerm.length > 0 || selectedCategories.length > 0) && (
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap backdrop-blur-md border transition-all
                  ${selectedTags.includes(tag)
                    ? 'bg-orange-400/40 border-orange-400 shadow-lg text-white'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}
                `}
                style={{ boxShadow: selectedTags.includes(tag) ? '0 2px 8px 0 rgba(0,0,0,0.10)' : undefined }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Asset Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-400">Loading assets...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-800 text-red-300 p-4 rounded-lg mb-4">
          <p>{error}</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
          {searchTerm.length > 0 || selectedCategories.length > 0 || selectedTags.length > 0 ? (
            <>
              <h3 className="text-lg font-medium text-gray-300">No assets found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your filters or search.</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-300">Enter a search term to view assets</h3>
              <p className="text-gray-500 mt-1">Use the search bar above to find assets.</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map(asset => {
            const frames = getFrameSources(asset);
            const frameCount = frames.length;
            const currentFrame = frameCount > 1 && asset.id in animatedAssets
              ? frames[animatedAssets[asset.id]]
              : frames[0];
            return (
              <div
                key={asset.id}
                className={compact ? "bg-gray-700 rounded-lg p-2 mb-2 flex flex-col items-center cursor-pointer w-20" : "bg-gray-700 rounded-lg p-4 mb-4 flex flex-col items-center cursor-pointer"}
                draggable={true}
                onDragStart={() => onAssetSelect && onAssetSelect(asset)}
                onClick={() => handleViewClick(asset)}
                style={compact ? { fontSize: '0.75rem', minWidth: 0, maxWidth: '5rem' } : {}}
              >
                <img
                  src={currentFrame}
                  alt={asset.name}
                  className={compact ? "w-12 h-12 object-contain mb-1" : "w-20 h-20 object-contain mb-2"}
                />
                <div className="truncate text-white font-semibold" style={compact ? { fontSize: '0.7rem' } : {}}>{asset.name}</div>
                {compact ? null : <div className="text-xs text-gray-400 mb-1">Categories: {(asset.categories || []).join(', ')}</div>}
                {compact ? null : <div className="text-xs text-gray-400 mb-1">Created: {new Date(asset.created_at).toLocaleDateString()}</div>}
                {compact ? null : (
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(asset); }}
                    className="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    disabled={deleting}
                  >
                    Delete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* View Modal */}
      {viewAsset && (
        <AssetViewModal
          asset={viewAsset}
          onClose={() => setViewAsset(null)}
          onEdit={() => {
            setViewAsset(null);
            setEditAsset(viewAsset);
          }}
          onDelete={() => {
            setViewAsset(null);
            setDeleteAsset(viewAsset);
          }}
        />
      )}

      {/* Edit Modal (placeholder) */}
      {editAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
              onClick={() => setEditAsset(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-white">Edit: {editAsset.name}</h2>
            <div className="mb-2 text-gray-300">(Edit form coming soon...)</div>
            <pre className="bg-gray-800 text-gray-200 rounded p-2 text-xs overflow-x-auto mt-4">{JSON.stringify(editAsset, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl p-8 w-full max-w-sm relative">
            <h2 className="text-xl font-bold mb-4 text-white">Delete Asset</h2>
            <div className="mb-4 text-gray-300">Are you sure you want to delete <span className="font-semibold">{deleteAsset.name}</span>?</div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                onClick={() => setDeleteAsset(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleDelete(deleteAsset)}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 