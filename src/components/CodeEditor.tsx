import React from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Lightbulb, BookOpen, Zap } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  onReset: () => void;
  onShowHint: () => void;
  onShowSolution: () => void;
  isRunning?: boolean;
  level: number;
  currentExecutingLine?: number;
  codeLines?: string[];
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRun,
  onReset,
  onShowHint,
  onShowSolution,
  isRunning = false,
  level,
  currentExecutingLine = -1,
  codeLines = []
}) => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-4 text-gray-300 font-medium">Level {level} - Code Editor</span>
            {isRunning && (
              <div className="flex items-center space-x-2 ml-4">
                <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span className="text-yellow-400 text-sm">Executing Step-by-Step</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onShowHint}
              className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              <Lightbulb size={16} />
              <span>Hint</span>
            </button>
            <button
              onClick={onShowSolution}
              className="flex items-center space-x-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              <BookOpen size={16} />
              <span>Solution</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step-by-Step Execution Display */}
      {isRunning && codeLines.length > 0 && (
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="text-sm text-gray-300 mb-2">Step-by-Step Execution:</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {codeLines.map((line, index) => (
              <div
                key={index}
                className={`
                  px-3 py-1 rounded text-sm font-mono transition-all duration-300
                  ${index === currentExecutingLine 
                    ? 'bg-yellow-600 text-white animate-pulse shadow-lg' 
                    : index < currentExecutingLine 
                      ? 'bg-green-800 text-green-200' 
                      : 'bg-gray-700 text-gray-400'
                  }
                `}
              >
                <span className="text-xs opacity-60 mr-2">{index + 1}:</span>
                {line.trim()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="h-80">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(value) => onChange(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            readOnly: isRunning
          }}
        />
      </div>

      {/* Controls */}
      <div className="bg-gray-800 px-4 py-3 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onRun}
              disabled={isRunning}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200
                ${isRunning 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 shadow-lg'
                }
              `}
            >
              <Play size={18} />
              <span>{isRunning ? 'Executing...' : 'Run Code'}</span>
            </button>
            <button
              onClick={onReset}
              disabled={isRunning}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200
                ${isRunning 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white hover:scale-105'
                }
              `}
            >
              <RotateCcw size={18} />
              <span>Reset</span>
            </button>
          </div>
          <div className="text-gray-400 text-sm">
            {isRunning ? (
              <span className="text-yellow-400">⚡ Watch your code execute step-by-step!</span>
            ) : (
              <>Press <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Ctrl+Enter</kbd> to run</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};