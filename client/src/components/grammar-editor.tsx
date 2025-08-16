import { useQuery } from "@tanstack/react-query";
import type { Correction } from "@shared/schema";

interface GrammarEditorProps {
  text: string;
  setText: (text: string) => void;
  onGrammarCheck: () => void;
  onClearText: () => void;
  isProcessing: boolean;
  wordCount: number;
}

export function GrammarEditor({ 
  text, 
  setText, 
  onGrammarCheck, 
  onClearText, 
  isProcessing, 
  wordCount 
}: GrammarEditorProps) {
  const { data: correctionHistory } = useQuery<Correction[]>({
    queryKey: ["/api/corrections/history"],
  });

  return (
    <>
      <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-secondary dark:text-gray-200">Text Editor</h2>
            <div className="flex items-center space-x-3">
              <span data-testid="text-word-count" className="text-sm text-gray-500 dark:text-gray-400">{wordCount} words</span>
              <button 
                onClick={onClearText}
                data-testid="button-clear"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-error transition-colors"
              >
                <i className="fas fa-trash-alt mr-1"></i>Clear
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here for real-time grammar correction..."
            data-testid="textarea-main"
            className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent text-base leading-relaxed bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onGrammarCheck}
                disabled={isProcessing || !text.trim()}
                data-testid="button-check-grammar"
                className="bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <i className="fas fa-check-circle"></i>
                <span>Check Grammar</span>
              </button>
              <button 
                data-testid="button-batch-process"
                className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-secondary dark:text-gray-300 px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <i className="fas fa-file-text"></i>
                <span>Batch Process</span>
              </button>
            </div>
            
            {/* Loading State */}
            {isProcessing && (
              <div data-testid="status-processing" className="flex items-center space-x-2 text-primary">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Correction History */}
      <div className="mt-6 bg-surface dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="text-lg font-medium text-secondary dark:text-gray-200">Correction History</h3>
        </div>
        <div className="p-6">
          {correctionHistory && correctionHistory.length > 0 ? (
            <div className="space-y-3">
              {correctionHistory.slice(0, 5).map((correction) => (
                <div key={correction.id} className="space-y-2">
                  {correction.suggestions.map((suggestion: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        suggestion.severity === 'error' ? 'bg-error' : 'bg-warning'
                      }`}>
                        <i className={`fas ${suggestion.severity === 'error' ? 'fa-times' : 'fa-exclamation'} text-white text-xs`}></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-secondary dark:text-gray-300">
                          <span className={`line-through ${suggestion.severity === 'error' ? 'text-error' : 'text-warning'}`}>
                            {suggestion.original}
                          </span> → 
                          <span className="text-success font-medium ml-1">{suggestion.suggested}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{suggestion.explanation}</p>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{suggestion.confidence}%</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-history text-gray-300 dark:text-gray-600 text-2xl mb-2"></i>
              <p className="text-sm text-gray-500 dark:text-gray-400">No correction history yet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
