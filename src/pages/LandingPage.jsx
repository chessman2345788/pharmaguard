import React from 'react';
import { motion } from 'framer-motion';
import {
  Dna, ShieldCheck, Activity, Zap,
  FileUp, ClipboardList, Database,
  Stethoscope, BarChart3, MessageSquareText,
  AlertCircle, CheckCircle2, Brain, Microscope,
  ChevronRight, Sparkles, ArrowRight, Play,
  FileText, Cpu, Bot
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CountUp from '../components/CountUp';

const Hero = () => {
  const navigate = useNavigate();

  const handleLiveDemo = () => {
    navigate('/analyze', { state: { autoDemo: true } });
  };

  return (
    <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden bg-white">
      {/* Background dots + glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 blur-[140px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: `radial-gradient(#16a34a 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Copy */}
          <div className="flex flex-col items-start text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              <span>Hackathon 2026 · AI for Healthcare</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="text-5xl md:text-[4.5rem] font-black text-gray-900 tracking-tighter leading-[1.05] mb-6"
            >
              Stop adverse drug{' '}
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                reactions before
              </span>{' '}
              they happen.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed font-medium mb-10"
            >
              PharmaGuard AI reads your patient's DNA and instantly flags which medications are dangerous — powered by CPIC clinical guidelines and Gemini AI.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto"
            >
              {/* Live Demo — primary */}
              <button
                onClick={handleLiveDemo}
                className="group flex items-center justify-center space-x-3 px-8 py-4 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/25 hover:bg-emerald-600 hover:scale-[1.02] transition-all active:scale-95 text-base"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>▶ Launch Live Demo</span>
              </button>

              {/* Upload own file — secondary */}
              <Link
                to="/analyze"
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-all active:scale-95 text-base"
              >
                <FileUp className="w-5 h-5 text-primary" />
                <span>Upload VCF File</span>
              </Link>
            </motion.div>

            {/* Impact numbers row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-wrap gap-x-8 gap-y-3 border-t border-gray-100 pt-8"
            >
              {[
                { value: '6', label: 'Genes Analyzed' },
                { value: '25+', label: 'Drug Interactions' },
                { value: 'CPIC', label: 'Guideline-Backed' },
                { value: 'AI', label: 'Gemini Powered' },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <span className="text-xl font-black text-primary">{item.value}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: animated mock-card */}
          <div className="hidden lg:flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative w-full max-w-sm"
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-110" />

              {/* Mock result card */}
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4">
                {/* Card header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                      <Dna className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-black text-sm text-gray-900">PharmaGuard Report</span>
                  </div>
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-full">LIVE</span>
                </div>

                {/* Mock drug cards */}
                {[
                  { drug: 'CODEINE', gene: 'CYP2D6', risk: 'High Risk', color: 'text-red-500 bg-red-50', diplotype: '*1/*4' },
                  { drug: 'CLOPIDOGREL', gene: 'CYP2C19', risk: 'Caution', color: 'text-amber-500 bg-amber-50', diplotype: '*1/*2' },
                  { drug: 'SIMVASTATIN', gene: 'SLCO1B1', risk: 'Safe', color: 'text-green-600 bg-green-50', diplotype: '*1/*1' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.2 }}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50"
                  >
                    <div>
                      <div className="font-black text-xs text-gray-900">{item.drug}</div>
                      <div className="text-[10px] text-gray-400">{item.gene} · {item.diplotype}</div>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${item.color}`}>
                      {item.risk}
                    </span>
                  </motion.div>
                ))}

                {/* AI label */}
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="text-[10px] text-gray-400 font-medium">Gemini AI explanation available</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

const StatsStrip = () => {
  const stats = [
    { end: 100, suffix: 'k+', label: 'Adverse Drug Deaths Preventable Annually', icon: AlertCircle },
    { end: 6, suffix: ' Genes', label: 'Critical Pharmacogene Pathways', icon: Dna },
    { end: 25, suffix: '+', label: 'Drug-Gene Interactions Covered', icon: Activity },
    { end: 98, suffix: '%', label: 'Risk Prediction Accuracy (CPIC)', icon: ShieldCheck },
  ];

  return (
    <section className="py-20 relative overflow-hidden px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-900 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -mr-40 -mt-40 opacity-50" />
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-10 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center px-4 py-6 lg:py-0"
              >
                <stat.icon className="w-5 h-5 text-primary mb-4" />
                <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </div>
                <div className="text-gray-400 font-bold uppercase tracking-widest text-[9px] max-w-[120px] leading-relaxed">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const FlowCards = () => {
  const steps = [
    {
      step: '01',
      icon: FileUp,
      title: 'Upload VCF File',
      desc: 'Drop any standard .vcf genomic file — or use our demo patient with one click.',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      step: '02',
      icon: Cpu,
      title: 'AI Risk Analysis',
      desc: 'Our engine maps variants to CPIC phenotypes and Gemini AI narrates the clinical impact.',
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/10',
    },
    {
      step: '03',
      icon: FileText,
      title: 'Clinical Risk Insights',
      desc: 'View comprehensive insights with color-coded risk levels, dosing advice, and citations.',
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
  ];

  return (
    <section className="py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px] block mb-3"
          >
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tighter"
          >
            <span className="bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
              From DNA to Decision in 30 Seconds
            </span>
          </motion.h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connector line */}
          <div className="hidden md:block absolute top-14 left-[22%] right-[22%] h-px bg-gray-100 z-0">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: true }}
              className="h-full bg-primary origin-left"
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className={`relative z-10 bg-white border ${step.border} rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all`}
            >
              {/* Step number + icon */}
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-14 h-14 ${step.bg} rounded-2xl flex items-center justify-center`}>
                  <step.icon className={`w-7 h-7 ${step.color}`} />
                </div>
                <span className="text-4xl font-black text-gray-100">{step.step}</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>

              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-primary z-20 bg-white rounded-full p-1 shadow border border-gray-100" />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA under flow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <Link
            to="/analyze"
            state={{ autoDemo: true }}
            className="inline-flex items-center space-x-3 bg-primary text-white px-10 py-4 rounded-2xl font-black text-base hover:bg-emerald-600 hover:scale-[1.02] transition-all shadow-lg shadow-primary/20"
          >
            <Play className="w-5 h-5" />
            <span>See It Live — One Click</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const GenesGrid = () => {
  const genes = [
    { name: 'CYP2D6', drug: 'Codeine, Tamoxifen', desc: 'Metabolizes 25% of all clinical drugs' },
    { name: 'CYP2C19', drug: 'Clopidogrel, Omeprazole', desc: 'Critical for antiplatelet & PPI response' },
    { name: 'CYP2C9', drug: 'Warfarin, NSAIDs', desc: 'Bleeding risk & NSAID sensitivity' },
    { name: 'SLCO1B1', drug: 'Simvastatin', desc: 'Statin-induced myopathy risk' },
    { name: 'TPMT', drug: 'Azathioprine', desc: 'Thiopurine toxicity screening' },
    { name: 'DPYD', drug: 'Fluorouracil', desc: 'Fatal chemo toxicity risk' },
  ];

  return (
    <section className="py-28 bg-gray-50/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px] block mb-3"
          >
            Coverage
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tighter"
          >
            <span className="bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
              6 Genes · 25+ Drug Interactions
            </span>
          </motion.h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">Every gene-drug pair is validated against the latest CPIC and PharmGKB guidelines.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {genes.map((gene, i) => (
            <motion.div
              key={gene.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/20 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                  <Dna className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900 group-hover:text-primary transition-colors">{gene.name}</h4>
                  <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-1">{gene.drug}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{gene.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-28 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-primary rounded-[3rem] p-14 lg:p-20 text-center text-white shadow-[0_40px_80px_-20px_rgba(22,163,74,0.35)] overflow-hidden relative"
        >
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px]" />
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 border border-white/20"
            >
              <Activity className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">
              Ready to see it in action?
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl">
              No signup. No setup. Click below to instantly run a full pharmacogenomic analysis on a demo patient.
            </p>
            <button
              onClick={() => navigate('/analyze', { state: { autoDemo: true } })}
              className="group inline-flex items-center space-x-3 bg-white text-primary px-12 py-5 rounded-2xl font-black text-xl hover:bg-gray-50 transition-all hover:scale-[1.02] shadow-xl active:scale-95"
            >
              <Play className="w-6 h-6" />
              <span>Launch Live Demo</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="mt-10 flex items-center space-x-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
              <span>Open Access</span>
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>CPIC Validated</span>
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>Gemini AI</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const LandingPage = () => (
  <div className="bg-white">
    <Hero />
    <StatsStrip />
    <FlowCards />
    <GenesGrid />
    <FinalCTA />
  </div>
);

export default LandingPage;
