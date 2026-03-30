import { type ReactNode, createContext, useContext, useState } from "react";
import { Language } from "../backend";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: Language.en,
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("veritas_lang");
    if (
      stored === Language.gu ||
      stored === Language.hi ||
      stored === Language.en
    )
      return stored;
    return Language.en;
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem("veritas_lang", lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export const LANG_LABELS: Record<Language, string> = {
  [Language.en]: "EN",
  [Language.gu]: "ગુ",
  [Language.hi]: "हि",
};

export const CATEGORY_LABELS: Record<string, Record<Language, string>> = {
  gujarat: { en: "Gujarat", gu: "ગુજરાત", hi: "गुजरात" },
  india: { en: "India", gu: "ભારત", hi: "भारत" },
  world: { en: "World", gu: "વિશ્વ", hi: "विश्व" },
  politics: { en: "Politics", gu: "રાજકારણ", hi: "राजनीति" },
  sports: { en: "Sports", gu: "રમત", hi: "खेल" },
  business: { en: "Business", gu: "વ્યાપાર", hi: "व्यापार" },
  entertainment: { en: "Entertainment", gu: "મનોરંજન", hi: "मनोरंजन" },
};

export const NAV_LABELS: Record<string, Record<Language, string>> = {
  home: { en: "Home", gu: "હોમ", hi: "होम" },
  videos: { en: "Videos", gu: "વિડ્યો", hi: "वीडियो" },
  gallery: { en: "Gallery", gu: "ગેલેરી", hi: "गैलरी" },
  live: { en: "Live TV", gu: "લાઇવ", hi: "लाइव" },
  about: { en: "About", gu: "અમારા વિષે", hi: "हमारे बारे में" },
  contact: { en: "Contact", gu: "સંપર્ક", hi: "संपर्क" },
};
