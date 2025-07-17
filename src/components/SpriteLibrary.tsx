import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Play, Pause, Trash, Image } from 'lucide-react';

interface SpriteData {
  id: string;
  name: string;
  animations: Array<{
    name: string;
    frames: string[];
    settings: {
      speed: number;
      loop: boolean;
      pingPong: boolean;
      reverse: boolean;
    };
  }>;
}

export const SpriteLibrary: React.FC = () => {
  const [sprites, setSprites] = useState<SpriteData[]>([]);
  const [playingAnimations, setPlayingAnimations] = useState<Record<string, boolean>>({});
  const [currentFrames, setCurrentFrames] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Load sprites from Supabase
  useEffect(() => {
    const loadSprites = async () => {
      try {
        const { data, error } = await supabase
          .from('sprites')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Filter out sprites with no animations or frames
        const validSprites = (data || []).filter(sprite => 
          sprite.animations?.length > 0 && 
          sprite.animations.some(anim => anim.frames?.length > 0)
        );
        
        setSprites(validSprites);
      } catch (err) {
        console.error('Error loading sprites:', err);
        setError('Failed to load sprites');
      } finally {
        setLoading(false);
      }
    };

    loadSprites();
  }, []);

  // Handle animation playback
  useEffect(() => {
    const animationFrames: Record<string, number> = {};

    const updateFrame = (spriteId: string, animationName: string) => {
      if (!playingAnimations[`${spriteId}-${animationName}`]) return;

      const sprite = sprites.find(s => s.id === spriteId);
      const animation = sprite?.animations.find(a => a.name === animationName);
      if (!animation?.frames?.length) return;

      const frameCount = animation.frames.length;
      const currentFrame = currentFrames[`${spriteId}-${animationName}`] || 0;
      const fps = animation.settings.speed || 5; // Default to 5 FPS if not set
      
      animationFrames[`${spriteId}-${animationName}`] = requestAnimationFrame(() => {
        const nextFrame = (currentFrame + 1) % frameCount;
        setCurrentFrames(prev => ({
          ...prev,
          [`${spriteId}-${animationName}`]: nextFrame
        }));
        setTimeout(() => updateFrame(spriteId, animationName), 1000 / fps);
      });
    };

    Object.entries(playingAnimations).forEach(([key, isPlaying]) => {
      if (isPlaying) {
        const [spriteId, animationName] = key.split('-');
        updateFrame(spriteId, animationName);
      }
    });

    return () => {
      Object.values(animationFrames).forEach(frameId => cancelAnimationFrame(frameId));
    };
  }, [playingAnimations, currentFrames, sprites]);

  const toggleAnimation = (spriteId: string, animationName: string) => {
    const key = `${spriteId}-${animationName}`;
    setPlayingAnimations(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    // Reset current frame when starting animation
    if (!playingAnimations[key]) {
      setCurrentFrames(prev => ({
        ...prev,
        [key]: 0
      }));
    }
  };

  const deleteSprite = async (spriteId: string) => {
    try {
      const { error } = await supabase
        .from('sprites')
        .delete()
        .match({ id: spriteId });

      if (error) throw error;

      setSprites(prev => prev.filter(sprite => sprite.id !== spriteId));
    } catch (err) {
      console.error('Error deleting sprite:', err);
      setError('Failed to delete sprite');
    }
  };

  const handleImageError = (spriteId: string, animationName: string) => {
    const key = `${spriteId}-${animationName}`;
    setImageErrors(prev => ({
      ...prev,
      [key]: true
    }));
    // Stop animation if image fails to load
    setPlayingAnimations(prev => ({
      ...prev,
      [key]: false
    }));
  };

  if (loading) return <div className="p-4 text-white">Loading sprites...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!sprites.length) return <div className="p-4 text-white">No sprites found</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Sprite Library</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sprites.map(sprite => (
          <div key={sprite.id} className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-lg">
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <h3 className="text-lg font-medium text-white">{sprite.name}</h3>
              <button
                onClick={() => deleteSprite(sprite.id)}
                className="text-red-500 hover:text-red-400"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
            {sprite.animations.map(animation => (
              <div key={animation.name} className="border-b border-white/10 last:border-0">
                <div className="flex items-center justify-between p-3">
                  <span className="text-white/80">{animation.name}</span>
                  {animation.frames?.length > 0 && (
                    <button
                      onClick={() => toggleAnimation(sprite.id, animation.name)}
                      className="text-white/80 hover:text-white"
                    >
                      {playingAnimations[`${sprite.id}-${animation.name}`] ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>
                <div className="aspect-square bg-black/50 p-4 flex items-center justify-center">
                  {animation.frames?.length > 0 && !imageErrors[`${sprite.id}-${animation.name}`] ? (
                    <img
                      src={animation.frames[currentFrames[`${sprite.id}-${animation.name}`] || 0]}
                      alt={`${sprite.name} - ${animation.name}`}
                      className="w-full h-full object-contain"
                      style={{ imageRendering: 'pixelated' }}
                      onError={() => handleImageError(sprite.id, animation.name)}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-white/40">
                      <Image className="w-12 h-12 mb-2" />
                      <span className="text-sm">No frames available</span>
                    </div>
                  )}
                </div>
                <div className="px-3 py-2 text-sm text-white/60">
                  {animation.frames?.length || 0} frames • {animation.settings?.speed || 5} FPS
                  {animation.settings?.loop && ' • Loop'}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}; 