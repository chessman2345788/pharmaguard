import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, Database, Globe, Heart, Activity, Award } from 'lucide-react';

const StatItem = ({ val, label, delay }) => {
  const [count, setCount] = useState(0);
  const target = parseFloat(val.replace(/[^0-9.]/g, ''));
  const suffix = val.replace(/[0-9.]/g, '');

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const timer = setTimeout(() => {
      const handle = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(handle);
        } else {
          setCount(start);
        }
      }, 16);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [target, delay]);

  const formattedCount = val.includes('.') ? count.toFixed(1) : Math.floor(count);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="flex flex-col items-center"
    >
      <div className="text-5xl font-black text-primary mb-3 flex items-baseline">
        {formattedCount}{suffix}
      </div>
      <div className="h-1 w-8 bg-primary/20 rounded-full mb-3" />
      <div className="text-gray-400 font-bold text-xs uppercase tracking-widest">{label}</div>
    </motion.div>
  );
};

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
      {/* Hero Mission Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-32"
      >
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-primary font-black uppercase tracking-[0.3em] text-[10px] bg-primary/5 px-4 py-1.5 rounded-full"
        >
          Our Core Mission
        </motion.span>
        
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mt-8 mb-10 tracking-tight leading-[1.1]">
          Bridging the Gap Between <br />
          <span className="bg-gradient-to-r from-primary via-primary-dark to-primary bg-clip-text text-transparent opacity-90">
            Genomics & Clinical Care
          </span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-xl text-gray-500 font-medium leading-relaxed mb-12">
          PharmaGuard AI was founded on the principle that no patient should suffer from 
          avoidable adverse drug reactions. We use state-of-the-art AI to translate 
          complex genetic data into actionable medical intelligence.
        </p>
        
        <div className="w-24 h-px bg-gray-200 mx-auto" />
      </motion.div>

      {/* Main Content Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-40">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
           <h2 className="text-4xl font-black text-gray-900 tracking-tight">
             Developed for the <br /> 
             <span className="text-primary/80">Healthcare Future</span>
           </h2>
           <p className="text-lg text-gray-600 leading-relaxed font-medium">
             Traditional pharmaceutical models follow a "one size fits all" approach. 
             However, human biology is uniquely diverse. By analyzing the patient's VCF 
             files, PharmaGuard provides a window into how an individual's enzymes 
             will actually process specific medications.
           </p>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
              {[
                { icon: ShieldCheck, title: "HIPAA Ready", text: "Enterprise-grade security" },
                { icon: Database, title: "CPIC Sourced", text: "Gold standard clinical data" },
                { icon: Globe, title: "Global Reach", text: "Multi-ethnic reference sets" },
                { icon: Heart, title: "Patient First", text: "Clear, empathetic insights" },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -5 }}
                  className="flex items-start space-x-4 group cursor-default"
                >
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-primary/10">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-gray-500 text-xs mt-1 font-medium">{item.text}</p>
                  </div>
                </motion.div>
              ))}
           </div>
        </motion.div>

        {/* Right Visual Card */}
        <div className="relative">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="w-full h-[600px] bg-primary rounded-[4rem] relative shadow-2xl shadow-primary/20 overflow-hidden group"
           >
              {/* Soft Inner Glow */}
              <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                 <motion.div
                   animate={{ 
                     scale: [1, 1.1, 1],
                     opacity: [0.2, 0.4, 0.2]
                   }}
                   transition={{ 
                     duration: 2, 
                     repeat: Infinity,
                     ease: "easeInOut"
                   }}
                 >
                   <Activity className="w-48 h-48 text-white" />
                 </motion.div>
              </div>

              {/* Heartbeat Line (Very Slow) */}
              <svg className="absolute top-1/2 left-0 w-full h-32 opacity-10 pointer-events-none" viewBox="0 0 400 100">
                <motion.path
                  d="M0 50 L150 50 L160 30 L175 70 L185 50 L400 50"
                  fill="transparent"
                  stroke="white"
                  strokeWidth="2"
                  animate={{ x: [-400, 400] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </svg>

              {/* Premium Testimonial Card */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-12 left-8 right-8 bg-white/95 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/20"
              >
                 <div className="flex items-center space-x-6 mb-6">
                    <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center">
                      <Award className="text-amber-500 w-10 h-10" />
                    </div>
                    <div>
                       <h4 className="font-extrabold text-xl text-gray-900">NextGen Innovation</h4>
                       <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Awarded 2026 • HealthTech Expo</p>
                    </div>
                 </div>
                 <p className="text-gray-600 font-medium italic text-lg leading-relaxed">
                   "PharmaGuard AI is setting a new clinical standard for genomic interpretation, making precision medicine a reality for primary care."
                 </p>
              </motion.div>
           </motion.div>
        </div>
      </div>

      {/* Research Stats Strip */}
      <div className="bg-white border border-gray-100 rounded-[4rem] px-8 py-20 shadow-sm mb-20">
         <div className="text-center mb-16">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">The Research Behind the Platform</h2>
            <div className="w-12 h-1 bg-primary/20 mx-auto mt-4 rounded-full" />
         </div>
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 max-w-5xl mx-auto">
            <StatItem val="250+" label="Drugs Analyzed" delay={0.1} />
            <StatItem val="1.2M" label="Variant Pairs" delay={0.2} />
            <StatItem val="99.9%" label="System Accuracy" delay={0.3} />
            <StatItem val="CPIC v4" label="Guideline Set" delay={0.4} />
         </div>
      </div>
    </div>
  );
};

export default AboutPage;
