import React, { useState, useEffect } from "react";
import { Play, Edit, Trash, ExternalLink } from 'lucide-react';
import { listAnimations } from '../utils/supabaseAnimationSaver';
import { loadAnimationsFromLocalStorage } from '../utils/simpleSave';
import { AnimationEditor } from './AnimationEditor';

interface AnimationItem {
  id: string;
  name: string;
  animations?: any[];
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  source: 'supabase' | 'local';
}

interface AnimationPreviewModalProps {
  animation: AnimationItem;
  onClose: () => void;
}

const AnimationPreviewModal: React.FC<AnimationPreviewModalProps> = ({ animation, onClose }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const animationFrames = animation.animations?.[0]?.frames || [];
  const speed = animation.animations?.[0]?.settings?.speed || 10;
  
  useEffect(() => {
    if (!isPlaying || animationFrames.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % animationFrames.length);
    }, 1000 / speed);
    
    return () => clearInterval(interval);
  }, [isPlaying, animationFrames.length, speed]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl p-6 w-[500px] max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{animation.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex justify-center mb-4">
          {animationFrames.length > 0 ? (
            <div className="bg-gray-800 p-4 rounded-lg">
              <img 
                src={animationFrames[currentFrame]} 
                alt={`Frame ${currentFrame}`}
                className="max-w-full max-h-[300px]"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          ) : (
            <div className="text-gray-400 p-4">No frames available</div>
          )}
        </div>
        
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
          >
            Close
          </button>
        </div>
        
        {animationFrames.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <div className="flex space-x-2">
              {animationFrames.map((frame: string, idx: number) => (
                <div 
                  key={idx}
                  className={`w-12 h-12 border-2 cursor-pointer ${currentFrame === idx ? 'border-blue-500' : 'border-gray-700'}`}
                  onClick={() => {
                    setCurrentFrame(idx);
                    setIsPlaying(false);
                  }}
                >
                  <img 
                    src={frame} 
                    alt={`Thumbnail ${idx}`}
                    className="w-full h-full object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AnimationLibrary: React.FC = () => {
  const [animations, setAnimations] = useState<AnimationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnimation, setSelectedAnimation] = useState<AnimationItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [spriteName, setSpriteName] = useState('');
  const [animationData, setAnimationData] = useState<any[]>([]);
  
  const loadAnimations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load from Supabase
      let supabaseAnimations: AnimationItem[] = [];
      try {
        const data = await listAnimations();
        if (data) {
          supabaseAnimations = data.map(item => ({
            ...item,
            source: 'supabase' as const
          }));
        }
      } catch (err) {
        console.error('Error loading from Supabase:', err);
      }
      
      // Load from local storage
      const localAnimations = loadAnimationsFromLocalStorage().map((item: unknown) => ({
        ...(item as { id: string }),
        source: 'local' as const
      }));
      
      // Combine and sort by date (newest first)
      const allAnimations = [...supabaseAnimations, ...localAnimations].sort((a, b) => {
        const dateA = new Date(a.updated_at || a.updatedAt || a.created_at || a.createdAt || 0);
        const dateB = new Date(b.updated_at || b.updatedAt || b.created_at || b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setAnimations(allAnimations);
    } catch (err) {
      console.error('Error loading animations:', err);
      setError('Failed to load animations. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadAnimations();
  }, []);
  
  const handlePreviewAnimation = (animation: AnimationItem) => {
    setSelectedAnimation(animation);
  };
  
  const handleEditAnimation = (animation: AnimationItem) => {
    setSpriteName(animation.name);
    setAnimationData(animation.animations || []);
    setIsEditMode(true);
  };
  
  const handleDeleteAnimation = async (animation: AnimationItem) => {
    if (!window.confirm(`Are you sure you want to delete "${animation.name}"?`)) {
      return;
    }
    
    try {
      if (animation.source === 'supabase') {
        // Delete from Supabase
        const { deleteAnimation } = await import('../utils/supabaseAnimationSaver');
        await deleteAnimation(animation.id);
      } else {
        // Delete from local storage
        const localAnimations = loadAnimationsFromLocalStorage();
        const updatedAnimations = localAnimations.filter((item: unknown) => (item as {id: string}).id !== animation.id);
        localStorage.setItem('animations', JSON.stringify(updatedAnimations));
      }
      
      // Refresh the list
      loadAnimations();
    } catch (err) {
      console.error('Error deleting animation:', err);
      setError('Failed to delete animation. Please try again.');
    }
  };
  
  if (isEditMode) {
    return (
      <AnimationEditor
        isOpen={true}
        onClose={() => setIsEditMode(false)}
        spriteName={spriteName}
        onSpriteNameChange={setSpriteName}
        animations={animationData}
        onAnimationsUpdate={setAnimationData}
      />
    );
  }
  
  return (
    <div>
      {error && (
        <div className="bg-red-500/20 text-white p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center text-white py-12">
          Loading animations...
        </div>
      ) : animations.length === 0 ? (
        <div className="text-center text-white/60 py-12">
          No animations found. Create a new animation to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {animations.map(animation => (
            <div 
              key={animation.id} 
              className="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-semibold truncate">{animation.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${animation.source === 'supabase' ? 'bg-blue-500/20 text-blue-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                    {animation.source === 'supabase' ? 'Supabase' : 'Local'}
                  </span>
                </div>
                
                <div 
                  className="bg-gray-900 h-32 flex items-center justify-center mb-2 cursor-pointer"
                  onClick={() => handlePreviewAnimation(animation)}
                >
                  {animation.animations?.[0]?.frames?.[0] ? (
                    <img 
                      src={animation.animations[0].frames[0]} 
                      alt={animation.name}
                      className="max-h-full max-w-full"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  ) : (
                    <div className="text-gray-400">No preview</div>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => handlePreviewAnimation(animation)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    title="Preview"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleEditAnimation(animation)}
                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteAnimation(animation)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    title="Delete"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedAnimation && (
        <AnimationPreviewModal 
          animation={selectedAnimation} 
          onClose={() => setSelectedAnimation(null)} 
        />
      )}
    </div>
  );
};
