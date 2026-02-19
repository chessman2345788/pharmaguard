'use client';

import { useState } from 'react';
import UploadForm from '@/components/UploadForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import SplashScreen from '@/components/SplashScreen';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [results, setResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const handleAnalyze = async (file: File, drugs: string) => {
    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('drugs', drugs);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] pb-20 transition-colors duration-300 overflow-x-hidden">
      {/* Header */}
      <header className="glass-panel sticky top-4 mx-4 md:mx-auto max-w-6xl mt-4 rounded-2xl z-20 shadow-lg shadow-black/5 dark:shadow-black/20">
        <div className="px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">P</div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight hidden sm:block">PharmaGuard</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
             <LanguageSwitcher />
             <ThemeToggle />
             <a href="#" className="hidden md:block text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-white/5 transition-colors">
               {t('docs')}
             </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-16 space-y-12 sm:space-y-20">
        <div className="text-center space-y-6 pt-4 sm:pt-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold tracking-wide uppercase mb-2 animate-scale-in">
             <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
             AI-Powered Precision Medicine
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1] drop-shadow-sm">
            {t('heroTitle')} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-400 dark:from-blue-400 dark:via-teal-300 dark:to-emerald-300 pb-2">
              {t('heroSubtitle')}
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
            {t('heroDesc')}
          </p>
        </div>

        <UploadForm onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <ResultsDisplay results={results} />
      </main>

      <footer className="bg-white/50 dark:bg-black/20 border-t border-gray-200 dark:border-gray-800 mt-20 py-12 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>{t('footer')}</p>
        </div>
      </footer>
    </div>
  );
}
