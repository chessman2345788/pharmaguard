import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingChatbot from '../components/FloatingChatbot';
import SplashScreen from '../components/SplashScreen';
import DemoOverlay from '../components/DemoOverlay';

const MainLayout = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>
      
      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Navbar />
          <DemoOverlay />
          <main className="pt-20">
            <Outlet />
          </main>
          <Footer />
          <FloatingChatbot />
        </motion.div>
      )}
    </div>
  );
};

export default MainLayout;
