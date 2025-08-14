import type { GrammarSuggestion } from "@shared/schema";

interface SuggestionsPanelProps {
  suggestions: GrammarSuggestion[];
  onApplySuggestion: (suggestion: GrammarSuggestion) => void;
  onIgnoreSuggestion: (suggestionId: string) => void;
}

export function SuggestionsPanel({ 
  suggestions, 
  onApplySuggestion, 
  onIgnoreSuggestion 
}: SuggestionsPanelProps) {
  return (
    <div className="bg-surface rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-medium text-secondary">Suggestions</h3>
      </div>
      <div className="p-6">
        {suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div 
                key={suggestion.id}
                data-testid={`suggestion-${suggestion.id}`}
                className={`p-4 border rounded-lg ${
                  suggestion.severity === 'error' 
                    ? 'border-error/20 bg-error/5' 
                    : suggestion.severity === 'warning'
                    ? 'border-warning/20 bg-warning/5'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <i className={`fas text-sm ${
                    suggestion.severity === 'error' 
                      ? 'fa-exclamation-triangle text-error'
                      : suggestion.severity === 'warning'
                      ? 'fa-lightbulb text-warning'
                      : 'fa-info-circle text-gray-500'
                  }`}></i>
                  <span className={`font-medium text-sm ${
                    suggestion.severity === 'error' 
                      ? 'text-error'
                      : suggestion.severity === 'warning'
                      ? 'text-warning'
                      : 'text-gray-700'
                  }`}>
                    {suggestion.type === 'grammar' ? 'Grammar Error' :
                     suggestion.type === 'style' ? 'Style Suggestion' :
                     'Spelling Error'}
                  </span>
                  {suggestion.confidence && (
                    <span className="text-xs text-gray-400 ml-auto">
                      {suggestion.confidence}% confidence
                    </span>
                  )}
                </div>
                <p className="text-sm text-secondary mb-2">
                  "<span className={`px-1 rounded ${
                    suggestion.severity === 'error' ? 'bg-error/20' : 'bg-warning/20'
                  }`}>
                    {suggestion.original}
                  </span>" should be "<span className="bg-success/20 px-1 rounded">
                    {suggestion.suggested}
                  </span>"
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {suggestion.explanation}
                </p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onApplySuggestion(suggestion)}
                    data-testid={`button-apply-${suggestion.id}`}
                    className="bg-success hover:bg-success/90 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                  >
                    Apply Fix
                  </button>
                  <button 
                    onClick={() => onIgnoreSuggestion(suggestion.id)}
                    data-testid={`button-ignore-${suggestion.id}`}
                    className="border border-gray-300 hover:bg-gray-50 text-secondary px-3 py-1.5 rounded text-xs font-medium transition-colors"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div data-testid="status-no-suggestions" className="text-center py-8">
            <i className="fas fa-check-circle text-success text-2xl mb-2"></i>
            <p className="text-sm text-gray-500">No grammar issues found!</p>
          </div>
        )}
      </div>
    </div>
  );
}
