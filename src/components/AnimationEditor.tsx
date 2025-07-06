import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Plus, 
  Grid, 
  Image, 
  X, 
  Edit
} from 'lucide-react';
import { initializeStorage } from '../utils/storageHelpers';
import { SpriteAnimation, AnimationFolder } from '../types/game';
import { simpleSaveAnimation, testSupabaseConnection } from '../utils/simpleSave';

interface AnimationEditorProps {
  isOpen: boolean;
  onClose: () => void;
  spriteName: string;
  onSpriteNameChange: (name: string) => void;
  animations: SpriteAnimation[];
  onAnimationsUpdate: (animations: SpriteAnimation[]) => void;
}

interface AnimationDirection {
  up: SpriteAnimation[];
  down: SpriteAnimation[];
  left: SpriteAnimation[];
  right: SpriteAnimation[];
}

interface CharacterAnimationSet {
  idle: AnimationDirection;
  walk: AnimationDirection;
  attack: AnimationDirection;
}

interface SpritesheetCutterState {
  file: File | null;
  previewUrl: string;
  frameWidth: number;
  frameHeight: number;
  columns: number;
  rows: number;
  padding: number;
  margin: number;
  frames: string[];
  selectedFrames: boolean[];
}

interface FrameDestinationModalProps {
  frames: string[];
  onClose: () => void;
  onAddToCurrentAnimation: (frames: string[]) => void;
  onCreateNewAnimation: (frames: string[], name: string) => void;
}

