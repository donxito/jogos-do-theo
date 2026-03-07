"use client";

import { createContext, useContext, useState, useCallback } from "react";

type LangContextType = {
  lang: string;
  toggleLang: () => void;
};

const LangContext = createContext<LangContextType>({
  lang: "pt",
  toggleLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState("pt");
  const toggleLang = useCallback(() => setLang((l) => (l === "pt" ? "da" : "pt")), []);

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
