'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Lang } from './translations';

const LanguageContext = createContext<{
  lang: Lang;
  toggle: () => void;
  setLang: (l: Lang) => void;
}>({ lang: 'zh', toggle: () => {}, setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('zh');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ziwei-lang') as Lang | null;
    if (saved === 'en' || saved === 'zh') {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('ziwei-lang', l);
  };

  const toggle = () => {
    const next: Lang = lang === 'zh' ? 'en' : 'zh';
    setLang(next);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}