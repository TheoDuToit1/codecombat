import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Users, 
  Settings, 
  BookOpen, 
  Trophy, 
  Gamepad2, 
  Palette, 
  Volume2, 
  FolderOpen, 
  Code, 
  Star,
  Zap,
  Target,
  Crown,
  Sword,
  Wand2,
  ArrowRight,
  Plus,
  Music,
  Image,
  Save,
  User,
  Layers,
  Upload,
  Map as MapIcon
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { CrewMember } from '../data/story';
import { CharacterAnimator } from './CharacterAnimator';
import { ProgressService } from '../services/ProgressService';

interface DashboardProps {
  onNavigate?: (view: 
    | 'dashboard' 
    | 'babylon-viewport' 
    | 'babylon-topdown' 
    | 'asset-workshop' 
    | 'character-selector'
    | 'character-carousel'
    | 'character-demo'
    | 'audio-manager'
    | 'asset-manager'
    | 'sprite-upload'
    | 'sprite-creator'
    | 'code-editor'
    | 'game-grid'
    | 'xcode-academy'
    | 'project-manager'
  ) => void;
  currentProgress?: number;
  crewMembers?: CrewMember[];
  selectedCrewMember?: CrewMember | null;
  onStartGame?: () => void;
  onShowCrewIntro?: () => void;
  onShowLessonPlan?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  currentProgress = 0,
  crewMembers = [],
  selectedCrewMember,
  onStartGame,
  onShowCrewIntro,
  onShowLessonPlan
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [localProgress, setLocalProgress] = useState(currentProgress);
  const navigate = useNavigate();

  // Update local progress when prop changes
  useEffect(() => {
    setLocalProgress(currentProgress);
  }, [currentProgress]);

  // Load progress from service if not provided via props
  useEffect(() => {
    if (currentProgress === 0) {
      const savedProgress = ProgressService.getCurrentProgress();
      if (savedProgress > 0) {
        setLocalProgress(savedProgress);
      }
    }
  }, [currentProgress]);

