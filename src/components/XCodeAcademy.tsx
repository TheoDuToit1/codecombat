// XCodeAcademy Component
import React, { useState } from 'react';
import { ArrowLeft, BookOpen, ChevronRight, Code, Star, Clock, Award, CheckCircle, Lock, Play } from 'lucide-react';
import { CS1_LESSONS, MENTOR_DATA, COURSE_STRUCTURE } from '../data/cs1LessonData';

interface XCodeAcademyProps {
  onBack?: () => void;
  currentProgress?: number;
}

const XCodeAcademy: React.FC<XCodeAcademyProps> = ({ 
  onBack,
  currentProgress = 3 // Default to lesson 3 being completed
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  // Filter lessons by week
  const weekLessons = CS1_LESSONS.filter(lesson => lesson.week === selectedWeek);
  const selectedLessonData = selectedLesson ? CS1_LESSONS.find(l => l.id === selectedLesson) : null;

  // Group lessons by week for the sidebar
  const weekGroups = Array.from(new Set(CS1_LESSONS.map(l => l.week))).sort((a, b) => a - b);
  
  // Create difficulty stars
  const renderDifficultyStars = (difficulty: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < difficulty ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };

  // Check if a lesson is unlocked based on progress
  const isLessonUnlocked = (lessonId: number) => {
    return lessonId <= currentProgress + 1;
  };

  // Check if a lesson is completed
  const isLessonCompleted = (lessonId: number) => {
    return lessonId <= currentProgress;
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header with back button */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={onBack} 
              className="mr-4 p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <BookOpen className="mr-2" /> 
                X-Code Crew Academy
              </h1>
              <p className="text-blue-100">Your 160-lesson coding adventure</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-75">Progress</div>
            <div className="text-lg font-bold">{currentProgress}/160</div>
            <div className="w-32 bg-white bg-opacity-20 rounded-full h-2 mt-1">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${(currentProgress/160)*100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="flex gap-6">
          {/* Sidebar - Course Structure */}
          <div className="w-1/4 bg-gray-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Code className="mr-2" /> Course Outline
            </h2>
            
            {/* Current Course Info */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">{MENTOR_DATA.sage.icon}</span>
                <div>
                  <h3 className="font-bold">CS1: Code Basics</h3>
                  <p className="text-sm text-blue-200">with {MENTOR_DATA.sage.name}</p>
                </div>
              </div>
              <p className="text-sm text-blue-100 mb-2">Master the fundamentals of programming through interactive challenges.</p>
              <div className="text-xs text-blue-300">
                {COURSE_STRUCTURE.cs1.mainConcepts.join(' • ')}
              </div>
            </div>
            
            {/* Week Selection */}
            <div className="mb-6">
              <h3 className="text-gray-400 text-sm font-medium mb-2">SELECT WEEK</h3>
              <div className="grid grid-cols-5 gap-2">
                {weekGroups.map(week => (
                  <button
                    key={week}
                    onClick={() => setSelectedWeek(week)}
                    className={`p-2 rounded-lg text-center ${
                      selectedWeek === week 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {week}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Week Title */}
            <h3 className="font-medium text-lg mb-3">
              Week {selectedWeek}: {
                selectedWeek === 1 ? "First Steps" :
                selectedWeek === 2 ? "Building Skills" :
                selectedWeek === 3 ? "Intermediate Concepts" :
                selectedWeek === 4 ? "Advanced Basics" :
                "Mastery & Gauntlet Prep"
              }
            </h3>
            
            {/* Mentor Quote */}
            <div className="bg-gray-700 rounded-lg p-3 mb-6 border-l-4 border-blue-500">
              <p className="italic text-sm text-gray-300">"{MENTOR_DATA.sage.quote}"</p>
              <p className="text-right text-xs text-gray-400 mt-1">— {MENTOR_DATA.sage.name}</p>
            </div>
            
            {/* Additional Navigation */}
            <div className="space-y-2 mt-4">
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-left px-4 py-2 rounded-lg flex items-center justify-between text-sm">
                <span>All Courses</span>
                <ChevronRight size={16} />
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-left px-4 py-2 rounded-lg flex items-center justify-between text-sm">
                <span>View Achievements</span>
                <Award size={16} />
              </button>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1">
            {selectedLessonData ? (
              /* Lesson Detail View */
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                {/* Lesson Header */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Lesson {selectedLessonData.lessonNumber}: {selectedLessonData.title}
                      </h2>
                      <p className="text-blue-200">{selectedLessonData.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-300 mb-1">Difficulty</p>
                        <div className="flex">
                          {renderDifficultyStars(selectedLessonData.difficulty)}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-300 mb-1">Time</p>
                        <p className="flex items-center">
                          <Clock size={14} className="mr-1" /> 
                          <span>{selectedLessonData.estimatedTime}m</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex mt-4">
                    <span className="bg-blue-500 bg-opacity-30 text-blue-200 text-xs px-3 py-1 rounded-full">
                      {selectedLessonData.concept}
                    </span>
                  </div>
                </div>
                
                {/* Lesson Content */}
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-blue-400 mb-2">Objectives</h3>
                    <ul className="space-y-2">
                      {selectedLessonData.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5" />
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {selectedLessonData.codeExample && (
                    <div>
                      <h3 className="text-lg font-medium text-blue-400 mb-2">Example Code</h3>
                      <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-gray-300">
                        <pre>{selectedLessonData.codeExample}</pre>
                      </div>
                    </div>
                  )}
                  
                  {selectedLessonData.hints && (
                    <div>
                      <h3 className="text-lg font-medium text-blue-400 mb-2">Hints & Tips</h3>
                      <ul className="space-y-2">
                        {selectedLessonData.hints.map((hint, index) => (
                          <li key={index} className="flex items-start text-gray-300">
                            <span className="font-bold text-yellow-500 mr-2">•</span>
                            <span>{hint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedLessonData.unlocks && (
                    <div className="bg-purple-900 bg-opacity-30 border border-purple-500 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-purple-300 mb-1">Unlocks</h3>
                      <p>{selectedLessonData.unlocks}</p>
                    </div>
                  )}
                  
                  {/* Lesson Actions */}
                  <div className="flex justify-between pt-4">
                    <button 
                      onClick={() => setSelectedLesson(null)} 
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                    >
                      Back to Lessons
                    </button>
                    <button 
                      className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg flex items-center font-medium"
                    >
                      <Play size={16} className="mr-2" /> Start Lesson
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Lesson List View */
              <div className="space-y-6">
                <div className="bg-gray-800 p-6 rounded-xl">
                  <h2 className="text-xl font-bold mb-4">
                    Week {selectedWeek} Lessons
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {weekLessons.map(lesson => {
                      const isCompleted = isLessonCompleted(lesson.id);
                      const isUnlocked = isLessonUnlocked(lesson.id);
                      const isActive = lesson.id === currentProgress + 1;
                      
                      return (
                        <div
                          key={lesson.id}
                          className={`
                            p-4 rounded-lg border-l-4 
                            ${isCompleted 
                              ? 'bg-green-900 bg-opacity-20 border-green-500' 
                              : isActive
                                ? 'bg-blue-900 bg-opacity-20 border-blue-500 animate-pulse'
                                : 'bg-gray-700 border-gray-600'}
                          `}
                        >
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              {isCompleted ? (
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                                  <CheckCircle size={16} />
                                </div>
                              ) : isUnlocked ? (
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                                  {lesson.lessonNumber}
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                                  <Lock size={14} />
                                </div>
                              )}
                              <div>
                                <h3 className="font-medium">{lesson.title}</h3>
                                <p className="text-sm text-gray-400">{lesson.concept}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex mb-1">
                                {renderDifficultyStars(lesson.difficulty)}
                              </div>
                              <div className="text-xs text-gray-400 flex items-center">
                                <Clock size={12} className="mr-1" /> {lesson.estimatedTime}m
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-between items-center">
                            <p className="text-sm text-gray-300 line-clamp-1">
                              {lesson.description}
                            </p>
                            <button
                              onClick={() => isUnlocked && setSelectedLesson(lesson.id)}
                              disabled={!isUnlocked}
                              className={`
                                px-4 py-1.5 rounded-lg text-sm flex items-center
                                ${isUnlocked 
                                  ? 'bg-blue-600 hover:bg-blue-500' 
                                  : 'bg-gray-600 cursor-not-allowed text-gray-400'}
                              `}
                            >
                              {isCompleted ? 'Review' : isUnlocked ? 'Start' : 'Locked'}
                              <ChevronRight size={16} className="ml-1" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
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

export default XCodeAcademy;
