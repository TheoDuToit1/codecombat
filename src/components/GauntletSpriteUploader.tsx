import React, { useState, useEffect, useRef } from 'react';
import { Upload, Save, X, Check, ArrowLeft, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface GauntletSpriteUploaderProps {
  section: number;
  onBack: () => void;
  onSpriteUpdate?: () => void;
}

interface GauntletObject {
  id?: string;
  code: string;
  name: string;
  color: string;
  image_url?: string;
  type: string;
}

export const GauntletSpriteUploader: React.FC<GauntletSpriteUploaderProps> = ({
  section,
  onBack,
  onSpriteUpdate
}) => {
  const [objects, setObjects] = useState<GauntletObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedObject, setSelectedObject] = useState<GauntletObject | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Section names
  const sectionNames = [
    'Dungeon Depths',
    'Crystal Caverns',
    'Logic Labyrinth',
    'Master\'s Tower'
  ];

  // Load objects for the current section
  useEffect(() => {
    const loadObjects = async () => {
      setLoading(true);
      try {
        const tableName = `gauntlet_objects${section}`;
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('code');
        
        if (error) throw error;
        
        setObjects(data || []);
      } catch (error) {
        console.error('Error loading objects:', error);
        setMessage('Failed to load objects');
      } finally {
        setLoading(false);
      }
    };
    
    loadObjects();
  }, [section]);

  // Handle object selection
  const handleSelectObject = (object: GauntletObject) => {
    setSelectedObject(object);
    setImagePreview(object.image_url || null);
    setImageFile(null);
    setMessage('');
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle upload button click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle saving the sprite
  const handleSaveSprite = async () => {
    if (!selectedObject) {
      setMessage('No object selected');
      return;
    }

    if (!imageFile && !selectedObject.image_url) {
      setMessage('No image selected');
      return;
    }

    setSaving(true);
    setMessage('Saving...');

    try {
      const tableName = `gauntlet_objects${section}`;
      let image_url = selectedObject.image_url;

      // If there's a new image file, upload it
      if (imageFile) {
        const fileName = `${section}_${selectedObject.code}_${Date.now()}.png`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('gauntlet_sprites')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: urlData } = await supabase.storage
          .from('gauntlet_sprites')
          .getPublicUrl(fileName);

        image_url = urlData.publicUrl;
      }

      // Update the object in the database
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ image_url })
        .eq('id', selectedObject.id);

      if (updateError) throw updateError;

      // Update local state
      setObjects(objects.map(obj => 
        obj.id === selectedObject.id ? { ...obj, image_url } : obj
      ));
      
      setSelectedObject({
        ...selectedObject,
        image_url
      });

      setMessage('Sprite saved successfully');
      
      // Notify parent component if needed
      if (onSpriteUpdate) {
        onSpriteUpdate();
      }
    } catch (error) {
      console.error('Error saving sprite:', error);
      setMessage('Failed to save sprite');
    } finally {
      setSaving(false);
    }
  };

  // Handle removing a sprite
  const handleRemoveSprite = async () => {
    if (!selectedObject || !selectedObject.image_url) {
      return;
    }

    setSaving(true);
    setMessage('Removing sprite...');

    try {
      const tableName = `gauntlet_objects${section}`;
      
      // Update the object in the database to remove the image_url
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ image_url: null })
        .eq('id', selectedObject.id);

      if (updateError) throw updateError;

      // Update local state
      setObjects(objects.map(obj => 
        obj.id === selectedObject.id ? { ...obj, image_url: null } : obj
      ));
      
      setSelectedObject({
        ...selectedObject,
        image_url: null
      });
      
      setImagePreview(null);
      setImageFile(null);

      setMessage('Sprite removed successfully');
      
      // Notify parent component if needed
      if (onSpriteUpdate) {
        onSpriteUpdate();
      }
    } catch (error) {
      console.error('Error removing sprite:', error);
      setMessage('Failed to remove sprite');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <div className="flex items-center mb-4">
        <button 
          onClick={onBack}
          className="mr-2 p-2 bg-gray-800 rounded hover:bg-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">
          Sprite Uploader - {sectionNames[section - 1]}
        </h1>
      </div>
      
      {message && (
        <div className={`p-2 mb-4 rounded ${message.includes('success') ? 'bg-green-800' : 'bg-red-800'}`}>
          {message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Object List */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl mb-4">Object Codes</h2>
          
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <RefreshCw className="animate-spin mr-2" />
              Loading objects...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-[70vh] overflow-y-auto">
              {objects.map(object => (
                <div 
                  key={object.id} 
                  className={`p-2 rounded cursor-pointer ${selectedObject?.id === object.id ? 'bg-blue-700' : 'bg-gray-700'} hover:bg-blue-600`}
                  onClick={() => handleSelectObject(object)}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-6 h-6 mr-2 rounded" 
                      style={{ backgroundColor: object.color }}
                    />
                    <div>
                      <div className="font-bold">{object.code}</div>
                      <div className="text-xs text-gray-300">{object.name}</div>
                    </div>
                  </div>
                  {object.image_url && (
                    <div className="mt-1 text-xs text-green-400">Has sprite</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Sprite Editor */}
        <div className="bg-gray-800 p-4 rounded col-span-2">
          <h2 className="text-xl mb-4">Sprite Editor</h2>
          
          {selectedObject ? (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-bold">{selectedObject.name} ({selectedObject.code})</h3>
                <div className="flex items-center mt-2">
                  <div 
                    className="w-8 h-8 mr-2 rounded" 
                    style={{ backgroundColor: selectedObject.color }}
                  />
                  <div>Color: {selectedObject.color}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg">Current Sprite</h3>
                </div>
                
                <div className="border border-gray-600 rounded p-4 bg-gray-700 flex items-center justify-center min-h-[200px]">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt={selectedObject.name}
                      className="max-h-[180px] max-w-full"
                    />
                  ) : (
                    <div className="text-gray-400">No sprite assigned</div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 mb-4">
                <button 
                  onClick={handleUploadClick}
                  className="flex items-center px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                  disabled={saving}
                >
                  <Upload size={16} className="mr-1" />
                  Upload New Sprite
                </button>
                
                {imagePreview && (
                  <button 
                    onClick={handleRemoveSprite}
                    className="flex items-center px-4 py-2 bg-red-600 rounded hover:bg-red-500"
                    disabled={saving}
                  >
                    <X size={16} className="mr-1" />
                    Remove Sprite
                  </button>
                )}
              </div>
              
              {imageFile && (
                <div className="flex space-x-2">
                  <button 
                    onClick={handleSaveSprite}
                    className="flex items-center px-4 py-2 bg-green-600 rounded hover:bg-green-500"
                    disabled={saving}
                  >
                    <Save size={16} className="mr-1" />
                    Save Changes
                  </button>
                  
                  <button 
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(selectedObject.image_url || null);
                    }}
                    className="flex items-center px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                    disabled={saving}
                  >
                    <X size={16} className="mr-1" />
                    Cancel
                  </button>
                </div>
              )}
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png,image/jpeg,image/gif"
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 text-gray-400">
              Select an object from the list to edit its sprite
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GauntletSpriteUploader; 