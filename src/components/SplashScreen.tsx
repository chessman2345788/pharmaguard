'use client';

import { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500); // Wait for fade out to complete
    }, 2500); // Display time

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900 transition-opacity duration-700 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="text-center animate-pulse">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-400 rounded-2xl mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center">
            <span className="text-5xl">🧬</span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-widest uppercase font-mono">
          Pharma<span className="text-blue-400">Guard</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm tracking-wider">Precision Medicine AI</p>
      </div>
    </div>
  );
}
