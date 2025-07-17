import React from 'react';
import { Terminal, CheckCircle, XCircle, Info } from 'lucide-react';

interface ExecutionLogProps {
  logs: string[];
  isRunning?: boolean;
}

export const ExecutionLog: React.FC<ExecutionLogProps> = ({ logs, isRunning = false }) => {
  const getLogIcon = (log: string) => {
    if (log.includes('Error') || log.includes('Failed')) {
      return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
    }
    if (log.includes('Success') || log.includes('Completed') || log.includes('Collected')) {
      return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
    }
    return <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />;
  };

  const getLogColor = (log: string) => {
    if (log.includes('Error') || log.includes('Failed')) {
      return 'text-red-700 bg-red-50 border-red-200';
    }
    if (log.includes('Success') || log.includes('Completed') || log.includes('Collected')) {
      return 'text-green-700 bg-green-50 border-green-200';
    }
    return 'text-blue-700 bg-blue-50 border-blue-200';
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-green-400" />
          <span className="text-gray-300 font-medium">Execution Log</span>
          {isRunning && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Running</span>
            </div>
          )}
        </div>
      </div>

      {/* Log Content */}
      <div className="h-64 overflow-y-auto p-4 space-y-2 bg-gray-900">
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No execution logs yet. Run your code to see output!</p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`
                flex items-start space-x-2 p-2 rounded border text-sm
                ${getLogColor(log)}
              `}
            >
              {getLogIcon(log)}
              <span className="flex-1">{log}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};