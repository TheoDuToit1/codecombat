import React, { useState } from 'react';
import { CS1Quiz } from '../data/cs1QuizData';
import { CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';

interface CS1QuizModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  quiz: CS1Quiz;
}

const getInitialAnswers = (quiz: CS1Quiz) => quiz.questions.map(() => null);

export const CS1QuizModal: React.FC<CS1QuizModalProps> = ({ isOpen, onRequestClose, quiz }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(string | boolean | null)[]>(getInitialAnswers(quiz));
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = quiz.questions[current];
  const total = quiz.questions.length;
  const score = answers.filter((a, i) => a === quiz.questions[i].answer).length;

  const handleAnswer = (answer: string | boolean) => {
    if (showFeedback) return;
    const correct = answer === question.answer;
    setIsCorrect(correct);
    setAnswers(prev => prev.map((a, i) => (i === current ? answer : a)));
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      if (current === total - 1) {
        setFinished(true);
      } else {
        setCurrent(c => c + 1);
      }
    }, 1200);
  };

  const handleRestart = () => {
    setCurrent(0);
    setAnswers(getInitialAnswers(quiz));
    setShowFeedback(false);
    setIsCorrect(false);
    setFinished(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-70 z-40" onClick={onRequestClose} />
      <div className="relative z-50 bg-gray-900 rounded-2xl p-8 shadow-2xl w-full max-w-xl animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          onClick={onRequestClose}
        >
          ×
        </button>
        {finished ? (
          <div className="flex flex-col items-center text-center">
            <Sparkles className="w-16 h-16 text-yellow-400 animate-bounce mb-4" />
            <h2 className="text-3xl font-bold text-green-300 mb-2">Quiz Complete!</h2>
            <div className="text-xl text-white mb-4">Score: <span className="font-mono text-green-400">{score} / {total}</span></div>
            <p className="text-lg text-blue-200 mb-6">{score === total ? 'Perfect! You are a coding wizard!' : score > total/2 ? 'Great job! Keep practicing and you will master it!' : 'Keep going! Every coder learns by trying.'}</p>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-full shadow-lg transition-all duration-300"
              onClick={handleRestart}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-300">Question {current + 1} / {total}</div>
              <div className="w-40 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-green-400 rounded-full transition-all duration-500"
                  style={{ width: `${((current + (showFeedback ? 1 : 0)) / total) * 100}%` }}
                />
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl mb-4 animate-slide-in">
              <div className="text-lg font-bold text-blue-200 mb-2">{question.question}</div>
              {question.type === 'multiple-choice' && (
                <ul className="space-y-2">
                  {question.options?.map((opt, i) => (
                    <li key={i}>
                      <button
                        className={`w-full text-left px-4 py-2 rounded-lg font-mono text-base transition-all duration-200
                          ${answers[current] === opt ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-blue-600 text-blue-200'}
                          ${showFeedback && opt === question.answer ? 'ring-2 ring-green-400' : ''}
                        `}
                        disabled={showFeedback}
                        onClick={() => handleAnswer(opt)}
                      >
                        {opt}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {question.type === 'true-false' && (
                <div className="flex gap-4 mt-2">
                  {[true, false].map(val => (
                    <button
                      key={String(val)}
                      className={`flex-1 px-4 py-2 rounded-lg font-bold text-lg transition-all duration-200
                        ${answers[current] === val ? (val ? 'bg-green-500' : 'bg-red-500') + ' text-white' : 'bg-gray-700 text-blue-200 hover:bg-blue-600'}
                        ${showFeedback && val === question.answer ? 'ring-2 ring-green-400' : ''}
                      `}
                      disabled={showFeedback}
                      onClick={() => handleAnswer(val)}
                    >
                      {val ? 'True' : 'False'}
                    </button>
                  ))}
                </div>
              )}
              {question.type === 'code-fill' && !showFeedback && (
                <form
                  className="flex gap-2 mt-2"
                  onSubmit={e => {
                    e.preventDefault();
                    const val = (e.target as any).elements[0].value.trim();
                    handleAnswer(val);
                  }}
                >
                  <input
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-blue-200 font-mono border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Type your answer..."
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg"
                  >
                    Submit
                  </button>
                </form>
              )}
              {question.type === 'short-answer' && !showFeedback && (
                <form
                  className="flex gap-2 mt-2"
                  onSubmit={e => {
                    e.preventDefault();
                    const val = (e.target as any).elements[0].value.trim();
                    handleAnswer(val);
                  }}
                >
                  <input
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-blue-200 font-mono border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Type your answer..."
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg"
                  >
                    Submit
                  </button>
                </form>
              )}
              {showFeedback && (
                <div className="flex items-center gap-2 mt-4">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-400 animate-bounce" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 animate-shake" />
                  )}
                  <span className={`text-lg font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? 'Correct!' : 'Try again next time!'}
                  </span>
                  {question.explanation && (
                    <span className="text-xs text-gray-300 ml-2">{question.explanation}</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <span className="text-gray-400 text-xs">Powered by X-Code Academy</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CS1QuizModal; 