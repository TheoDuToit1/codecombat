import React, { useState } from 'react';
import { ArrowLeft, Save, User, Palette, Film } from 'lucide-react';
import { CharacterCreator } from './CharacterCreator';
import { AnimationEditor } from './AnimationEditor';
import { Character } from '../types/game';

interface CharacterAnimatorProps {
  onBack: () => void;
}

export const CharacterAnimator: React.FC<CharacterAnimatorProps> = ({
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'creator' | 'animations'>('creator');
  const [character, setCharacter] = useState<Character | null>(null);
  const [animations, setAnimations] = useState<Array<{
    name: string;
    frames: string[];
    settings: {
      speed: number;
      loop: boolean;
      pingPong: boolean;
      reverse: boolean;
    };
  }>>([]);
  const [spriteName, setSpriteName] = useState('');

  const handleCharacterCreated = (newCharacter: Character) => {
    setCharacter(newCharacter);
    setSpriteName(newCharacter.name);
    setActiveTab('animations');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold">🎮 Character Selector</h1>
              <p className="text-purple-100">Create and animate your hero</p>
            </div>
            
            <div className="w-32"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('creator')}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all
              ${activeTab === 'creator'
                ? 'bg-blue-500 text-white'
                : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
              }
            `}
          >
            <User className="w-5 h-5" />
            <span>Character Creator</span>
          </button>
          
          <button
            onClick={() => setActiveTab('animations')}
            disabled={!character}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all
              ${!character
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : activeTab === 'animations'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
              }
            `}
          >
            <Film className="w-5 h-5" />
            <span>Animations</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'creator' && (
          <CharacterCreator
            onBack={() => {}}
            onCharacterCreated={handleCharacterCreated}
          />
        )}

        {activeTab === 'animations' && character && (
          <AnimationEditor
            isOpen={true}
            onClose={() => setActiveTab('creator')}
            spriteName={spriteName}
            onSpriteNameChange={setSpriteName}
            animations={animations}
            onAnimationsUpdate={setAnimations}
          />
        )}
      </div>
    </div>
  );
}; 