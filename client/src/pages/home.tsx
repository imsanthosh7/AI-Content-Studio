import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ContentGenerationResult, ContentType, MoodType, Platform } from "@shared/schema";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeContentType, setActiveContentType] = useState<ContentType>("grammar");
  const [selectedMood, setSelectedMood] = useState<MoodType>("professional");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("linkedin");
  const [charLimit, setCharLimit] = useState<number>(5000);
  const language = "en";

  // Character limits for different platforms
  const platformCharLimits = {
    grammar: 5000,
    linkedin: 3000, 
    instagram: 2200,
    twitter: 280,
    reddit: 3500,
    "comment-reply": 500
  };

  // Initialize character limit on component mount
  useEffect(() => {
    setCharLimit(platformCharLimits[activeContentType]);
  }, [activeContentType]);
  
  const { toast } = useToast();

  // Content generation mutation
  const generateMutation = useMutation({
    mutationFn: async (data: { 
      text: string; 
      contentType: ContentType; 
      platform?: Platform; 
      mood?: MoodType; 
      language: string 
    }) => {
      const response = await apiRequest("POST", "/api/content/generate", data);
      return response.json() as Promise<ContentGenerationResult>;
    },
    onSuccess: (result) => {
      setOutputText(result.generatedContent);
      const typeLabels = {
        grammar: "Grammar corrected",
        linkedin: "LinkedIn caption created", 
        instagram: "Instagram caption created",
        twitter: "Twitter caption created",
        reddit: "Reddit caption created",
        "comment-reply": "Comment reply generated"
      };
      toast({
        title: typeLabels[result.contentType],
        description: "Content generated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  });

  const handleGenerate = () => {
    if (!inputText.trim()) {
      toast({
        title: "Enter Text",
        description: "Please enter some text to process",
        variant: "destructive",
      });
      return;
    }

    const requestData = {
      text: inputText,
      contentType: activeContentType,
      language,
      charLimit,
      ...(activeContentType === "comment-reply" && { platform: selectedPlatform }),
      ...(activeContentType !== "grammar" && { mood: selectedMood })
    };

    generateMutation.mutate(requestData);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
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

  const contentTypeIcons = {
    grammar: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    twitter: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    reddit: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
      </svg>
    ),
    "comment-reply": (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  };

  const moodEmojis = {
    professional: "👔",
    casual: "😊", 
    friendly: "🤝",
    confident: "💪",
    enthusiastic: "🚀",
    grateful: "🙏"
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
                {contentTypeIcons.grammar}
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Content Studio
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Grammar correction & social media content
                </p>
              </div>
            </div>

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content Type Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Choose Content Type
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
            {Object.entries(contentTypeIcons).map(([type, icon]) => (
              <button
                key={type}
                onClick={() => {
                  const contentLabels = {
                    grammar: "Grammar Correction",
                    linkedin: "LinkedIn Caption Generator", 
                    instagram: "Instagram Caption Generator",
                    twitter: "Twitter Caption Generator",
                    reddit: "Reddit Caption Generator",
                    "comment-reply": "Comment Reply Generator"
                  };
                  
                  setActiveContentType(type as ContentType);
                  setInputText(""); // Clear input text when switching types
                  setOutputText(""); // Clear previous content when switching types
                  setCharLimit(platformCharLimits[type as ContentType]); // Update character limit
                  
                  toast({
                    title: `Switched to ${contentLabels[type as ContentType]}`,
                  });
                }}
                data-testid={`button-content-${type}`}
                className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                  activeContentType === type
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                }`}
              >
                <div className={`flex-shrink-0 ${activeContentType === type ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {icon}
                </div>
                <span className="text-xs sm:text-sm font-medium capitalize text-center leading-tight">
                  {type === "comment-reply" ? "Reply" : type}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Mood and Platform Selectors */}
        {activeContentType !== "grammar" && (
          <div className="mb-8 space-y-6">
            {/* Mood Selector */}
            <div>
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                Select Mood
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
                {Object.entries(moodEmojis).map(([mood, emoji]) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood as MoodType)}
                    data-testid={`button-mood-${mood}`}
                    className={`p-2 sm:p-3 rounded-lg border transition-all duration-200 flex flex-col items-center space-y-1 ${
                      selectedMood === mood
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl">{emoji}</span>
                    <span className="text-xs font-medium capitalize truncate">{mood}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Selector for Comment Replies */}
            {activeContentType === "comment-reply" && (
              <div>
                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                  Platform
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {(["linkedin", "instagram", "reddit"] as Platform[]).map((platform) => (
                    <button
                      key={platform}
                      onClick={() => setSelectedPlatform(platform)}
                      data-testid={`button-platform-${platform}`}
                      className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 ${
                        selectedPlatform === platform
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {contentTypeIcons[platform]}
                      </div>
                      <span className="text-sm sm:text-base font-medium capitalize">
                        {platform}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Character Limit Controller */}
        {activeContentType !== "grammar" && (
          <div className="mb-8">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
              Character Limit
            </h3>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Max: {platformCharLimits[activeContentType]} characters
                </span>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {charLimit}
                </span>
              </div>
              <Slider
                value={[charLimit]}
                onValueChange={(value) => setCharLimit(value[0])}
                max={platformCharLimits[activeContentType]}
                min={activeContentType === "twitter" ? 100 : 200}
                step={activeContentType === "twitter" ? 10 : 50}
                className="w-full"
                data-testid="slider-char-limit"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>{activeContentType === "twitter" ? "100" : "200"}</span>
                <span>{platformCharLimits[activeContentType]}</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Input Text
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {inputText.length} characters
              </span>
            </div>
            
            <div className="relative">
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  activeContentType === "grammar" 
                    ? "Type or paste your text here for grammar correction..."
                    : activeContentType === "comment-reply"
                    ? "Paste the comment you want to reply to..."
                    : "Describe your content idea or paste existing text to transform..."
                }
                data-testid="textarea-input"
                className="w-full h-60 sm:h-80 p-4 sm:p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base leading-relaxed shadow-sm transition-all duration-200"
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
              onClick={handleGenerate}
              disabled={generateMutation.isPending || !inputText.trim()}
              data-testid="button-generate"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {generateMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  {contentTypeIcons[activeContentType]}
                  <span>
                    {activeContentType === "grammar" ? "Correct Grammar" : 
                     activeContentType === "comment-reply" ? "Generate Reply" : 
                     `Create ${activeContentType.charAt(0).toUpperCase() + activeContentType.slice(1)}`}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Generated Content
              </h2>
              {outputText && (
                <button
                  onClick={() => copyToClipboard(outputText)}
                  data-testid="button-copy-output"
                  className="flex items-center justify-center sm:justify-start space-x-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
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
                data-testid="output-generated-content"
                className="w-full h-60 sm:h-80 p-4 sm:p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl text-base leading-relaxed shadow-sm overflow-y-auto"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {outputText ? (
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{outputText}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                    {contentTypeIcons[activeContentType]}
                    <p className="text-center mt-4 text-sm sm:text-base">
                      Generated content will appear here
                      <br />
                      <span className="text-xs sm:text-sm opacity-75">
                        {activeContentType === "grammar" ? "Enter text and click 'Correct Grammar'" : 
                         `Enter text and click 'Create ${activeContentType.charAt(0).toUpperCase() + activeContentType.slice(1)}'`}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {outputText && (
              <button
                onClick={() => setInputText(outputText)}
                data-testid="button-use-output"
                className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Use This Content</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 AI Content Studio - Grammar correction & social content generation
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-sm text-gray-500 dark:text-gray-400">
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