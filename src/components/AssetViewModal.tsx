import React, { useState, useEffect } from 'react';

interface AssetViewModalProps {
  asset: any;
  onClose: () => void;
  onEdit?: (asset: any) => void;
  onDelete?: (asset: any) => void;
}

// Helper to get all frame sources from asset
function getAllFrameSources(asset: any): string[] {
  if (asset.data?.frames && Array.isArray(asset.data.frames) && asset.data.frames.length > 0) {
    return asset.data.frames.map((frame: any) =>
      typeof frame === 'string' ? frame : frame.data || ''
    );
  } else if (asset.animations?.frames && Array.isArray(asset.animations.frames)) {
    return asset.animations.frames;
  }
  return [];
}

const AssetViewModal: React.FC<AssetViewModalProps> = ({ 
  asset, 
  onClose,
  onEdit,
  onDelete
}) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // Auto-play

  const frameSources = getAllFrameSources(asset);
  const framesCount = frameSources.length;

  // Animation playback effect
  useEffect(() => {
    if (!isPlaying || framesCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentFrameIndex(prev => (prev + 1) % framesCount);
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying, framesCount]);

  // Reset frame index and auto-play when viewing a new asset
  useEffect(() => {
    setCurrentFrameIndex(0);
    setIsPlaying(framesCount > 1);
  }, [asset, framesCount]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl p-8 w-full max-w-2xl relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-white">{asset.name}</h2>
        {/* Asset Preview */}
        <div className="mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex justify-center items-center mb-4" style={{ height: '400px' }}>
            {frameSources.length > 0 ? (
              <img 
                src={frameSources[currentFrameIndex]} 
                alt={`Frame ${currentFrameIndex}`} 
                className="max-h-full max-w-full object-contain"
              />
            ) : asset.spriteSheet ? (
              <img 
                src={asset.spriteSheet} 
                alt="Sprite Sheet" 
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-gray-400">
                <div>No preview available</div>
                <pre className="text-xs mt-2 overflow-auto max-h-40 bg-slate-900 p-2 rounded">
                  {JSON.stringify(asset, null, 2)}
                </pre>
              </div>
            )}
          </div>
          {/* Animation Controls */}
          {framesCount > 1 && (
            <div className="flex justify-center items-center gap-4 mb-4">
              <button 
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <div className="text-white">
                Frame: {currentFrameIndex + 1} / {framesCount}
              </div>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-600"
                  onClick={() => setCurrentFrameIndex(prev => (prev === 0 ? framesCount - 1 : prev - 1))}
                >
                  &lt;
                </button>
                <button 
                  className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-600"
                  onClick={() => setCurrentFrameIndex(prev => (prev + 1) % framesCount)}
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
          {/* Frame Thumbnails */}
          {framesCount > 1 && (
            <div className="flex gap-2 overflow-x-auto p-2 bg-slate-800 rounded-lg">
              {frameSources.map((src: string, idx: number) => (
                <img 
                  key={idx}
                  src={src}
                  alt={`Thumbnail ${idx}`}
                  className={`h-16 w-16 object-contain cursor-pointer border-2 ${currentFrameIndex === idx ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setCurrentFrameIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>
        {/* Asset Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Details</h3>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="mb-2">
                <span className="text-gray-400">Categories:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(asset.categories || []).map((cat: string) => (
                    <span key={cat} className="bg-blue-900 text-blue-200 px-2 py-0.5 rounded text-xs">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <span className="text-gray-400">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(asset.tags || []).map((tag: string) => (
                    <span key={tag} className="bg-orange-900 text-orange-200 px-2 py-0.5 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-gray-400 text-sm">
                <div>Created: {asset.created_at ? new Date(asset.created_at).toLocaleString() : 'N/A'}</div>
                <div>Updated: {asset.updated_at ? new Date(asset.updated_at).toLocaleString() : 'N/A'}</div>
                {asset.data?.frameWidth && asset.data?.frameHeight && (
                  <div>Frame Size: {asset.data.frameWidth}×{asset.data.frameHeight}</div>
                )}
                {framesCount > 0 && (
                  <div>Frame Count: {framesCount}</div>
                )}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Actions</h3>
            <div className="bg-slate-800 rounded-lg p-4 flex flex-col gap-2">
              {onEdit && (
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2"
                  onClick={() => onEdit(asset)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit Asset
                </button>
              )}
              {onDelete && (
                <button 
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center gap-2"
                  onClick={() => onDelete(asset)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  Delete Asset
                </button>
              )}
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                onClick={onClose}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetViewModal; 