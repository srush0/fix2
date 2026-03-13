'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { LANGUAGES, getTranslation } from '@/lib/translations';

const LANG_STORAGE_KEY = 'fixoo_language';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) || 'en';
      setLangState(saved);
    }
  }, []);

  const setLang = useCallback((code) => {
    setLangState(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_STORAGE_KEY, code);
      window.dispatchEvent(new CustomEvent('languageChange', { detail: code }));
    }
  }, []);

  const t = useCallback(
    (key) => getTranslation(lang, key),
    [lang]
  );

  const currentLanguage = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, currentLanguage, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
