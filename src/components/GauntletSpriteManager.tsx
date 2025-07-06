import React, { useState, useEffect } from 'react';
import { GAUNTLET_SECTIONS, GAUNTLET_OBJECT_TYPES, saveGauntletSprite, listGauntletObjects, deleteGauntletObject } from '../utils/gauntletSpriteSheetSaver';
import ConfirmDialog from './ConfirmDialog';

interface GauntletSpriteManagerProps {
  frames: string[];
  onClose: () => void;
  onSaved?: () => void;
}

const GauntletSpriteManager: React.FC<GauntletSpriteManagerProps> = ({ frames, onClose, onSaved }) => {
  const [section, setSection] = useState(1);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState(GAUNTLET_OBJECT_TYPES[0]);
  const [color, setColor] = useState('#FFFFFF');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [existingObjects, setExistingObjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  // Load existing objects when section changes
  useEffect(() => {
    const loadObjects = async () => {
      try {
        setIsLoading(true);
        const objects = await listGauntletObjects(section);
        setExistingObjects(markEssentialObjects(objects || []));
      } catch (error) {
        console.error('Error loading gauntlet objects:', error);
        setErrorMessage('Failed to load existing objects');
      } finally {
        setIsLoading(false);
      }
    };

    loadObjects();
  }, [section]);

  // Generate a unique code suggestion when type changes
  useEffect(() => {
    const generateCode = () => {
      // Get first letter of type
      const typePrefix = type.charAt(0).toUpperCase();
      
      // Find existing codes with this prefix
      const existingCodes = existingObjects
        .filter(obj => obj.code.startsWith(typePrefix))
        .map(obj => obj.code);
      
      // Find next available number (supports up to 2 digits for a 3-char total)
      let num = 1;
      while (existingCodes.includes(`${typePrefix}${num}`) && num < 100) {
        num++;
      }
      
      // Just return the concatenated string
      return `${typePrefix}${num}`;
    };
    
    setCode(generateCode());
  }, [type, existingObjects]);

  // Add a helper function to mark essential objects
  const markEssentialObjects = (objects: any[]) => {
    const essentialWallTypes = ['WH', 'WV', 'WL', 'WR', 'LT', 'RT', 'LB', 'RB'];
    return objects.map(obj => ({
      ...obj,
      isEssential: essentialWallTypes.includes(obj.code)
    }));
  };

  const handleSave = async () => {
    if (!frames.length) {
      setErrorMessage('No frames available to save');
      return;
    }

    if (!code) {
      setErrorMessage('Code is required');
      return;
    }

    if (code.length > 3) {
      setErrorMessage('Code must be 3 characters or less');
      return;
    }

    if (!name) {
      setErrorMessage('Name is required');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);
      
      // Save the selected frame as a gauntlet object
      await saveGauntletSprite(
        section,
        code.trim().toUpperCase(),
        name,
        type,
        color,
        frames[selectedFrame]
      );
      
      setSuccessMessage(`Sprite saved successfully to ${GAUNTLET_SECTIONS.find(s => s.id === section)?.name}`);
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Refresh the list of objects
      const objects = await listGauntletObjects(section);
      setExistingObjects(markEssentialObjects(objects || []));
      
      // Call the onSaved callback if provided
      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error('Error saving gauntlet sprite:', error);
      
      // Show a more detailed error message
      let errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      // Check for specific error types and provide more helpful messages
      if (errorMsg.includes('value too long for type character varying')) {
        errorMsg = `Failed to save: Code is too long. Due to database constraints, please use 2 characters or less.`;
      } else if (errorMsg.includes('permission denied') || errorMsg.includes('violates row-level security policy')) {
        errorMsg = `Failed to upload sprite image: Storage permission denied. Please check Supabase storage bucket permissions.`;
      } else if (errorMsg.includes('413')) {
        errorMsg = `Failed to upload: Image too large. Please use a smaller image (max 5MB).`;
      } else if (errorMsg.includes('429')) {
        errorMsg = `Failed to upload: Too many requests. Please try again later.`;
      }
      
      setErrorMessage(`Failed to save: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (objectCode: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Object',
      message: `Are you sure you want to delete object with code "${objectCode}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteGauntletObject(section, objectCode);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          
          // Refresh the list of objects
          const objects = await listGauntletObjects(section);
          setExistingObjects(markEssentialObjects(objects || []));
          
          setSuccessMessage('Object deleted successfully');
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
          console.error('Error deleting gauntlet object:', error);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          setErrorMessage(`Failed to delete object: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      type: 'danger'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-slate-900 p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-400">Gauntlet Sprite Manager</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        {errorMessage && (
          <div className="bg-red-900 text-white p-3 rounded-lg mb-4 whitespace-pre-line">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-900 text-white p-3 rounded-lg mb-4">
            {successMessage}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side: Sprite selection and form */}
          <div>
            <h3 className="text-lg font-bold text-blue-300 mb-2">Select Frame to Save</h3>
            
            <div className="flex gap-2 flex-wrap bg-slate-800 p-4 rounded-lg mb-4 max-h-40 overflow-y-auto">
              {frames.map((frame, idx) => (
                <img 
                  key={idx} 
                  src={frame} 
                  alt={`Frame ${idx}`} 
                  className={`w-16 h-16 object-contain border-2 rounded cursor-pointer ${selectedFrame === idx ? 'border-blue-400' : 'border-slate-600 hover:border-blue-200'}`}
                  onClick={() => setSelectedFrame(idx)}
                />
              ))}
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-blue-300 mb-4">Save as Gauntlet Object</h3>
              
              <div className="mb-4">
                <label className="block text-white mb-2">Gauntlet Section / Database Table</label>
                <select
                  value={section}
                  onChange={(e) => setSection(Number(e.target.value))}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg p-2"
                >
                  {GAUNTLET_SECTIONS.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name} (Levels {section.levels}) - {section.table}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-white mb-2">Object Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg p-2"
                >
                  {GAUNTLET_OBJECT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-white mb-2">Code (3 characters or less)</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 3))}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg p-2"
                  placeholder="E.g. WHL, WAL, F01"
                  maxLength={3}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-white mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg p-2"
                  placeholder="E.g. Stone Wall, Fire Dragon"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-white mb-2">Color (for map editor)</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10 bg-slate-700 border border-slate-600 rounded-lg p-1"
                  />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                      </svg>
                      Save Object
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Right side: Existing objects */}
          <div>
            <h3 className="text-lg font-bold text-blue-300 mb-2">
              Existing Objects - {GAUNTLET_SECTIONS.find(s => s.id === section)?.name} ({GAUNTLET_SECTIONS.find(s => s.id === section)?.table})
            </h3>
            <div className="bg-slate-800 p-4 rounded-lg h-[calc(100%-2rem)] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : existingObjects.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No objects found for this section
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {existingObjects.map((obj) => (
                    <div 
                      key={obj.id} 
                      className={`p-2 rounded flex items-center justify-between ${
                        obj.isEssential 
                          ? 'bg-blue-900 border border-blue-700' 
                          : 'bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center">
                      <div 
                          className="w-6 h-6 rounded mr-2" 
                        style={{ backgroundColor: obj.color || '#FFFFFF' }}
                        />
                        <div>
                          <div className="font-bold">{obj.code}</div>
                          <div className="text-sm text-gray-300">{obj.name}</div>
                          <div className="text-xs text-gray-400">{obj.type}</div>
                        </div>
                      </div>
                      {obj.image_url ? (
                        <div className="flex items-center gap-2">
                          <img 
                            src={obj.image_url} 
                            alt={obj.name}
                            className="w-8 h-8 object-contain"
                          />
                          <button
                            onClick={() => handleDelete(obj.code)}
                            className="text-red-400 hover:text-red-300"
                            title="Delete entire object including code"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {!obj.isEssential && (
                      <button
                        onClick={() => handleDelete(obj.code)}
                              className="text-red-400 hover:text-red-300 ml-2"
                        title="Delete object"
                      >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
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
};

export default GauntletSpriteManager; 