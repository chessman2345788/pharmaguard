import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      vcfData: null,
      selectedDrugs: [],
      analysisResults: null, // Initialized to null to track if analysis happened
      isAnalyzing: false,
      error: null,
      explanationMode: 'patient',
      simulationMode: 'none',
      transparencyLevel: 'detailed',
      isDemoMode: false,

      setVcfData: (data) => set({ vcfData: data }),
      setSelectedDrugs: (drugs) => set({ selectedDrugs: drugs }),
      setAnalysisResults: (results) => set({ analysisResults: results }),
      setIsAnalyzing: (status) => set({ isAnalyzing: status }),
      setError: (error) => set({ error: error }),
      setExplanationMode: (mode) => set({ explanationMode: mode }),
      setSimulationMode: (mode) => set({ simulationMode: mode }),
      setTransparencyLevel: (level) => set({ transparencyLevel: level }),
      setDemoMode: (status) => set({ isDemoMode: status }),
      
      reset: () => set({ 
        vcfData: null, 
        selectedDrugs: [], 
        analysisResults: null, 
        isAnalyzing: false, 
        error: null 
      })
    }),
    {
      name: 'pharmaguard-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
