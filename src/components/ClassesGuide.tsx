import React, { useState } from 'react';
import { CHARACTER_CLASSES } from '../data/characterClasses';
import { ENEMY_CLASSES } from '../data/enemyClasses';

interface ClassesGuideProps {
  onClose?: () => void;
}

export default function ClassesGuide({ onClose }: ClassesGuideProps) {
  const [activeTab, setActiveTab] = useState<'characters' | 'enemies'>('characters');

  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 max-w-4xl w-full mx-auto overflow-hidden">
      <div className="flex items-center justify-between bg-slate-800 px-6 py-4 border-b border-slate-700">
        <h2 className="text-xl font-bold">Game Classes Guide</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="flex border-b border-slate-700">
        <button
          className={`px-6 py-3 font-medium text-lg ${activeTab === 'characters' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          onClick={() => setActiveTab('characters')}
        >
          Characters
        </button>
        <button
          className={`px-6 py-3 font-medium text-lg ${activeTab === 'enemies' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          onClick={() => setActiveTab('enemies')}
        >
          Enemies
        </button>
      </div>
      
      <div className="p-6">
        {activeTab === 'characters' ? (
          <div>
            <p className="text-blue-300 mb-4">
              Choose your character class wisely! Each has unique abilities and attributes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CHARACTER_CLASSES.map(characterClass => (
                <div 
                  key={characterClass.id}
                  className="bg-slate-800 rounded-lg p-4 border-l-4 shadow-md"
                  style={{ borderLeftColor: characterClass.color.replace('bg-', '').includes('red') ? '#ef4444' : 
                                            characterClass.color.replace('bg-', '').includes('blue') ? '#3b82f6' : 
                                            characterClass.color.replace('bg-', '').includes('green') ? '#22c55e' : 
                                            '#a855f7' }}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{characterClass.icon}</span>
                    <h3 className="text-xl font-bold">{characterClass.name}</h3>
                  </div>
                  <p className="text-slate-300 mb-3">{characterClass.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-slate-700 p-2 rounded">
                      <span className="font-bold text-red-400">Health:</span> {characterClass.health}
                    </div>
                    <div className="bg-slate-700 p-2 rounded">
                      <span className="font-bold text-green-400">Speed:</span> {characterClass.speed}
                    </div>
                    <div className="bg-slate-700 p-2 rounded">
                      <span className="font-bold text-orange-400">Damage:</span> {characterClass.damage}
                    </div>
                    <div className="bg-slate-700 p-2 rounded">
                      <span className="font-bold text-blue-400">Type:</span> {characterClass.attackType}
                    </div>
                  </div>
                  <div className="mt-3 bg-slate-700 p-2 rounded text-sm">
                    <span className="font-bold text-purple-400">Special:</span> {characterClass.specialAbility}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-blue-300 mb-4">
              Know your enemies! Each enemy type has different behaviors and strengths.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ENEMY_CLASSES.map(enemyClass => (
                <div 
                  key={enemyClass.id}
                  className="bg-slate-800 rounded-lg p-4 border-l-4 shadow-md"
                  style={{ borderLeftColor: enemyClass.color.replace('bg-', '').includes('green') ? '#16a34a' : 
                                            enemyClass.color.replace('bg-', '').includes('cyan') ? '#06b6d4' : 
                                            enemyClass.color.replace('bg-', '').includes('red') ? '#b91c1c' : 
                                            '#8b5cf6' }}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{enemyClass.icon}</span>
                    <h3 className="text-xl font-bold">{enemyClass.name}</h3>
                  </div>
                  <p className="text-slate-300 mb-3">{enemyClass.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-slate-700 p-2 rounded">
                      <span className="font-bold text-red-400">Health:</span> {enemyClass.health}
                    </div>
                    <div className="bg-slate-700 p-2 rounded">
                      <span className="font-bold text-green-400">Speed:</span> {enemyClass.speed}
                    </div>
                    <div className="bg-slate-700 p-2 rounded">
                      <span className="font-bold text-orange-400">Damage:</span> {enemyClass.damage}
                    </div>
                    <div className="bg-slate-700 p-2 rounded">
                      <span className="font-bold text-blue-400">Type:</span> {enemyClass.attackType}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 