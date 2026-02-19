import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingChatbot from '../components/FloatingChatbot';
import SplashScreen from '../components/SplashScreen';

const MainLayout = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <SplashScreen onComplete={() => setShowSplash(false)} />
      <div 
        className={`min-h-screen medical-gradient overflow-x-hidden transition-opacity duration-1000 ${
          showSplash ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'
        }`}
      >
        <Navbar />
        <main className="pt-20">
          <Outlet />
        </main>
        <Footer />
        <FloatingChatbot />
      </div>
    </>
  );
};

export default MainLayout;
