'use client';

interface RiskResult {
  drug: string;
  gene: string;
  phenotype: string;
  risk: string;
  recommendation: string;
  severity: string;
  llm_explanation: {
    summary: string;
    mechanism: string;
    citation: string;
  };
}

import { useLanguage } from '@/context/LanguageContext';

interface ResultsDisplayProps {
  results: any; // Full JSON response
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const { t } = useLanguage();
  if (!results) return null;

  const riskColor = (severity: string) => {
    // ... no change needed
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      default: return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
    }
  };

  const downloadJson = () => {
    // ...
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `pharmaguard_report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(results, null, 2));
    alert('JSON copied to clipboard!');
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center">
         <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('resultsTitle')}</h2>
         <div className="space-x-4">
           <button 
             onClick={copyToClipboard}
             className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-colors"
           >
             {t('copyJson')}
           </button>
           <button 
             onClick={downloadJson}
             className="px-4 py-2 bg-gray-800 dark:bg-blue-600 text-white rounded hover:bg-gray-700 dark:hover:bg-blue-700 text-sm font-medium transition-colors"
           >
             {t('downloadJson')}
           </button>
         </div>
      </div>

      <div className="grid gap-6">
        {results.results.map((item: RiskResult, idx: number) => (
          <div key={idx} className="glass-panel rounded-xl border-l-8 border-l-transparent overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1"
               style={{ borderLeftColor: item.severity === 'critical' ? '#ef4444' : item.severity === 'high' ? '#f97316' : item.severity === 'moderate' ? '#eab308' : '#22c55e' }}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{item.drug}</h3>
                  <p className="text-gray-500 text-sm">Gene: <span className="font-mono bg-gray-100 px-1 rounded">{item.gene}</span> • Phenotype: {item.phenotype}</p>
                </div>
                <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${riskColor(item.severity)}`}>
                  {item.risk}
                </span>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-blue-900 font-medium">⚕️ Recommendation</p>
                <p className="text-blue-800">{item.recommendation}</p>
              </div>

               <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">AI Explanation</p>
                  <p className="text-gray-700 italic">"{item.llm_explanation.summary}"</p>
                  <p className="text-gray-600 text-sm mt-1">{item.llm_explanation.mechanism}</p>
               </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-900 text-gray-300 p-6 rounded-xl font-mono text-xs overflow-x-auto">
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </div>
    </div>
  );
}
