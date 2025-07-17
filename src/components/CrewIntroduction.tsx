import React, { useState } from 'react';
import { Sword, Zap, Wand2, Target, Crown, Star, BookOpen, Users, Trophy, Lock } from 'lucide-react';
import { XCODE_CREW, COURSE_STRUCTURE, CrewMember } from '../data/story';

interface CrewIntroductionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMember: (member: CrewMember) => void;
  currentProgress?: number; // Which lesson they're on
}

export const CrewIntroduction: React.FC<CrewIntroductionProps> = ({
  isOpen,
  onClose,
  onSelectMember,
  currentProgress = 1
}) => {
  const [selectedMember, setSelectedMember] = useState<CrewMember | null>(null);
  const [showCourseInfo, setShowCourseInfo] = useState(false);

  const getClassIcon = (gauntletClass: string) => {
    switch (gauntletClass) {
      case 'warrior': return <Sword className="w-8 h-8" />;
      case 'valkyrie': return <Crown className="w-8 h-8" />;
      case 'wizard': return <Wand2 className="w-8 h-8" />;
      case 'elf': return <Target className="w-8 h-8" />;
      default: return <Star className="w-8 h-8" />;
    }
  };

  const getClassColor = (gauntletClass: string) => {
    switch (gauntletClass) {
      case 'warrior': return 'from-red-500 to-red-700';
      case 'valkyrie': return 'from-purple-500 to-purple-700';
      case 'wizard': return 'from-blue-500 to-blue-700';
      case 'elf': return 'from-green-500 to-green-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const isUnlocked = (member: CrewMember) => currentProgress >= member.unlockLevel;

  const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="flex items-center space-x-2">
      <span className="text-xs font-medium w-16">{label}:</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full bg-gradient-to-r ${color}`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
      <span className="text-xs font-bold w-6">{value}</span>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🎮 X-Code Crew Heroes!</h1>
              <p className="text-purple-100">Choose your coding mentor and start your adventure!</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">Your Progress</div>
              <div className="text-xl font-bold">Lesson {currentProgress}/160</div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-120px)]">
          {/* Course Structure Panel */}
          <div className="w-1/3 bg-gradient-to-b from-slate-50 to-slate-100 p-6 border-r overflow-y-auto">
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🎯</div>
                <h2 className="text-xl font-bold text-gray-800">Learning Path</h2>
              </div>

              {/* Course Structure */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-700 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  160 Coding Lessons
                </h3>
                
                {Object.entries(COURSE_STRUCTURE).map(([key, course]) => (
                  <div key={key} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{course.name}</span>
                      <span className="text-sm text-gray-500">{course.levels} levels</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      Mentor: <span className="font-medium text-purple-600">{course.mentor}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {course.concepts.join(', ')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Gauntlet Info */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-bold">The Great Gauntlet</span>
                </div>
                <div className="text-sm opacity-90 mb-2">
                  100 epic adventure levels!
                </div>
                <div className="text-xs opacity-75">
                  🔓 Unlocks after completing 40 lessons
                </div>
              </div>

              <button
                onClick={() => setShowCourseInfo(!showCourseInfo)}
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
              >
                {showCourseInfo ? 'Hide Details' : 'Show Course Details'}
              </button>
            </div>
          </div>

          {/* Crew Members Panel */}
          <div className="w-2/3 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {XCODE_CREW.map((member) => {
                const unlocked = isUnlocked(member);
                
                return (
                  <div
                    key={member.id}
                    className={`
                      relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300
                      ${!unlocked 
                        ? 'opacity-50 cursor-not-allowed border-gray-300' 
                        : selectedMember?.id === member.id 
                          ? 'border-purple-500 shadow-2xl scale-105 cursor-pointer' 
                          : 'border-gray-200 hover:border-purple-300 hover:shadow-xl hover:scale-102 cursor-pointer'
                      }
                    `}
                    onClick={() => unlocked && setSelectedMember(member)}
                  >
                    {/* Lock Overlay */}
                    {!unlocked && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-20 rounded-xl flex items-center justify-center z-10">
                        <div className="bg-white rounded-lg p-3 text-center">
                          <Lock className="w-6 h-6 mx-auto mb-1 text-gray-500" />
                          <div className="text-sm font-medium text-gray-700">
                            Unlocks at Lesson {member.unlockLevel}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Character Header */}
                    <div className={`bg-gradient-to-r ${getClassColor(member.gauntletClass)} text-white p-4 rounded-t-xl`}>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                          {getClassIcon(member.gauntletClass)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{member.name}</h3>
                          <p className="text-sm opacity-90 capitalize">
                            {member.gauntletClass} • Teaches {member.codingSkill}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Character Details */}
                    <div className="p-4 space-y-4">
                      <p className="text-gray-700 font-medium">{member.description}</p>
                      
                      {/* Stats */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800 flex items-center text-sm">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          Hero Stats:
                        </h4>
                        <div className="space-y-1">
                          <StatBar label="Strength" value={member.stats.strength} color="from-red-400 to-red-600" />
                          <StatBar label="Magic" value={member.stats.magic} color="from-blue-400 to-blue-600" />
                          <StatBar label="Speed" value={member.stats.speed} color="from-green-400 to-green-600" />
                          <StatBar label="Wisdom" value={member.stats.wisdom} color="from-purple-400 to-purple-600" />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          unlocked 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {unlocked ? '✓ Available' : `🔒 Lesson ${member.unlockLevel}`}
                        </span>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedMember?.id === member.id && unlocked && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            {selectedMember && (
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Ready to learn with {selectedMember.name}?
                  </h3>
                  <p className="text-gray-600">
                    Master <strong>{selectedMember.codingSkill}</strong> with your {selectedMember.gauntletClass} mentor!
                  </p>
                  <div className="flex space-x-4 justify-center">
                    <button
                      onClick={() => onSelectMember(selectedMember)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Start Learning with {selectedMember.name}!
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Choose Later
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};