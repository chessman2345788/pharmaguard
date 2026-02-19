import { create } from 'zustand';

export const useStore = create((set) => ({
  vcfData: null,
  selectedDrugs: [],
  analysisResults: [],
  isAnalyzing: false,
  error: null,
  explanationMode: 'patient', // 'patient' or 'doctor'

  setVcfData: (data) => set({ vcfData: data }),
  setSelectedDrugs: (drugs) => set({ selectedDrugs: drugs }),
  setAnalysisResults: (results) => set({ analysisResults: results }),
  setIsAnalyzing: (status) => set({ isAnalyzing: status }),
  setError: (error) => set({ error: error }),
  setExplanationMode: (mode) => set({ explanationMode: mode }),
  
  reset: () => set({ 
    vcfData: null, 
    selectedDrugs: [], 
    analysisResults: [], 
    isAnalyzing: false, 
    error: null 
  })
}));
