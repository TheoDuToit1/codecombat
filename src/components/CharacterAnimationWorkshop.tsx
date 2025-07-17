import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ACTIONS, DIRECTIONS, DIRECTION_LABELS } from '../data/classes';
import { CHARACTER_CLASSES, getCharacterClassById } from '../data/characterClasses';
import { ENEMY_CLASSES, getEnemyClassById } from '../data/enemyClasses';
import { 
  saveCharacterAnimation, 
  updateCharacterAnimation, 
  saveAnimationSection, 
  saveOrUpdateCharacterAnimation,
  getCharacterAnimationById,
  CharacterAnimation,
  FramesState as DBFramesState,
  checkCharacterNameDuplicate,
  listCharacterAnimations
} from '../utils/characterAnimationSaver';
import FrameEditorModal from './FrameEditorModal';

interface CharacterAnimationWorkshopProps {
  className?: string;
  initialAnimationId?: string;
}

type ActionKey = typeof ACTIONS[number];
type DirectionKey = typeof DIRECTIONS[number];

type FramesState = Record<ActionKey, Record<DirectionKey, string[]>>;

interface ActionDirectionCompassProps {
  action: ActionKey;
  frames: Record<DirectionKey, string[]>;
  onAddFrames: (direction: DirectionKey) => void;
  onRemoveFrame: (direction: DirectionKey, index: number) => void;
  isEdited: boolean;
  onSave: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

function ActionDirectionCompass({ action, frames, onAddFrames, onRemoveFrame, isEdited, onSave, isPlaying, onTogglePlay }: ActionDirectionCompassProps) {
  const [selectedDirection, setSelectedDirection] = useState<DirectionKey>('s');
  const [showPreview, setShowPreview] = useState(true); // Auto-show preview
  const [currentFrames, setCurrentFrames] = useState<Record<DirectionKey, number>>(
    Object.fromEntries(DIRECTIONS.map(dir => [dir, 0])) as Record<DirectionKey, number>
  );
  const animationRef = useRef<number | null>(null);
  const keyPressRef = useRef<Record<string, boolean>>({});
  
  // Individual animation refs for each direction
  const directionAnimationRefs = useRef<Record<DirectionKey, number | null>>({
    n: null, ne: null, e: null, se: null, s: null, sw: null, w: null, nw: null
  });
  
  // Individual frame counters for each direction
  const [directionFrames, setDirectionFrames] = useState<Record<DirectionKey, number>>(
    Object.fromEntries(DIRECTIONS.map(dir => [dir, 0])) as Record<DirectionKey, number>
  );

  // Map keyboard keys to directions
  const keyToDirection: Record<string, DirectionKey> = {
    'ArrowUp': 'n',
    'ArrowRight': 'e',
    'ArrowDown': 's',
    'ArrowLeft': 'w',
    'w': 'n',
    'd': 'e',
    's': 's',
    'a': 'w',
  };

  // Handle keyboard input for direction control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keyToDirection[key]) {
        keyPressRef.current[key] = true;
        updateSelectedDirection();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keyToDirection[key]) {
        keyPressRef.current[key] = false;
        updateSelectedDirection();
      }
    };

    const updateSelectedDirection = () => {
      // Determine direction based on key combinations
      let newDir: DirectionKey = 's'; // Default
      
      const up = keyPressRef.current['w'] || keyPressRef.current['ArrowUp'];
      const right = keyPressRef.current['d'] || keyPressRef.current['ArrowRight'];
      const down = keyPressRef.current['s'] || keyPressRef.current['ArrowDown'];
      const left = keyPressRef.current['a'] || keyPressRef.current['ArrowLeft'];
      
      if (up && right) newDir = 'ne';
      else if (up && left) newDir = 'nw';
      else if (down && right) newDir = 'se';
      else if (down && left) newDir = 'sw';
      else if (up) newDir = 'n';
      else if (right) newDir = 'e';
      else if (down) newDir = 's';
      else if (left) newDir = 'w';
      
      setSelectedDirection(newDir);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Set up individual animations for each direction
  useEffect(() => {
    // Clean up any existing animations
    DIRECTIONS.forEach(dir => {
      if (directionAnimationRefs.current[dir]) {
        cancelAnimationFrame(directionAnimationRefs.current[dir]!);
        directionAnimationRefs.current[dir] = null;
      }
    });
    
    // Only start animations if isPlaying is true
    if (!isPlaying) return;
    
    // Start animations for directions with frames
    DIRECTIONS.forEach(dir => {
      if (frames[dir].length <= 1) return;
      
      let lastTime = 0;
      const frameInterval = 150; // ms between frames
      
      const animateDirection = (timestamp: number) => {
        if (!lastTime || timestamp - lastTime >= frameInterval) {
          lastTime = timestamp;
          setDirectionFrames(prev => ({
            ...prev,
            [dir]: (prev[dir] + 1) % frames[dir].length
          }));
        }
        directionAnimationRefs.current[dir] = requestAnimationFrame(animateDirection);
      };
      
      directionAnimationRefs.current[dir] = requestAnimationFrame(animateDirection);
    });
    
    return () => {
      // Cleanup all animations on unmount or when effect dependencies change
      DIRECTIONS.forEach(dir => {
        if (directionAnimationRefs.current[dir]) {
          cancelAnimationFrame(directionAnimationRefs.current[dir]!);
          directionAnimationRefs.current[dir] = null;
        }
      });
    };
  }, [frames, isPlaying]); // Add isPlaying to dependencies

  // Positions for the 8-direction compass
  const getPosition = (dir: DirectionKey): { x: string, y: string } => {
    // Create a tighter circle in the center
    const centerX = 50;
    const centerY = 50;
    const radius = 15; // Even smaller radius for tighter circle
    
    // Calculate positions based on angle
    const angles: Record<DirectionKey, number> = {
      n: 270, // Top (270 degrees)
      ne: 315, // Top-right (315 degrees)
      e: 0,   // Right (0 degrees)
      se: 45,  // Bottom-right (45 degrees)
      s: 90,   // Bottom (90 degrees)
      sw: 135, // Bottom-left (135 degrees)
      w: 180,  // Left (180 degrees)
      nw: 225  // Top-left (225 degrees)
    };
    
    // Convert angle to radians and calculate position
    const angleRad = (angles[dir] * Math.PI) / 180;
    const x = centerX + radius * Math.cos(angleRad);
    const y = centerY + radius * Math.sin(angleRad);
    
    return {
      x: `${x}%`,
      y: `${y}%`
    };
  };

  // Get position for direction label
  const getLabelPosition = (dir: DirectionKey): { top?: string, bottom?: string, left?: string, right?: string, transform?: string } => {
    switch(dir) {
      case 'n': return { top: '-60px', left: '50%', transform: 'translateX(-50%)' };
      case 'ne': return { top: '-50px', right: '-50px' };
      case 'e': return { top: '50%', right: '-60px', transform: 'translateY(-50%)' };
      case 'se': return { bottom: '-50px', right: '-50px' };
      case 's': return { bottom: '-60px', left: '50%', transform: 'translateX(-50%)' };
      case 'sw': return { bottom: '-50px', left: '-50px' };
      case 'w': return { top: '50%', left: '-60px', transform: 'translateY(-50%)' };
      case 'nw': return { top: '-50px', left: '-50px' };
      default: return {};
    }
  };

  // Check if all directions have at least one frame
  const allDirectionsHaveFrames = DIRECTIONS.every(dir => frames[dir].length > 0);

  // Center character animation state
  const [centerFrame, setCenterFrame] = useState(0);
  useEffect(() => {
    if (!isPlaying || frames[selectedDirection].length === 0) {
      setCenterFrame(0);
      return;
    }
    setCenterFrame(0);
    const interval = setInterval(() => {
      setCenterFrame(prev => (prev + 1) % frames[selectedDirection].length);
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying, selectedDirection, frames]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-xl font-bold text-blue-400 mb-4">
        {action} Animation
      </h2>
      
      <div className="relative w-full pt-[90%] mb-8 bg-gradient-to-b from-blue-900/70 to-blue-950 rounded-xl shadow-lg overflow-hidden">
        {/* Center animated character */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {frames[selectedDirection].length > 0 && (
            <img
              src={frames[selectedDirection][centerFrame]}
              alt={selectedDirection}
              className="object-contain w-48 h-48 drop-shadow-lg"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.3))', transform: 'scale(1.3)' }}
            />
          )}
        </div>
        {/* Direction buttons arranged in a compass */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="relative w-full h-full">
            {DIRECTIONS.map(dir => {
              const { x, y } = getPosition(dir);
              const hasFrames = frames[dir].length > 0;
              const isSelected = selectedDirection === dir;
              const labelPosition = getLabelPosition(dir);
              
              return (
                <div
                  key={dir}
                  className="absolute"
                  style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
                >
                  <button
                    type="button"
                    className="relative group focus:outline-none"
                    onClick={() => onAddFrames(dir)}
                    style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, zIndex: 2 }}
                    title={`Edit ${DIRECTION_LABELS[dir]} frames`}
                  >
                    {hasFrames && (
                      <img
                        src={frames[dir][directionFrames[dir]]}
                        alt={dir}
                        className="object-contain w-48 h-48"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.3))', transform: 'scale(1.2)' }}
                      />
                    )}
                    <div
                      className="absolute flex items-center justify-center text-white font-bold shadow-md bg-blue-600 rounded-full w-12 h-12 text-xl"
                      style={labelPosition}
                    >
                      {DIRECTION_LABELS[dir]}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Animation controls */}
      <div className="flex justify-center gap-4 mb-6">
        <button 
          className={`px-6 py-2 rounded-lg ${isPlaying ? 'bg-blue-600' : 'bg-slate-700'} text-white`}
          onClick={onTogglePlay}
        >
          {isPlaying ? 'Pause Animation' : 'Play Animation'}
        </button>
        
        {!allDirectionsHaveFrames && (
          <div className="text-yellow-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Some directions need frames
          </div>
        )}
      </div>

      {/* Save button at the bottom */}
      <div className="flex justify-center mt-2">
        <button
          onClick={onSave}
          disabled={!isEdited}
          className={`px-6 py-3 rounded-lg font-medium transition-colors w-full max-w-md ${
            isEdited 
              ? 'bg-green-600 hover:bg-green-500 text-white' 
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isEdited ? 'Save Changes to ' + action : action + ' (No Changes)'}
        </button>
      </div>
    </div>
  );
}

function normalizeFrames(animations: any) {
  const normalized: FramesState = {} as FramesState;
  ACTIONS.forEach(action => {
    normalized[action] = {} as Record<DirectionKey, string[]>;
    DIRECTIONS.forEach(dir => {
      normalized[action][dir] = (animations?.[action]?.[dir]) || [];
    });
  });
  return normalized;
}

export default function CharacterAnimationWorkshop({ className = '', initialAnimationId }: CharacterAnimationWorkshopProps) {
  // frames[action][direction] = string[]
  const [frames, setFrames] = useState<FramesState>(() => {
    const initial: FramesState = {} as FramesState;
    ACTIONS.forEach(action => {
      initial[action] = { n: [], ne: [], e: [], se: [], s: [], sw: [], w: [], nw: [] };
    });
    return initial;
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<ActionKey | null>(null);
  const [modalDirection, setModalDirection] = useState<DirectionKey | null>(null);
  const [characterName, setCharacterName] = useState<string>('');
  const [tempCharacterName, setTempCharacterName] = useState<string>('');
  const [characterClass, setCharacterClass] = useState<string>('warrior');
  const [isEnemyMode, setIsEnemyMode] = useState<boolean>(false);
  const [animationId, setAnimationId] = useState<string | undefined>(initialAnimationId);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(!!initialAnimationId);
  
  // Track which sections have been edited
  const [editedSections, setEditedSections] = useState<Record<ActionKey, boolean>>(() => {
    const initial: Record<ActionKey, boolean> = {} as Record<ActionKey, boolean>;
    ACTIONS.forEach(action => {
      initial[action] = false;
    });
    return initial;
  });

  // State for flashing reminder
  const [isFlashing, setIsFlashing] = useState(false);
  
  // Animation play state for each section
  const [isPlayingMap, setIsPlayingMap] = useState<Record<ActionKey, boolean>>(() => {
    const map = {} as Record<ActionKey, boolean>;
    ACTIONS.forEach(action => { map[action] = false; }); // All paused by default
    return map;
  });
  
  // Set up flashing effect for the reminder
  useEffect(() => {
    const flashInterval = setInterval(() => {
      setIsFlashing(prev => !prev);
    }, 1500);
    
    return () => clearInterval(flashInterval);
  }, []);
  
  // Initialize temp name from character name
  useEffect(() => {
    setTempCharacterName(characterName);
  }, []);

  // Load animation if initialAnimationId is provided
  useEffect(() => {
    if (initialAnimationId) {
      loadAnimation(initialAnimationId);
    }
  }, [initialAnimationId]);

  // Function to load animation from database
  const loadAnimation = async (id: string) => {
    try {
      setIsLoading(true);
      const animation = await getCharacterAnimationById(id);
      
      if (animation) {
        // Set all the state from the loaded animation
        setCharacterName(animation.name);
        setTempCharacterName(animation.name);
        setCharacterClass(animation.character_class);
        setIsEnemyMode(animation.character_type === 'enemy');
        setFrames(normalizeFrames(animation.animations));
        setAnimationId(animation.id);
        
        // Reset edited sections since we just loaded
        const resetEdited: Record<ActionKey, boolean> = {} as Record<ActionKey, boolean>;
        ACTIONS.forEach(action => {
          resetEdited[action] = false;
        });
        setEditedSections(resetEdited);
      }
    } catch (error) {
      console.error('Error loading animation:', error);
      alert('Failed to load animation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup function to revoke all object URLs
      Object.values(frames).forEach(actionFrames => {
        Object.values(actionFrames).forEach(directionFrames => {
          directionFrames.forEach(url => {
            if (url.startsWith('blob:')) {
              URL.revokeObjectURL(url);
            }
          });
        });
      });
    };
  }, []);

  // Auto-update character name when temp name changes
  useEffect(() => {
    if (tempCharacterName !== characterName) {
      setCharacterName(tempCharacterName);
    }
  }, [tempCharacterName]);

  // Handler to open modal
  const handleEditFrames = (action: ActionKey, direction: DirectionKey) => {
    setModalAction(action);
    setModalDirection(direction);
    setModalOpen(true);
  };

  // Handler to add frames (from modal)
  const handleAddFramesToModal = (files: FileList) => {
    if (!modalAction || !modalDirection) return;
    // Convert files to URLs (simulate upload for now)
    const urls = Array.from(files).map(file => URL.createObjectURL(file));
    setFrames(prev => ({
      ...prev,
      [modalAction]: {
        ...prev[modalAction],
        [modalDirection]: [...prev[modalAction][modalDirection], ...urls]
      }
    }));
  };

  // Handler to remove frame (from modal)
  const handleRemoveFrameFromModal = (idx: number) => {
    if (!modalAction || !modalDirection) return;
    setFrames(prev => ({
      ...prev,
      [modalAction]: {
        ...prev[modalAction],
        [modalDirection]: prev[modalAction][modalDirection].filter((_, i) => i !== idx)
      }
    }));
  };

  // Handler to save modal changes
  const handleSaveModal = (newFrames: string[], speed: number, loop: boolean) => {
    if (!modalAction || !modalDirection) return;
    setFrames(prev => ({
      ...prev,
      [modalAction]: {
        ...prev[modalAction],
        [modalDirection]: newFrames
      }
    }));
    setEditedSections(prev => ({
      ...prev,
      [modalAction]: true
    }));
    setModalOpen(false);
  };

  // Handler to close modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Save a specific animation section
  const handleSaveSection = async (action: ActionKey) => {
    try {
      setIsSaving(true);
      console.log(`Saving ${action} animation for ${characterName}`);
      
      if (!characterName.trim()) {
        alert('Please enter a character name first!');
        setIsSaving(false);
        return;
      }
      
      // Improved duplicate name check
      const existing = await listCharacterAnimations({ searchTerm: characterName.trim(), limit: 1 });
      if (existing.length > 0 && (!animationId || existing[0].id !== animationId)) {
        alert('A character with this name already exists. Please choose a different name.');
        setIsSaving(false);
        return;
      }
      
      // If we don't have an animation ID yet, we need to create a new animation first
      if (!animationId) {
        // Create a new character animation with just this action
        const newAnimation: CharacterAnimation = {
          name: characterName,
          character_class: characterClass,
          character_type: isEnemyMode ? 'enemy' : 'player',
          [action as keyof CharacterAnimation]: frames[action] as any,
          thumbnail: frames.Idle?.s?.[0] || '' // Use first frame of Idle_s as thumbnail
        };
        
        const result = await saveCharacterAnimation(newAnimation);
        setAnimationId(result.id);
        
        // Reset the edited flag for this section
        setEditedSections(prev => ({
          ...prev,
          [action]: false
        }));
      } else {
        // If we already have an ID, we can save just this section
        await saveAnimationSection(animationId, action, frames[action]);
        
        // Reset the edited flag for this section
        setEditedSections(prev => ({
          ...prev,
          [action]: false
        }));
      }
      
      // Show success message
      alert(`${action} animation saved successfully!`);
    } catch (error) {
      console.error(`Error saving ${action} animation:`, error);
      alert(`Failed to save ${action} animation. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  // Save all unsaved sections
  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      const unsavedSections = ACTIONS.filter(action => editedSections[action]);
      
      if (unsavedSections.length === 0) {
        alert('All sections are already saved!');
        setIsSaving(false);
        return;
      }
      
      if (!characterName.trim()) {
        alert('Please enter a character name first!');
        setIsSaving(false);
        return;
      }
      
      // Improved duplicate name check
      const existing = await listCharacterAnimations({ searchTerm: characterName.trim(), limit: 1 });
      if (existing.length > 0 && (!animationId || existing[0].id !== animationId)) {
        alert('A character with this name already exists. Please choose a different name.');
        setIsSaving(false);
        return;
      }
      
      // If we don't have an ID yet, save everything as a new animation
      if (!animationId) {
        // Create an object with individual action columns
        const newAnimationData: any = {
          name: characterName,
          character_class: characterClass,
          character_type: isEnemyMode ? 'enemy' : 'player',
          thumbnail: frames.Idle?.s?.[0] || '', // Use first frame of Idle_s as thumbnail
          is_template: false,
          metadata: {},
        };
        
        // Add each action as a separate column
        ACTIONS.forEach(action => {
          if (frames[action] && Object.values(frames[action]).some(arr => arr.length > 0)) {
            newAnimationData[action] = frames[action];
          }
        });
        
        const result = await saveCharacterAnimation(newAnimationData);
        setAnimationId(result.id);
      } else {
        // If we have an ID, update the animation with all modified sections
        const updateData: any = {
          name: characterName,
          character_class: characterClass,
          character_type: isEnemyMode ? 'enemy' : 'player',
          thumbnail: frames.Idle?.s?.[0] || '', // Use first frame of Idle_s as thumbnail
          is_template: false,
          metadata: {},
        };
        
        // Add each edited action as a separate column
        unsavedSections.forEach(action => {
          updateData[action] = frames[action];
        });
        
        await updateCharacterAnimation(animationId, updateData);
      }
      
      // Reset all edited flags
      const resetEdited: Record<ActionKey, boolean> = {} as Record<ActionKey, boolean>;
      ACTIONS.forEach(action => {
        resetEdited[action] = false;
      });
      setEditedSections(resetEdited);
      
      // Show success message
      alert(`All animations saved successfully!`);
    } catch (error) {
      console.error('Error saving animations:', error);
      alert('Failed to save animations. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Get the current entity class based on mode
  const getCurrentClass = () => {
    if (isEnemyMode) {
      return getEnemyClassById(characterClass);
    } else {
      return getCharacterClassById(characterClass);
    }
  };

  // Check if any sections need saving
  const hasUnsavedChanges = ACTIONS.some(action => editedSections[action]);

  // Handler to toggle play/pause for a section
  const handleTogglePlay = (action: ActionKey) => {
    setIsPlayingMap(prev => ({ ...prev, [action]: !prev[action] }));
  };

  // Handler to save the character (name, class, etc.)
  const handleSaveCharacter = async () => {
    if (!characterName.trim()) {
      alert('Please enter a character name.');
      return;
    }
    setIsSaving(true);
    try {
      if (!animationId) {
        // Improved duplicate name check
        const existing = await listCharacterAnimations({ searchTerm: characterName.trim(), limit: 1 });
        if (existing.length > 0) {
          alert('A character with this name already exists. Please choose a different name.');
          setIsSaving(false);
          return;
        }
        // Create an object with individual action columns
        const newCharacterData: any = {
          name: characterName.trim(),
          character_class: characterClass,
          character_type: isEnemyMode ? 'enemy' : 'player',
          is_template: false,
          metadata: {},
        };
        
        // Add each action as a separate column if it has frames
        ACTIONS.forEach(action => {
          if (frames[action] && Object.values(frames[action]).some(arr => arr.length > 0)) {
            newCharacterData[action] = frames[action];
          }
        });
        
        // Set thumbnail if available
        if (frames.Idle?.s?.[0]) {
          newCharacterData.thumbnail = frames.Idle.s[0];
        }
        
        const result = await saveCharacterAnimation(newCharacterData);
        setAnimationId(result.id);
        alert('Character saved! You can now add animations.');
      } else {
        // Improved duplicate name check for update
        const existing = await listCharacterAnimations({ searchTerm: characterName.trim(), limit: 1 });
        if (existing.length > 0 && existing[0].id !== animationId) {
          alert('A character with this name already exists. Please choose a different name.');
          setIsSaving(false);
          return;
        }
        
        // Update the existing character with basic info
        const updateData: any = {
          name: characterName.trim(),
          character_class: characterClass,
          character_type: isEnemyMode ? 'enemy' : 'player',
          is_template: false,
          metadata: {},
        };
        
        // Set thumbnail if available
        if (frames.Idle?.s?.[0]) {
          updateData.thumbnail = frames.Idle.s[0];
        }
        
        await updateCharacterAnimation(animationId, updateData);
        alert('Character updated!');
      }
    } catch (error) {
      alert('Failed to save character.');
    } finally {
      setIsSaving(false);
    }
  };

  // Add state for loading characters
  const [loadDropdownOpen, setLoadDropdownOpen] = useState(false);
  const [loadOptions, setLoadOptions] = useState<CharacterAnimation[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // Handler for Load Character button
  const handleLoadCharacterClick = async () => {
    setIsLoadingOptions(true);
    setLoadDropdownOpen(false);
    const type = isEnemyMode ? 'enemy' : 'player';
    const charClass = characterClass;
    const results = await listCharacterAnimations({ characterClass: charClass, characterType: type });
    setLoadOptions(results);
    setIsLoadingOptions(false);
    setLoadDropdownOpen(true);
    setTimeout(() => {
      setIsLoadingOptions(false);
    }, 2000);
  };

  // Handler for selecting a character from dropdown
  const handleSelectLoadedCharacter = async (id: string) => {
    setLoadDropdownOpen(false);
    await loadAnimation(id);
  };

  // Place the Save Character button at the top of the return statement
  return (
    <div className={`text-white py-6 ${className}`}>
      <div className="max-w-5xl mx-auto">
        <div className="bg-slate-900 p-6 rounded-xl mb-8 border-l-4 border-blue-500 shadow-lg">
          <h3 className="text-2xl font-bold mb-2 text-white">
            {isEnemyMode ? 'Enemy Animation Workshop' : 'Character Animation Workshop'}
          </h3>
          <p className="text-blue-300 mb-4">
            Create and manage animations for your {isEnemyMode ? 'enemy' : 'character'} in 8 directions.
            Click on direction buttons to preview, and use "Add Frames" to upload sprites for each direction.
          </p>

          <div className="mt-4 bg-slate-800 p-4 rounded-lg border border-slate-700">
            {/* Character/Enemy Toggle */}
            <div className="flex justify-center mb-4">
              <div className="bg-slate-700 p-1 rounded-lg inline-flex">
                <button
                  className={`px-4 py-2 rounded-lg ${!isEnemyMode ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
                  onClick={() => setIsEnemyMode(false)}
                >
                  Human
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${isEnemyMode ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
                  onClick={() => setIsEnemyMode(true)}
                >
                  Enemies
                </button>
              </div>
            </div>
            
            <div className="flex justify-end items-center mb-4 relative">
              <button
                onClick={handleLoadCharacterClick}
                className="px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors text-lg"
                style={{ boxShadow: '0 0 8px 2px #2563eb33' }}
              >
                {isLoadingOptions ? 'Loading...' : 'Load Character'}
              </button>
              {loadDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-slate-800 border border-slate-600 rounded shadow-lg z-50 w-64">
                  {loadOptions.length === 0 ? (
                    <div className="p-4 text-slate-300">No characters found for this selection.</div>
                  ) : (
                    <ul>
                      {loadOptions.map(opt => (
                        <li key={opt.id}>
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-blue-700 text-white"
                            onClick={() => handleSelectLoadedCharacter(opt.id!)}
                          >
                            {opt.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Character/Enemy Name Input */}
              <div className="flex-1">
                <label htmlFor="character-name" className="block text-white font-medium mb-2">
                  {isEnemyMode ? 'Enemy Name:' : 'Character Name:'}
                </label>
                <input
                  id="character-name"
                  type="text"
                  value={tempCharacterName}
                  onChange={(e) => setTempCharacterName(e.target.value)}
                  placeholder={isEnemyMode ? "Enter enemy name" : "Enter character name"}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Character/Enemy Class Selector */}
              <div className="flex-1">
                <label className="block text-white font-medium mb-2">
                  {isEnemyMode ? 'Enemy Class:' : 'Character Class:'}
                </label>
                <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
                  {(isEnemyMode ? ENEMY_CLASSES : CHARACTER_CLASSES).map(cls => (
                    <button
                      key={cls.id}
                      onClick={() => setCharacterClass(cls.id)}
                      className={`
                        rounded-lg p-2 flex items-center justify-center gap-2
                        border-2 transition-all duration-200
                        ${characterClass === cls.id 
                          ? `${cls.color} border-white` 
                          : `bg-slate-700 border-slate-600 hover:border-slate-400`
                        }
                      `}
                      title={cls.description}
                    >
                      <span className="text-xl">{cls.icon}</span>
                      <span className="font-bold">{cls.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Save Character Button */}
              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={handleSaveCharacter}
                  className="px-6 py-3 rounded-lg font-bold text-white bg-green-600 animate-pulse shadow-lg shadow-green-400/50 hover:bg-green-500 transition-colors text-lg"
                  style={{ boxShadow: '0 0 16px 4px #22c55e' }}
                >
                  Save Character
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {characterName && (
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white">
              <span className="text-blue-400">{characterName}</span> 
              {characterClass && (
                <span className="ml-2">
                  the {getCurrentClass().name}
                </span>
              )}
            </h2>
          </div>
        )}
        
        {ACTIONS.map((action, index) => (
          <div key={action} className="w-full relative flex flex-col items-center mb-8 p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
            {/* Compass UI and controls */}
            <div className="flex-1 flex flex-col items-center w-full">
              <ActionDirectionCompass
                action={action}
                frames={frames[action]}
                onAddFrames={(dir) => handleEditFrames(action, dir)}
                onRemoveFrame={(direction, index) => {
                  setModalAction(action);
                  setModalDirection(direction);
                  handleRemoveFrameFromModal(index);
                }}
                isEdited={editedSections[action]}
                onSave={() => handleSaveSection(action)}
                isPlaying={isPlayingMap[action]}
                onTogglePlay={() => handleTogglePlay(action)}
              />
            </div>
            
            {/* Assembly controls - moved from grouped box to below the compass */}
            <div className="flex flex-wrap justify-center items-center gap-4 mt-6 w-full">
              <div className="flex items-center">
                <input
                  type="text"
                  value={tempCharacterName}
                  onChange={e => setTempCharacterName(e.target.value)}
                  className="bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded text-sm w-32"
                  placeholder="Character Name"
                />
              </div>
              
              <div className="flex items-center">
                <select
                  value={characterClass}
                  onChange={e => setCharacterClass(e.target.value)}
                  className="bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded text-sm"
                >
                  {(isEnemyMode ? ENEMY_CLASSES : CHARACTER_CLASSES).map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <select
                  value={action}
                  onChange={() => {}}
                  className="bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded text-sm"
                  disabled
                >
                  <option value={action}>{action.charAt(0).toUpperCase() + action.slice(1)}</option>
                </select>
              </div>
              
              <button
                className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-lg shadow-lg text-sm"
                onClick={async () => {
                  if (!tempCharacterName.trim()) {
                    alert('Please enter a character name.');
                    return;
                  }
                  if (!characterClass.trim()) {
                    alert('Please select a class.');
                    return;
                  }
                  const name = tempCharacterName.trim();
                  const classId = characterClass;
                  const actionKey = action;
                  const directionFrames = frames[actionKey];
                  // Check for duplicate (name/class/action)
                  const existing = await listCharacterAnimations({ searchTerm: name, characterClass: classId, limit: 100 });
                  const match = existing.find(anim => anim.name === name && anim.character_class === classId && 
                    (anim.animations?.[actionKey] || anim[actionKey as keyof CharacterAnimation]));
                  let overwrite = false;
                  if (match) {
                    overwrite = window.confirm('An animation for this name, class, and action already exists. Overwrite?');
                    if (!overwrite) return;
                  }
                  try {
                    if (match) {
                      // Update only the specific action column
                      await updateCharacterAnimation(match.id!, {
                        [actionKey]: directionFrames,
                        updated_at: new Date().toISOString(),
                      });
                      alert('Animation overwritten successfully!');
                    } else {
                      // Create a new animation with the specific action column
                      const newAnimation: CharacterAnimation = {
                        name,
                        character_class: classId,
                        character_type: isEnemyMode ? 'enemy' : 'player',
                        [actionKey as keyof CharacterAnimation]: directionFrames as any,
                        is_template: false,
                        metadata: {},
                      };
                      await saveCharacterAnimation(newAnimation);
                      alert('Animation assembled and saved!');
                    }
                  } catch (err) {
                    alert('Failed to save animation.');
                  }
                }}
              >
                Assemble
              </button>
            </div>
            
            {/* Add the reminder at the bottom of the last section */}
            {index === ACTIONS.length - 1 && (
              <div className="mt-8 w-full max-w-3xl mx-auto">
                <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-lg border border-slate-700">
                  <button
                    onClick={handleSaveAll}
                    className={`px-6 py-4 rounded-lg font-bold text-lg transition-all duration-300 flex-1 ${
                      isFlashing 
                        ? 'bg-green-500 text-white' 
                        : 'bg-green-600 text-white'
                    }`}
                    style={{
                      boxShadow: isFlashing ? '0 0 20px rgba(34, 197, 94, 0.6)' : 'none',
                      transform: isFlashing ? 'scale(1.02)' : 'scale(1)'
                    }}
                  >
                    Did you save? {hasUnsavedChanges ? '(You have unsaved changes!)' : ''}
                  </button>
                  <div className="text-center">
                    <p className="text-green-300 text-sm font-medium">just to be safe</p>
                    <p className="text-slate-400 text-xs mt-1">
                      {hasUnsavedChanges 
                        ? `${ACTIONS.filter(a => editedSections[a]).length} section(s) with unsaved changes` 
                        : 'All sections saved'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <FrameEditorModal
        isOpen={modalOpen}
        direction={modalDirection || ''}
        frames={modalAction && modalDirection ? frames[modalAction][modalDirection] : []}
        onAddFrames={handleAddFramesToModal}
        onRemoveFrame={handleRemoveFrameFromModal}
        onSave={handleSaveModal}
        onClose={handleCloseModal}
      />
    </div>
  );
} 