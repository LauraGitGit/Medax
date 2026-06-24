import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translate, translatePlural } from "./translations";

const STORAGE_KEY = "medax_locale";
const DEFAULT_LOCALE = "sv";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === "en" || saved === "sv" ? saved : DEFAULT_LOCALE;
    } catch {
      return DEFAULT_LOCALE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore storage errors
    }
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (nextLocale) => {
    if (nextLocale === "en" || nextLocale === "sv") {
      setLocaleState(nextLocale);
    }
  };

  const value = useMemo(() => {
    const t = (key, vars) => translate(locale, key, vars);
    const tp = (key, count, vars) => translatePlural(locale, key, count, vars);
    return { locale, setLocale, t, tp };
  }, [locale]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within LanguageProvider");
  }
  return context;
}
