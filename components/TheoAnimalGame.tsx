"use client";

import { useState } from "react";
import Link from "next/link";
import { animals, type Animal } from "@/lib/animals";
import { useLang } from "@/lib/LangContext";
import AnimalCard from "./animalCard";
import Stars from "./stars";
import { BackButton } from "./BackButton";
import { LangToggle } from "./LangToggle";

export function AnimalGame() {
  const { lang } = useLang();
  const [tappedAnimals, setTappedAnimals] = useState<Set<string>>(new Set());
  const [celebration, setCelebration] = useState(false);

  const handleTap = (animal: Animal) => {
    setTappedAnimals((prev) => {
      const next = new Set(prev);
      next.add(animal.id);
      if (next.size === animals.length && !celebration) {
        setCelebration(true);
      }
      return next;
    });
  };

  const resetGame = () => {
    setTappedAnimals(new Set());
    setCelebration(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #FFF9F0 0%, #FFF0E6 50%, #F0F4FF 100%)",
        fontFamily: "'Nunito', sans-serif",
        padding: "16px",
        paddingTop: "60px",
        paddingBottom: "100px",
      }}
    >
      <BackButton />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1
          style={{
            fontSize: "clamp(24px, 6vw, 36px)",
            fontWeight: "900",
            color: "#4A3728",
            margin: "0 0 4px 0",
          }}
        >
          {lang === "pt" ? "🌟 Animais do Theo 🌟" : "🌟 Theos Dyr 🌟"}
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#8B7355",
            margin: "0 0 12px 0",
            fontWeight: "600",
          }}
        >
          {lang === "pt" ? "Toca nos animais!" : "Tryk på dyrene!"}
        </p>
        <LangToggle />
      </div>

      {/* Stars progress */}
      <div style={{ marginBottom: "16px" }}>
        <Stars count={tappedAnimals.size} />
      </div>

      {/* Animal grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          maxWidth: "420px",
          margin: "0 auto",
        }}
      >
        {animals.map((animal) => (
          <AnimalCard
            key={animal.id}
            animal={animal}
            lang={lang}
            onTap={handleTap}
          />
        ))}
      </div>

      {/* Celebration overlay */}
      {celebration && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.92)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            animation: "popIn 0.4s ease",
          }}
        >
          <div style={{ fontSize: "80px", animation: "bounce 0.8s ease infinite" }}>
            🎉
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 7vw, 42px)",
              fontWeight: "900",
              color: "#4A3728",
              margin: "16px 0 8px",
              textAlign: "center",
            }}
          >
            {lang === "pt" ? "Parabéns, Theo!" : "Godt klaret, Theo!"}
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "#8B7355",
              fontWeight: "700",
              margin: "0 0 8px",
            }}
          >
            {lang === "pt"
              ? "Encontraste todos os animais!"
              : "Du fandt alle dyrene!"}
          </p>
          <Stars count={animals.length} />
          <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={resetGame}
              style={{
                background: "#FFE4A5",
                border: "3px solid #FFD060",
                borderRadius: "50px",
                padding: "14px 28px",
                fontSize: "17px",
                fontWeight: "800",
                color: "#6B5744",
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                boxShadow: "0 4px 15px rgba(255,208,96,0.4)",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {lang === "pt" ? "🔄 Jogar de novo!" : "🔄 Spil igen!"}
            </button>
            <Link
              href="/"
              style={{
                background: "white",
                border: "2px solid #E8DDD0",
                borderRadius: "50px",
                padding: "14px 28px",
                fontSize: "17px",
                fontWeight: "800",
                color: "#6B5744",
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {lang === "pt" ? "🏠 Menu" : "🏠 Menu"}
            </Link>
          </div>
          <p
            style={{
              marginTop: "32px",
              fontSize: "12px",
              color: "#C4B5A0",
              fontWeight: "600",
              fontStyle: "italic",
            }}
          >
            Feito com amor pelo Papi 💛
          </p>
        </div>
      )}
    </div>
  );
}
