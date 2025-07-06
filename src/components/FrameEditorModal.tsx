import React, { useState, useEffect, useRef } from 'react';

interface FrameEditorModalProps {
  isOpen: boolean;
  direction: string;
  frames: string[];
  initialSpeed?: number;
  initialLoop?: boolean;
  onAddFrames: (files: FileList) => void;
  onRemoveFrame: (index: number) => void;
  onReorderFrames?: (from: number, to: number) => void; // (future)
  onSave: (frames: string[], speed: number, loop: boolean) => void;
  onClose: () => void;
}

const FrameEditorModal: React.FC<FrameEditorModalProps> = ({
  isOpen,
  direction,
  frames: initialFrames,
  initialSpeed = 5,
  initialLoop = true,
  onAddFrames,
  onRemoveFrame,
  onReorderFrames,
  onSave,
  onClose,
}) => {
  const [frames, setFrames] = useState<string[]>(initialFrames);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(initialSpeed);
  const [loop, setLoop] = useState(initialLoop);
  const animationRef = useRef<number | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerImage, setScannerImage] = useState<string | null>(null);
  const [scannerFrames, setScannerFrames] = useState<string[]>([]);
  const [scannerCount, setScannerCount] = useState(1);
  const [scanDirection, setScanDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [columns, setColumns] = useState(1);
  const [rows, setRows] = useState(1);

  // Animate preview
  useEffect(() => {
    if (!isPlaying || frames.length <= 1) return;
    let lastTime = 0;
    const frameInterval = Math.max(30, 1000 / speed);
    const animate = (timestamp: number) => {
      if (!lastTime || timestamp - lastTime >= frameInterval) {
        lastTime = timestamp;
        setCurrentFrame(prev => {
          if (prev + 1 < frames.length) return prev + 1;
          return loop ? 0 : prev; // Loop or stay on last
        });
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, frames, speed, loop]);

  // Reset preview when frames change
  useEffect(() => {
    setCurrentFrame(0);
  }, [frames]);

  // Sync local frames state with prop
  useEffect(() => {
    setFrames(initialFrames);
  }, [initialFrames]);

  // Scanner: auto-detect frames in a single image
  const handleScanFrames = async (file: File) => {
    const url = URL.createObjectURL(file);
    setScannerImage(url);
    const img = new window.Image();
    img.src = url;
    await new Promise(res => { img.onload = res; });
    // Auto-detect: assume horizontal strip
    let likelyCols = Math.round(img.width / img.height);
    let likelyRows = 1;
    if (img.height > img.width) {
      likelyRows = Math.round(img.height / img.width);
      likelyCols = 1;
      setScanDirection('vertical');
    } else {
      setScanDirection('horizontal');
    }
    setColumns(likelyCols > 1 ? likelyCols : 1);
    setRows(likelyRows > 1 ? likelyRows : 1);
    setScannerCount(likelyCols * likelyRows);
    setShowScanner(true);
    cutFramesFromImage(img, likelyCols, likelyRows, scanDirection);
  };

  // Cut frames from scannerImage
  const cutFramesFromImage = (img: HTMLImageElement, cols: number, rows: number, direction: 'horizontal' | 'vertical') => {
    const frames: string[] = [];
    const frameWidth = Math.floor(img.width / cols);
    const frameHeight = Math.floor(img.height / rows);
    const canvas = document.createElement('canvas');
    canvas.width = frameWidth;
    canvas.height = frameHeight;
    const ctx = canvas.getContext('2d');
    if (direction === 'horizontal') {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const sx = col * frameWidth;
          const sy = row * frameHeight;
          ctx!.clearRect(0, 0, frameWidth, frameHeight);
          ctx!.drawImage(img, sx, sy, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
          // --- Begin tight crop logic ---
          const imageData = ctx!.getImageData(0, 0, frameWidth, frameHeight);
          let minX = frameWidth, minY = frameHeight, maxX = 0, maxY = 0;
          for (let y = 0; y < frameHeight; y++) {
            for (let x = 0; x < frameWidth; x++) {
              const alpha = imageData.data[(y * frameWidth + x) * 4 + 3];
              if (alpha > 0) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            }
          }
          if (minX <= maxX && minY <= maxY) {
            const cropWidth = maxX - minX + 1;
            const cropHeight = maxY - minY + 1;
            const cropCanvas = document.createElement('canvas');
            cropCanvas.width = cropWidth;
            cropCanvas.height = cropHeight;
            const cropCtx = cropCanvas.getContext('2d');
            cropCtx!.putImageData(ctx!.getImageData(minX, minY, cropWidth, cropHeight), 0, 0);
            frames.push(cropCanvas.toDataURL('image/png'));
          } else {
            frames.push(canvas.toDataURL('image/png'));
          }
          // --- End tight crop logic ---
        }
      }
    } else {
      // vertical: cut by columns first, then rows (top-to-bottom, then left-to-right)
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const sx = col * frameWidth;
          const sy = row * frameHeight;
          ctx!.clearRect(0, 0, frameWidth, frameHeight);
          ctx!.drawImage(img, sx, sy, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
          // --- Begin tight crop logic ---
          const imageData = ctx!.getImageData(0, 0, frameWidth, frameHeight);
          let minX = frameWidth, minY = frameHeight, maxX = 0, maxY = 0;
          for (let y = 0; y < frameHeight; y++) {
            for (let x = 0; x < frameWidth; x++) {
              const alpha = imageData.data[(y * frameWidth + x) * 4 + 3];
              if (alpha > 0) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            }
          }
          if (minX <= maxX && minY <= maxY) {
            const cropWidth = maxX - minX + 1;
            const cropHeight = maxY - minY + 1;
            const cropCanvas = document.createElement('canvas');
            cropCanvas.width = cropWidth;
            cropCanvas.height = cropHeight;
            const cropCtx = cropCanvas.getContext('2d');
            cropCtx!.putImageData(ctx!.getImageData(minX, minY, cropWidth, cropHeight), 0, 0);
            frames.push(cropCanvas.toDataURL('image/png'));
          } else {
            frames.push(canvas.toDataURL('image/png'));
          }
          // --- End tight crop logic ---
        }
      }
    }
    setScannerFrames(frames);
  };

  // When columns/rows/scanDirection changes, re-cut frames
  useEffect(() => {
    if (!scannerImage) return;
    const img = new window.Image();
    img.src = scannerImage;
    img.onload = () => cutFramesFromImage(img, columns, rows, scanDirection);
  }, [columns, rows, scanDirection, scannerImage]);

  if (!isOpen) return null;

  // Scanner modal step
  if (showScanner && scannerImage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-slate-900 rounded-lg shadow-xl p-6 w-full max-w-lg relative">
          <button className="absolute top-2 right-2 text-white text-2xl hover:text-red-400" onClick={() => setShowScanner(false)}>×</button>
          <h2 className="text-xl font-bold text-blue-400 mb-2 text-center">Scan & Cut Frames</h2>
          <div className="flex flex-col items-center mb-4">
            <img src={scannerImage} alt="Spritesheet" className="w-64 h-32 object-contain border-2 border-blue-500 mb-2" />
            <div className="flex gap-2 mb-2">
              <label className="text-white">Scan Direction:</label>
              <select value={scanDirection} onChange={e => setScanDirection(e.target.value as 'horizontal' | 'vertical')} className="bg-slate-800 text-white rounded px-2 py-1">
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>
            <div className="flex gap-2 mb-2">
              <label className="text-white">Columns:</label>
              <input type="number" min={1} max={32} value={columns} onChange={e => setColumns(Number(e.target.value))} className="w-16 px-2 py-1 rounded bg-slate-800 text-white border border-slate-600" />
              <label className="text-white">Rows:</label>
              <input type="number" min={1} max={32} value={rows} onChange={e => setRows(Number(e.target.value))} className="w-16 px-2 py-1 rounded bg-slate-800 text-white border border-slate-600" />
              <button className="px-2 py-1 bg-slate-700 text-white rounded hover:bg-blue-600" title="Re-detect frames" onClick={() => {
                const img = new window.Image();
                img.src = scannerImage;
                img.onload = () => {
                  let likelyCols = Math.round(img.width / img.height);
                  let likelyRows = 1;
                  if (scanDirection === 'vertical') {
                    likelyRows = Math.round(img.height / img.width);
                    likelyCols = 1;
                  }
                  setColumns(likelyCols > 1 ? likelyCols : 1);
                  setRows(likelyRows > 1 ? likelyRows : 1);
                  cutFramesFromImage(img, likelyCols, likelyRows, scanDirection);
                };
              }}>Refresh</button>
            </div>
            <div className="flex gap-2 overflow-x-auto p-2 bg-slate-800 rounded">
              {scanDirection === 'horizontal' ? (
                scannerFrames.map((frame, idx) => (
                  <img key={idx} src={frame} alt={`Frame ${idx}`} className="w-16 h-16 object-contain border-2 border-blue-400 rounded" />
                ))
              ) : (
                // vertical: show as columns
                Array.from({ length: columns }).map((_, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-2">
                    {Array.from({ length: rows }).map((_, rowIdx) => {
                      const idx = colIdx * rows + rowIdx;
                      return scannerFrames[idx] ? (
                        <img key={idx} src={scannerFrames[idx]} alt={`Frame ${idx}`} className="w-16 h-16 object-contain border-2 border-blue-400 rounded" />
                      ) : null;
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button className="px-6 py-2 bg-slate-600 text-white rounded hover:bg-slate-500 font-bold" onClick={() => setShowScanner(false)}>Cancel</button>
            <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 font-bold" onClick={() => {
              setFrames(prev => [...prev, ...scannerFrames]);
              setShowScanner(false);
            }}>Apply Frames</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-slate-900 rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-white text-2xl hover:text-red-400"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-blue-400 mb-2 text-center">
          Edit {direction.toUpperCase()} Frames
        </h2>
        {/* Large preview */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-72 h-72 bg-slate-800 rounded flex items-center justify-center border-2 border-blue-500 mb-2">
            {frames.length > 0 ? (
              <img
                src={frames[currentFrame]}
                alt={`Frame ${currentFrame}`}
                className="w-64 h-64 object-contain"
              />
            ) : (
              <span className="text-white">No Frames</span>
            )}
          </div>
          <div className="flex gap-2 mb-2">
            <button
              className="px-2 py-1 bg-slate-700 text-white rounded hover:bg-blue-600"
              onClick={() => setCurrentFrame(f => Math.max(0, f - 1))}
              disabled={currentFrame === 0}
            >
              ◀
            </button>
            <span className="text-white">{currentFrame + 1} / {frames.length}</span>
            <button
              className="px-2 py-1 bg-slate-700 text-white rounded hover:bg-blue-600"
              onClick={() => setCurrentFrame(f => Math.min(frames.length - 1, f + 1))}
              disabled={currentFrame === frames.length - 1}
            >
              ▶
            </button>
            <button
              className={`px-2 py-1 rounded ${isPlaying ? 'bg-blue-600' : 'bg-slate-700'} text-white ml-4`}
              onClick={() => setIsPlaying(p => !p)}
              disabled={frames.length <= 1}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        </div>
        {/* Thumbnails row */}
        <div className="flex gap-2 overflow-x-auto mb-4 p-2 bg-slate-800 rounded">
          {frames.map((frame, idx) => (
            <div key={idx} className={`relative w-16 h-16 border-2 rounded ${currentFrame === idx ? 'border-blue-500' : 'border-slate-600'}`}>
              <img
                src={frame}
                alt={`Frame ${idx}`}
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => setCurrentFrame(idx)}
              />
              <button
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-400"
                onClick={() => {
                  onRemoveFrame(idx);
                  setFrames(frames => frames.filter((_, i) => i !== idx));
                  setCurrentFrame(f => Math.max(0, f - (f === idx ? 1 : 0)));
                }}
                title="Remove frame"
              >
                ×
              </button>
            </div>
          ))}
          {/* Add frames button */}
          <label className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-blue-400 rounded cursor-pointer hover:bg-blue-900">
            <span className="text-blue-400 text-2xl">+</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={async e => {
                if (e.target.files) {
                  if (e.target.files.length === 1) {
                    handleScanFrames(e.target.files[0]);
                  } else {
                    // Add all selected files as frames
                    const files = Array.from(e.target.files);
                    const newFrames: string[] = [];
                    for (const file of files) {
                      const reader = new FileReader();
                      await new Promise<void>(resolve => {
                        reader.onload = evt => {
                          if (evt.target?.result) newFrames.push(evt.target.result as string);
                          resolve();
                        };
                        reader.readAsDataURL(file);
                      });
                    }
                    setFrames(prev => [...prev, ...newFrames]);
                  }
                }
              }}
            />
          </label>
        </div>
        {/* Animation properties */}
        <div className="flex items-center gap-4 mb-4">
          <label className="text-white flex items-center gap-2">
            Speed:
            <input
              type="number"
              min={1}
              max={60}
              value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded bg-slate-800 text-white border border-slate-600"
            />
            fps
          </label>
          <label className="text-white flex items-center gap-2">
            <input
              type="checkbox"
              checked={loop}
              onChange={e => setLoop(e.target.checked)}
              className="accent-blue-500"
            />
            Loop
          </label>
        </div>
        {/* Save and Cancel buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="px-6 py-2 bg-slate-600 text-white rounded hover:bg-slate-500 font-bold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 font-bold"
            onClick={() => onSave(frames, speed, loop)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrameEditorModal; 