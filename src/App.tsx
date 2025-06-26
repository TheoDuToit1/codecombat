import React, { useState } from 'react';
import babylon from './maps/babylon';
import labyrinth from './maps/labyrinth';
import { GameGrid } from './components/GameGrid';
import Dashboard from './components/Dashboard';
import AssetWorkshop from './pages/AssetWorkshop';
import CharacterSelect from './components/CharacterSelect';
import CharacterCarousel from './components/CharacterCarousel';
import GauntletSelectionScreen from './components/GauntletSelectionScreen';
import GauntletArcadeMode from './components/GauntletArcadeMode';
import BabylonViewportMode from './components/BabylonViewportMode';
import { BabylonTopDownMode } from './components/BabylonTopDownMode';
import { CharacterConfig } from './data/classes';
import XCodeAcademy from './components/XCodeAcademy';

const Placeholder: React.FC<{ name: string; onBack: () => void }> = ({ name, onBack }) => (
  <div style={{ padding: 32 }}>
    <button onClick={onBack} style={{ padding: '6px 16px', fontSize: 16 }}>⬅️ Back</button>
    <h2 style={{ marginTop: 24, fontSize: 32 }}>{name}</h2>
    <p style={{ marginTop: 16 }}>This page is under construction.</p>
  </div>
);

const App: React.FC = () => {
  // For campaign: track current level index (future: array of levels)
  const [view, setView] = useState<
    | 'dashboard'
    | 'gauntlet-selection'
    | 'gauntlet-arcade'
    | 'babylon-viewport'
    | 'babylon-topdown'
    | 'asset-workshop'
    | 'character-selector'
    | 'character-carousel'
    | 'audio-manager'
    | 'asset-manager'
    | 'sprite-upload'
    | 'sprite-creator'
    | 'code-editor'
    | 'game-grid'
    | 'xcode-academy'
    | 'project-manager'
  >('dashboard');
  const [currentLevel, setCurrentLevel] = useState(0); // 0 = Level 1
  // Store the selected character information
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  // In future, levels = [babylon, ...]
  const levels = [babylon];
  
  // Handle the Gauntlet mode selection
  const handleGauntletModeSelect = (mode: 'arcade' | 'babylon-viewport' | 'babylon-topdown') => {
    if (!selectedCharacter) {
      // Set a default character (elf) if none is selected
      setSelectedCharacter('elf');
    }
    
    // Always transition to the selected mode
    switch (mode) {
      case 'arcade':
        setView('gauntlet-arcade');
        break;
      case 'babylon-viewport':
        setView('babylon-viewport');
        break;
      case 'babylon-topdown':
        setView('babylon-topdown');
        break;
    }
  };

  // Handle character selection
  const handleCharacterSelect = (id: string) => {
    setSelectedCharacter(id);
    setView('babylon-topdown'); // Go directly to top-down mode after selection
  };

  // Type-safe navigation handler
  const handleNavigate = (destination: typeof view) => {
    // If navigating to a game mode and no character is selected, go to character selection first
    if (
      (destination === 'gauntlet-arcade' || 
       destination === 'babylon-viewport' || 
       destination === 'babylon-topdown') && 
      !selectedCharacter
    ) {
      setView('character-selector'); // Use the detailed character selector instead of carousel
    } else {
      setView(destination);
    }
  };

  // Add navigation handlers for switching between map views
  const switchToViewport = () => {
    setView('babylon-viewport');
  };

  const switchToTopDown = () => {
    setView('babylon-topdown');
  };

  return (
    <div style={{ padding: 0 }}>
      {view === 'dashboard' && (
        <Dashboard 
          onStartGauntlet={() => handleNavigate('gauntlet-selection')} 
          onNavigate={handleNavigate} 
        />
      )}
      
      {/* Gauntlet Selection Screen */}
      {view === 'gauntlet-selection' && (
        <GauntletSelectionScreen 
          onBack={() => setView('dashboard')} 
          onSelectMode={handleGauntletModeSelect} 
        />
      )}
      
      {/* Gauntlet Arcade Mode */}
      {view === 'gauntlet-arcade' && (
        <GauntletArcadeMode 
          onBack={() => setView('gauntlet-selection')}
        />
      )}
      
      {/* Babylon Viewport Mode */}
      {view === 'babylon-viewport' && (
        <BabylonViewportMode 
          onBack={() => setView('gauntlet-selection')}
          selectedCharacter={selectedCharacter}
          onSwitchToTopDown={switchToTopDown}
        />
      )}
      
      {/* Babylon Top-down Mode */}
      {view === 'babylon-topdown' && (
        <BabylonTopDownMode 
          onBack={() => setView('gauntlet-selection')}
          selectedCharacter={selectedCharacter}
          onSwitchToViewport={switchToViewport}
        />
      )}
      
      {view === 'asset-workshop' && (
        <AssetWorkshop onBack={() => setView('dashboard')} />
      )}
      
      {/* Updated detailed character selector */}
      {view === 'character-selector' && (
        <CharacterSelect 
          onSelect={handleCharacterSelect} 
          onBack={() => setView('dashboard')}
        />
      )}
      
      {/* Carousel character selector (kept as alternative) */}
      {view === 'character-carousel' && (
        <CharacterCarousel 
          onSelect={handleCharacterSelect}
          onBack={() => setView('dashboard')}
          initialCharacterId="elf"
        />
      )}
      
      {view === 'audio-manager' && <Placeholder name="Audio Manager" onBack={() => setView('dashboard')} />}
      {view === 'asset-manager' && <Placeholder name="Asset Manager" onBack={() => setView('dashboard')} />}
      {view === 'sprite-upload' && <Placeholder name="Sprite Uploader" onBack={() => setView('dashboard')} />}
      {view === 'sprite-creator' && <Placeholder name="Sprite Editor" onBack={() => setView('dashboard')} />}
      {view === 'code-editor' && <Placeholder name="Code Editor" onBack={() => setView('dashboard')} />}
      {view === 'game-grid' && <Placeholder name="Game Grid" onBack={() => setView('dashboard')} />}
      {/* X-Code Academy Component */}
      {view === 'xcode-academy' && <XCodeAcademy onBack={() => setView('dashboard')} />}
      {view === 'project-manager' && <Placeholder name="Project Manager" onBack={() => setView('dashboard')} />}
    </div>
  );
};

export default App;