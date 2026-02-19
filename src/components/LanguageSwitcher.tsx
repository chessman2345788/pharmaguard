'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <Globe size={20} className="text-gray-600 dark:text-gray-300" />
        <span className="font-medium text-gray-700 dark:text-gray-200 uppercase">{language}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 glass-panel dark:bg-gray-800/90 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-20 animate-fade-in-up">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as any);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors
                  ${language === lang.code ? 'bg-blue-50 dark:bg-gray-700 font-bold text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}
                `}
              >
                <span className="text-lg">{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
