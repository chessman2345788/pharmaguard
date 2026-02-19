import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileUp, Search, Info, Trash2, 
  Send, Bot, User, Loader2,
  FileCheck, AlertCircle, Plus,
  Sparkles, Activity, ShieldCheck
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { parseVCF } from '../utils/vcfParser';
import { predictRisk } from '../utils/riskEngine';
import { useNavigate } from 'react-router-dom';
import CountUp from '../components/CountUp';
import { ChevronDown, CheckCircle, Cpu, Layers, GitMerge, ArrowRight, FileCode } from 'lucide-react';

const ANALYSIS_STEPS = [
  { id: 'upload', label: 'Upload', icon: FileUp },
  { id: 'parse', label: 'Parse', icon: Search },
  { id: 'match', label: 'Match Genes', icon: Activity },
  { id: 'predict', label: 'Predict Risk', icon: ShieldCheck },
  { id: 'report', label: 'Report', icon: FileCheck }
];

const SUPPORTED_DRUGS = [
  'CODEINE', 'WARFARIN', 'CLOPIDOGREL', 
  'SIMVASTATIN', 'AZATHIOPRINE', 'FLUOROURACIL'
];

const AnalyzerPage = () => {
  const navigate = useNavigate();
  const { 
    vcfData, setVcfData, 
    selectedDrugs, setSelectedDrugs,
    analysisResults, setAnalysisResults, 
    isAnalyzing, setIsAnalyzing,
    explanationMode, setExplanationMode,
    transparencyLevel, setTransparencyLevel,
    isDemoMode, setDemoMode,
    error, setError 
  } = useStore();

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: 'Hello! I am PharmaGuard AI Assistant. Upload a VCF and select drugs to get started, or ask me about pharmacogenomics.' }
  ]);
  const [currentStep, setCurrentStep] = useState(0);

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
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  }, []);

  const validateAndProcessFile = (file) => {
    if (!file.name.endsWith('.vcf')) {
      setError('Please upload a valid .vcf file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }
    setFile(file);
    setError(null);
    processVCF(file);
  };

  const processVCF = async (file) => {
    setIsAnalyzing(true);
    setError(null);
    setCurrentStep(0);
    try {
      // Logic to cycle through steps for visual effect
      const stepsCount = ANALYSIS_STEPS.length;
      for (let i = 1; i < stepsCount; i++) {
        setTimeout(() => setCurrentStep(i), i * 800);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('selectedDrugs', selectedDrugs.join(','));

      const response = await fetch("http://localhost:5000/api/analyze", {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }
      
      const results = await response.json();
      setAnalysisResults(results);
      setVcfData(results[0]?.pharmacogenomic_profile?.detected_variants || []);
      
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate('/analytics');
      }, stepsCount * 800);
    } catch (err) {
      console.error(err);
      setError(`VCF upload failed: ${err.message}. Please check file format.`);
      setIsAnalyzing(false);
    }
  };

  const handleDemoPatient = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/demo");
      if (!response.ok) throw new Error("Failed to load demo data");
      const results = await response.json();
      
      setAnalysisResults(results);
      setVcfData(results[0]?.pharmacogenomic_profile?.detected_variants || []);
      setFile({ name: 'demo_patient_001.vcf', size: 1240 });
      setSelectedDrugs(['CODEINE', 'CLOPIDOGREL', 'SIMVASTATIN']);
      
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate('/analytics');
      }, 1500);
    } catch (err) {
      setError("Failed to load demo patient data.");
      setIsAnalyzing(false);
    }
  };

  const toggleDrug = (drug) => {
    if (selectedDrugs.includes(drug)) {
      setSelectedDrugs(selectedDrugs.filter(d => d !== drug));
    } else {
      setSelectedDrugs([...selectedDrugs, drug]);
    }
  };

  const handleAnalyze = () => {
    if (!file || selectedDrugs.length === 0) {
      setError('Please upload genetic data and select at least one drug.');
      return;
    }
    processVCF(file);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    
    try {
      const { geminiChatService } = await import('../utils/geminiChatService');
      const botResponse = await geminiChatService(userMsg, analysisResults, transparencyLevel, explanationMode);
      setChatHistory(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'bot', text: "Assistant error. Please check backend connection." }]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Demo Mode Presentation Labels */}
        <AnimatePresence>
          {isDemoMode && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex justify-center space-x-8 mb-4"
            >
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-4 py-1 rounded-full border border-primary/10">AI-Powered Pharmacogenomic Analysis</span>
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-4 py-1 rounded-full border border-primary/10">CPIC-Aligned Recommendations</span>
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-4 py-1 rounded-full border border-primary/10">Variant-Level Explainability</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Panel: Analyzer Inputs */}
        <div className="flex-1 space-y-8">
          <div className="bg-white/50 p-8 rounded-3xl border border-white shadow-xl backdrop-blur-sm relative">
             <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                   <Activity className="text-primary w-6 h-6" />
                </div>
                <div>
                   <h2 className="text-2xl font-bold text-gray-900">Patient Data Analyzer</h2>
                   <p className="text-gray-500 text-sm">Upload genetic profile and select drug interactions</p>
                </div>
             </div>

             {/* Demo Scenario Switcher (Feature 6) */}
             <div className="absolute top-8 right-8">
                <div className="relative group">
                   <button className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">
                      <span>Demo Scenario</span>
                      <ChevronDown className="w-3 h-3" />
                   </button>
                   <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                      {[
                        { name: 'Codeine Toxicity', drugs: ['CODEINE'] },
                        { name: 'Clopidogrel Failure', drugs: ['CLOPIDOGREL'] },
                        { name: 'Multidrug Risk', drugs: ['CODEINE', 'CLOPIDOGREL', 'SIMVASTATIN', 'WARFARIN'] }
                      ].map((s) => (
                        <button 
                          key={s.name}
                          onClick={() => {
                            setSelectedDrugs(s.drugs);
                            handleDemoPatient();
                          }}
                          className="w-full text-left px-5 py-4 hover:bg-primary/5 text-xs font-bold text-gray-600 hover:text-primary transition-colors border-b last:border-0 border-gray-50"
                        >
                           {s.name}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             {/* Analysis Pipeline Progress (Feature 2) */}
             <AnimatePresence>
               {isAnalyzing && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="mb-10 px-4"
                 >
                   <div className="relative flex justify-between items-center max-w-lg mx-auto">
                      {/* Background line */}
                      <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 -translate-y-1/2" />
                      
                      {/* Active progress line */}
                      <motion.div 
                        className="absolute top-1/2 left-0 h-px bg-primary -translate-y-1/2"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(currentStep / (ANALYSIS_STEPS.length - 1)) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />

                      {ANALYSIS_STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        const isActive = idx <= currentStep;
                        const isCurrent = idx === currentStep;
                        
                        return (
                          <div key={idx} className="relative z-10 flex flex-col items-center">
                             <motion.div 
                               animate={{ 
                                 scale: isCurrent ? [1, 1.2, 1] : 1,
                                 backgroundColor: isActive ? '#16a34a' : '#fff'
                               }}
                               className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                                 isActive ? 'border-primary shadow-lg shadow-primary/20' : 'border-gray-200'
                               }`}
                             >
                               {isActive ? (
                                 <CheckCircle className="w-4 h-4 text-white" />
                               ) : (
                                 <Icon className="w-4 h-4 text-gray-300" />
                               )}
                             </motion.div>
                             <span className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
                               isActive ? 'text-primary' : 'text-gray-300'
                             }`}>
                               {step.label}
                             </span>
                          </div>
                        );
                      })}
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>

             {/* Drag & Drop Zone */}
             <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative px-10 py-16 border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center text-center ${
                  dragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-gray-200 bg-gray-50'
                } ${file ? 'bg-green-50/30 border-primary/50' : ''}`}
             >
                {!file ? (
                  <>
                    <div className="w-20 h-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-6">
                       <FileUp className={`w-10 h-10 ${dragActive ? 'text-primary' : 'text-gray-400'}`} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Drag and drop your VCF file here</h3>
                    <p className="text-gray-400 text-sm mb-6">Support .vcf files up to 5MB</p>
                    <input 
                      type="file" 
                      id="vcf-upload" 
                      className="hidden" 
                      accept=".vcf"
                      onChange={(e) => validateAndProcessFile(e.target.files[0])}
                    />
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                      <label 
                        htmlFor="vcf-upload"
                        className="btn-secondary cursor-pointer"
                      >
                        Select File
                      </label>
                      <button 
                        onClick={handleDemoPatient}
                        className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border ${
                          isDemoMode 
                            ? 'bg-primary text-white shadow-xl shadow-primary/20 border-primary animate-pulse' 
                            : 'bg-primary/5 text-primary border-primary/20 hover:bg-primary/10'
                        }`}
                      >
                        {isDemoMode ? '🚀 Initialize Demo Patient' : 'Try Demo Patient'}
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
                             <p className="text-primary font-medium text-xs">{(file.size / 1024).toFixed(1)} KB • Validated Profile</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => {setFile(null); setVcfData(null);}}
                         className="flex items-center space-x-2 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-50 px-4 py-2 rounded-xl transition-all border border-red-100"
                       >
                         <Trash2 className="w-4 h-4" />
                         <span>Remove</span>
                       </button>
                    </div>

                    {/* VCF Insight Panel */}
                    <div className="grid grid-cols-3 gap-4">
                       <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Variants</div>
                          <div className="text-2xl font-black text-gray-900"><CountUp end={1242} /></div>
                       </div>
                       <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Genes Matched</div>
                          <div className="text-2xl font-black text-primary"><CountUp end={84} /></div>
                       </div>
                       <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Actionable</div>
                          <div className="text-2xl font-black text-amber-500"><CountUp end={12} /></div>
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

             {/* Drug Selection */}
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
                        className={`px-4 py-3 rounded-xl border text-left transition-all ${
                          selectedDrugs.includes(drug)
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-white border-gray-100 text-gray-600 hover:border-primary/30'
                        }`}
                     >
                        <span className="text-xs uppercase font-bold">{drug}</span>
                     </button>
                   ))}
                </div>
             </div>

             {/* Action Buttons */}
             <div className="mt-12 flex space-x-4">
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !file || selectedDrugs.length === 0}
                  className="flex-1 btn-primary py-5 rounded-2xl flex items-center justify-center space-x-3 text-xl disabled:bg-gray-200 disabled:shadow-none"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Analyzing Genome...</span>
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
                    setVcfData(null);
                    setError(null);
                  }}
                  className="px-8 py-5 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Reset
                </button>
             </div>

              {/* Feature: How PharmaGuard Works (Architecture View) */}
              <AnimatePresence>
                {isDemoMode && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-12 bg-white/50 p-8 rounded-3xl border border-white shadow-xl backdrop-blur-sm"
                  >
                     <div className="flex items-center space-x-3 mb-8">
                        <Cpu className="text-primary w-5 h-5" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 leading-none">System Architecture Overview</h4>
                     </div>
                     <div className="flex items-center justify-between px-4">
                        {[
                           { icon: FileCode, label: 'VCF Data' },
                           { icon: Cpu, label: 'Risk Engine' },
                           { icon: GitMerge, label: 'CPIC Logic' },
                           { icon: Sparkles, label: 'AI Insight' }
                        ].map((step, idx, arr) => (
                           <React.Fragment key={idx}>
                              <div className="flex flex-col items-center space-y-3">
                                 <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10">
                                    <step.icon className="w-6 h-6 text-primary" />
                                 </div>
                                 <span className="text-[7px] font-black uppercase tracking-widest text-gray-400 text-center">{step.label}</span>
                              </div>
                              {idx < arr.length - 1 && (
                                 <ArrowRight className="w-4 h-4 text-gray-200" />
                              )}
                           </React.Fragment>
                        ))}
                     </div>
                     <p className="mt-8 text-[9px] text-gray-400 font-medium text-center uppercase tracking-widest leading-relaxed">
                        Secure end-to-end pipeline: Local parsing → Federated Risk Assessment → AI Clinical Narrative Generation.
                     </p>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* Right Panel: AI Chatbot */}
        <div className="w-full lg:w-[400px] flex flex-col">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl flex flex-col h-[700px] overflow-hidden">
              {/* Header */}
              <div className="bg-primary p-6 text-white flex flex-col">
                 <div className="flex justify-between items-center w-full mb-6">
                    <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                          <Bot className="w-6 h-6" />
                       </div>
                       <div>
                          <h3 className="font-bold text-base leading-none mb-1">PharmaGuard Assistant</h3>
                          <div className="flex items-center space-x-2 text-green-100 text-[8px] uppercase tracking-widest font-black">
                             <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                             <span>AI Online</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Feature 2: AI Transparency Slider */}
                 <div className="flex flex-col space-y-2 relative z-10 w-full mb-2">
                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-white/60">
                       <span>AI Depth Control</span>
                       <span className="text-white/90">{transparencyLevel}</span>
                    </div>
                    <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                       <input 
                         type="range" 
                         min="0" 
                         max="2" 
                         step="1"
                         value={transparencyLevel === 'simple' ? 0 : transparencyLevel === 'detailed' ? 1 : 2}
                         onChange={(e) => {
                           const val = parseInt(e.target.value);
                           setTransparencyLevel(val === 0 ? 'simple' : val === 1 ? 'detailed' : 'research');
                         }}
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                       />
                       <motion.div 
                         className="absolute top-0 left-0 h-full bg-white rounded-full"
                         animate={{ width: transparencyLevel === 'simple' ? '33%' : transparencyLevel === 'detailed' ? '66%' : '100%' }}
                       />
                    </div>
                    <div className="flex justify-between text-[7px] font-black text-white/40 uppercase tracking-tighter">
                       <span>Basic</span>
                       <span>Standard</span>
                       <span>Deep</span>
                    </div>
                 </div>
              </div>

             {/* Chat History */}
             <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[85%] space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${
                          msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-primary'
                       }`}>
                          {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                       </div>
                       <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-gray-100 text-gray-700 shadow-sm'
                       }`}>
                          {msg.text}
                       </div>
                    </div>
                  </div>
                ))}
             </div>

             {/* Suggestions */}
             <div className="px-6 py-4 flex space-x-2 overflow-x-auto no-scrollbar">
                {['Explain CYP2D6', 'Best drug for pain?', 'How accurate is this?'].map((q) => (
                  <button 
                    key={q}
                    onClick={() => {setChatInput(q); }}
                    className="flex-shrink-0 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-500 hover:border-primary hover:text-primary whitespace-nowrap"
                  >
                    {q}
                  </button>
                ))}
             </div>

             {/* Input */}
             <div className="p-4 bg-white border-t border-gray-100">
                <div className="relative">
                   <input 
                     type="text" 
                     value={chatInput}
                     onChange={(e) => setChatInput(e.target.value)}
                     onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                     placeholder="Type your medical query..."
                     className="w-full pl-5 pr-14 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20"
                   />
                   <button 
                     onClick={handleSendChat}
                     className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-all"
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
