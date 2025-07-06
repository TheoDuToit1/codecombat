import React, { useState, useRef, useEffect } from 'react';
import { Upload, Save } from 'lucide-react';
import { saveAnimationToSupabase, listAnimations, getAnimationById } from '../utils/supabaseAnimationSaver';
import { SPRITE_CATEGORIES, saveSpriteSheet } from '../utils/spriteSheetSaver';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface SpriteUploadPanelProps {
  onFramesDetected?: (frames: {
    frameWidth: number;
    frameHeight: number;
    cols: number;
    rows: number;
    imageUrl: string;
  }) => void;
  onExport?: (frames: string[]) => void;
}

export default function SpriteUploadPanel({ onFramesDetected, onExport }: SpriteUploadPanelProps) {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [frameWidth, setFrameWidth] = useState<number>(64);
  const [frameHeight, setFrameHeight] = useState<number>(64);
  const [isAutoscanning, setIsAutoscanning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPreviewFrame, setCurrentPreviewFrame] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(200); // ms per frame
  const [showPreview, setShowPreview] = useState(false);
  const [padding, setPadding] = useState(0);
  const [margin, setMargin] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [cutFrames, setCutFrames] = useState<string[]>([]);
  const [rowFrames, setRowFrames] = useState<string[][]>([]);
  const [rowPlay, setRowPlay] = useState<{[row: number]: boolean}>({});
  const [rowSpeeds, setRowSpeeds] = useState<{[row: number]: number}>({});
  const rowAnimationRefs = useRef<{[row: number]: number}>({});

  // Modal state for Add to Library
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [modalRowIdx, setModalRowIdx] = useState<number | null>(null);
  const [modalAssetName, setModalAssetName] = useState('');
  const [modalCategories, setModalCategories] = useState<string[]>([]);
  const [modalTags, setModalTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Add at the top of the component
  const ACTIONS = ["Idle", "Walk", "Run", "Attack", "Hurt", "Die"];
  const DIRECTIONS = ["Down", "Up", "Left", "Right"];
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [selectedDirection, setSelectedDirection] = useState<string>("");
  const [actionDirectionFrames, setActionDirectionFrames] = useState<Record<string, Record<string, string[]>>>({});

  // New modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<string>("");
  const [modalDirection, setModalDirection] = useState<string>("");
  const [modalFrameIdx, setModalFrameIdx] = useState(0);
  const [modalIsPlaying, setModalIsPlaying] = useState(false);
  const [modalSpeed, setModalSpeed] = useState(200);
  const modalAnimRef = useRef<number>();

  // Add at the top of the component
  const LOCAL_STORAGE_KEY = 'frameSequenceAssignments';

  // New Supabase state
  const [showSupabaseSaveModal, setShowSupabaseSaveModal] = useState(false);
  const [supabaseName, setSupabaseName] = useState("");
  const [supabaseCategories, setSupabaseCategories] = useState<string[]>([]);
  const [supabaseTags, setSupabaseTags] = useState<string[]>([]);
  const [supabaseTagInput, setSupabaseTagInput] = useState("");
  const [showSupabaseLoadModal, setShowSupabaseLoadModal] = useState(false);
  const [supabaseAssets, setSupabaseAssets] = useState<any[]>([]);
  const [supabaseLoading, setSupabaseLoading] = useState(false);

  // Add new state for sprite sheet saving
  const [showSpriteSaveModal, setShowSpriteSaveModal] = useState(false);
  const [spriteSheetName, setSpriteSheetName] = useState('');
  const [spriteSheetCategory, setSpriteSheetCategory] = useState(SPRITE_CATEGORIES[0]);
  const [spriteSheetTags, setSpriteSheetTags] = useState<string[]>([]);
  const [spriteSheetTagInput, setSpriteSheetTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle file upload
  const handleUpload = (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    const urls = fileArr.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...fileArr]);
    setImageUrls(prev => [...prev, ...urls]);
    setSelectedIndex(images.length); // select the first of the new batch
    setCutFrames([]);
    setShowPreview(false);
    // Auto-detect for the first new image
    if (fileArr[0]) {
      const img = new Image();
      img.onload = () => {
        autoDetectFrameSize(img);
        URL.revokeObjectURL(img.src);
      };
      img.src = urls[0];
    }
  };

  // Auto-detect frame size
  const autoDetectFrameSize = (img: HTMLImageElement) => {
    setIsAutoscanning(true);
    
    // Common sprite sizes to check
    const commonSizes = [16, 24, 32, 48, 64, 96, 128];
    
    // Default size if no good match is found
    let bestWidth = 64;
    let bestHeight = 64;
    
    // Try to find a common size that divides the image evenly
    for (const size of commonSizes) {
      if (img.width % size === 0 && img.height % size === 0) {
        bestWidth = size;
        bestHeight = size;
        break;
      }
    }
    
    // If no common size fits perfectly, try to detect the most likely frame size
    if (img.width % bestWidth !== 0 || img.height % bestHeight !== 0) {
      // Find the largest even divisor of width and height
      for (let i = Math.min(img.width, img.height, 128); i >= 16; i--) {
        if (img.width % i === 0 && img.height % i === 0) {
          bestWidth = i;
          bestHeight = i;
          break;
        }
      }
    }
    
    // Calculate rows and columns
    const cols = Math.floor(img.width / bestWidth);
    const rows = Math.floor(img.height / bestHeight);
    
    // Update state
    setFrameWidth(bestWidth);
    setFrameHeight(bestHeight);
    setGrid({ cols, rows });
    setIsAutoscanning(false);
    
    // Notify parent component if callback provided
    if (onFramesDetected) {
      onFramesDetected({
        frameWidth: bestWidth,
        frameHeight: bestHeight,
        cols,
        rows,
        imageUrl: img.src
      });
    }
  };

  // Manual update of grid dimensions
  const updateGrid = () => {
    const imageUrl = imageUrls[selectedIndex];
    if (!imageUrl) return;
    const img = new Image();
    img.onload = () => {
      const cols = Math.floor(img.width / (frameWidth + padding)) || 1;
      const rows = Math.floor(img.height / (frameHeight + padding)) || 1;
      
      setGrid({ cols, rows });
      
      // Notify parent component if callback provided
      if (onFramesDetected) {
        onFramesDetected({
          frameWidth,
          frameHeight,
          cols,
          rows,
          imageUrl
        });
      }
      
      // Clean up object URL
      URL.revokeObjectURL(img.src);
    };
    
    img.src = imageUrl;
  };

  // Update grid when frame dimensions change
  useEffect(() => {
    if (isManualOverride && imageUrls[selectedIndex]) {
      updateGrid();
    }
  }, [frameWidth, frameHeight, padding, margin, isManualOverride]);

  // Fix for the useEffect where 'grid' may be null
  useEffect(() => {
    const imageUrl = imageUrls[selectedIndex];
    if (!imageUrl || !canvasRef.current) return;
    
    if (grid) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const img = new Image();
      img.onload = () => {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image
        ctx.drawImage(img, 0, 0);
        
        // Draw grid overlay
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)';
        ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x <= grid.cols; x++) {
          ctx.beginPath();
          ctx.moveTo(x * (frameWidth + padding) + margin, 0);
          ctx.lineTo(x * (frameWidth + padding) + margin, img.height);
          ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= grid.rows; y++) {
          ctx.beginPath();
          ctx.moveTo(0, y * (frameHeight + padding) + margin);
          ctx.lineTo(img.width, y * (frameHeight + padding) + margin);
          ctx.stroke();
        }
      };
      
      img.src = imageUrl;
    }
  }, [imageUrls, selectedIndex, grid, frameWidth, frameHeight, padding, margin]);

  // Cut the sprite sheet into individual frames
  const cutSpritesheet = () => {
    setExtractMessage(null);
    setExtractError(null);
    const file = images[selectedIndex];
    if (!file || !grid) {
      setExtractError('No image or grid detected.');
      console.error('Extract Frames: No image or grid detected.');
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setExtractError('Could not get canvas context.');
          console.error('Extract Frames: Could not get canvas context.');
          URL.revokeObjectURL(objectUrl);
          return;
        }
        const frames: string[] = [];
        const rows: string[][] = [];
        canvas.width = frameWidth;
        canvas.height = frameHeight;
        for (let row = 0; row < grid.rows; row++) {
          const rowArr: string[] = [];
          for (let col = 0; col < grid.cols; col++) {
            ctx.clearRect(0, 0, frameWidth, frameHeight);
            const sourceX = col * (frameWidth + padding) + margin;
            const sourceY = row * (frameHeight + padding) + margin;
            ctx.drawImage(
              img,
              sourceX, sourceY, frameWidth, frameHeight,
              0, 0, frameWidth, frameHeight
            );
            const frameData = canvas.toDataURL('image/png');
            frames.push(frameData);
            rowArr.push(frameData);
          }
          rows.push(rowArr);
        }
        setCutFrames(frames);
        setRowFrames(rows);
        setShowPreview(true);
        setCurrentPreviewFrame(0);
        setRowPlay({});
        setRowSpeeds({});
        setRowPreviewIdx({});
        if (frames.length > 0) {
          setExtractMessage(`Successfully extracted ${frames.length} frames.`);
          console.log(`Extracted ${frames.length} frames.`);
        } else {
          setExtractError('No frames were extracted.');
          console.error('Extract Frames: No frames were extracted.');
        }
        if (onExport) {
          onExport(frames);
        }
      } catch (err) {
        setExtractError('An error occurred during extraction.');
        console.error('Extract Frames: Error during extraction', err);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    img.onerror = () => {
      setExtractError('Failed to load image for extraction.');
      console.error('Extract Frames: Failed to load image.');
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  // Row-by-row animation effect
  // (one effect for all rows, handles play/pause for each row)
  useEffect(() => {
    Object.keys(rowPlay).forEach(rowIdxStr => {
      const rowIdx = Number(rowIdxStr);
      if (rowPlay[rowIdx] && rowFrames[rowIdx] && rowFrames[rowIdx].length > 0) {
        if (rowAnimationRefs.current[rowIdx]) clearTimeout(rowAnimationRefs.current[rowIdx]);
        const speed = rowSpeeds[rowIdx] || 200;
        rowAnimationRefs.current[rowIdx] = window.setTimeout(() => {
          setRowPreviewIdx(prev => ({
            ...prev,
            [rowIdx]: ((prev[rowIdx] || 0) + 1) % rowFrames[rowIdx].length
          }));
        }, speed);
      } else if (rowAnimationRefs.current[rowIdx]) {
        clearTimeout(rowAnimationRefs.current[rowIdx]);
      }
    });
    return () => {
      Object.values(rowAnimationRefs.current).forEach(ref => clearTimeout(ref));
    };
  }, [rowPlay, rowFrames, rowSpeeds]);

  // Remove frame from a row
  const removeFrameFromRow = (rowIdx: number, frameIdx: number) => {
    setRowFrames(prev => prev.map((row, i) => i === rowIdx ? row.filter((_, j) => j !== frameIdx) : row));
  };
  // Move frame left/right in a row
  const moveFrameInRow = (rowIdx: number, frameIdx: number, dir: -1 | 1) => {
    setRowFrames(prev => prev.map((row, i) => {
      if (i !== rowIdx) return row;
      const newRow = [...row];
      const newIdx = frameIdx + dir;
      if (newIdx < 0 || newIdx >= newRow.length) return row;
      [newRow[frameIdx], newRow[newIdx]] = [newRow[newIdx], newRow[frameIdx]];
      return newRow;
    }));
  };
  // Export/save a row
  const exportRowFrames = async (rowIdx: number) => {
    const row = rowFrames[rowIdx];
    if (!row || row.length === 0) return;
    const zip = new JSZip();
    row.forEach((frame, index) => {
      const base64 = frame.split(',')[1];
      zip.file(`row${rowIdx + 1}_frame${index.toString().padStart(3, '0')}.png`, base64, {base64: true});
    });
    const blob = await zip.generateAsync({type: 'blob'});
    saveAs(blob, `row${rowIdx + 1}_frames.zip`);
  };

  // Export all frames
  const exportAllFrames = async () => {
    if (!rowFrames.length) return;
    const zip = new JSZip();
    rowFrames.forEach((row, rowIdx) => {
      row.forEach((frame, index) => {
        const base64 = frame.split(',')[1];
        zip.file(`row${rowIdx + 1}_frame${index.toString().padStart(3, '0')}.png`, base64, {base64: true});
      });
    });
    const blob = await zip.generateAsync({type: 'blob'});
    saveAs(blob, 'all_rows_frames.zip');
  };

  // Handle animation preview
  useEffect(() => {
    if (!isPlaying || cutFrames.length === 0) return;
    
    const animate = () => {
      setCurrentPreviewFrame((prev) => (prev + 1) % cutFrames.length);
      animationRef.current = setTimeout(animate, animationSpeed) as unknown as number;
    };
    
    animationRef.current = setTimeout(animate, animationSpeed) as unknown as number;
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, cutFrames, animationSpeed]);

  // Draw the current preview frame
  useEffect(() => {
    if (!showPreview || cutFrames.length === 0 || !previewCanvasRef.current) return;
    
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions
      canvas.width = frameWidth * 3;
      canvas.height = frameHeight * 3;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the frame scaled up
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        img,
        0, 0, img.width, img.height,
        0, 0, canvas.width, canvas.height
      );
    };
    
    img.src = cutFrames[currentPreviewFrame];
  }, [currentPreviewFrame, cutFrames, showPreview, frameWidth, frameHeight]);

  // Export frames as PNG files
  const exportFrames = () => {
    if (cutFrames.length === 0) return;
    
    // Create a zip file of frames
    cutFrames.forEach((frame, index) => {
      // Create a link element
      const link = document.createElement('a');
      link.href = frame;
      link.download = `frame_${index.toString().padStart(3, '0')}.png`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  // Modal animation effect
  useEffect(() => {
    if (!modalIsPlaying || !modalAction || !modalDirection) return;
    
    const frames = actionDirectionFrames[modalAction]?.[modalDirection];
    if (!frames?.length) return;
    
    const animate = () => {
      setModalFrameIdx((prev) => (prev + 1) % frames.length);
      modalAnimRef.current = setTimeout(animate, modalSpeed) as unknown as number;
    };
    
    modalAnimRef.current = setTimeout(animate, modalSpeed) as unknown as number;
    
    return () => {
      if (modalAnimRef.current) clearTimeout(modalAnimRef.current);
    };
  }, [modalIsPlaying, modalAction, modalDirection, modalSpeed, actionDirectionFrames]);

  // Modal open handler
  const openFrameModal = (action: string, direction: string) => {
    setModalAction(action);
    setModalDirection(direction);
    setModalFrameIdx(0);
    setModalIsPlaying(false);
    setModalOpen(true);
  };

  // Modal remove frame
  const removeModalFrame = (idx: number) => {
    setActionDirectionFrames(prev => {
      const updated = { ...prev };
      if (!updated[modalAction] || !updated[modalAction][modalDirection]) return prev;
      updated[modalAction][modalDirection] = updated[modalAction][modalDirection].filter((_, i) => i !== idx);
      return updated;
    });
    setModalFrameIdx(idx => Math.max(0, idx - 1));
  };

  // Modal export
  const exportModalFrames = () => {
    const urls = actionDirectionFrames[modalAction]?.[modalDirection] || [];
    if (!urls.length) return;
    const zip = new JSZip();
    urls.forEach((url, i) => {
      fetch(url)
        .then(res => res.blob())
        .then(blob => zip.file(`frame_${i + 1}.png`, blob))
        .then(() => {
          if (i === urls.length - 1) {
            zip.generateAsync({ type: 'blob' }).then(content => {
              saveAs(content, `${modalAction}_${modalDirection}_frames.zip`);
            });
          }
        });
    });
  };

  // Load saved assignments on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setActionDirectionFrames(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Save handler
  const handleSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(actionDirectionFrames));
    alert('Animation assignments saved!');
  };

  // New Animation handler
  const handleNewAnimation = () => {
    if (window.confirm('Start a new animation? This will clear all current assignments.')) {
      setActionDirectionFrames({});
    }
  };

  // Load Animation handler
  const handleLoadAnimation = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setActionDirectionFrames(JSON.parse(saved));
      alert('Loaded saved animation assignments.');
    } else {
      alert('No saved animation assignments found.');
    }
  };

  // Save to Supabase handler
  const handleSupabaseSave = async () => {
    try {
      await saveAnimationToSupabase(
        supabaseName,
        supabaseCategories,
        supabaseTags,
        actionDirectionFrames
      );
      alert('Saved to Supabase!');
      setShowSupabaseSaveModal(false);
    } catch (e) {
      alert('Error saving to Supabase.');
    }
  };

  // Load from Supabase handler
  const openSupabaseLoadModal = async () => {
    setSupabaseLoading(true);
    setShowSupabaseLoadModal(true);
    try {
      const assets = await listAnimations();
      setSupabaseAssets(assets || []);
    } catch {
      setSupabaseAssets([]);
    }
    setSupabaseLoading(false);
  };
  const handleSupabaseLoad = async (id: string) => {
    setSupabaseLoading(true);
    try {
      const asset = await getAnimationById(id);
      if (asset && asset.data) {
        setActionDirectionFrames(asset.data);
        alert('Loaded animation from Supabase!');
        setShowSupabaseLoadModal(false);
      }
    } catch {
      alert('Error loading from Supabase.');
    }
    setSupabaseLoading(false);
  };

  // Add new function to handle sprite sheet save
  const handleSpriteSave = async () => {
    if (!spriteSheetName) {
      setSaveError('Please provide a name for the sprite sheet');
      return;
    }

    if (!cutFrames.length) {
      setSaveError('No frames detected. Please cut the sprite sheet first.');
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      
      const spriteData = {
        frames: cutFrames,
        frameWidth,
        frameHeight,
        grid: grid || { cols: 0, rows: 0 },
        rowFrames
      };
      
      await saveSpriteSheet(
        spriteSheetName,
        spriteSheetCategory,
        spriteSheetTags,
        spriteData
      );
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      setShowSpriteSaveModal(false);
    } catch (error) {
      console.error('Error saving sprite sheet:', error);
      setSaveError(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Add tag to sprite sheet tags
  const addSpriteSheetTag = () => {
    if (spriteSheetTagInput.trim() && !spriteSheetTags.includes(spriteSheetTagInput.trim())) {
      setSpriteSheetTags([...spriteSheetTags, spriteSheetTagInput.trim()]);
      setSpriteSheetTagInput('');
    }
  };

  // Remove tag from sprite sheet tags
  const removeSpriteSheetTag = (tag: string) => {
    setSpriteSheetTags(spriteSheetTags.filter(t => t !== tag));
  };

  return (
    <div className="sprite-upload-panel">
      <div className="bg-slate-900 p-4 rounded-lg shadow-lg mb-6">
        <h3 className="font-semibold text-lg mb-4 text-white">Sprite Sheet Uploader</h3>
        
        <div className="mb-4">
          <div 
            className="border-2 border-dashed border-gray-600 bg-slate-800 p-4 rounded-lg text-center hover:bg-slate-750 hover:border-blue-400 transition-colors cursor-pointer"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              if (e.dataTransfer.files.length) {
                handleUpload(e.dataTransfer.files);
              }
            }}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/png, image/jpeg, image/gif';
              input.multiple = true;
              input.onchange = (e: any) => {
                if (e.target.files.length) {
                  handleUpload(e.target.files);
                }
              };
              input.click();
            }}
          >
            <Upload className="mx-auto mb-2 text-blue-400" size={32} />
            <p className="text-gray-300">Drop sprite sheet here or click to upload</p>
            <p className="text-gray-400 text-sm mt-1">PNG, JPG or GIF</p>
          </div>
        </div>

        {/* Add Save Button */}
        {cutFrames.length > 0 && (
          <div className="flex justify-end mb-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={() => setShowSpriteSaveModal(true)}
            >
              <Save size={16} />
              Save to Database
            </button>
          </div>
        )}
        
        {/* ... rest of the component UI ... */}
      </div>

      {/* Sprite Sheet Save Modal */}
      {showSpriteSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-slate-900 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Save Sprite Sheet</h3>
            
            {saveError && (
              <div className="bg-red-900 text-white p-3 rounded-lg mb-4">
                {saveError}
              </div>
            )}
            
            {saveSuccess && (
              <div className="bg-green-900 text-white p-3 rounded-lg mb-4">
                Sprite sheet saved successfully!
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-white mb-2">Name</label>
              <input
                type="text"
                value={spriteSheetName}
                onChange={(e) => setSpriteSheetName(e.target.value)}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-2"
                placeholder="Enter sprite sheet name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-white mb-2">Category</label>
              <select
                value={spriteSheetCategory}
                onChange={(e) => setSpriteSheetCategory(e.target.value)}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-2"
              >
                {SPRITE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-white mb-2">Tags</label>
              <div className="flex">
                <input
                  type="text"
                  value={spriteSheetTagInput}
                  onChange={(e) => setSpriteSheetTagInput(e.target.value)}
                  className="flex-1 bg-slate-800 text-white border border-slate-700 rounded-l-lg p-2"
                  placeholder="Add tag"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSpriteSheetTag();
                    }
                  }}
                />
                <button
                  onClick={addSpriteSheetTag}
                  className="bg-blue-600 text-white px-3 rounded-r-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              
              {spriteSheetTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {spriteSheetTags.map(tag => (
                    <div key={tag} className="bg-blue-900 text-white px-2 py-1 rounded-full flex items-center">
                      <span>{tag}</span>
                      <button
                        onClick={() => removeSpriteSheetTag(tag)}
                        className="ml-1 text-white hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowSpriteSaveModal(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSpriteSave}
                disabled={isSaving}
                className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ... existing modals ... */}
    </div>
  );
} 