const FrameDestinationModal: React.FC<FrameDestinationModalProps> = ({
  frames,
  onClose,
  onAddToCurrentAnimation,
  onCreateNewAnimation,
}) => {
  const [newAnimationName, setNewAnimationName] = useState('');
  const [selectedOption, setSelectedOption] = useState<'current' | 'new'>('current');

  const handleSave = () => {
    if (selectedOption === 'current') {
      onAddToCurrentAnimation(frames);
    } else {
      if (!newAnimationName.trim()) {
        alert('Please enter a name for the new animation');
        return;
      }
      onCreateNewAnimation(frames, newAnimationName);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-gray-900 w-full max-w-md rounded-lg shadow-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Save Cut Frames</h2>
        
        <div className="space-y-4">
          <label className="block">
            <input
              type="radio"
              checked={selectedOption === 'current'}
              onChange={() => setSelectedOption('current')}
              className="mr-2"
            />
            <span className="text-white">Add to current animation</span>
          </label>
          
          <label className="block">
            <input
              type="radio"
              checked={selectedOption === 'new'}
              onChange={() => setSelectedOption('new')}
              className="mr-2"
            />
            <span className="text-white">Create new animation</span>
          </label>
          
          {selectedOption === 'new' && (
            <input
              type="text"
              value={newAnimationName}
              onChange={(e) => setNewAnimationName(e.target.value)}
              placeholder="Enter animation name"
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg mt-2"
            />
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
          >
            Save Frames
          </button>
        </div>
      </div>
    </div>
  );
};

export const AnimationEditor: React.FC<AnimationEditorProps> = ({
  isOpen,
  onClose,
  spriteName,
  onSpriteNameChange,
  animations = [],
  onAnimationsUpdate,
}) => {
  const [selectedAnimationIndex, setSelectedAnimationIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [editingAnimationName, setEditingAnimationName] = useState<number | null>(null);
  const [folders, setFolders] = useState<AnimationFolder[]>([]);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [spritesheetState, setSpritesheetState] = useState<SpritesheetCutterState>({
    file: null,
    previewUrl: '',
    frameWidth: 32,
    frameHeight: 32,
    columns: 1,
    rows: 1,
    padding: 0,
    margin: 0,
    frames: [],
    selectedFrames: []
  });
  const [showFrameDestinationModal, setShowFrameDestinationModal] = useState(false);
  const [cutFrames, setCutFrames] = useState<string[]>([]);
  const [previewFrame, setPreviewFrame] = useState<{row: number, col: number} | null>(null);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const lastFrameTimeRef = useRef<number>(0);
  const animationRef = useRef<number>();

  // Calculate animations in folders once for the entire component
  const animationsInFolders = folders.flatMap(f => f.animations);

  const selectedAnimation = animations[selectedAnimationIndex];

  // Initialize storage when component mounts
  useEffect(() => {
    const init = async () => {
      try {
        // Initialize storage
        await initializeStorage();
      } catch (error) {
        console.error('Error initializing:', error);
        // Don't throw the error, just log it and continue
        // The user will need to set up their .env file with Supabase credentials
      }
    };
    
    init();
  }, []);

  // Test Supabase connection when component mounts
  useEffect(() => {
    const testConnection = async () => {
      try {
        const result = await testSupabaseConnection();
        if (result.success) {
          console.log('Supabase connection test successful');
        } else {
          console.error('Supabase connection test failed:', result.error);
        }
      } catch (error) {
        console.error('Error testing Supabase connection:', error);
      }
    };
    
    testConnection();
  }, []);

  useEffect(() => {
    if ((isPlaying || showPreviewModal) && selectedAnimation?.frames.length) {
      const speed = selectedAnimation.settings.speed || 5;
      const frameTime = 1000 / speed;

      const animate = (timestamp: number) => {
        if (!lastFrameTimeRef.current) {
          lastFrameTimeRef.current = timestamp;
        }

        const elapsed = timestamp - lastFrameTimeRef.current;

        if (elapsed >= frameTime) {
          setCurrentFrame(prev => {
            let nextFrame = prev;
            
            // Use the reverse setting from animation settings
            const shouldMoveBackward = selectedAnimation.settings.reverse ? !isReversed : isReversed;
            
            if (shouldMoveBackward) {
              nextFrame = prev - 1;
            } else {
              nextFrame = prev + 1;
            }

            // Handle ping-pong
            if (selectedAnimation.settings.pingPong) {
              if (isReversed && nextFrame < 0) {
                setIsReversed(false);
                return 1; // Start moving forward from second frame
              } else if (!isReversed && nextFrame >= selectedAnimation.frames.length) {
                setIsReversed(true);
                return selectedAnimation.frames.length - 2; // Start moving backward from second-to-last frame
              }
            }
            // Handle normal looping - Fixed loop logic
            else if (selectedAnimation.settings.loop) {
              if (nextFrame >= selectedAnimation.frames.length) {
                return 0;
              } else if (nextFrame < 0) {
                return selectedAnimation.frames.length - 1;
              }
            }
            // No looping - Fixed non-loop logic
            else {
              if (nextFrame >= selectedAnimation.frames.length || nextFrame < 0) {
                setIsPlaying(false);
                setCurrentFrame(0); // Reset to first frame when animation ends
                return 0;
              }
            }

            return nextFrame;
          });

          lastFrameTimeRef.current = timestamp;
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        lastFrameTimeRef.current = 0;
      };
    }
  }, [isPlaying, showPreviewModal, selectedAnimation, isReversed]);

  // Reset animation state when changing animations
  useEffect(() => {
    setCurrentFrame(0);
    setIsReversed(false);
    lastFrameTimeRef.current = 0;
  }, [selectedAnimationIndex]);

  const handleAddAnimation = () => {
    const newAnimation: SpriteAnimation = {
      name: `Animation ${animations.length + 1}`,
      frames: [],
      settings: {
        speed: 12,
        loop: true,
        pingPong: false,
        reverse: false
      }
    };
    onAnimationsUpdate([...animations, newAnimation]);
    setSelectedAnimationIndex(animations.length);
  };

  const handleFrameUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || selectedAnimationIndex === -1) return;

    const newFrames = [...(selectedAnimation?.frames || [])];
    for (const file of Array.from(e.target.files)) {
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onload = (e) => {
          if (e.target?.result) {
            newFrames.push(e.target.result as string);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    const updatedAnimations = animations.map((anim, index) =>
      index === selectedAnimationIndex
        ? { ...anim, frames: newFrames }
        : anim
    );
    onAnimationsUpdate(updatedAnimations);
    setShowUploadModal(false);
  };

  const handleSpritesheetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new window.Image();
      img.src = e.target?.result as string;
      
      img.onload = () => {
        // Auto-detect columns and rows based on image size and frame size
        const columns = Math.floor(img.width / spritesheetState.frameWidth);
        const rows = Math.floor(img.height / spritesheetState.frameHeight);
        
        setSpritesheetState(prev => ({
          ...prev,
          file,
          previewUrl: img.src,
          columns,
          rows,
          selectedFrames: new Array(columns * rows).fill(true)
        }));
      };
    };
    reader.readAsDataURL(file);
  };

  const autoDetectFrames = () => {
    if (!spritesheetState.previewUrl) return;

    const img = new window.Image();
    img.src = spritesheetState.previewUrl;

    img.onload = () => {
      // Basic auto-detection logic:
      // 1. Try to detect common sprite sizes (16x16, 32x32, 64x64)
      // 2. Look for even divisions of the image width/height
      
      const commonSizes = [16, 24, 32, 48, 64];
      let bestFrameWidth = 32;
      let bestFrameHeight = 32;
      
      // Find the common size that divides the image most evenly
      for (const size of commonSizes) {
        if (img.width % size === 0 && img.height % size === 0) {
          bestFrameWidth = size;
          bestFrameHeight = size;
          break;
        }
      }
      
      // If no common size fits perfectly, try to find the best fit
      if (img.width % bestFrameWidth !== 0 || img.height % bestFrameHeight !== 0) {
        // Find the largest even divisor of width and height
        for (let i = Math.min(img.width, img.height, 64); i >= 16; i--) {
          if (img.width % i === 0 && img.height % i === 0) {
            bestFrameWidth = i;
            bestFrameHeight = i;
            break;
          }
        }
      }
      
      const columns = Math.floor(img.width / bestFrameWidth);
      const rows = Math.floor(img.height / bestFrameHeight);
      
      // Initialize padding and margin variables
      let detectedPadding = 0;
      const detectedMargin = 0;
      
      // Create a canvas to analyze the image for better frame detection
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Try to detect padding between frames by looking for transparent/same color pixels
        
        // Simple padding detection - check if there are consistent empty columns/rows
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Check for horizontal padding
          for (let x = 1; x < bestFrameWidth; x++) {
            let isEmptyColumn = true;
            for (let col = 0; col < columns; col++) {
              const colX = col * bestFrameWidth + x;
              for (let row = 0; row < rows; row++) {
                const rowY = row * bestFrameHeight + Math.floor(bestFrameHeight / 2);
                const idx = (rowY * canvas.width + colX) * 4 + 3; // Alpha channel
                if (data[idx] > 20) { // Non-transparent pixel
                  isEmptyColumn = false;
                  break;
                }
              }
              if (!isEmptyColumn) break;
            }
            if (isEmptyColumn) {
              detectedPadding = 1;
              break;
            }
          }
        } catch (e) {
          console.error("Error analyzing image data:", e);
        }
      }
      
      setSpritesheetState(prev => ({
        ...prev,
        frameWidth: bestFrameWidth,
        frameHeight: bestFrameHeight,
        columns,
        rows,
        padding: detectedPadding,
        margin: detectedMargin,
        selectedFrames: new Array(columns * rows).fill(true)
      }));
    };
  };

  const cutSpritesheet = async () => {
    if (!spritesheetState.previewUrl) return;

    const img = new window.Image();
    img.src = spritesheetState.previewUrl;

    await new Promise<void>(resolve => {
      img.onload = () => resolve();
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frames: string[] = [];
    const { frameWidth, frameHeight, columns, rows, padding, margin } = spritesheetState;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const frameIndex = row * columns + col;
        if (!spritesheetState.selectedFrames[frameIndex]) continue;

        canvas.width = frameWidth;
        canvas.height = frameHeight;
        ctx.clearRect(0, 0, frameWidth, frameHeight);

        const sourceX = col * (frameWidth + padding) + margin;
        const sourceY = row * (frameHeight + padding) + margin;

        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          frameWidth,
          frameHeight,
          0,
          0,
          frameWidth,
          frameHeight
        );

        frames.push(canvas.toDataURL('image/png'));
      }
    }

    setCutFrames(frames);
    setShowFrameDestinationModal(true);
  };

  const handleAddToCurrentAnimation = (frames: string[]) => {
    if (selectedAnimationIndex !== -1) {
      const newAnimations = [...animations];
      newAnimations[selectedAnimationIndex].frames.push(...frames);
      onAnimationsUpdate(newAnimations);
    }
    setShowFrameDestinationModal(false);
  };

  const handleCreateNewAnimation = (frames: string[], name: string) => {
    const newAnimation: SpriteAnimation = {
      name,
      frames,
      settings: {
        speed: 12,
        loop: true,
        pingPong: false,
        reverse: false
      }
    };
    onAnimationsUpdate([...animations, newAnimation]);
    setSelectedAnimationIndex(animations.length);
    setShowFrameDestinationModal(false);
  };

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: AnimationFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      animations: [],
      isOpen: true
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  const handleRenameAnimation = (index: number, newName: string) => {
    const updatedAnimations = [...animations];
    updatedAnimations[index] = {
      ...updatedAnimations[index],
      name: newName
    };
    onAnimationsUpdate(updatedAnimations);
    setEditingAnimationName(null);
  };

  // Function to handle image resizing
  const handleResize = (newSize: { width: number; height: number }) => {
    setSpritesheetState(prev => ({
      ...prev,
      imageSize: newSize
    }));
  };

  // Function to handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.5 : 0.5;
      setPreviewZoom(Math.max(0.25, Math.min(32, previewZoom + delta)));
    }
  };

  const renderAnimationItem = ({animation, index}: {animation: SpriteAnimation, index: number}) => (
    <div
      key={index}
      className={`flex items-center justify-between p-2 rounded cursor-pointer ${
        selectedAnimationIndex === index ? 'bg-blue-500' : 'hover:bg-[#444444]'
      }`}
      onClick={() => setSelectedAnimationIndex(index)}
    >
      <div className="flex items-center flex-1 min-w-0">
        <Play className="w-4 h-4 mr-2 text-white" />
        {editingAnimationName === index ? (
          <input
            type="text"
            className="bg-[#444444] text-white px-2 py-1 rounded w-full"
            defaultValue={animation.name}
            autoFocus
            onBlur={(e) => handleRenameAnimation(index, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRenameAnimation(index, e.currentTarget.value);
              } else if (e.key === 'Escape') {
                setEditingAnimationName(null);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="flex items-center justify-between flex-1">
            <span className="text-white truncate">{animation.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingAnimationName(index);
              }}
              className="p-1 hover:bg-[#555555] rounded text-gray-400 hover:text-white ml-2"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Add spritesheet cutter button to the frame list header
  const renderFrameListHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-white font-medium">Frames</h3>
      <div className="flex space-x-2">
        <button
          onClick={() => setShowFrameDestinationModal(true)}
          className="text-gray-400 hover:text-white"
          title="Cut Spritesheet"
        >
          Cut Frames
        </button>
        <button
          onClick={() => document.getElementById('frame-upload')?.click()}
          className="text-gray-400 hover:text-white"
          title="Upload Individual Frames"
        >
          Upload Frames
        </button>
        <input
          id="frame-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFrameUpload}
          className="hidden"
        />
      </div>
    </div>
  );

  // Replace the existing save button with this one
  const renderSaveButton = () => (
    <button 
      onClick={async () => {
        try {
          if (!spriteName.trim()) {
            alert('Please enter a sprite name before saving.');
            return;
          }

          if (animations.length === 0) {
            alert('Please create at least one animation before saving.');
            return;
          }

          setIsSaving(true);
          setSaveMessage('Saving...');
          
          // Use the simplified save function
          const savedSprite = await simpleSaveAnimation(spriteName, animations);
          
          console.log('Animation saved successfully:', savedSprite);
          
          // Check if it was saved to local storage (fallback)
          if (savedSprite.id && savedSprite.id.startsWith('anim_')) {
            setSaveMessage('Saved to local storage!');
          } else {
            setSaveMessage('Saved to Supabase!');
          }
          
          // Clear message after 3 seconds
          setTimeout(() => {
            setSaveMessage('');
          }, 3000);
        } catch (error) {
          console.error('Error saving animation:', error);
          
          // Show more detailed error message
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Unknown error';
            
          setSaveMessage('Error: ' + errorMessage);
          
          // Clear error message after 5 seconds
          setTimeout(() => {
            setSaveMessage('');
          }, 5000);
        } finally {
          setIsSaving(false);
        }
      }}
      disabled={isSaving}
      className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center ${
        isSaving ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      Save Animation
    </button>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-full h-full max-w-7xl max-h-[90vh] rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <input
              type="text"
              value={spriteName}
              onChange={(e) => onSpriteNameChange(e.target.value)}
              className="bg-gray-800 text-white px-3 py-1 rounded"
              placeholder="Sprite Name"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowPreviewModal(true)} className="text-gray-400 hover:text-white">
              <Play className="w-6 h-6" />
            </button>
            {renderSaveButton()}
            {saveMessage && (
              <span 
                className={`ml-2 ${
                  saveMessage.includes('Error') ? 'text-red-400' : 'text-green-400'
                }`}
              >
                {saveMessage}
              </span>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex">
          {/* Left panel - Animation controls */}
          <div className="w-64 bg-gray-800 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Animations</h3>
              <button
                onClick={handleAddAnimation}
                className="text-gray-400 hover:text-white"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {/* Animation list */}
            <div className="flex-1 overflow-y-auto">
              {animations.map((animation, index) => renderAnimationItem({ animation, index }))}
            </div>
          </div>

          {/* Center panel - Frame editor */}
          <div className="flex-1 p-4">
            {selectedAnimation && (
              <div className="h-full flex flex-col">
                <div className="flex-1 relative">
                  {/* Frame display */}
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-gray-700 rounded-lg overflow-hidden"
                  >
                    {selectedAnimation.frames[currentFrame] && (
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <img
                            src={selectedAnimation.frames[currentFrame]}
                            alt={`Frame ${currentFrame}`}
                            style={{
                              imageRendering: 'pixelated',
                              transform: `scale(${previewZoom})`,
                              transformOrigin: 'center',
                              maxWidth: '100%',
                              maxHeight: '100%',
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Frame controls */}
                <div className="h-32 mt-4 bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Play className="w-6 h-6" />
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={selectedAnimation.settings.speed}
                      onChange={(e) => {
                        const newAnimations = [...animations];
                        newAnimations[selectedAnimationIndex].settings.speed = parseInt(e.target.value);
                        onAnimationsUpdate(newAnimations);
                      }}
                      className="flex-1 mx-4"
                    />
                    <span className="text-white">{selectedAnimation.settings.speed} FPS</span>
                  </div>
                  <div className="flex space-x-4">
                    <label className="flex items-center text-white">
                      <input
                        type="checkbox"
                        checked={selectedAnimation.settings.loop}
                        onChange={(e) => {
                          const newAnimations = [...animations];
                          newAnimations[selectedAnimationIndex].settings.loop = e.target.checked;
                          onAnimationsUpdate(newAnimations);
                        }}
                        className="mr-2"
                      />
                      Loop
                    </label>
                    <label className="flex items-center text-white">
                      <input
                        type="checkbox"
                        checked={selectedAnimation.settings.pingPong}
                        onChange={(e) => {
                          const newAnimations = [...animations];
                          newAnimations[selectedAnimationIndex].settings.pingPong = e.target.checked;
                          onAnimationsUpdate(newAnimations);
                        }}
                        className="mr-2"
                      />
                      Ping Pong
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right panel - Frame list */}
          <div className="w-64 bg-gray-800 p-4">
            {renderFrameListHeader()}
            <div className="grid grid-cols-2 gap-2">
              {selectedAnimation?.frames.map((frame, index) => (
                <div
                  key={index}
                  className={`relative aspect-square bg-gray-700 rounded-lg overflow-hidden cursor-pointer ${
                    currentFrame === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setCurrentFrame(index)}
                >
                  <img src={frame} alt={`Frame ${index}`} className="w-full h-full object-contain" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newAnimations = [...animations];
                      newAnimations[selectedAnimationIndex].frames.splice(index, 1);
                      onAnimationsUpdate(newAnimations);
                    }}
                    className="absolute top-1 right-1 text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[70]">
          <button
            onClick={() => {
              setShowPreviewModal(false);
              setIsPlaying(false);
              setIsReversed(false);
              lastFrameTimeRef.current = 0;
            }}
            className="absolute top-8 right-8 p-3 text-white hover:bg-[#444444] rounded-full bg-[#2D2D2D] transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="bg-[#2D2D2D] rounded-xl shadow-2xl relative max-w-[95vw] max-h-[95vh] p-8">
            <div className="flex flex-col items-center justify-center">
              <img
                src={selectedAnimation.frames[currentFrame]}
                alt="Animation Preview"
                className="w-auto h-auto max-w-[85vw] max-h-[70vh] object-contain"
                style={{ 
                  imageRendering: 'pixelated',
                  transform: `scale(${previewZoom})`,
                  transformOrigin: 'center'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
          <div className="bg-[#2D2D2D] rounded-lg shadow-2xl w-[600px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-medium">Add Frames</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSpritesheetState({
                    file: null,
                    previewUrl: '',
                    cols: 1,
                    rows: 1,
                    direction: 'horizontal'
                  });
                }}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Multiple Sprites Option */}
              <div
                className="bg-[#333333] p-4 rounded-lg cursor-pointer hover:bg-[#444444] transition-colors"
                onClick={() => document.getElementById('frame-upload')?.click()}
              >
                <div className="flex items-center justify-center h-32 mb-4 border-2 border-dashed border-[#555555] rounded">
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-white text-center font-medium mb-2">Multiple Sprites</h3>
                <p className="text-gray-400 text-sm text-center">
                  Upload multiple image files as individual frames
                </p>
                <input
                  id="frame-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFrameUpload}
                />
              </div>

              {/* Spritesheet Option */}
              <div
                className="bg-[#333333] p-4 rounded-lg cursor-pointer hover:bg-[#444444] transition-colors"
                onClick={() => document.getElementById('spritesheet-upload')?.click()}
              >
                <div className="flex items-center justify-center h-32 mb-4 border-2 border-dashed border-[#555555] rounded">
                  <Grid className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-white text-center font-medium mb-2">Spritesheet</h3>
                <p className="text-gray-400 text-sm text-center">
                  Upload a single spritesheet and slice it into frames
                </p>
                <input
                  id="spritesheet-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSpritesheetUpload}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2D2D2D] rounded-lg p-6 w-96">
            <h3 className="text-white text-lg font-medium mb-4">Create New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full bg-[#444444] text-white px-3 py-2 rounded border border-[#555555] focus:outline-none focus:border-blue-500 mb-4"
              placeholder="Folder Name"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 text-white hover:bg-[#444444] rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFolder}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showFrameDestinationModal && (
        <FrameDestinationModal
          frames={cutFrames}
          onClose={() => setShowFrameDestinationModal(false)}
          onAddToCurrentAnimation={handleAddToCurrentAnimation}
          onCreateNewAnimation={handleCreateNewAnimation}
        />
      )}
    </div>
  );
};