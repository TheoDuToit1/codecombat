import React, { useState, useRef } from "react";

export default function SpriteEditor() {
  const [image, setImage] = useState<File | null>(null);
  const [frameWidth, setFrameWidth] = useState(16);
  const [frameHeight, setFrameHeight] = useState(16);
  const [frames, setFrames] = useState<HTMLCanvasElement[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [gridInfo, setGridInfo] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));

    const img = new Image();
    img.onload = () => {
      const cols = Math.floor(img.width / frameWidth);
      const rows = Math.floor(img.height / frameHeight);
      const ctxFrames: HTMLCanvasElement[] = [];
      const tags: string[] = [];

      setGridInfo(`${cols} × ${rows} grid (${cols * rows} frames detected)`);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const canvas = document.createElement("canvas");
          canvas.width = frameWidth;
          canvas.height = frameHeight;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(
            img,
            x * frameWidth,
            y * frameHeight,
            frameWidth,
            frameHeight,
            0,
            0,
            frameWidth,
            frameHeight
          );
          ctxFrames.push(canvas);
          tags.push("");
        }
      }
      setFrames(ctxFrames);
      setTags(tags);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const spriteData = frames.map((frame, i) => ({
        tag: tags[i] || `frame-${i}`,
        dataUrl: frame.toDataURL()
      }));
      
      await fetch("/api/sprites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spriteData })
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving sprites:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFrameWidthChange = (value: number) => {
    setFrameWidth(value);
    if (image && previewUrl) {
      const img = new Image();
      img.onload = () => {
        const cols = Math.floor(img.width / value);
        const rows = Math.floor(img.height / frameHeight);
        setGridInfo(`${cols} × ${rows} grid (${cols * rows} frames detected)`);
      };
      img.src = previewUrl;
    }
  };

  const handleFrameHeightChange = (value: number) => {
    setFrameHeight(value);
    if (image && previewUrl) {
      const img = new Image();
      img.onload = () => {
        const cols = Math.floor(img.width / frameWidth);
        const rows = Math.floor(img.height / value);
        setGridInfo(`${cols} × ${rows} grid (${cols * rows} frames detected)`);
      };
      img.src = previewUrl;
    }
  };

  const handleExtractFrames = () => {
    if (!image || !previewUrl) return;
    
    const img = new Image();
    img.onload = () => {
      const cols = Math.floor(img.width / frameWidth);
      const rows = Math.floor(img.height / frameHeight);
      const ctxFrames: HTMLCanvasElement[] = [];
      const newTags: string[] = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const canvas = document.createElement("canvas");
          canvas.width = frameWidth;
          canvas.height = frameHeight;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(
            img,
            x * frameWidth,
            y * frameHeight,
            frameWidth,
            frameHeight,
            0,
            0,
            frameWidth,
            frameHeight
          );
          ctxFrames.push(canvas);
          newTags.push("");
        }
      }
      setFrames(ctxFrames);
      setTags(newTags);
    };
    img.src = previewUrl;
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Sprite Sheet Extractor</h1>
        <p className="text-gray-400">Upload a sprite sheet and extract individual frames</p>
      </div>
      
      {/* Upload Section */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Upload Area */}
          <div className="flex-1">
            <div 
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Sprite Sheet Preview" 
                    className="max-h-64 mx-auto object-contain"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewUrl(null);
                      setImage(null);
                      setFrames([]);
                      setTags([]);
                      setGridInfo(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-400 mb-1">Click to upload a sprite sheet</p>
                  <p className="text-gray-500 text-sm">PNG or JPEG recommended</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
          
          {/* Settings Area */}
          <div className="flex-1 bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Frame Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Frame Width</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={frameWidth}
                    onChange={(e) => handleFrameWidthChange(Number(e.target.value))}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full"
                    min="1"
                  />
                  <span className="text-gray-400 ml-2">px</span>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Frame Height</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={frameHeight}
                    onChange={(e) => handleFrameHeightChange(Number(e.target.value))}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full"
                    min="1"
                  />
                  <span className="text-gray-400 ml-2">px</span>
                </div>
              </div>
              
              {gridInfo && (
                <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-3 mt-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-blue-300">{gridInfo}</span>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleExtractFrames}
                disabled={!image}
                className={`w-full py-3 rounded-lg flex items-center justify-center font-medium ${
                  image 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Extract Frames
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Frames Section */}
      {frames.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Extracted Frames ({frames.length})</h2>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-2 rounded-lg flex items-center ${
                isSaving
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : saveSuccess
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Saved!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                  </svg>
                  Save to Library
                </>
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {frames.map((canvas, i) => (
              <div key={i} className="bg-gray-700 rounded-lg p-2 hover:bg-gray-600 transition-colors">
                <div className="flex justify-center items-center bg-black/40 rounded mb-2 p-2">
                  <div
                    dangerouslySetInnerHTML={{ __html: canvas.outerHTML }}
                    className="border border-gray-600 rounded"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Frame ${i}`}
                    value={tags[i]}
                    onChange={(e) => handleTagChange(i, e.target.value)}
                    className="bg-gray-800 text-white text-xs px-2 py-1 rounded w-full"
                  />
                  <div className="absolute right-2 top-1 text-xs text-gray-500">#{i}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 