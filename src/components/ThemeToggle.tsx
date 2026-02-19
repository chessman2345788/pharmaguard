'use client';

import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
       <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-lg transition-all duration-300 ease-in-out
        ${theme === 'dark' 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 hover:rotate-12' 
          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:-rotate-12'
        }
      `}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
