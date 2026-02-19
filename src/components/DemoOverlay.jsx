import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert } from 'lucide-react';
import { useStore } from '../store/useStore';

const DemoOverlay = () => {
  const { isDemoMode } = useStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isDemoMode) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 7000); // 7 seconds to give more reading time for a 5s fade requirement
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isDemoMode]);

  return (
    <AnimatePresence>
      {isDemoMode && isVisible && (
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95 }}
           className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-4"
        >
           <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden group">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] -mr-16 -mt-16 animate-pulse" />
              
              <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                 <X className="w-4 h-4 text-white/50" />
              </button>

              <div className="flex items-start space-x-6 relative z-10">
                 <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 flex-shrink-0">
                    <ShieldAlert className="w-7 h-7 text-primary" />
                 </div>
                 <div className="space-y-3">
                    <h4 className="text-xl font-black tracking-tight leading-tight">The Problem & Our Solution</h4>
                    <p className="text-sm text-gray-400 font-medium leading-relaxed">
                       "Adverse drug reactions cause <span className="text-white font-bold">preventable deaths</span>. 
                       PharmaGuard AI analyzes genetic variants to predict drug risks."
                    </p>
                    <div className="pt-2 flex items-center space-x-3">
                       <span className="h-1 w-12 bg-primary rounded-full" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Demo Active</span>
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoOverlay;
