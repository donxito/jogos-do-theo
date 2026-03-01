"use client";

import { useState } from "react";
import { animals, type Animal } from "@/lib/animals";
import AnimalCard from "./animalCard";
import Stars from "./stars";

export default function TheoAnimalGame() {
  const [lang, setLang] = useState("pt");
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

  const toggleLang = () => {
    setLang((l) => (l === "pt" ? "da" : "pt"));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #FFF9F0 0%, #FFF0E6 50%, #F0F4FF 100%)",
        fontFamily: "'Nunito', sans-serif",
        padding: "16px",
        paddingBottom: "100px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes starPop {
          0% { transform: scale(0) rotate(-20deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes celebrationBg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          75% { transform: translateY(-10px) rotate(-3deg); }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(24px, 6vw, 36px)",
            fontWeight: "900",
            color: "#4A3728",
            margin: "0 0 4px 0",
            letterSpacing: "-0.5px",
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

        {/* Language toggle */}
        <button
          onClick={toggleLang}
          style={{
            background: "white",
            border: "2px solid #E8DDD0",
            borderRadius: "50px",
            padding: "8px 20px",
            fontSize: "15px",
            fontWeight: "800",
            color: "#6B5744",
            cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            transition: "all 0.2s ease",
          }}
        >
          {lang === "pt" ? "🇵🇹" : "🇩🇰"}
          <span style={{ fontSize: "13px", opacity: 0.5 }}>→</span>
          {lang === "pt" ? "🇩🇰" : "🇵🇹"}
        </button>
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
          <div
            style={{
              fontSize: "80px",
              animation: "bounce 0.8s ease infinite",
            }}
          >
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
          <button
            onClick={resetGame}
            style={{
              marginTop: "24px",
              background: "#FFE4A5",
              border: "3px solid #FFD060",
              borderRadius: "50px",
              padding: "14px 36px",
              fontSize: "18px",
              fontWeight: "800",
              color: "#6B5744",
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
              boxShadow: "0 4px 15px rgba(255,208,96,0.4)",
              transition: "transform 0.2s ease",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.95)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {lang === "pt" ? "🔄 Jogar de novo!" : "🔄 Spil igen!"}
          </button>

          {/* Hidden message for Papi */}
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
