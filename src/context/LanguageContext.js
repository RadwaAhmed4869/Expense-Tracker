import React, { createContext, useContext, useEffect, useState } from "react";

import { translations, interpolate } from "../i18n/translations";

const STORAGE_KEY = "expense-tracker:language";
const LanguageContext = createContext(null);

const loadLanguage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "ar" || saved === "en" ? saved : "en";
  } catch {
    return "en";
  }
};

export const LanguageProvider = (props) => {
  const [language, setLanguage] = useState(loadLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore storage failures (e.g. private browsing quota)
    }
  }, [language]);

  const toggleLanguage = () => setLanguage((prev) => (prev === "en" ? "ar" : "en"));

  const t = (key, params) => interpolate(translations[language][key] ?? key, params);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {props.children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
