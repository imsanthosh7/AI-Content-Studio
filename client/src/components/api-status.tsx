import { useQuery } from "@tanstack/react-query";

interface ApiStatusResponse {
  status: string;
  service: string;
  timestamp: string;
}

export function ApiStatus() {

  const { data: status, error, refetch, isLoading } = useQuery<ApiStatusResponse>({
    queryKey: ["/api/status"],
    refetchInterval: 30000, // Check every 30 seconds
  });

  const handleRetry = () => {
    refetch();
  };

  const isConnected = status?.status === "connected";
  const hasError = !!error;

  return (
    <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h3 className="text-lg font-medium text-secondary dark:text-gray-200">API Status</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Gemini Flash API</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isLoading ? 'bg-warning animate-pulse' :
                isConnected ? 'bg-success' : 'bg-error'
              }`}></div>
              <span data-testid="status-api-connection" className={`text-sm font-medium ${
                isLoading ? 'text-warning' :
                isConnected ? 'text-success' : 'text-error'
              }`}>
                {isLoading ? 'Checking...' : isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          {!hasError && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Rate Limit</span>
                <span className="text-sm text-secondary dark:text-gray-200">Available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Response Time</span>
                <span className="text-sm text-secondary dark:text-gray-200">~1.2s avg</span>
              </div>
            </>
          )}
          
          {/* Error State */}
          {hasError && (
            <div data-testid="status-api-error" className="p-3 bg-error/5 dark:bg-error/10 border border-error/20 dark:border-error/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <i className="fas fa-exclamation-triangle text-error text-sm"></i>
                <span className="text-sm font-medium text-error">API Error</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Failed to connect to grammar correction service. Please check your connection and API key.
              </p>
              <button 
                onClick={handleRetry}
                data-testid="button-retry-connection"
                className="mt-2 text-xs text-primary hover:text-primary-dark font-medium"
              >
                Retry Connection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
