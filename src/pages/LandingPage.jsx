import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Dna, ShieldCheck, Activity, Zap, 
  Search, FileUp, ClipboardList, Database, 
  Stethoscope, BarChart3, MessageSquareText,
  AlertCircle, Users, CheckCircle2,
  ChevronRight, Brain, Microscope, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CountUp from '../components/CountUp';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 overflow-hidden bg-white">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-full h-full opacity-[0.03]" 
             style={{ backgroundImage: `radial-gradient(#16a34a 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Content */}
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              <span>Next-Generation Healthcare AI</span>
            </motion.div>

            <div className="space-y-4 mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[1.1]"
              >
                <span className="block italic text-gray-400 font-medium text-3xl md:text-4xl mb-2 tracking-normal">Precision Medicine</span>
                <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent block md:whitespace-nowrap">
                  Powered by Genomics
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                className="text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed font-medium"
              >
                Translating complex VCF genetic data into actionable clinical intelligence. Reducing adverse drug reactions through AI-driven risk prediction.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto"
            >
              <Link 
                to="/analyze" 
                className="px-8 py-4 bg-gradient-to-r from-primary to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <FileUp className="w-5 h-5" />
                <span>Upload Genome Report</span>
              </Link>
              <Link 
                to="/about" 
                className="px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center active:scale-95"
              >
                Explore Science
              </Link>
            </motion.div>

            {/* Trust Row */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="flex flex-wrap gap-6 border-t border-gray-100 pt-8"
            >
              {[
                { label: "AI Pharmacogenomics", icon: Brain },
                { label: "CPIC Guideline Ready", icon: Stethoscope },
                { label: "Variant-Level Insights", icon: Microscope }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span>{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Illustration */}
          <div className="hidden lg:flex justify-center items-center relative min-h-[500px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
              className="relative w-full max-w-md aspect-square"
            >
              {/* Abstract DNA/Healthcare Vector Replacement */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <motion.div 
                   animate={{ 
                     rotate: 360,
                   }}
                   transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                   className="absolute w-full h-full border-[1px] border-dashed border-primary/20 rounded-full" 
                 />
                 <motion.div 
                   animate={{ 
                     rotate: -360,
                   }}
                   transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                   className="absolute w-3/4 h-3/4 border-[1px] border-dashed border-emerald-500/10 rounded-full" 
                 />
                 
                 <div className="relative">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1],
                        filter: ["drop-shadow(0 0 20px rgba(22, 163, 74, 0.1))", "drop-shadow(0 0 40px rgba(22, 163, 74, 0.3))", "drop-shadow(0 0 20px rgba(22, 163, 74, 0.1))"]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-gray-50 mb-8"
                    >
                      <Activity className="w-16 h-16 text-primary" />
                    </motion.div>
                    
                    {/* Abstract Floating Bits */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          y: [0, -20, 0],
                          x: [0, 10, 0]
                        }}
                        transition={{ 
                          duration: 3 + i, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: i * 0.5
                        }}
                        className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm"
                        style={{ 
                          top: i === 0 ? '-20px' : i === 1 ? '40px' : '100px',
                          left: i === 0 ? '120px' : i === 1 ? '-40px' : '140px'
                        }}
                      />
                    ))}
                 </div>
              </div>
              
              {/* Abstract DNA Coil Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.15]" viewBox="0 0 400 400">
                <motion.path
                  d="M100,50 Q200,200 300,50"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                  animate={{ d: ["M100,50 Q200,200 300,50", "M100,150 Q200,50 300,150", "M100,50 Q200,200 300,50"] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.path
                  d="M50,150 Q250,250 150,350"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                  animate={{ d: ["M50,150 Q250,250 150,350", "M150,150 Q50,250 250,350", "M50,150 Q250,250 150,350"] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const IntelligenceStrip = () => {
  return (
    <div className="bg-white border-y border-gray-50 py-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
           {[
             { icon: Dna, label: "Variant Engine", color: "text-blue-500" },
             { icon: Brain, label: "AI Clinical Engine", color: "text-primary" },
             { icon: BarChart3, label: "Risk Engine", color: "text-amber-500" }
           ].map((item, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="flex items-center space-x-3 group"
             >
                <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-900 transition-colors">
                  {item.label}
                </span>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
};

const FeatureCards = () => {
  const cards = [
    { 
      icon: Microscope, 
      title: "Genetic Variant Analysis", 
      text: "Deep scan of SNVs and indels across 6 critical metabolic gene pathways.",
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    { 
      icon: Brain, 
      title: "AI Clinical Explanations", 
      text: "Transformer-based translation of complex metabolism into plain language.",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    { 
      icon: Stethoscope, 
      title: "CPIC Recommendations", 
      text: "Real-time mapping to the latest dosing guidelines for immediate care.",
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
    { 
      icon: BarChart3, 
      title: "Risk Dashboard", 
      text: "Multi-dimensional visual analytics of cumulative risk profiles.",
      color: "text-purple-500",
      bg: "bg-purple-50"
    }
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Refined Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full opacity-50" />
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{ backgroundImage: `radial-gradient(#16a34a 0.5px, transparent 0.5px)`, backgroundSize: '32px 32px' }} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
           <motion.span 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block"
           >
             Precision Capabilities
           </motion.span>
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             viewport={{ once: true }}
             className="text-4xl md:text-5xl font-black tracking-tighter"
           >
             <span className="bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
               Engineered for Medical Accuracy
             </span>
           </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group bg-white border border-green-50 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
            >
              {/* Icon Container */}
              <div className={`w-16 h-16 ${card.bg} rounded-full flex items-center justify-center mb-10 relative`}>
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute inset-0 ${card.bg} rounded-full opacity-50`} 
                />
                <card.icon className={`w-7 h-7 ${card.color} relative z-10 transition-transform duration-500 group-hover:rotate-12`} />
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight transition-colors duration-300 group-hover:text-primary">
                {card.title}
              </h3>
              
              <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-1 opacity-80 group-hover:opacity-100 transition-opacity">
                {card.text}
              </p>
              
              <div className="flex items-center text-xs font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-all duration-300">
                 <span className="mr-2">Explore Module</span>
                 <ChevronRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { title: "Upload VCF File", text: "Secure drag-and-drop of your genomic data profile for immediate cloud processing." },
    { title: "Analyze Variants", text: "Parallel processing of genotype-to-phenotype mapping against world-class databases." },
    { title: "Get Evidence Report", text: "Comprehensive clinical report with actionable dosing and risk level stratification." }
  ];

  return (
    <section className="py-32 bg-gray-50/40 rounded-[4rem] mx-4 sm:mx-8 relative overflow-hidden border border-gray-100/50">
      {/* Background Polish */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
           <motion.span 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block"
           >
             Simple Workflow
           </motion.span>
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             viewport={{ once: true }}
             className="text-4xl md:text-5xl font-black tracking-tighter"
           >
             <span className="bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
               Three Steps to Intelligence
             </span>
           </motion.h2>
        </div>

        <div className="relative">
          {/* Animated Connecting Path (Desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-0 w-full px-40 z-0">
             <div className="h-0.5 bg-gray-200 w-full relative">
                <motion.div 
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  viewport={{ once: true }}
                  className="h-full bg-primary shadow-[0_0_10px_rgba(22,163,74,0.5)]" 
                />
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative z-10">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                {/* Step Marker */}
                <div className="relative mb-10 inline-block">
                  <div className="w-28 h-28 bg-white border-4 border-gray-100 rounded-[2.5rem] flex items-center justify-center text-3xl font-black text-gray-300 shadow-xl transition-all duration-500 group-hover:border-primary group-hover:text-primary group-hover:scale-110 relative z-10 bg-white">
                     0{i + 1}
                  </div>
                  
                  {/* Outer Glow Sync'd with Hover */}
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-primary/10 rounded-[2.5rem] -z-10 group-hover:bg-primary/20" 
                  />
                  
                  {/* Subtle Sparkle/Checkmark on Hover */}
                  <motion.div 
                    className="absolute -top-2 -right-2 bg-primary text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg"
                  >
                    <Activity className="w-4 h-4" />
                  </motion.div>
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-4 transition-colors group-hover:text-primary">
                  {step.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed max-w-[280px] mx-auto text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const GenesGrid = () => {
  const genes = [
    { name: 'CYP2D6', desc: 'Metabolizes 25% of clinical drugs' },
    { name: 'CYP2C19', desc: 'Critical for antiplatelet response' },
    { name: 'CYP2C9', desc: 'Warfarin & NSAID sensitivity' },
    { name: 'SLCO1B1', desc: 'Statin-induced myopathy risks' },
    { name: 'TPMT', desc: 'Thiopurine toxicity screening' },
    { name: 'DPYD', desc: 'Fluoropyrimidine risk factors' }
  ];

  return (
    <section className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
           <motion.span 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block"
           >
             Targeted Pharmacogenes
           </motion.span>
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             viewport={{ once: true }}
             className="text-4xl md:text-5xl font-black tracking-tighter"
           >
             <span className="bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
               High-Impact Clinical Pathways
             </span>
           </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {genes.map((gene, i) => (
            <motion.div
              key={gene.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group cursor-default relative overflow-hidden"
            >
              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors" />
              
              <div className="relative z-10 flex items-start space-x-5">
                <div className="w-14 h-14 bg-gray-50 group-hover:bg-primary/10 rounded-2xl flex items-center justify-center transition-colors">
                  <Database className="text-primary/20 group-hover:text-primary w-6 h-6 transition-colors" />
                </div>
                <div>
                   <h4 className="text-xl font-black text-gray-900 mb-1 group-hover:text-primary transition-colors">
                     {gene.name}
                   </h4>
                   <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest leading-none mb-2">
                     Core Metabolic Pathway
                   </p>
                   <p className="text-gray-500 text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 italic">
                     {gene.desc}
                   </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 flex justify-center"
        >
           <div className="px-6 py-3 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center space-x-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>Continuously updated via NCBI ClinVar & CPIC API</span>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

const StatsStrip = () => {
  const stats = [
    { end: 100000, suffix: "+", label: "Adverse Drug Deaths Preventable", icon: AlertCircle },
    { end: 6, suffix: " Critical", label: "Gene Pathways Analyzed", icon: Activity },
    { end: 98, suffix: "%", label: "Risk Prediction Accuracy", icon: ShieldCheck }
  ];

  return (
    <section className="py-24 relative overflow-hidden px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl border border-white/5">
          {/* Background Polish */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -mr-40 -mt-40 opacity-50" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full -ml-20 -mb-20 opacity-30" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center px-8 py-8 md:py-0 group"
              >
                <div className="mb-6 relative">
                   <stat.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                   <motion.div 
                     animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                     transition={{ duration: 2, repeat: Infinity }}
                     className="absolute inset-0 bg-primary/40 rounded-full -z-10" 
                   />
                </div>
                
                <div className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4 group-hover:text-primary transition-colors">
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </div>
                
                <div className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] max-w-[150px] leading-relaxed">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const LandingPage = () => {
  return (
    <div className="bg-white">
      <Hero />
      <IntelligenceStrip />
      <StatsStrip />
      <FeatureCards />
      <HowItWorks />
      <GenesGrid />
      
      {/* Final CTA Strip */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative bg-primary rounded-[3.5rem] p-12 lg:p-24 text-center text-white shadow-[0_40px_80px_-20px_rgba(22,163,74,0.3)] overflow-hidden"
          >
             {/* Deep Clinical Glow */}
             <motion.div 
               animate={{ 
                 scale: [1, 1.2, 1],
                 opacity: [0.2, 0.4, 0.2]
               }}
               transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-white rounded-full blur-[120px] -z-0" 
             />
             
             <div className="relative z-10 flex flex-col items-center">
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-10 border border-white/20 shadow-xl"
               >
                  <Activity className="w-10 h-10 text-white" />
               </motion.div>
               
               <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-[1.1]">
                 Scale clinical intelligence <br className="hidden md:block" /> with precision genomics.
               </h2>
               
               <p className="text-primary-soft text-lg md:text-xl font-medium mb-12 max-w-2xl opacity-90 leading-relaxed">
                 Trusted by researchers and practitioners to predict drug response with 98% validated accuracy.
               </p>
               
               <Link 
                 to="/analyze" 
                 className="group inline-flex items-center space-x-4 bg-white text-primary px-12 py-6 rounded-2xl font-black text-xl hover:bg-gray-50 transition-all hover:scale-[1.02] shadow-2xl active:scale-95"
               >
                 <span>Start Free Analysis</span>
                 <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
               </Link>
               
               <div className="mt-12 flex items-center space-x-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
                  <span>Open Access</span>
                  <div className="w-1 h-1 bg-white rounded-full" />
                  <span> HIPAA Compliant</span>
                  <div className="w-1 h-1 bg-white rounded-full" />
                  <span>ClinVar Synced</span>
               </div>
             </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
