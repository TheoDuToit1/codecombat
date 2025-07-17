import React, { useState } from 'react';
import { BookOpen, Clock, Star, Trophy, Lock, CheckCircle, Target, Users, Zap, Award, Map, ScrollText } from 'lucide-react';
import { LESSON_PLAN, COURSES, ACHIEVEMENTS, Lesson, Course } from '../data/lessonPlan';
import { X_CODE_LESSONS } from '../data/X_CODE_LESSONS';

// Define a CS1_STORY_OVERVIEW constant to replace the imported one
const CS1_STORY_OVERVIEW = {
  mentor: "Sage the Wizard",
  world: "Syntaxia",
  overview: "Begin your coding journey in the magical realm of Syntaxia. Under the guidance of Sage the Wizard, you'll learn the fundamentals of programming while exploring the castle grounds, nearby villages, and mysterious forests. Master movement, variables, conditionals, and loops as you solve puzzles and help the inhabitants of this enchanted land."
};

interface LessonPlanViewerProps {
  isOpen: boolean;
  onClose: () => void;
  currentProgress: number;
  onSelectLesson?: (lesson: Lesson) => void;
}

export const LessonPlanViewer: React.FC<LessonPlanViewerProps> = ({
  isOpen,
  onClose,
  currentProgress,
  onSelectLesson
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('cs1');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);

  const getMentorColor = (mentor: string) => {
    switch (mentor) {
      case 'Sage': return 'from-blue-500 to-blue-700';
      case 'Rex': return 'from-red-500 to-red-700';
      case 'Arrow': return 'from-green-500 to-green-700';
      case 'Luna': return 'from-purple-500 to-purple-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getMentorIcon = (mentor: string) => {
    switch (mentor) {
      case 'Sage': return '🧙‍♂️';
      case 'Rex': return '⚔️';
      case 'Arrow': return '🏹';
      case 'Luna': return '👑';
      default: return '📚';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-orange-100 text-orange-800';
      case 5: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
  };

  const isLessonUnlocked = (lesson: Lesson) => {
    return lesson.id <= currentProgress + 1; // Can access current + next lesson
  };

  const isLessonCompleted = (lesson: Lesson) => {
    return lesson.id < currentProgress;
  };

  const courseLessons = LESSON_PLAN.filter(lesson => lesson.courseId === selectedCourse);
  const selectedCourseData = COURSES.find(course => course.id === selectedCourse);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">📚 160 Lesson Master Plan</h1>
              <p className="text-indigo-100">Your complete journey from beginner to code legend!</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">Your Progress</div>
              <div className="text-2xl font-bold">{currentProgress}/160</div>
              <div className="text-sm opacity-75">
                {Math.round((currentProgress / 160) * 100)}% Complete
              </div>
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
          {/* Course Selection Sidebar */}
          <div className="w-1/4 bg-gray-50 border-r overflow-y-auto">
            <div className="p-4 space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Courses
              </h3>
              
              {COURSES.map((course) => {
                const courseProgress = LESSON_PLAN.filter(
                  lesson => lesson.courseId === course.id && lesson.id < currentProgress
                ).length;
                const isUnlocked = course.id === 'cs1' || courseProgress > 0 || currentProgress >= (course.id === 'cs2' ? 40 : course.id === 'cs3' ? 80 : 120);
                
                return (
                  <div
                    key={course.id}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-all duration-200 border-2
                      ${!isUnlocked 
                        ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-100' 
                        : selectedCourse === course.id 
                          ? 'border-purple-500 bg-purple-50 shadow-md' 
                          : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
                      }
                    `}
                    onClick={() => isUnlocked && setSelectedCourse(course.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getMentorIcon(course.mentor)}</span>
                        <span className="font-medium text-gray-800">{course.name}</span>
                      </div>
                      {!isUnlocked && <Lock className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{course.description}</div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{courseProgress}/40 lessons</span>
                      <span className={`px-2 py-1 rounded ${isUnlocked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {isUnlocked ? '✓ Available' : '🔒 Locked'}
                      </span>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => setShowAchievements(!showAchievements)}
                className="w-full p-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-medium transition-all duration-200 hover:from-yellow-500 hover:to-orange-600"
              >
                <Award className="w-4 h-4 inline mr-2" />
                {showAchievements ? 'Hide' : 'Show'} Achievements
              </button>

              {showAchievements && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">🏆 Achievements</h4>
                  {ACHIEVEMENTS.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="p-2 bg-white rounded border text-xs">
                      <div className="flex items-center space-x-2">
                        <span>{achievement.icon}</span>
                        <span className="font-medium">{achievement.name}</span>
                      </div>
                      <div className="text-gray-600 mt-1">{achievement.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Lesson List */}
          <div className="w-1/2 border-r overflow-y-auto">
            <div className="p-4">
              {selectedCourseData && (
                <div className={`bg-gradient-to-r ${getMentorColor(selectedCourseData.mentor)} text-white p-4 rounded-lg mb-4`}>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getMentorIcon(selectedCourseData.mentor)}</span>
                    <div>
                      <h2 className="text-xl font-bold">{selectedCourseData.name}</h2>
                      <p className="opacity-90">{selectedCourseData.description}</p>
                    </div>
                  </div>
                  <div className="text-sm opacity-75">
                    Concepts: {selectedCourseData.concepts.join(', ')}
                  </div>
                </div>
              )}

              {/* Story Overview for CS1 */}
              {selectedCourse === 'cs1' && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4 mb-4">
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                    <Map className="w-4 h-4 mr-2" />
                    🌍 X-Code Quest: CS1
                  </h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <div className="text-xs text-gray-600">
                      <strong>Mentor:</strong> {CS1_STORY_OVERVIEW.mentor} | <strong>World:</strong> {CS1_STORY_OVERVIEW.world}
                    </div>
                    <div className="text-xs leading-relaxed">
                      {CS1_STORY_OVERVIEW.overview}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {courseLessons.map((lesson) => {
                  const isUnlocked = isLessonUnlocked(lesson);
                  const isCompleted = isLessonCompleted(lesson);
                  const isCurrent = lesson.id === currentProgress;
                  
                  return (
                    <div
                      key={lesson.id}
                      className={`
                        p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                        ${!isUnlocked 
                          ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50' 
                          : selectedLesson?.id === lesson.id 
                            ? 'border-purple-500 bg-purple-50 shadow-md' 
                            : isCompleted 
                              ? 'border-green-200 bg-green-50 hover:border-green-300' 
                              : isCurrent 
                                ? 'border-blue-200 bg-blue-50 hover:border-blue-300' 
                                : 'border-gray-200 bg-white hover:border-purple-300'
                        }
                      `}
                      onClick={() => isUnlocked && setSelectedLesson(lesson)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-gray-500">#{lesson.lessonNumber}</span>
                          <span className="font-medium text-gray-800">{lesson.name}</span>
                          {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {isCurrent && <Zap className="w-4 h-4 text-blue-500" />}
                          {!isUnlocked && <Lock className="w-4 h-4 text-gray-400" />}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(lesson.difficulty)}`}>
                            {getDifficultyStars(lesson.difficulty)}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {lesson.estimatedTime}m
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{lesson.description}</div>
                      <div className="text-xs text-gray-500">
                        Concept: <span className="font-medium">{lesson.concept}</span>
                      </div>
                      {lesson.unlocks && (
                        <div className="text-xs text-purple-600 mt-1 font-medium">
                          🎉 Unlocks: {lesson.unlocks}
                        </div>
                      )}
                      {/* Quest Update for CS1 */}
                      {selectedCourse === 'cs1' && (() => {
                        const storyData = X_CODE_LESSONS.find(s => s.id === lesson.id);
                        return storyData ? (
                          <div className="text-xs text-orange-600 mt-1 font-medium">
                            ⚔️ {storyData.questUpdate}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lesson Details */}
          <div className="w-1/4 overflow-y-auto">
            <div className="p-4">
              {selectedLesson ? (
                <div className="space-y-4">
                  <div className={`bg-gradient-to-r ${getMentorColor(selectedLesson.mentor)} text-white p-4 rounded-lg`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xl">{getMentorIcon(selectedLesson.mentor)}</span>
                      <div>
                        <h3 className="font-bold">Lesson {selectedLesson.lessonNumber}</h3>
                        <p className="text-sm opacity-90">{selectedLesson.name}</p>
                      </div>
                    </div>
                    <div className="text-sm opacity-75">
                      Mentor: {selectedLesson.mentor}
                    </div>
                  </div>

                  {/* Your Quest Section */}
                  {selectedCourse === 'cs1' && (() => {
                    const storyData = X_CODE_LESSONS.find(s => s.id === selectedLesson.id);
                    return storyData ? (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                          <ScrollText className="w-4 h-4 mr-1" />
                          ⚔️ Your Quest
                        </h4>
                        <div className="text-sm text-gray-700 space-y-2">
                          <div className="font-medium text-orange-700">{storyData.title}</div>
                          <div className="text-xs leading-relaxed">
                            {storyData.questUpdate}
                          </div>
                          <div className="text-xs text-gray-600">
                            <strong>Setting:</strong> {storyData.setting}
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()}

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        Objectives
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedLesson.objectives.map((objective, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        New Concepts
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedLesson.newConcepts.map((concept, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Code Example
                      </h4>
                      <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
                        {selectedLesson.codeExample}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">💡 Hints</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedLesson.hints.map((hint, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-500 mr-2">💡</span>
                            {hint}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {onSelectLesson && isLessonUnlocked(selectedLesson) && (
                      <button
                        onClick={() => onSelectLesson(selectedLesson)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-200"
                      >
                        Start This Lesson
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a lesson to see details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};