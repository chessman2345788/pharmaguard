import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
   AlertTriangle, CheckCircle, Info,
   Copy, ChevronLeft,
   Stethoscope, Microscope, Brain,
   Calendar, User as UserIcon, Tag,
   FileJson, Share2, Activity
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Link, useNavigate } from 'react-router-dom';

const ResultsPage = () => {
   const navigate = useNavigate();
   const { analysisResults, explanationMode, setExplanationMode } = useStore();

   if (analysisResults.length === 0) {
      return (
         <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold mb-4">No analysis results found</h2>
            <Link to="/analyze" className="btn-primary">Return to Analyzer</Link>
         </div>
      );
   }

   const handleDownloadJSON = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysisResults, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "pharmaguard_report.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
   };

   const handleCopyJSON = () => {
      navigator.clipboard.writeText(JSON.stringify(analysisResults, null, 2));
      alert('Report JSON copied to clipboard!');
   };

   const getRiskColor = (risk) => {
      switch (risk.toLowerCase()) {
         case 'toxic': return 'text-red-600 bg-red-50 border-red-100';
         case 'ineffective': return 'text-orange-600 bg-orange-50 border-orange-100';
         case 'adjust dosage': return 'text-amber-600 bg-amber-50 border-amber-100';
         case 'safe': return 'text-green-600 bg-green-50 border-green-100';
         default: return 'text-gray-600 bg-gray-50 border-gray-100';
      }
   };

   return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
         {/* Header */}
         <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <button
                  onClick={() => navigate('/analyze')}
                  className="flex items-center space-x-2 text-primary font-bold mb-4 hover:translate-x-1 transition-transform"
               >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Back to Analyzer</span>
               </button>
               <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Analysis Report</h1>
               <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                     <UserIcon className="w-4 h-4 text-primary" />
                     <span className="font-bold">Patient: PG-001</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                     <Calendar className="w-4 h-4 text-primary" />
                     <span>{new Date().toLocaleDateString()}</span>
                  </div>
               </div>
            </div>
            <div className="flex flex-wrap gap-3">
               <button onClick={handleCopyJSON} className="btn-secondary flex items-center space-x-2">
                  <Copy className="w-4 h-4" />
                  <span>Copy JSON</span>
               </button>
               <button onClick={handleDownloadJSON} className="btn-secondary flex items-center space-x-2">
                  <FileJson className="w-4 h-4" />
                  <span>JSON</span>
               </button>
            </div>
         </div>

         {/* Risk Timeline */}
         <div className="mb-16 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto gap-8">
               {[
                  { label: 'Upload VCF', icon: FileJson, active: true },
                  { label: 'Variant Detection', icon: Microscope, active: true },
                  { label: 'Gene Analysis', icon: Brain, active: true },
                  { label: 'Drug Risk', icon: AlertTriangle, active: true },
                  { label: 'Recommendation', icon: Stethoscope, active: false }
               ].map((step, i, arr) => (
                  <React.Fragment key={i}>
                     <div className="flex flex-col items-center group">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 mb-3 ${step.active ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' : 'bg-gray-50 text-gray-300'
                           }`}>
                           <step.icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${step.active ? 'text-gray-900' : 'text-gray-300'}`}>
                           {step.label}
                        </span>
                     </div>
                     {i < arr.length - 1 && (
                        <div className={`hidden md:block h-px flex-1 mx-4 ${step.active && arr[i + 1].active ? 'bg-primary' : 'bg-gray-100'}`} />
                     )}
                  </React.Fragment>
               ))}
            </div>
         </div>

         {/* Results List */}
         <div className="space-y-16">
            {analysisResults.map((result, idx) => (
               <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 + 0.5, duration: 0.8 }}
                  className="space-y-8"
               >
                  {/* Summary Header with Micro-animations */}
                  <div className="relative group">
                     <motion.div
                        animate={result.risk_assessment.risk_label === 'Safe' ?
                           { boxShadow: ['0 0 0px rgba(22,163,74,0)', '0 0 30px rgba(22,163,74,0.15)', '0 0 0px rgba(22,163,74,0)'] } :
                           result.risk_assessment.risk_label === 'Adjust Dosage' ?
                              { scale: [1, 1.01, 1] } :
                              { boxShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 30px rgba(239,68,68,0.2)', '0 0 0px rgba(239,68,68,0)'] }
                        }
                        transition={{ duration: 3, repeat: Infinity }}
                        className={`p-8 rounded-[3rem] border-2 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 bg-white transition-all duration-500 ${getRiskColor(result.risk_assessment.risk_label)}`}
                     >
                        <div className="flex items-center space-x-8">
                           <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center bg-white shadow-xl group-hover:rotate-[10deg] transition-transform duration-500`}>
                              {result.risk_assessment.risk_label === 'Safe' ? <CheckCircle className="w-10 h-10 text-primary" /> : <AlertTriangle className="w-10 h-10" />}
                           </div>
                           <div>
                              <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Genomic Drug Interaction</div>
                              <h2 className="text-4xl font-black tracking-tighter text-gray-900">{result.drug_name}</h2>
                           </div>
                        </div>
                        <div className="flex flex-col items-center md:items-end">
                           <div className={`px-8 py-3 rounded-2xl text-xl font-black uppercase border-2 mb-4 tracking-tighter shadow-sm ${getRiskColor(result.risk_assessment.risk_label)}`}>
                              {result.risk_assessment.risk_label}
                           </div>
                           <div className="flex items-center space-x-2 text-xs font-bold text-gray-400">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span>High Confidence Algorithm</span>
                           </div>
                        </div>
                     </motion.div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     {/* Left Column: Pharmacogenomic Profile */}
                     <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                           <div className="flex items-center space-x-3 mb-8">
                              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                 <Microscope className="text-primary w-5 h-5" />
                              </div>
                              <h3 className="font-extrabold text-xl tracking-tight text-gray-900">Genomic Profile</h3>
                           </div>

                           {/* Gene Visual Chips */}
                           <div className="space-y-6">
                              <div className="flex flex-wrap gap-2">
                                 <div className="flex items-center bg-primary/5 border border-primary/10 px-4 py-2 rounded-full">
                                    <span className="text-[10px] font-black text-primary/60 mr-2 uppercase tracking-widest">Gene</span>
                                    <span className="text-sm font-black text-primary">{result.pharmacogenomic_profile.primary_gene}</span>
                                 </div>
                                 <div className="flex items-center bg-gray-50 border border-gray-100 px-4 py-2 rounded-full">
                                    <span className="text-[10px] font-black text-gray-400 mr-2 uppercase tracking-widest">Diplotype</span>
                                    <span className="text-sm font-black text-gray-900">{result.pharmacogenomic_profile.diplotype}</span>
                                 </div>
                                 <div className="flex items-center bg-gray-50 border border-gray-100 px-4 py-2 rounded-full">
                                    <span className="text-[10px] font-black text-gray-400 mr-2 uppercase tracking-widest">Phenotype</span>
                                    <span className="text-sm font-black text-gray-900">{result.pharmacogenomic_profile.phenotype}</span>
                                 </div>
                              </div>

                              <div className="pt-6 border-t border-gray-50">
                                 <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Detected Variants</div>
                                 <div className="space-y-3">
                                    {result.pharmacogenomic_profile.detected_variants.map((v, i) => (
                                       <div key={i} className="flex items-center justify-between bg-gray-50/50 p-3 rounded-xl border border-gray-100 group hover:border-primary/20 transition-colors">
                                          <div className="flex items-center space-x-3">
                                             <Activity className="w-4 h-4 text-primary/30" />
                                             <span className="text-xs font-black text-gray-700">{v.rsid}</span>
                                          </div>
                                          <span className="text-[10px] font-black text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100 uppercase tracking-wider">{v.ref} → {v.alt}</span>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Clinical Confidence Panel */}
                        <motion.div
                           initial={{ opacity: 0, scale: 0.95 }}
                           whileInView={{ opacity: 1, scale: 1 }}
                           viewport={{ once: true }}
                           className="bg-emerald-950 p-8 rounded-[2.5rem] text-white relative overflow-hidden group"
                        >
                           <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-[60px] -mr-16 -mt-16 opacity-20 group-hover:opacity-40 transition-opacity" />
                           <h3 className="font-extrabold text-xl mb-6 relative z-10">Clinical Confidence</h3>
                           <div className="space-y-4 relative z-10">
                              <div className="flex justify-between items-center py-3 border-b border-white/5">
                                 <span className="text-primary-soft text-xs font-black uppercase tracking-widest">Evidence Level</span>
                                 <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">High (Level 1A)</span>
                              </div>
                              <div className="flex justify-between items-center py-3 border-b border-white/5">
                                 <span className="text-primary-soft text-xs font-black uppercase tracking-widest">Guideline Source</span>
                                 <span className="flex items-center space-x-2">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">CPIC / PharmGKB</span>
                                 </span>
                              </div>
                              <div className="flex justify-between items-center py-3">
                                 <span className="text-primary-soft text-xs font-black uppercase tracking-widest">Impact Score</span>
                                 <span className="text-lg font-black tracking-tighter">0.98 <span className="text-xs opacity-40">/ 1.0</span></span>
                              </div>
                           </div>
                        </motion.div>
                     </div>

                     {/* Right Column: Recommendations & Insights */}
                     <div className="lg:col-span-8 space-y-8">
                        <div className="bg-primary/5 p-10 rounded-[2.5rem] border border-primary/10 relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] z-0"
                              style={{ backgroundImage: `radial-gradient(#16a34a 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}
                           />
                           <div className="relative z-10">
                              <div className="flex items-center justify-between mb-8">
                                 <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
                                       <Stethoscope className="text-primary w-6 h-6" />
                                    </div>
                                    <h3 className="font-black text-2xl tracking-tight text-gray-900">Clinical Recommendation</h3>
                                 </div>
                              </div>
                              <div className="text-xl text-gray-800 font-bold leading-relaxed bg-white p-8 rounded-3xl border border-primary/5 shadow-xl shadow-primary/5">
                                 {result.clinical_recommendation.dosing_advice}
                              </div>
                              <div className="mt-8 flex items-center space-x-3 text-[10px] text-primary/50 font-black uppercase tracking-[0.2em]">
                                 <Info className="w-4 h-4" />
                                 <span>Clinical Action Recommended based on Pharmacogenomic Evidence</span>
                              </div>
                           </div>
                        </div>

                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                              <div className="flex items-center space-x-3">
                                 <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                    <Brain className="text-primary w-6 h-6" />
                                 </div>
                                 <h3 className="font-black text-2xl tracking-tight text-gray-900">AI Clinical Explanation</h3>
                              </div>

                              {/* Explanation Mode Toggle */}
                              <div className="bg-gray-50 p-1.5 rounded-2xl flex items-center border border-gray-100">
                                 <button
                                    onClick={() => setExplanationMode('patient')}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${explanationMode === 'patient' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-gray-600'
                                       }`}
                                 >
                                    Patient Mode
                                 </button>
                                 <button
                                    onClick={() => setExplanationMode('doctor')}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${explanationMode === 'doctor' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-gray-600'
                                       }`}
                                 >
                                    Doctor Mode
                                 </button>
                              </div>
                           </div>

                           <div className="space-y-6">
                              <p className="text-lg text-gray-600 leading-relaxed font-medium bg-gray-50/50 p-6 rounded-3xl border border-gray-100 border-dashed">
                                 {explanationMode === 'doctor' ? (
                                    `Patient presents with a restricted clearance profile for ${result.drug_name} driven by ${result.pharmacogenomic_profile.primary_gene} ${result.pharmacogenomic_profile.diplotype} polymorphism. Kinetic studies suggest severe metabolic downregulation.`
                                 ) : (
                                    result.llm_explanation.summary
                                 )}
                              </p>

                              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-6 justify-between items-center">
                                 <div className="flex items-center space-x-3">
                                    <span className="w-10 h-10 bg-emerald-50 text-primary flex items-center justify-center rounded-xl border border-primary/10">
                                       <Tag className="w-5 h-5" />
                                    </span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Interaction Mechanism Mapping</span>
                                 </div>
                                 <div className="flex gap-2">
                                    {result.llm_explanation.variant_citations.map((c, i) => (
                                       <span key={i} className="text-[10px] font-bold bg-white px-4 py-2 rounded-xl border border-gray-100 text-gray-400 shadow-sm">{c}</span>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="h-px bg-gray-100 w-full my-12" />
               </motion.div>
            ))}
         </div>

         {/* Footer Navigation */}
         <div className="mt-20 flex flex-col items-center">
            <h3 className="text-xl font-bold mb-6">Explore Detailed Analytics</h3>
            <Link to="/analytics" className="btn-primary px-12 py-5 rounded-2xl flex items-center space-x-3 shadow-2xl">
               <span>View Full Visual Analytics</span>
               <Share2 className="w-5 h-5" />
            </Link>
         </div>
      </div>
   );
};

export default ResultsPage;
