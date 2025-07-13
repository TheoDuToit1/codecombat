import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Lightbulb, BookOpen } from 'lucide-react';

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
  placeholder?: string;
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
  codeLines = [],
  placeholder = ''
}) => {
  const editorRef = useRef<any>(null);
  const [monaco, setMonaco] = useState<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [editorMeasurements, setEditorMeasurements] = useState({
    lineHeight: 19,
    paddingTop: 4
  });
  
  // Editor initialization
  const handleEditorDidMount = (editor: any, monacoInstance: any) => {
    editorRef.current = editor;
    setMonaco(monacoInstance);
    
    // Get actual line height from editor after it's mounted
    setTimeout(() => {
      try {
        const lineHeight = editor.getOption('lineHeight') || 19;
        const editorDomNode = editor.getDomNode();
        if (editorDomNode) {
          // Try to find the first line element to measure its actual position
          const firstLine = editorDomNode.querySelector('.view-line');
          const paddingTop = firstLine ? firstLine.getBoundingClientRect().top - editorDomNode.getBoundingClientRect().top : 4;
          
          setEditorMeasurements({
            lineHeight,
            paddingTop
          });
        }
      } catch (e) {
        console.error('Failed to measure editor dimensions:', e);
      }
    }, 100);
  };
  
  // External Execution Line Highlighter Component
  const LineHighlighter = ({ currentLine, totalLines }: { currentLine: number, totalLines: number }) => {
    if (currentLine < 0) return null;
    
    // Hard-coded values that seem to work well for Monaco
    const LINE_HEIGHT = 19;
    const TOP_OFFSET = -1; // Reduced from 4 to -2 to move everything up a bit
    
    // Calculate positions
    const getLineTop = (line: number) => TOP_OFFSET + (line * LINE_HEIGHT);
    
    return (
      <div className="absolute left-0 top-0 right-0 bottom-0 pointer-events-none">
        {/* Completed lines */}
        {Array.from({ length: currentLine }).map((_, index) => (
          <div 
            key={`completed-line-${index}`}
            className="absolute left-0 right-0"
            style={{
              top: `${getLineTop(index)}px`,
              height: `${LINE_HEIGHT}px`,
              backgroundColor: 'rgba(40, 167, 69, 0.2)',
              borderLeft: '2px solid rgba(40, 167, 69, 0.7)',
              zIndex: 1
            }}
          />
        ))}
        
        {/* Current executing line */}
        <div 
          className="absolute left-0 right-0"
          style={{
            top: `${getLineTop(currentLine)}px`,
            height: `${LINE_HEIGHT}px`,
            backgroundColor: 'rgba(255, 215, 0, 0.35)',
            borderLeft: '2px solid rgba(255, 180, 0, 1)',
            boxShadow: '0 0 2px rgba(0, 0, 0, 0.1)',
            zIndex: 2,
            animation: 'pulse-line 1.2s infinite alternate'
          }}
        >
          <div 
            className="absolute top-0 bottom-0 flex items-center"
            style={{ left: '5px' }}
          >
            <span className="text-yellow-800 font-bold">→</span>
          </div>
        </div>
      </div>
    );
  };
  
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

      {/* Editor with external line markers */}
      <div className="h-80 editor-wrapper relative" ref={wrapperRef}>
        {/* Show placeholder when empty */}
        {!code && placeholder && (
          <div className="absolute z-10 text-gray-500 p-4 font-mono text-sm">
            {placeholder.split('\n').map((line, idx) => (
              <div key={idx}>{line || ' '}</div>
            ))}
          </div>
        )}
        
        {/* Monaco Editor */}
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 19, // Fixed line height for consistency
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            readOnly: isRunning,
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            parameterHints: { enabled: false },
            suggest: { showClasses: false, showFunctions: false, showVariables: false, showWords: false },
            hover: { enabled: false },
            formatOnType: false,
            formatOnPaste: false,
            glyphMargin: true,
            lineDecorationsWidth: 15,
            renderWhitespace: 'none',
            cursorBlinking: 'blink',
            cursorStyle: 'line',
            fixedOverflowWidgets: true,
          }}
        />
        
        {/* Line highlighter overlay - only show when running */}
        {isRunning && (
          <LineHighlighter currentLine={currentExecutingLine} totalLines={codeLines.length} />
        )}
        
        {/* CSS animations */}
        <style>{`
          @keyframes pulse-line {
            from { background-color: rgba(255, 215, 0, 0.25); }
            to { background-color: rgba(255, 215, 0, 0.45); }
          }
        `}</style>
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
              <span>Executing...</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};