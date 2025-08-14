import { useState, useEffect } from "react";
import { GrammarEditor } from "@/components/grammar-editor";
import { SuggestionsPanel } from "@/components/suggestions-panel";
import { StatisticsPanel } from "@/components/statistics-panel";
import { ApiStatus } from "@/components/api-status";
import { PreferencesPanel } from "@/components/preferences-panel";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { GrammarCheckResult, GrammarSuggestion, TextStats, UserPreferences } from "@shared/schema";

export default function Home() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");
  const [suggestions, setSuggestions] = useState<GrammarSuggestion[]>([]);
  const [stats, setStats] = useState<TextStats>({
    wordCount: 0,
    charCount: 0,
    sentenceCount: 0,
    grammarScore: 100,
    errorCount: 0,
    suggestionCount: 0
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch preferences
  const { data: preferences } = useQuery<UserPreferences>({
    queryKey: ["/api/preferences"],
  });

  // Grammar check mutation
  const grammarCheckMutation = useMutation({
    mutationFn: async (data: { text: string; language: string }) => {
      const response = await apiRequest("POST", "/api/grammar/check", {
        originalText: data.text,
        language: data.language
      });
      return response.json() as Promise<GrammarCheckResult>;
    },
    onSuccess: (result) => {
      setSuggestions(result.suggestions);
      setStats(result.stats);
      queryClient.invalidateQueries({ queryKey: ["/api/corrections/history"] });
      toast({
        title: "Grammar Check Complete",
        description: `Found ${result.suggestions.length} suggestions`,
      });
    },
    onError: (error) => {
      toast({
        title: "Grammar Check Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  });

  // Update stats when text changes
  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    
    setStats(prev => ({
      ...prev,
      wordCount: words,
      charCount: chars,
      sentenceCount: sentences
    }));
  }, [text]);

  const handleGrammarCheck = () => {
    if (!text.trim()) {
      toast({
        title: "No Text to Check",
        description: "Please enter some text to check for grammar issues.",
        variant: "destructive",
      });
      return;
    }
    grammarCheckMutation.mutate({ text, language });
  };

  const handleApplySuggestion = (suggestion: GrammarSuggestion) => {
    const newText = text.slice(0, suggestion.position.start) + 
                   suggestion.suggested + 
                   text.slice(suggestion.position.end);
    setText(newText);
    
    // Remove applied suggestion
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    
    toast({
      title: "Suggestion Applied",
      description: `Changed "${suggestion.original}" to "${suggestion.suggested}"`,
    });
  };

  const handleIgnoreSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const handleClearText = () => {
    setText("");
    setSuggestions([]);
    setStats({
      wordCount: 0,
      charCount: 0,
      sentenceCount: 0,
      grammarScore: 100,
      errorCount: 0,
      suggestionCount: 0
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-spell-check text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-semibold text-secondary">GrammarAssist</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                data-testid="select-language"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
              </select>
              <button 
                className="p-2 text-gray-500 hover:text-primary transition-colors" 
                title="Settings"
                data-testid="button-settings"
              >
                <i className="fas fa-cog"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Text Editor Section */}
          <div className="lg:col-span-2">
            <GrammarEditor
              text={text}
              setText={setText}
              onGrammarCheck={handleGrammarCheck}
              onClearText={handleClearText}
              isProcessing={grammarCheckMutation.isPending}
              wordCount={stats.wordCount}
            />
          </div>

          {/* Suggestions Panel */}
          <div className="lg:col-span-1">
            <SuggestionsPanel
              suggestions={suggestions}
              onApplySuggestion={handleApplySuggestion}
              onIgnoreSuggestion={handleIgnoreSuggestion}
            />

            <StatisticsPanel stats={stats} />
          </div>
        </div>

        {/* API Status & Settings */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ApiStatus />
          <PreferencesPanel preferences={preferences} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>© 2024 GrammarAssist</span>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-500">Powered by Gemini Flash</span>
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <i className="fas fa-robot text-white text-xs"></i>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
