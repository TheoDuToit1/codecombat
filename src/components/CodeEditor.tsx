import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, BookOpen } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  onReset: () => void;
  onShowHint: () => void;
  onShowSolution: () => void;
  isRunning?: boolean;
  level: number;
  placeholder?: string;
}

// Simplified placeholder text component that overlays the editor
const PlaceholderOverlay = ({ text, visible }: { text: string, visible: boolean }) => {
  if (!visible || !text) return null;
  
  return (
    <div className="absolute inset-0 z-10 pointer-events-none p-4">
      <div className="bg-transparent font-mono text-sm">
        <div className="text-blue-400 opacity-40">{text}</div>
      </div>
    </div>
  );
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRun,
  onReset,
  onShowHint,
  onShowSolution,
  isRunning = false,
  level,
  placeholder = ''
}) => {
  const editorRef = useRef<any>(null);
  const [monaco, setMonaco] = useState<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [editorMeasurements, setEditorMeasurements] = useState({
    lineHeight: 19,
    paddingTop: 4
  });
  const [showingSolution, setShowingSolution] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [showSolutionButton, setShowSolutionButton] = useState(true);
  
  // Initialize state based on level
  useEffect(() => {
    // Hide solution button initially for Lesson 10
    if (level === 10) {
      setShowSolutionButton(false);
    } else {
      setShowSolutionButton(true);
    }
  }, [level]);
  
  // Update showingSolution state when code changes
  useEffect(() => {
    // Check if code contains more than just comments
    const hasCodeBeyondComments = !/^(\s*#.*\n?)*$/.test(code);
    setShowingSolution(hasCodeBeyondComments);
    
    // Hide placeholder when user starts typing anything
    if (code.trim() !== '') {
      setShowPlaceholder(false);
    } else {
      setShowPlaceholder(true);
    }
    
    // Show solution button once user starts typing in Lesson 10
    if (level === 10 && code.trim() !== '') {
      setShowSolutionButton(true);
    }
  }, [code, level]);
  
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
        
        // Ensure the editor shows 10 lines by default
        editor.setScrollTop(0);
        
        // For lesson 10, ensure we have exactly 10 empty lines
        if (level === 10) {
          // Set to completely empty with 10 lines
          editor.getModel().setValue('\n'.repeat(9));
          editor.setPosition({ lineNumber: 1, column: 1 });
        } else {
          // For other lessons, ensure at least 10 lines
          const lineCount = editor.getModel().getLineCount();
          if (lineCount < 10) {
            const currentValue = editor.getModel().getValue();
            const linesToAdd = 10 - lineCount;
            const newValue = currentValue + '\n'.repeat(linesToAdd);
            editor.getModel().setValue(newValue);
            editor.setPosition({ lineNumber: 1, column: 1 });
          }
        }
        
        // Add focus listener to hide placeholder on focus
        editor.onDidFocusEditorText(() => {
          // Hide placeholder when editor gets focus
          setShowPlaceholder(false);
        });
        
        // Reset placeholder visibility when editor loses focus
        editor.onDidBlurEditorText(() => {
          if (code.trim() === '') {
            setShowPlaceholder(true);
          }
        });
      } catch (e) {
        console.error('Failed to measure editor dimensions:', e);
      }
    }, 100);
  };
  
  // Handle solution button click
  const handleSolutionClick = () => {
    onShowSolution();
  };
  
  // Show solution button when run button is clicked
  useEffect(() => {
    if (isRunning && level === 10) {
      setShowSolutionButton(true);
    }
  }, [isRunning, level]);
  
  // Calculate editor height to fit exactly 10 lines
  const editorHeight = "220px"; // Approximately 10 lines + padding
  
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
            {showSolutionButton && (
              <button
                onClick={handleSolutionClick}
                className="flex items-center space-x-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                <BookOpen size={16} />
                <span>{showingSolution ? "Hide Solution" : "Solution"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Editor with external line markers */}
      <div className="editor-wrapper relative" style={{ height: editorHeight }} ref={wrapperRef}>
        {/* Improved placeholder overlay */}
        <PlaceholderOverlay text={placeholder} visible={showPlaceholder} />
        
        {/* Monaco Editor */}
        <Editor
          height={editorHeight}
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
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10
            }
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
              <span>Executing...</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};