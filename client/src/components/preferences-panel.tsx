import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { UserPreferences } from "@shared/schema";

interface PreferencesPanelProps {
  preferences?: UserPreferences;
}

export function PreferencesPanel({ preferences }: PreferencesPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Local state for immediate UI updates
  const [localPrefs, setLocalPrefs] = useState(preferences);

  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<UserPreferences>) => {
      const response = await apiRequest("PUT", "/api/preferences", updates);
      return response.json() as Promise<UserPreferences>;
    },
    onSuccess: (updatedPrefs) => {
      setLocalPrefs(updatedPrefs);
      queryClient.invalidateQueries({ queryKey: ["/api/preferences"] });
      toast({
        title: "Preferences Updated",
        description: "Your settings have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleToggle = (key: keyof UserPreferences, value: boolean) => {
    const updates = { [key]: value };
    setLocalPrefs(prev => prev ? { ...prev, ...updates } : undefined);
    updatePreferencesMutation.mutate(updates);
  };

  const handleSelectChange = (key: keyof UserPreferences, value: string) => {
    const updates = { [key]: value };
    setLocalPrefs(prev => prev ? { ...prev, ...updates } : undefined);
    updatePreferencesMutation.mutate(updates);
  };

  const currentPrefs = localPrefs || preferences;

  if (!currentPrefs) {
    return (
      <div className="bg-surface rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-secondary">Preferences</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-medium text-secondary">Preferences</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Auto-correct</span>
            <button 
              onClick={() => handleToggle('autoCorrect', !currentPrefs.autoCorrect)}
              data-testid="toggle-auto-correct"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                currentPrefs.autoCorrect ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                currentPrefs.autoCorrect ? 'translate-x-6' : 'translate-x-1'
              }`}></span>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Show confidence scores</span>
            <button 
              onClick={() => handleToggle('showScores', !currentPrefs.showScores)}
              data-testid="toggle-show-scores"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                currentPrefs.showScores ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                currentPrefs.showScores ? 'translate-x-6' : 'translate-x-1'
              }`}></span>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Real-time checking</span>
            <button 
              onClick={() => handleToggle('realTime', !currentPrefs.realTime)}
              data-testid="toggle-real-time"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                currentPrefs.realTime ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                currentPrefs.realTime ? 'translate-x-6' : 'translate-x-1'
              }`}></span>
            </button>
          </div>
          
          <div>
            <label className="text-sm text-gray-600 block mb-2">Correction sensitivity</label>
            <select 
              value={currentPrefs.sensitivity || 'balanced'}
              onChange={(e) => handleSelectChange('sensitivity', e.target.value)}
              data-testid="select-sensitivity"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="conservative">Conservative</option>
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
