import type { TextStats } from "@shared/schema";

interface StatisticsPanelProps {
  stats: TextStats;
}

export function StatisticsPanel({ stats }: StatisticsPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-success';
    if (score >= 70) return 'bg-warning';
    return 'bg-error';
  };

  const getScoreWidth = (score: number) => {
    return `${Math.max(score, 5)}%`;
  };

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-medium text-secondary">Statistics</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Words</span>
            <span data-testid="stat-word-count" className="font-medium text-secondary">{stats.wordCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Characters</span>
            <span data-testid="stat-char-count" className="font-medium text-secondary">{stats.charCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Sentences</span>
            <span data-testid="stat-sentence-count" className="font-medium text-secondary">{stats.sentenceCount}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Grammar Score</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div 
                  data-testid="progress-grammar-score"
                  className={`h-2 rounded-full ${getScoreColor(stats.grammarScore)}`}
                  style={{ width: getScoreWidth(stats.grammarScore) }}
                ></div>
              </div>
              <span data-testid="stat-grammar-score" className="font-medium text-secondary text-sm">{stats.grammarScore}%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Errors Found</span>
            <span data-testid="stat-error-count" className="font-medium text-error">{stats.errorCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Suggestions</span>
            <span data-testid="stat-suggestion-count" className="font-medium text-warning">{stats.suggestionCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
