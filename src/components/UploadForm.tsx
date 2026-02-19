'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface UploadFormProps {
  onAnalyze: (file: File, drugs: string) => Promise<void>;
  isAnalyzing: boolean;
}

export default function UploadForm({ onAnalyze, isAnalyzing }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [drugs, setDrugs] = useState<string>('Codeine, Warfarin');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onAnalyze(file, drugs);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-10 rounded-3xl animate-fade-in-up shadow-2xl shadow-blue-900/5 dark:shadow-black/20">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
        <span className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-xl font-bold">1</span> 
        {t('uploadTitle')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 sm:p-12 text-center hover:bg-gray-50 dark:hover:bg-white/5 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 group cursor-pointer">
          <input
            type="file"
            accept=".vcf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="vcf-upload"
          />
          <label htmlFor="vcf-upload" className="cursor-pointer block w-full h-full">
            <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">🧬</div>
            <span className="text-lg text-gray-700 dark:text-gray-200 font-medium block mb-2">
              {file ? file.name : t('dragDrop')}
            </span>
            <p className="text-sm text-gray-400">{t('maxSize')}</p>
          </label>
        </div>

        <div className="bg-white/40 dark:bg-black/20 p-6 rounded-2xl">
           <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-3">
             <span className="flex items-center justify-center w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full text-teal-600 dark:text-teal-400 text-lg font-bold">2</span> 
             {t('drugTitle')}
           </h2>
           <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider ml-1">
             {t('drugLabel')}
           </label>
           <input
             type="text"
             value={drugs}
             onChange={(e) => setDrugs(e.target.value)}
             className="w-full p-4 rounded-xl glass-input focus:ring-4 focus:ring-blue-400/20 outline-none text-lg transition-all duration-300 placeholder:text-gray-400"
             placeholder={t('drugPlaceholder')}
           />
        </div>

        <button
          type="submit"
          disabled={!file || isAnalyzing}
          className={`w-full py-5 rounded-xl font-bold text-xl text-white shadow-lg transition-all duration-300
            ${!file || isAnalyzing 
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-70' 
              : 'bg-gradient-to-r from-blue-600 to-teal-500 hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99]'
            }`}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> {t('analyzingBtn')}
            </span>
          ) : t('analyzeBtn')}
        </button>
      </form>
    </div>
  );
}
