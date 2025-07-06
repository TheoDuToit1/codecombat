import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MapEditorPage from './pages/MapEditorPage';
import AssetWorkshop from './pages/AssetWorkshop';
import CharacterSelect from './components/CharacterSelect';
import GauntletSelectionScreen from './components/GauntletSelectionScreen';
import { CharacterCreator } from './components/CharacterCreator';
import { AudioManager } from './components/AudioManager';
import XCodeAcademy from './components/XCodeAcademy';
import CharacterDemo from './components/CharacterDemo';
import { FundamentalsSlidesPage } from './pages/FundamentalsSlidesPage';

// Import the old components to maintain compatibility
import GauntletArcadeMode from './components/GauntletArcadeMode';
import BabylonViewportMode from './components/BabylonViewportMode';
import { BabylonTopDownMode } from './components/BabylonTopDownMode';
import { GauntletContainer } from './components/GauntletContainer';

const WithBackToMain = (Component: any, extraProps = {}) => (props: any) => {
  const navigate = useNavigate();
  return <Component {...props} {...extraProps} onBack={() => navigate('/')} />;
};

const App: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Dashboard 
            onNavigate={(view) => {
              if (view === 'xcode-academy') navigate('/academy-course');
              else if (view === 'gauntlet-selection') navigate('/gauntlet-mode');
              else if (view === 'gauntlet-arcade') navigate('/gauntlet-mode');
              else if (view === 'character-demo') navigate('/character-demo');
            }}
          />
        }
      />
      
      {/* Add direct route for lesson1 */}
      <Route path="/lesson1" element={<XCodeAcademy onBack={() => navigate('/academy-course')} />} />
      
      {/* Academy course route */}
      <Route path="/academy-course" element={
        <XCodeAcademy 
          onBack={() => navigate('/')} 
          onStartLessonLevel={(lessonId) => navigate(`/lesson/${lessonId}`)}
        />
      } />
      
      {/* Fundamentals slides route */}
      <Route path="/fundamentals-slides" element={<FundamentalsSlidesPage />} />
      
      <Route path="/lesson/:lessonId" element={<XCodeAcademy onBack={() => navigate('/academy-course')} />} />
      <Route path="/map-editor" element={<MapEditorPage />} />
      <Route path="/character-selector" element={WithBackToMain(CharacterSelect, { onSelect: () => {} })({})} />
      <Route path="/character-creator" element={WithBackToMain(CharacterCreator, { onCharacterCreated: () => {} })({})} />
      <Route path="/character-demo" element={WithBackToMain(CharacterDemo)({})} />
      <Route path="/gauntlet-mode" element={WithBackToMain(GauntletSelectionScreen)({})} />
      <Route path="/gauntlet-level/:levelNumber" element={<GauntletContainer onBack={() => navigate('/gauntlet-mode')} />} />
      <Route path="/audio-manager" element={WithBackToMain(AudioManager)({})} />
      <Route path="/asset-workshop" element={WithBackToMain(AssetWorkshop)({})} />
      
      {/* Redirect old routes to the new implementation */}
      <Route path="/gauntlet-arcade" element={<Navigate to="/gauntlet-mode" replace />} />
      <Route path="/babylon-viewport" element={<Navigate to="/gauntlet-mode" replace />} />
      <Route path="/babylon-topdown" element={<Navigate to="/babylon-topdown" replace />} />
    </Routes>
  );
};

export default App;