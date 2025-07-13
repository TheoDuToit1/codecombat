import { useState, useRef } from "react";
import AssetLibraryService, { Asset } from "../services/AssetLibraryService";
import AssetLibrary from "../components/AssetLibrary";
import ConfirmDialog from "../components/ConfirmDialog";
import { ArrowLeft } from "lucide-react";
import CharacterAnimationWorkshop from '../components/CharacterAnimationWorkshop';
import FrameEditorModal from '../components/FrameEditorModal';
import { SPRITE_CATEGORIES, saveSpriteSheet } from '../utils/spriteSheetSaver';

export default function AssetWorkshop({ onBack }: { onBack: () => void }) {
  const [behaviorCode, setBehaviorCode] = useState("// Example: moveToward(hero.position)");
  const [activeTab, setActiveTab] = useState("sprite");
  const [frameWidth, setFrameWidth] = useState(16);
  const [frameHeight, setFrameHeight] = useState(16);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  });
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [spriteSheetName, setSpriteSheetName] = useState('');
  const [spriteSheetCategory, setSpriteSheetCategory] = useState(SPRITE_CATEGORIES[0]);
  const [spriteSheetTags, setSpriteSheetTags] = useState<string[]>([]);
  const [spriteSheetTagInput, setSpriteSheetTagInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const assetService = AssetLibraryService.getInstance();

  const [spriteSheetModalOpen, setSpriteSheetModalOpen] = useState(false);
  const [sheetFrames, setSheetFrames] = useState<string[]>([]);

  const resetForm = () => {
    setBehaviorCode("// Example: moveToward(hero.position)");
    setSelectedAsset(null);
    setFrameWidth(16);
    setFrameHeight(16);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    setBehaviorCode(asset.behaviorCode);
    setFrameWidth(asset.frameWidth);
    setFrameHeight(asset.frameHeight);
    setActiveTab("sprite");
  };

  const handleAssetDelete = (asset: Asset) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Asset',
      message: `Are you sure you want to delete "${asset.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await assetService.deleteAsset(asset.id);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          if (selectedAsset?.id === asset.id) {
            resetForm();
          }
        } catch (error) {
          console.error("Error deleting asset:", error);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          setErrorMessage(`Failed to delete asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      type: 'danger'
    });
  };

  const addSpriteSheetTag = () => {
    if (spriteSheetTagInput.trim() && !spriteSheetTags.includes(spriteSheetTagInput.trim())) {
      setSpriteSheetTags(prev => [...prev, spriteSheetTagInput.trim()]);
      setSpriteSheetTagInput('');
    }
  };

  const removeSpriteSheetTag = (tag: string) => {
    setSpriteSheetTags(spriteSheetTags.filter(t => t !== tag));
  };

  const handleSpriteSave = async () => {
    if (!spriteSheetName) {
      setErrorMessage('Please provide a name for the sprite sheet');
      return;
    }

    if (!sheetFrames.length) {
      setErrorMessage('No frames detected. Please cut the sprite sheet first.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);
      
      // Format data for animations table
      const spriteData = {
        frames: sheetFrames,
        frameWidth,
        frameHeight,
        grid: { cols: Math.ceil(Math.sqrt(sheetFrames.length)), rows: Math.ceil(sheetFrames.length / Math.ceil(Math.sqrt(sheetFrames.length))) }
      };
      
      // Convert tags from array of strings to array of strings
      const tagArray = spriteSheetTags;
      
      await saveSpriteSheet(
        spriteSheetName,
        spriteSheetCategory,
        tagArray,
        spriteData
      );
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      setShowSaveModal(false);
      setErrorMessage('Sprite sheet saved successfully!');
      
      // Clear the frames after successful save
      setSheetFrames([]);
      setSpriteSheetName('');
      setSpriteSheetTags([]);
      setSpriteSheetTagInput('');
      
      // If we're currently on the library tab, refresh it to show the new asset
      if (activeTab === 'library') {
        // Trigger a refresh of the AssetLibrary component
        // This is a bit of a hack, but it works by toggling to another tab and back
        setActiveTab('sprite');
        setTimeout(() => setActiveTab('library'), 100);
      }
    } catch (error) {
      console.error('Error saving sprite sheet:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error';
      setErrorMessage(`Failed to save: ${errorMessage}`);
      
      // Show more detailed error in the console
      if (typeof error === 'object' && error !== null) {
        console.error('Detailed error:', JSON.stringify(error, null, 2));
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-white bg-slate-950">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded flex items-center border border-slate-700"
          title="Back to Dashboard"
        >
          <ArrowLeft size={18} />
          <span className="ml-1 text-base">Back</span>
        </button>
        <h1 className="text-3xl font-bold ml-4 text-white">🔧 The Asset Workshop</h1>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-slate-700">
          <button
            className={`px-4 py-2 flex-1 min-w-28 ${activeTab === 'sprite' ? 'text-blue-400 border-b-2 border-blue-400 font-bold' : 'text-slate-300 hover:text-white'}`}
            onClick={() => setActiveTab('sprite')}
          >
            Sprite Sheet
          </button>
          <button
            className={`px-4 py-2 flex-1 min-w-28 ${activeTab === 'behavior' ? 'text-blue-400 border-b-2 border-blue-400 font-bold' : 'text-slate-300 hover:text-white'}`}
            onClick={() => setActiveTab('behavior')}
          >
            Behavior Logic
          </button>
          <button
            className={`px-4 py-2 flex-1 min-w-28 ${activeTab === 'library' ? 'text-blue-400 border-b-2 border-blue-400 font-bold' : 'text-slate-300 hover:text-white'}`}
            onClick={() => setActiveTab('library')}
          >
            Asset Library
          </button>
          <button
            className={`px-4 py-2 flex-1 min-w-28 ${activeTab === 'character-animation' ? 'text-blue-400 border-b-2 border-blue-400 font-bold' : 'text-slate-300 hover:text-white'}`}
            onClick={() => setActiveTab('character-animation')}
          >
            Character Animation
          </button>
        </div>
      </div>

      {activeTab === 'sprite' && (
        <div className="p-6">
          <div className="flex gap-4 mb-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg"
              onClick={() => setSpriteSheetModalOpen(true)}
            >
              Upload Sprite Sheet
            </button>
            
            {sheetFrames.length > 0 && (
              <div className="flex gap-2">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg flex items-center gap-2"
                  onClick={() => setShowSaveModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save to Database
                </button>
              </div>
            )}
          </div>
          
          {spriteSheetModalOpen && (
            <FrameEditorModal
              isOpen={spriteSheetModalOpen}
              direction={"sprite"}
              frames={[]}
              onAddFrames={() => {}}
              onRemoveFrame={() => {}}
              onSave={(frames) => { setSheetFrames(frames as string[]); setSpriteSheetModalOpen(false); }}
              onClose={() => setSpriteSheetModalOpen(false)}
            />
          )}
          {sheetFrames.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-blue-300 mb-2">Cut Frames Preview</h3>
              <div className="flex gap-2 flex-wrap bg-slate-800 p-4 rounded-lg">
                {sheetFrames.map((frame, idx) => (
                  <img key={idx} src={frame} alt={`Frame ${idx}`} className="w-16 h-16 object-contain border-2 border-blue-400 rounded" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'behavior' && (
        <div className="bg-slate-900 rounded-lg p-6 mb-6 border border-slate-800 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Behavior Logic</h2>
          <div className="mb-4">
            <p className="text-blue-300 mb-2">
              Define how this asset behaves in the game. You can use the following functions:
            </p>
            <ul className="list-disc list-inside text-white mb-4">
              <li>moveToward(position) - Move toward a position</li>
              <li>moveAway(position) - Move away from a position</li>
              <li>attack(target) - Attack a target</li>
              <li>wander() - Move randomly</li>
              <li>idle() - Stay in place</li>
            </ul>
            <textarea 
              className="w-full h-64 bg-slate-800 text-white p-3 rounded border border-slate-700 font-mono text-sm"
              value={behaviorCode}
              onChange={e => setBehaviorCode(e.target.value)}
              placeholder="// Write your behavior code here"
            ></textarea>
          </div>
        </div>
      )}

      {activeTab === 'library' && (
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Asset Library</h2>
          <AssetLibrary 
            onAssetSelect={handleAssetSelect} 
            onAssetDelete={handleAssetDelete}
            selectedAssetId={selectedAsset?.id}
          />
        </div>
      )}

      {activeTab === 'character-animation' && (
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 shadow-lg">
          <CharacterAnimationWorkshop />
        </div>
      )}
      
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-slate-900 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Save Sprite Sheet</h3>
            
            {errorMessage && (
              <div className="bg-red-900 text-white p-3 rounded-lg mb-4">
                {errorMessage}
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
                onClick={() => setShowSaveModal(false)}
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

      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        type={confirmDialog.type}
      />
    </div>
  );
} 