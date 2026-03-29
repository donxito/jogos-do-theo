"use client";

import { useLang } from "@/lib/LangContext";

export function LangToggle() {
  const { lang, toggleLang } = useLang();
  return (
    <button
      onClick={toggleLang}
      style={{
        background: "white",
        border: "2px solid #E8DDD0",
        borderRadius: "50px",
        padding: "clamp(5px, 1.5vw, 7px) clamp(12px, 3.5vw, 18px)",
        fontSize: "clamp(13px, 3.5vw, 15px)",
        fontWeight: "800",
        color: "#6B5744",
        cursor: "pointer",
        fontFamily: "'Nunito', sans-serif",
        display: "inline-flex",
        alignItems: "center",
        gap: "clamp(5px, 1.5vw, 8px)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "all 0.2s ease",
      }}
    >
      {lang === "pt" ? "🇵🇹" : "🇩🇰"}
      <span style={{ fontSize: "clamp(10px, 2.5vw, 12px)", opacity: 0.4 }}>→</span>
      {lang === "pt" ? "🇩🇰" : "🇵🇹"}
    </button>
  );
}
