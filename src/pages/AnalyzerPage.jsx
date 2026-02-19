import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileUp, Search, Info, Trash2, 
  Send, Bot, User, Loader2,
  FileCheck, AlertCircle, Plus,
  Sparkles, Activity
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { parseVCF } from '../utils/vcfParser';
import { predictRisk } from '../utils/riskEngine';
import { useNavigate } from 'react-router-dom';
import CountUp from '../components/CountUp';

const SUPPORTED_DRUGS = [
  'CODEINE', 'WARFARIN', 'CLOPIDOGREL', 
  'SIMVASTATIN', 'AZATHIOPRINE', 'FLUOROURACIL'
];

const AnalyzerPage = () => {
  const navigate = useNavigate();
  const { 
    vcfData, setVcfData, 
    selectedDrugs, setSelectedDrugs,
    setAnalysisResults, 
    isAnalyzing, setIsAnalyzing,
    error, setError 
  } = useStore();

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: 'Hello! I am PharmaGuard AI Assistant. Upload a VCF and select drugs to get started, or ask me about pharmacogenomics.' }
  ]);

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
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target.result;
        const variants = await parseVCF(content);
        setVcfData(variants);
        setIsAnalyzing(false);
      };
      reader.readAsText(file);
    } catch (err) {
      setError('Failed to parse VCF file.');
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
    if (!vcfData || selectedDrugs.length === 0) {
      setError('Please upload genetic data and select at least one drug.');
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      const results = predictRisk(vcfData, selectedDrugs);
      setAnalysisResults(results);
      setIsAnalyzing(false);
      navigate('/results');
    }, 2000);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatHistory([...chatHistory, { role: 'user', text: userMsg }]);
    setChatInput('');
    
    // Mock bot response
    setTimeout(() => {
       let botMsg = "That's an interesting question about pharmacogenomics. Would you like me to analyze how this specifically relates to your current genetic profile?";
       if (userMsg.toLowerCase().includes('cyp2d6')) {
          botMsg = "CYP2D6 is one of the most important pharmacogenes, responsible for metabolizing about 25% of all clinically used drugs, including codeine, antidepressants, and beta-blockers.";
       } else if (userMsg.toLowerCase().includes('codeine')) {
          botMsg = "Codeine is a prodrug that needs to be converted into morphine by the CYP2D6 enzyme. If you are a 'Poor Metabolizer', you won't get pain relief. If 'Ultrarapid', you risk morphine toxicity.";
       }
       setChatHistory(prev => [...prev, { role: 'bot', text: botMsg }]);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Panel: Analyzer Inputs */}
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
                        onClick={() => {
                          const demoVcf = [
                            { gene: 'CYP2D6', diplotype: '*1/*4', rsid: 'rs3892097', ref: 'C', alt: 'T' },
                            { gene: 'CYP2C19', diplotype: '*1/*2', rsid: 'rs4244285', ref: 'G', alt: 'A' },
                            { gene: 'SLCO1B1', diplotype: '*5/*5', rsid: 'rs4149056', ref: 'T', alt: 'C' }
                          ];
                          setVcfData(demoVcf);
                          setFile({ name: 'demo_patient_001.vcf', size: 1240 });
                          setSelectedDrugs(['CODEINE', 'CLOPIDOGREL', 'SIMVASTATIN']);
                        }}
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
                    setVcfData(null);
                    setError(null);
                  }}
                  className="px-8 py-5 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Reset
                </button>
             </div>
          </div>
        </div>

        {/* Right Panel: AI Chatbot */}
        <div className="w-full lg:w-[400px] flex flex-col">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl flex flex-col h-[700px] overflow-hidden">
             {/* Header */}
             <div className="bg-primary p-6 text-white">
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