  const progressPercentage = (localProgress / 160) * 100;

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    
    // If this is a mobile view, scroll to the section
    if (window.innerWidth < 768) {
      const element = document.getElementById(`section-${section}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">X-Code Game Development</h1>
          <p className="text-xl text-gray-400">Build, learn, and play with code</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/4 mb-6 lg:mb-0">
            <div className="bg-gray-800 rounded-2xl p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-6">Navigation</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => handleSectionChange('overview')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    activeSection === 'overview' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => handleSectionChange('learning')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    activeSection === 'learning' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                  }`}
                >
                  Learning Path
                </button>
                <button
                  onClick={() => handleSectionChange('tools')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    activeSection === 'tools' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                  }`}
                >
                  Development Tools
                </button>
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-medium mb-2">Your Progress</h3>
                <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400">
                  {localProgress} / 160 points ({Math.round(progressPercentage)}%)
                </p>
              </div>
            </div>
          </div>

          <div className="lg:w-3/4">
            {/* Overview Section */}
            <div
              id="section-overview"
              className={`mb-12 transition-opacity duration-300 ${
                activeSection === 'overview' ? 'opacity-100' : 'opacity-0 lg:hidden h-0 overflow-hidden'
              }`}
            >
              <h2 className="text-3xl font-bold mb-6">Welcome to X-Code</h2>
              <p className="text-gray-300 mb-8">
                Your all-in-one game development environment. Create characters, design levels, write code, and play your game all in one place.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                  onClick={() => onNavigate && onNavigate('xcode-academy')}
                  className="group bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">Recommended</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">X-Code Academy</h3>
                  <p className="text-gray-300 mb-4">Start your journey with guided tutorials and challenges</p>
                  <div className="flex items-center text-sm text-blue-300 group-hover:text-blue-200">
                    <span>Get started</span>
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                <button
                  onClick={() => onNavigate && onNavigate('gauntlet-selection')}
                  className="group bg-gradient-to-br from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                      <Gamepad2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">Epic Challenge</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Gauntlet Mode</h3>
                  <p className="text-gray-300 mb-4">Challenge yourself with 100 epic dungeon levels</p>
                  <div className="flex items-center text-sm text-yellow-300 group-hover:text-yellow-200">
                    <span>Enter the gauntlet</span>
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                <div className="bg-gray-800 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold mb-4">Your Crew</h3>
                  <div className="space-y-4">
                    {crewMembers.length > 0 ? (
                      crewMembers.map((member, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-gray-400">{member.codingSkill} Expert</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-400 mb-2">No crew members yet</p>
                        <button
                          onClick={onShowCrewIntro}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm"
                        >
                          Meet the Crew
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Path Section */}
            <div
              id="section-learning"
              className={`mb-12 transition-opacity duration-300 ${
                activeSection === 'learning' ? 'opacity-100' : 'opacity-0 lg:hidden h-0 overflow-hidden'
              }`}
            >
              <h2 className="text-3xl font-bold mb-6">Learning Path</h2>
              <p className="text-gray-300 mb-8">
                Follow our structured learning path to master game development concepts.
              </p>

              <div className="space-y-6">
                {/* X-Code Academy Featured Course */}
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 flex items-center">
                        <BookOpen className="w-6 h-6 mr-2" />
                        X-Code Academy
                      </h3>
                      <p className="text-gray-300 mb-4">
                        A comprehensive 160-lesson journey across 4 courses to master coding fundamentals.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-800 bg-opacity-40 p-3 rounded-lg">
                          <p className="text-sm text-gray-300">Courses</p>
                          <p className="text-2xl font-bold">4</p>
                        </div>
                        <div className="bg-blue-800 bg-opacity-40 p-3 rounded-lg">
                          <p className="text-sm text-gray-300">Lessons</p>
                          <p className="text-2xl font-bold">160</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => onNavigate && onNavigate('xcode-academy')}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center"
                      >
                        Start Learning <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                    <div className="hidden md:block">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-700 rounded-lg p-3 text-center">
                          <Wand2 className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">CS1</p>
                          <p className="text-sm font-bold">Basics</p>
                        </div>
                        <div className="bg-red-700 rounded-lg p-3 text-center">
                          <Sword className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">CS2</p>
                          <p className="text-sm font-bold">Functions</p>
                        </div>
                        <div className="bg-green-700 rounded-lg p-3 text-center">
                          <Target className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">CS3</p>
                          <p className="text-sm font-bold">Objects</p>
                        </div>
                        <div className="bg-purple-700 rounded-lg p-3 text-center">
                          <Crown className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">CS4</p>
                          <p className="text-sm font-bold">Advanced</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Gauntlet Mode */}
                <div className="bg-gradient-to-r from-orange-900 to-red-900 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 flex items-center">
                        <Trophy className="w-6 h-6 mr-2" />
                        Gauntlet Challenge
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Test your skills with 100 progressively difficult dungeon challenges.
                      </p>
                      <button 
                        onClick={() => onNavigate && onNavigate('gauntlet-selection')}
                        className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center"
                      >
                        Enter Gauntlet <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                    <div className="hidden md:flex">
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-8 h-8 fill-current" />
                        <Star className="w-8 h-8 fill-current" />
                        <Star className="w-8 h-8 fill-current" />
                        <Star className="w-8 h-8" />
                        <Star className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Your Progress */}
                <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Your Progress</h3>
                  <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <p>Beginner</p>
                    <p>Intermediate</p>
                    <p>Advanced</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Development Tools Section */}
            <div
              id="section-tools"
              className={`mb-12 transition-opacity duration-300 ${
                activeSection === 'tools' ? 'opacity-100' : 'opacity-0 lg:hidden h-0 overflow-hidden'
              }`}
            >
              <h2 className="text-3xl font-bold mb-6">Development Tools</h2>
              <p className="text-gray-300 mb-8">
                Powerful tools to bring your game ideas to life.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                  onClick={() => navigate('/character-selector')}
                  className="group bg-gradient-to-br from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl mb-4">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Character Selector</h3>
                  <p className="text-gray-300">Create and animate game characters</p>
                </button>

                <button
                  onClick={() => navigate('/gauntlet-mode')}
                  className="group bg-gradient-to-br from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl mb-4">
                    <Gamepad2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Gauntlet Mode</h3>
                  <p className="text-gray-300">Challenge yourself with advanced scenarios</p>
                </button>

                <button
                  onClick={() => navigate('/audio-manager')}
                  className="group bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl mb-4">
                    <Volume2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Audio Manager</h3>
                  <p className="text-gray-300">Add and manage game sounds</p>
                </button>

                <button
                  onClick={() => navigate('/asset-workshop')}
                  className="group bg-gradient-to-br from-green-700 to-green-500 hover:from-green-800 hover:to-green-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl mb-4">
                    <Layers className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">The Asset Workshop</h3>
                  <p className="text-gray-300">Create and manage game assets</p>
                </button>

                <button
                  onClick={() => navigate('/map-editor')}
                  className="group bg-gradient-to-br from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl mb-4">
                    <MapIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Map Editor</h3>
                  <p className="text-gray-300">Visually build and test your game maps</p>
                </button>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => onNavigate && onNavigate('project-manager')}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Save className="w-5 h-5" />
                  <span>Manage Projects</span>
                </button>
              </div>
            </div>

            {/* Create New Project */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Start a New Project</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => onNavigate && onNavigate('project-manager')}
                  className="bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white p-6 rounded-2xl border-2 border-dashed border-gray-500 hover:border-gray-400 transition-all duration-200 flex flex-col items-center justify-center space-y-4"
                >
                  <div className="p-3 bg-white bg-opacity-10 rounded-full">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Create New Project</h3>
                  <p className="text-gray-400 text-center">Start fresh with a new game project</p>
                </button>

                <div className="bg-gray-800 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold mb-4">Recent Projects</h3>
                  <p className="text-gray-400">Your recent projects will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;