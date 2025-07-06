import React, { useState } from 'react';
import { ArrowLeft, Save, RotateCcw, Eye, Palette, User, Zap, Shield, Heart, Star } from 'lucide-react';

interface CharacterStats {
  strength: number;
  magic: number;
  speed: number;
  wisdom: number;
  health: number;
}

interface Character {
  name: string;
  class: 'warrior' | 'wizard' | 'elf' | 'assassin';
  appearance: {
    skinTone: string;
    hairColor: string;
    eyeColor: string;
    outfit: string;
  };
  stats: CharacterStats;
}

interface CharacterCreatorProps {
  onBack: () => void;
  onCharacterCreated: (character: Character) => void;
}

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  onBack,
  onCharacterCreated
}) => {
  const [character, setCharacter] = useState<Character>({
    name: '',
    class: 'warrior',
    appearance: {
      skinTone: '#FDBCB4',
      hairColor: '#8B4513',
      eyeColor: '#4169E1',
      outfit: 'default'
    },
    stats: {
      strength: 5,
      magic: 5,
      speed: 5,
      wisdom: 5,
      health: 100
    }
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'appearance' | 'stats'>('basic');
  const [availablePoints, setAvailablePoints] = useState(10);

  const classes = [
    {
      id: 'warrior',
      name: 'Warrior',
      description: 'Strong and brave, masters of combat',
      icon: '⚔️',
      color: 'from-red-500 to-red-700',
      baseStats: { strength: 8, magic: 2, speed: 5, wisdom: 5, health: 120 }
    },
    {
      id: 'wizard',
      name: 'Wizard',
      description: 'Wise and magical, masters of spells',
      icon: '🧙‍♂️',
      color: 'from-blue-500 to-blue-700',
      baseStats: { strength: 3, magic: 9, speed: 4, wisdom: 8, health: 80 }
    },
    {
      id: 'elf',
      name: 'Elf',
      description: 'Quick and precise, masters of archery',
      icon: '🏹',
      color: 'from-green-500 to-green-700',
      baseStats: { strength: 5, magic: 6, speed: 9, wisdom: 6, health: 90 }
    },
    {
      id: 'assassin',
      name: 'Assassin',
      description: 'Agile and stealthy, masters of critical strikes',
      icon: '🗡️',
      color: 'from-purple-500 to-purple-700',
      baseStats: { strength: 6, magic: 4, speed: 9, wisdom: 7, health: 90 }
    }
  ];

  const skinTones = [
    '#FDBCB4', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#654321'
  ];

  const hairColors = [
    '#000000', '#8B4513', '#D2691E', '#DAA520', '#B22222', '#800080'
  ];

  const eyeColors = [
    '#4169E1', '#228B22', '#8B4513', '#800080', '#DC143C', '#000000'
  ];

  const outfits = [
    { id: 'default', name: 'Default', preview: '👕' },
    { id: 'armor', name: 'Armor', preview: '🛡️' },
    { id: 'robe', name: 'Robe', preview: '👘' },
    { id: 'cloak', name: 'Cloak', preview: '🧥' }
  ];

  const handleClassChange = (classId: string) => {
    const selectedClass = classes.find(c => c.id === classId);
    if (selectedClass) {
      setCharacter(prev => ({
        ...prev,
        class: classId as unknown as Character['class'],
        stats: { ...selectedClass.baseStats }
      }));
      setAvailablePoints(10);
    }
  };

  const handleStatChange = (stat: keyof CharacterStats, delta: number) => {
    if (stat === 'health') return; // Health is calculated

    const newValue = character.stats[stat] + delta;
    if (newValue < 1 || newValue > 10) return;
    
    if (delta > 0 && availablePoints <= 0) return;
    if (delta < 0 && character.stats[stat] <= 1) return;

    setCharacter(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: newValue,
        health: stat === 'strength' ? 80 + (newValue * 4) : prev.stats.health
      }
    }));
    
    setAvailablePoints(prev => prev - delta);
  };

  const resetStats = () => {
    const selectedClass = classes.find(c => c.id === character.class);
    if (selectedClass) {
      setCharacter(prev => ({
        ...prev,
        stats: { ...selectedClass.baseStats }
      }));
      setAvailablePoints(10);
    }
  };

  const handleSave = () => {
    if (!character.name.trim()) {
      alert('Please enter a character name!');
      return;
    }
    onCharacterCreated(character);
  };

  const selectedClass = classes.find(c => c.id === character.class);

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
              <h1 className="text-3xl font-bold">🎨 Character Creator</h1>
              <p className="text-purple-100">Design your coding hero</p>
            </div>
            
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>Save Character</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Character Preview</span>
              </h2>
              
              {/* Character Display */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 mb-6">
                <div className="text-center">
                  {/* Character Avatar */}
                  <div 
                    className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${selectedClass?.color} flex items-center justify-center text-6xl mb-4 shadow-2xl`}
                    style={{ 
                      background: `linear-gradient(135deg, ${character.appearance.skinTone}40, ${character.appearance.skinTone}80)`
                    }}
                  >
                    {selectedClass?.icon}
                  </div>
                  
                  {/* Character Info */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {character.name || 'Unnamed Hero'}
                  </h3>
                  <p className="text-gray-300 mb-4">{selectedClass?.name}</p>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-500 bg-opacity-20 rounded-lg p-3">
                      <div className="text-red-400 text-sm">Strength</div>
                      <div className="text-white font-bold text-lg">{character.stats.strength}</div>
                    </div>
                    <div className="bg-blue-500 bg-opacity-20 rounded-lg p-3">
                      <div className="text-blue-400 text-sm">Magic</div>
                      <div className="text-white font-bold text-lg">{character.stats.magic}</div>
                    </div>
                    <div className="bg-green-500 bg-opacity-20 rounded-lg p-3">
                      <div className="text-green-400 text-sm">Speed</div>
                      <div className="text-white font-bold text-lg">{character.stats.speed}</div>
                    </div>
                    <div className="bg-purple-500 bg-opacity-20 rounded-lg p-3">
                      <div className="text-purple-400 text-sm">Wisdom</div>
                      <div className="text-white font-bold text-lg">{character.stats.wisdom}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Color Palette */}
              <div className="space-y-3">
                <h4 className="text-white font-medium">Color Palette</h4>
                <div className="flex space-x-2">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ backgroundColor: character.appearance.skinTone }}
                    title="Skin Tone"
                  />
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ backgroundColor: character.appearance.hairColor }}
                    title="Hair Color"
                  />
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ backgroundColor: character.appearance.eyeColor }}
                    title="Eye Color"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Character Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white bg-opacity-10 rounded-2xl p-6">
              {/* Tabs */}
              <div className="flex space-x-4 mb-6 border-b border-white border-opacity-20">
                {[
                  { id: 'basic', label: 'Basic Info', icon: User },
                  { id: 'appearance', label: 'Appearance', icon: Palette },
                  { id: 'stats', label: 'Stats', icon: Zap }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as unknown as typeof activeTab)}
                    className={`
                      flex items-center space-x-2 px-4 py-3 border-b-2 transition-all duration-200
                      ${activeTab === id 
                        ? 'border-blue-400 text-blue-300' 
                        : 'border-transparent text-gray-300 hover:text-white hover:border-gray-400'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Character Name</label>
                    <input
                      type="text"
                      value={character.name}
                      onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your hero's name..."
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-opacity-20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-4">Choose Your Class</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {classes.map((cls) => (
                        <button
                          key={cls.id}
                          onClick={() => handleClassChange(cls.id)}
                          className={`
                            p-4 rounded-xl border-2 transition-all duration-200 text-left
                            ${character.class === cls.id 
                              ? 'border-blue-400 bg-blue-500 bg-opacity-20' 
                              : 'border-white border-opacity-20 bg-white bg-opacity-5 hover:bg-opacity-10 hover:border-opacity-40'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{cls.icon}</span>
                            <div>
                              <div className="text-white font-bold">{cls.name}</div>
                              <div className="text-gray-300 text-sm">{cls.description}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 mt-3">
                            <div className="text-center">
                              <div className="text-red-400 text-xs">STR</div>
                              <div className="text-white font-bold">{cls.baseStats.strength}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-blue-400 text-xs">MAG</div>
                              <div className="text-white font-bold">{cls.baseStats.magic}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-green-400 text-xs">SPD</div>
                              <div className="text-white font-bold">{cls.baseStats.speed}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-purple-400 text-xs">WIS</div>
                              <div className="text-white font-bold">{cls.baseStats.wisdom}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-3">Skin Tone</label>
                    <div className="flex space-x-3">
                      {skinTones.map((tone) => (
                        <button
                          key={tone}
                          onClick={() => setCharacter(prev => ({ 
                            ...prev, 
                            appearance: { ...prev.appearance, skinTone: tone }
                          }))}
                          className={`
                            w-12 h-12 rounded-full border-4 transition-all duration-200
                            ${character.appearance.skinTone === tone 
                              ? 'border-blue-400 scale-110' 
                              : 'border-white border-opacity-30 hover:border-opacity-60'
                            }
                          `}
                          style={{ backgroundColor: tone }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">Hair Color</label>
                    <div className="flex space-x-3">
                      {hairColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setCharacter(prev => ({ 
                            ...prev, 
                            appearance: { ...prev.appearance, hairColor: color }
                          }))}
                          className={`
                            w-12 h-12 rounded-full border-4 transition-all duration-200
                            ${character.appearance.hairColor === color 
                              ? 'border-blue-400 scale-110' 
                              : 'border-white border-opacity-30 hover:border-opacity-60'
                            }
                          `}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">Eye Color</label>
                    <div className="flex space-x-3">
                      {eyeColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setCharacter(prev => ({ 
                            ...prev, 
                            appearance: { ...prev.appearance, eyeColor: color }
                          }))}
                          className={`
                            w-12 h-12 rounded-full border-4 transition-all duration-200
                            ${character.appearance.eyeColor === color 
                              ? 'border-blue-400 scale-110' 
                              : 'border-white border-opacity-30 hover:border-opacity-60'
                            }
                          `}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">Outfit</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {outfits.map((outfit) => (
                        <button
                          key={outfit.id}
                          onClick={() => setCharacter(prev => ({ 
                            ...prev, 
                            appearance: { ...prev.appearance, outfit: outfit.id }
                          }))}
                          className={`
                            p-4 rounded-xl border-2 transition-all duration-200 text-center
                            ${character.appearance.outfit === outfit.id 
                              ? 'border-blue-400 bg-blue-500 bg-opacity-20' 
                              : 'border-white border-opacity-20 bg-white bg-opacity-5 hover:bg-opacity-10'
                            }
                          `}
                        >
                          <div className="text-3xl mb-2">{outfit.preview}</div>
                          <div className="text-white text-sm font-medium">{outfit.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Customize Stats</h3>
                    <div className="flex items-center space-x-4">
                      <div className="text-white">
                        <span className="text-yellow-400 font-bold">{availablePoints}</span> points remaining
                      </div>
                      <button
                        onClick={resetStats}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'strength', label: 'Strength', icon: Shield, color: 'red', description: 'Physical power and combat damage' },
                      { key: 'magic', label: 'Magic', icon: Star, color: 'blue', description: 'Magical abilities and spell power' },
                      { key: 'speed', label: 'Speed', icon: Zap, color: 'green', description: 'Movement speed and agility' },
                      { key: 'wisdom', label: 'Wisdom', icon: User, color: 'purple', description: 'Problem solving and learning speed' }
                    ].map(({ key, label, icon: Icon, color, description }) => (
                      <div key={key} className="bg-white bg-opacity-5 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Icon className={`w-5 h-5 text-${color}-400`} />
                            <div>
                              <div className="text-white font-medium">{label}</div>
                              <div className="text-gray-400 text-sm">{description}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleStatChange(key as keyof CharacterStats, -1)}
                              disabled={character.stats[key as keyof CharacterStats] <= 1}
                              className="w-8 h-8 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg font-bold transition-colors"
                            >
                              -
                            </button>
                            <div className="w-12 text-center">
                              <div className="text-white font-bold text-lg">
                                {character.stats[key as keyof CharacterStats]}
                              </div>
                            </div>
                            <button
                              onClick={() => handleStatChange(key as keyof CharacterStats, 1)}
                              disabled={character.stats[key as keyof CharacterStats] >= 10 || availablePoints <= 0}
                              className="w-8 h-8 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg font-bold transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${(character.stats[key as keyof CharacterStats] / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}

                    {/* Health Display */}
                    <div className="bg-white bg-opacity-5 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Heart className="w-5 h-5 text-red-400" />
                        <div>
                          <div className="text-white font-medium">Health</div>
                          <div className="text-gray-400 text-sm">Calculated from Strength (80 + STR × 4)</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold text-2xl">{character.stats.health}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};