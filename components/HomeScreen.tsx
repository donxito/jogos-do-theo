"use client";

import Link from "next/link";
import { GAMES } from "@/lib/gameRegistry";
import { useLang } from "@/lib/LangContext";
import { LangToggle } from "./LangToggle";

export function HomeScreen() {
  const { lang } = useLang();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(170deg, #FFFBF0 0%, #FFF0E8 35%, #E8F4FF 70%, #F0FFF4 100%)",
        fontFamily: "'Nunito', sans-serif",
        padding: "24px 16px 100px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating background decorations */}
      {["🌟", "🎈", "🌈", "☁️", "🦋", "🎵"].map((emoji, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            fontSize: `${18 + (i % 3) * 8}px`,
            opacity: 0.12,
            left: `${10 + (i * 16) % 80}%`,
            top: `${15 + (i * 23) % 60}%`,
            animation: `homeFloat ${4 + i * 0.7}s ${i * 0.5}s ease-in-out infinite alternate`,
            pointerEvents: "none",
          }}
        >
          {emoji}
        </div>
      ))}

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "12px", position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontSize: "52px",
            marginBottom: "4px",
            animation: "bounce 2s ease-in-out infinite",
          }}
        >
          🎮
        </div>
        <h1
          style={{
            fontSize: "clamp(28px, 7vw, 42px)",
            fontWeight: "900",
            color: "#3D2C1E",
            margin: "0",
            letterSpacing: "-0.5px",
            lineHeight: 1.1,
          }}
        >
          {lang === "pt" ? "Jogos do Theo" : "Theos Spil"}
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "#9B8D7E",
            margin: "6px 0 16px",
            fontWeight: "700",
          }}
        >
          {lang === "pt" ? "Escolhe um jogo para brincar!" : "Vælg et spil at lege med!"}
        </p>
        <LangToggle />
      </div>

      {/* Game Cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "400px",
          margin: "28px auto 0",
          position: "relative",
          zIndex: 1,
        }}
      >
        {GAMES.map((game, i) => {
          const info = lang === "pt" ? game.pt : game.da;
          return (
            <Link
              key={game.id}
              href={game.route}
              style={{
                background: game.bg,
                borderRadius: "24px",
                padding: "24px 20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "18px",
                boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                animation: `cardSlideIn 0.5s ${i * 0.12}s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
                position: "relative",
                overflow: "hidden",
                userSelect: "none",
                WebkitTapHighlightColor: "transparent",
                textDecoration: "none",
                color: "inherit",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {/* Decorative circle */}
              <div
                style={{
                  position: "absolute",
                  right: "-20px",
                  top: "-20px",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                }}
              />

              {/* Emoji */}
              <div
                style={{
                  fontSize: "52px",
                  lineHeight: 1,
                  flexShrink: 0,
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                }}
              >
                {game.emoji}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "clamp(20px, 5vw, 26px)",
                    fontWeight: "900",
                    color: game.color,
                    lineHeight: 1.1,
                    marginBottom: "4px",
                  }}
                >
                  {info.name}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: `${game.color}bb`,
                    fontWeight: "700",
                  }}
                >
                  {info.desc}
                </div>
              </div>

              {/* Arrow */}
              <div
                style={{
                  fontSize: "22px",
                  color: `${game.color}66`,
                  fontWeight: "900",
                  flexShrink: 0,
                }}
              >
                →
              </div>
            </Link>
          );
        })}
      </div>

      {/* Coming soon placeholder */}
      <div
        style={{
          maxWidth: "400px",
          margin: "16px auto 0",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            border: "2px dashed #D5C9BB",
            borderRadius: "24px",
            padding: "20px",
            color: "#B5A89A",
            fontWeight: "700",
            fontSize: "15px",
            animation: `cardSlideIn 0.5s ${GAMES.length * 0.12}s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
          }}
        >
          <span style={{ fontSize: "28px", display: "block", marginBottom: "4px" }}>🔜</span>
          {lang === "pt" ? "Mais jogos em breve!" : "Flere spil kommer snart!"}
        </div>
      </div>

      {/* Papi footer */}
      <p
        style={{
          textAlign: "center",
          marginTop: "36px",
          fontSize: "12px",
          color: "#C4B5A0",
          fontWeight: "600",
          fontStyle: "italic",
          position: "relative",
          zIndex: 1,
        }}
      >
        Feito com amor pelo Papi 💛
      </p>
    </div>
  );
}
