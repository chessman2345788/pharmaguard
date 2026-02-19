import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileUp, Search, Info, Trash2,
  Send, Bot, User, Loader2,
  FileCheck, AlertCircle, Plus,
  Sparkles, Activity, Wifi, WifiOff
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate, useLocation } from 'react-router-dom';
import CountUp from '../components/CountUp';
import { analyzeVCF, sendChatMessage } from '../utils/apiService';
import MarkdownMessage from '../components/MarkdownMessage';

const SUPPORTED_DRUGS = [
  'CODEINE', 'WARFARIN', 'CLOPIDOGREL',
  'SIMVASTATIN', 'AZATHIOPRINE', 'FLUOROURACIL'
];

const DEMO_VARIANTS = [
  { gene: 'CYP2D6', diplotype: '*1/*4', rsid: 'rs3892097', ref: 'C', alt: 'T', position: '100' },
  { gene: 'CYP2C19', diplotype: '*1/*2', rsid: 'rs4244285', ref: 'G', alt: 'A', position: '200' },
  { gene: 'SLCO1B1', diplotype: '*1/*5', rsid: 'rs4149056', ref: 'T', alt: 'C', position: '300' }
];

const AnalyzerPage = () => {
  const navigate = useNavigate();
  const {
    setAnalysisResults,
    isAnalyzing, setIsAnalyzing,
    error, setError
  } = useStore();

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [vcfStats, setVcfStats] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: 'Hello! I am PharmaGuard AI Assistant. Upload a VCF and select drugs to get started, or ask me about pharmacogenomics.' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [analysisContext, setAnalysisContext] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.autoDemo) {
      setFile({ name: 'demo_patient_001.vcf', size: 1240 });
      setIsDemoMode(true);
      setSelectedDrugs(['CODEINE', 'CLOPIDOGREL', 'SIMVASTATIN']);
      setVcfStats({ totalVariants: 3, genesMatched: 3, actionableVariants: 3 });
      setError(null);
      window.history.replaceState({}, '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, []);

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile.name.endsWith('.vcf')) {
      setError('Please upload a valid .vcf file.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }
    setFile(selectedFile);
    setIsDemoMode(false);
    setVcfStats(null);
    setError(null);
  };

  const handleDemoMode = () => {
    setFile({ name: 'demo_patient_001.vcf', size: 1240 });
    setIsDemoMode(true);
    setSelectedDrugs(['CODEINE', 'CLOPIDOGREL', 'SIMVASTATIN']);
    setVcfStats({ totalVariants: 3, genesMatched: 3, actionableVariants: 3 });
    setError(null);
  };

  const toggleDrug = (drug) => {
    if (selectedDrugs.includes(drug)) {
      setSelectedDrugs(selectedDrugs.filter(d => d !== drug));
    } else {
      setSelectedDrugs([...selectedDrugs, drug]);
    }
  };

  const handleAnalyze = async () => {
    if (!file && !isDemoMode) {
      setError('Please upload a VCF file first.');
      return;
    }
    if (selectedDrugs.length === 0) {
      setError('Please select at least one drug.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    if (isDemoMode) {
      setTimeout(() => {
        const demoResults = [
          {
            drug_name: 'CODEINE',
            pharmacogenomic_profile: {
              diplotype: '*1/*4',
              phenotype: 'Intermediate Metabolizer',
              primary_gene: 'CYP2D6'
            },
            risk_assessment: {
              risk_label: 'Moderate Risk',
              severity: 'Medium',
              confidence_score: 0.95
            },
            clinical_recommendation: {
              dosing_advice: 'Consider alternative analgesics (e.g., morphine or nonopioids). If codeine is used, monitor for lack of efficacy.'
            },
            llm_explanation: {
              summary: 'Reduced CYP2D6 activity may lead to lower efficacy of codeine, as it is not converted to morphine efficiently.',
              mechanism: 'CYP2D6 mediates the O-demethylation of codeine to morphine. Reduced activity means less active drug is produced.',
              variant_citations: ['CPIC Guideline for Codeine and CYP2D6']
            }
          },
          {
            drug_name: 'CLOPIDOGREL',
            pharmacogenomic_profile: {
              diplotype: '*1/*2',
              phenotype: 'Intermediate Metabolizer',
              primary_gene: 'CYP2C19'
            },
            risk_assessment: {
              risk_label: 'Caution',
              severity: 'Medium',
              confidence_score: 0.92
            },
            clinical_recommendation: {
              dosing_advice: 'Consider alternative antiplatelet therapy (e.g., prasugrel or ticagrelor) if no contraindications.'
            },
            llm_explanation: {
              summary: 'Reduced formation of the active metabolite of clopidogrel, potentially leading to reduced antiplatelet effect.',
              mechanism: 'CYP2C19 activates clopidogrel. *2 allele reduces enzymatic activity.',
              variant_citations: ['CPIC Guideline for Clopidogrel and CYP2C19']
            }
          },
          {
            drug_name: 'SIMVASTATIN',
            pharmacogenomic_profile: {
              diplotype: '*1/*1',
              phenotype: 'Normal Function',
              primary_gene: 'SLCO1B1'
            },
            risk_assessment: {
              risk_label: 'Safe',
              severity: 'Low',
              confidence_score: 0.98
            },
            clinical_recommendation: {
              dosing_advice: 'Initiate therapy with recommended starting dose. Adjust based on lipid levels.'
            },
            llm_explanation: {
              summary: 'Standard risk of simvastatin-induced myopathy. Normal transporter function.',
              mechanism: 'SLCO1B1 facilitates hepatic uptake of simvastatin. Normal function prevents systemic accumulation.',
              variant_citations: ['CPIC Guideline for Simvastatin and SLCO1B1']
            }
          }
        ];

        const filteredDemo = demoResults.filter(r => selectedDrugs.includes(r.drug_name));

        const setResults = useStore.getState().setAnalysisResults;
        setResults(filteredDemo);
        setAnalysisContext(filteredDemo);
        navigate('/results');
        setIsAnalyzing(false);
      }, 1500);
      return;
    }

    try {
      const response = await analyzeVCF(file, selectedDrugs);
      if (response.vcf_stats) {
        setVcfStats(response.vcf_stats);
      }
      useStore.getState().setAnalysisResults(response.results);
      setAnalysisContext(response.results);
      navigate('/results');
    } catch (err) {
      setError(err.message || 'Analysis failed. Is the backend server running?');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendChat = async () => {
    const userMsg = chatInput.trim();
    if (!userMsg) return;

    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const reply = await sendChatMessage(userMsg, analysisContext);
      setChatHistory(prev => [...prev, { role: 'bot', text: reply }]);
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        { role: 'bot', text: `⚠️ ${err.message || 'AI assistant unavailable. Please ensure the backend is running.'}` }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const displayStats = vcfStats || (isDemoMode ? { totalVariants: 3, genesMatched: 3, actionableVariants: 3 } : null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">

        <div className="flex-1 space-y-8">
          <div className="bg-white/50 p-8 rounded-3xl border border-white shadow-xl backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Activity className="text-primary w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Patient Data Analyzer</h2>
                <p className="text-gray-500 text-sm">Upload genetic profile and select drug interactions</p>
              </div>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative px-10 py-16 border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center text-center ${dragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-gray-200 bg-gray-50'
                } ${file ? 'bg-green-50/30 border-primary/50' : ''}`}
            >
              {!file ? (
                <>
                  <div className="w-20 h-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-6">
                    <FileUp className={`w-10 h-10 ${dragActive ? 'text-primary' : 'text-gray-400'}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Drag and drop your VCF file here</h3>
                  <p className="text-gray-400 text-sm mb-6">Supports .vcf files up to 10MB</p>
                  <input
                    type="file"
                    id="vcf-upload"
                    className="hidden"
                    accept=".vcf"
                    onChange={(e) => validateAndSetFile(e.target.files[0])}
                  />
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <label
                      htmlFor="vcf-upload"
                      className="btn-secondary cursor-pointer"
                    >
                      Select File
                    </label>
                    <button
                      onClick={handleDemoMode}
                      className="px-6 py-3 bg-primary/5 text-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/10 transition-all border border-primary/20"
                    >
                      Try Demo Patient
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full animate-fade-in">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <FileCheck className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold mb-0.5">{file.name}</h3>
                        <p className="text-primary font-medium text-xs">
                          {(file.size / 1024).toFixed(1)} KB • {isDemoMode ? 'Demo Profile' : 'Validated Profile'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setFile(null); setVcfStats(null); setIsDemoMode(false); }}
                      className="flex items-center space-x-2 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-50 px-4 py-2 rounded-xl transition-all border border-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Variants</div>
                      <div className="text-2xl font-black text-gray-900">
                        {displayStats ? <CountUp end={displayStats.totalVariants} /> : '—'}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Genes Matched</div>
                      <div className="text-2xl font-black text-primary">
                        {displayStats ? <CountUp end={displayStats.genesMatched} /> : '—'}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Actionable</div>
                      <div className="text-2xl font-black text-amber-500">
                        {displayStats ? <CountUp end={displayStats.actionableVariants} /> : '—'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-3 text-red-600 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="mt-12">
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-primary" />
                <span>Select Drugs for Risk Review</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SUPPORTED_DRUGS.map((drug) => (
                  <button
                    key={drug}
                    onClick={() => toggleDrug(drug)}
                    className={`px-4 py-3 rounded-xl border text-left transition-all ${selectedDrugs.includes(drug)
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-white border-gray-100 text-gray-600 hover:border-primary/30'
                      }`}
                  >
                    <span className="text-xs uppercase font-bold">{drug}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12 flex space-x-4">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !file || selectedDrugs.length === 0}
                className="flex-1 btn-primary py-5 rounded-2xl flex items-center justify-center space-x-3 text-xl disabled:bg-gray-200 disabled:shadow-none"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Processing Genome...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>Analyze Now</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setFile(null);
                  setSelectedDrugs([]);
                  setVcfStats(null);
                  setIsDemoMode(false);
                  setError(null);
                }}
                className="px-8 py-5 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[400px] flex flex-col">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl flex flex-col h-[700px] overflow-hidden">
            <div className="bg-primary p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Bot className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">PharmaGuard Assistant</h3>
                    <div className="flex items-center space-x-2 text-green-100 text-xs uppercase tracking-widest font-bold">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span>AI Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[85%] space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-primary'
                      }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-gray-100 text-gray-700 shadow-sm'
                      }`}>
                      <MarkdownMessage text={msg.text} isUser={msg.role === 'user'} />
                    </div>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-gray-400">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 flex space-x-2 overflow-x-auto no-scrollbar">
              {['Explain CYP2D6', 'What is CYP2C19?', 'How does warfarin work?'].map((q) => (
                <button
                  key={q}
                  onClick={() => setChatInput(q)}
                  className="flex-shrink-0 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-500 hover:border-primary hover:text-primary whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                  placeholder="Type your medical query..."
                  disabled={isChatLoading}
                  className="w-full pl-5 pr-14 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                />
                <button
                  onClick={handleSendChat}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyzerPage;
