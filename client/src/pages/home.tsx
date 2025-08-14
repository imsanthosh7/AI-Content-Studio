import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { GrammarCheckResult } from "@shared/schema";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [language, setLanguage] = useState("en");
  
  const { toast } = useToast();

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
      setCorrectedText(result.correctedText);
      toast({
        title: "Grammar Corrected",
        description: `Found and fixed ${result.suggestions.length} issues`,
      });
    },
    onError: (error) => {
      toast({
        title: "Grammar Check Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  });

  const handleCorrect = () => {
    if (!inputText.trim()) {
      toast({
        title: "Enter Text",
        description: "Please enter some text to check and correct",
        variant: "destructive",
      });
      return;
    }
    grammarCheckMutation.mutate({ text: inputText, language });
  };

  const handleClear = () => {
    setInputText("");
    setCorrectedText("");
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  GrammarFix
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered grammar correction</p>
              </div>
            </div>
            
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              data-testid="select-language"
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Enter Text</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {inputText.length} characters
              </span>
            </div>
            
            <div className="relative">
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your text here for grammar correction..."
                data-testid="textarea-input"
                className="w-full h-80 p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base leading-relaxed shadow-sm transition-all duration-200"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              
              {inputText && (
                <button
                  onClick={handleClear}
                  data-testid="button-clear-input"
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title="Clear text"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <button 
              onClick={handleCorrect}
              disabled={grammarCheckMutation.isPending || !inputText.trim()}
              data-testid="button-correct-grammar"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {grammarCheckMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Correcting...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Correct Grammar</span>
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Corrected Text</h2>
              {correctedText && (
                <button
                  onClick={() => copyToClipboard(correctedText)}
                  data-testid="button-copy-output"
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy</span>
                </button>
              )}
            </div>
            
            <div className="relative">
              <div 
                data-testid="output-corrected-text"
                className="w-full h-80 p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl text-base leading-relaxed shadow-sm overflow-y-auto"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {correctedText ? (
                  <p className="text-gray-900 dark:text-white">{correctedText}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                    <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-center">
                      Corrected text will appear here
                      <br />
                      <span className="text-sm opacity-75">Enter text and click "Correct Grammar"</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {correctedText && (
              <button
                onClick={() => setInputText(correctedText)}
                data-testid="button-use-correction"
                className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Use This Correction</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 GrammarFix - AI-powered grammar correction
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Powered by</span>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-sm"></div>
                <span className="font-medium">Gemini Flash</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}