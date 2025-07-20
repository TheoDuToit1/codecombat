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
  
  // Split the text by newlines and preserve empty lines
  const lines = text.split('\n');
  
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      <div className="relative h-full w-full">
        <div className="absolute left-[70px] top-[32px] right-0">
          <div 
            className="font-mono text-sm text-blue-400 opacity-40" 
            style={{ 
              fontFeatureSettings: '"liga" 0, "calt" 0',
              lineHeight: '19px',
              fontFamily: 'Consolas, "Courier New", monospace',
              letterSpacing: 'normal',
              wordSpacing: 'normal',
              whiteSpace: 'pre',
              paddingLeft: '15px',
              marginTop: '-1px'
            }}
          >
            {lines.map((line, i) => {
              // Preserve empty lines with a space to maintain height
              const displayLine = line === '' ? ' ' : line;
              return (
                <div 
                  key={i} 
                  className="h-[19px] leading-[19px] block whitespace-pre"
                  style={{
                    whiteSpace: 'pre',
                    fontFamily: 'Consolas, "Courier New", monospace',
                    lineHeight: '19px',
                    height: '19px',
                    margin: 0,
                    padding: 0
                  }}
                >
                  {displayLine}
                </div>
              );
            })}
          </div>
        </div>
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
  
  // Always show solution button if the lesson has a solution (remove special hiding for Lesson 10)
  useEffect(() => {
    setShowSolutionButton(true);
  }, [level]);
  
  // Handle solution button click
  const handleShowSolution = () => {
    setShowingSolution(!showingSolution);
    onShowSolution();
  };

  // Update placeholder visibility when code changes
  useEffect(() => {
    // Hide placeholder when user starts typing anything
    if (code.trim() !== '') {
      setShowPlaceholder(false);
    } else {
      setShowPlaceholder(true);
    }
  }, [code, level]);
  
  // Editor initialization
  const handleEditorDidMount = (editor: any, monacoInstance: any) => {
    editorRef.current = editor;
    setMonaco(monacoInstance);
    
    // Adjust content left margin to move text left
    editor.updateOptions({
      padding: { top: 22, left: -30 },
      scrollbar: {
        horizontal: 'hidden',
        vertical: 'hidden'
      }
    });
    
    // Apply custom editor styling
    monacoInstance.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'D4D4D4', background: '1E1E1E' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.lineHighlightBackground': '#2A2D2E',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#C6C6C6',
        'editorGutter.background': '#1E1E1E',
      }
    });
    
    // Apply the custom theme
    monacoInstance.editor.setTheme('custom-dark');
    
    // Get actual line height from editor after it's mounted
    setTimeout(() => {
      try {
        const lineHeight = editor.getOption('lineHeight') || 19;
        const editorDomNode = editor.getDomNode();
        if (editorDomNode) {
          // Add custom CSS for line numbers and padding
          const style = document.createElement('style');
          style.textContent = `
            .monaco-editor .line-numbers {
              padding-left: 10px !important;
            }
            .monaco-editor .view-lines {
              padding-left: 30px !important;
              padding-top: 0 !important;
              margin-top: 0 !important;
              margin-left: -30px !important;
            }
            .monaco-editor .margin-view-overlays {
              width: 60px !important;
            }
            .monaco-editor, .monaco-editor-background, .monaco-editor .inputarea.ime-input {
              padding-top: 22px !important;
            }
            .monaco-editor .lines-content {
              padding-left: 30px !important;
              padding-top: 0 !important;
              margin-top: 0 !important;
              margin-left: -30px !important;
            }
          `;
          document.head.appendChild(style);
          
          const firstLine = editorDomNode.querySelector('.view-line');
          const paddingTop = firstLine ? firstLine.getBoundingClientRect().top - editorDomNode.getBoundingClientRect().top : 10;
          
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
  
  // Solution click handler is now handled by handleShowSolution
  
  // Show solution button when run button is clicked
  useEffect(() => {
    if (isRunning && level === 10) {
      setShowSolutionButton(true);
    }
  }, [isRunning, level]);
  
  // Calculate editor height to fit exactly 10 lines with padding
  const editorHeight = "240px"; // Increased to accommodate padding
  
  // Add custom CSS for Monaco Editor to ensure consistent text positioning
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .monaco-editor .view-lines {
        padding-left: 12px !important;
      }
      .monaco-editor .line-numbers {
        padding-left: 10px !important;
      }
      .monaco-editor .margin-view-overlays {
        width: 40px !important;
      }
      .monaco-editor .lines-content {
        padding-left: 20px !important;
      }
      .monaco-editor .view-line {
        padding-top: 1px !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-4 text-gray-300 font-medium">Level {level} - Python Editor</span>
          </div>
          <div className="flex items-center space-x-2">
            {showSolutionButton && (
              <button
                onClick={handleShowSolution}
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
            lineNumbersMinChars: 4, // Ensure consistent width for line numbers
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 10, bottom: 10 }, // Add padding to the editor content
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

      {/* Spacer to push controls further down */}
      <div style={{ height: '40px' }} />
      {/* Controls */}
      <div className="bg-gray-800 px-4 py-6 border-t border-gray-700 mt-2">
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