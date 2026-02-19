'use client';

import { createContext, useContext, useState } from 'react';

type Language = 'en' | 'es' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    heroTitle: 'Stop Adverse Drug Reactions',
    heroSubtitle: 'Before They Happen',
    heroDesc: 'Upload your genetic data (VCF) to receive personalized pharmacogenomic risk assessments and AI-driven dosage recommendations.',
    uploadTitle: 'Upload Patient Genome',
    drugTitle: 'Enter Medications',
    analyzeBtn: 'Analyze Risk Profile',
    analyzingBtn: 'Analyzing Genome...',
    resultsTitle: 'Analysis Results',
    downloadJson: 'Download JSON',
    copyJson: 'Copy JSON',
    footer: '© 2026 PharmaGuard. Built for RIFT Hackathon.',
    docs: 'Documentation',
    dragDrop: 'Click to Upload VCF File',
    maxSize: 'Max size: 5MB',
    drugPlaceholder: 'e.g. Codeine, Warfarin, Clopidogrel',
    drugLabel: 'Drug Names (comma separated)',
  },
  es: {
    heroTitle: 'Detenga las Reacciones Adversas',
    heroSubtitle: 'Antes de que Ocurran',
    heroDesc: 'Suba sus datos genéticos (VCF) para recibir evaluaciones de riesgo farmacogenómico personalizadas y recomendaciones de dosis impulsadas por IA.',
    uploadTitle: 'Subir Genoma del Paciente',
    drugTitle: 'Ingresar Medicamentos',
    analyzeBtn: 'Analizar Perfil de Riesgo',
    analyzingBtn: 'Analizando Genoma...',
    resultsTitle: 'Resultados del Análisis',
    downloadJson: 'Descargar JSON',
    copyJson: 'Copiar JSON',
    footer: '© 2026 PharmaGuard. Construido para RIFT Hackathon.',
    docs: 'Documentación',
    dragDrop: 'Haga clic para subir archivo VCF',
    maxSize: 'Tamaño máx: 5MB',
    drugPlaceholder: 'ej. Codeína, Varfarina, Clopidogrel',
    drugLabel: 'Nombres de Medicamentos (separados por comas)',
  },
  hi: {
    heroTitle: 'प्रतिकूल दवा प्रतिक्रियाओं को रोकें',
    heroSubtitle: 'उनके होने से पहले',
    heroDesc: 'व्यक्तिगत फार्माकोजीनोमिक जोखिम मूल्यांकन और एआई-संचालित खुराक सिफारिशें प्राप्त करने के लिए अपना आनुवंशिक डेटा (VCF) अपलोड करें।',
    uploadTitle: 'रोगी जीनोम अपलोड करें',
    drugTitle: 'दवाएं दर्ज करें',
    analyzeBtn: 'जोखिम प्रोफ़ाइल का विश्लेषण करें',
    analyzingBtn: 'जीनोम का विश्लेषण कर रहा है...',
    resultsTitle: 'विश्लेषण परिणाम',
    downloadJson: 'JSON डाउनलोड करें',
    copyJson: 'JSON कॉपी करें',
    footer: '© 2026 PharmaGuard. RIFT हैकथॉन के लिए बनाया गया।',
    docs: 'दस्तावेज़ीकरण',
    dragDrop: 'VCF फ़ाइल अपलोड करने के लिए क्लिक करें',
    maxSize: 'अधिकतम आकार: 5MB',
    drugPlaceholder: 'जैसे कोडीन, वारफारिन',
    drugLabel: 'दवाओं के नाम (अल्पविराम से अलग)',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
