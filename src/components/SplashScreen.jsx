import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000); // Allow time for exit animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.1, 1],
              opacity: 1,
            }}
            transition={{ 
              duration: 1.5, 
              ease: "easeOut",
              times: [0, 0.7, 1]
            }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                filter: ["drop-shadow(0 0 0px rgba(22, 163, 74, 0))", "drop-shadow(0 0 20px rgba(22, 163, 74, 0.4))", "drop-shadow(0 0 0px rgba(22, 163, 74, 0))"] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl mb-8"
            >
              <Activity className="text-white w-12 h-12" />
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl font-black text-gray-900 tracking-tight"
            >
              PharmaGuard <span className="text-primary">AI</span>
            </motion.h1>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ delay: 1.2, duration: 2, ease: "easeInOut" }}
              className="h-0.5 bg-primary/20 mt-6 overflow-hidden relative"
            >
              <motion.div
                animate={{ 
                  left: ["-100%", "100%"] 
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute top-0 bottom-0 w-1/2 bg-primary"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-gray-400 text-sm mt-4 uppercase tracking-[0.3em] font-medium"
            >
              Precision Medicine Dashboard
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
            className="absolute bottom-20 text-gray-300 text-xs font-bold uppercase tracking-widest flex items-center space-x-2"
          >
             <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
             <span>Initializing Neural Pathways</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
