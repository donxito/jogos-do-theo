"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { animals, type Animal } from "@/lib/animals";
import { useLang } from "@/lib/LangContext";
import { BackButton } from "@/components/layout/BackButton";
import { LangToggle } from "@/components/layout/LangToggle";
import Stars from "@/components/ui/Stars";
import MemoryCard, {
  type MemoryCardData,
} from "@/components/games/memory/MemoryCard";
import {
  playFlipSound,
  playMatchSound,
  playMismatchSound,
  playLevelCompleteSound,
} from "@/components/games/memory/playMemorySound";

const LEVELS = [
  { pairs: 2, columns: 2 },
  { pairs: 3, columns: 3 },
  { pairs: 4, columns: 4 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(level: number): MemoryCardData[] {
  const { pairs } = LEVELS[level];
  const picked: Animal[] = shuffle(animals).slice(0, pairs);
  const deck: MemoryCardData[] = [];
  picked.forEach((animal) => {
    deck.push({ uid: `${animal.id}-a`, animal });
    deck.push({ uid: `${animal.id}-b`, animal });
  });
  return shuffle(deck);
}

export function MemoryGame() {
  const { lang } = useLang();
  const [level, setLevel] = useState(0);
  const [deck, setDeck] = useState<MemoryCardData[]>(() => buildDeck(0));
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [lockBoard, setLockBoard] = useState(false);
  const [celebration, setCelebration] = useState(false);

  const mismatchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const celebrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const totalPairs = LEVELS[level].pairs;
  const matchedPairs = matched.size / 2;
  const isFinalLevel = level === LEVELS.length - 1;

  const columns = LEVELS[level].columns;

  const startLevel = useCallback((nextLevel: number) => {
    setLevel(nextLevel);
    setDeck(buildDeck(nextLevel));
    setFlipped([]);
    setMatched(new Set());
    setLockBoard(false);
    setCelebration(false);
  }, []);

  const handleTap = useCallback(
    (card: MemoryCardData) => {
      if (lockBoard) return;
      if (matched.has(card.animal.id)) return;
      if (flipped.includes(card.uid)) return;
      if (flipped.length >= 2) return;

      playFlipSound();
      const next = [...flipped, card.uid];
      setFlipped(next);

      if (next.length === 2) {
        const [aUid, bUid] = next;
        const a = deck.find((c) => c.uid === aUid);
        const b = deck.find((c) => c.uid === bUid);
        if (a && b && a.animal.id === b.animal.id) {
          setLockBoard(true);
          setTimeout(() => {
            setMatched((prev) => {
              const merged = new Set(prev);
              merged.add(a.animal.id);
              return merged;
            });
            setFlipped([]);
            setLockBoard(false);
            playMatchSound();
          }, 380);
        } else {
          setLockBoard(true);
          setTimeout(() => playMismatchSound(), 420);
          mismatchTimerRef.current = setTimeout(() => {
            setFlipped([]);
            setLockBoard(false);
          }, 950);
        }
      }
    },
    [deck, flipped, lockBoard, matched],
  );

  useEffect(() => {
    if (matched.size > 0 && matched.size === totalPairs && !celebration) {
      celebrationTimerRef.current = setTimeout(() => {
        setCelebration(true);
        playLevelCompleteSound();
      }, 500);
    }
  }, [matched, totalPairs, celebration]);

  useEffect(() => {
    return () => {
      if (mismatchTimerRef.current) clearTimeout(mismatchTimerRef.current);
      if (celebrationTimerRef.current)
        clearTimeout(celebrationTimerRef.current);
    };
  }, []);

  const playAgain = () => startLevel(level);
  const nextLevel = () => startLevel(level + 1);
  const restartFromStart = () => startLevel(0);

  const gridStyle = useMemo<React.CSSProperties>(
    () => ({
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: "clamp(8px, 2.5vw, 14px)",
      maxWidth: columns >= 4 ? "440px" : "360px",
      margin: "0 auto",
      width: "100%",
    }),
    [columns],
  );

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "linear-gradient(180deg, #F3EEFB 0%, #EAF6F8 45%, #FFF5EC 100%)",
        fontFamily: "'Nunito', sans-serif",
        padding: "clamp(10px, 2.5vw, 16px)",
        paddingTop: "clamp(48px, 8vw, 60px)",
        paddingBottom: "clamp(24px, 6vw, 60px)",
      }}
    >
      <BackButton />

      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "clamp(8px, 2.5vw, 16px)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(20px, 5.5vw, 36px)",
            fontWeight: "900",
            color: "#4A3728",
            margin: "0 0 2px 0",
          }}
        >
          {lang === "pt"
            ? "🧠 Memória do Theo 🧠"
            : "🧠 Theos Hukommelse 🧠"}
        </h1>
        <p
          style={{
            fontSize: "clamp(12px, 3.2vw, 14px)",
            color: "#8B7355",
            margin: "0 0 clamp(6px, 2vw, 12px) 0",
            fontWeight: "600",
          }}
        >
          {lang === "pt"
            ? "Encontra os pares!"
            : "Find parrene!"}
        </p>
        <LangToggle />
      </div>

      {/* Level pills */}
      <div
        style={{
          display: "flex",
          gap: "clamp(4px, 1.5vw, 8px)",
          justifyContent: "center",
          marginBottom: "clamp(8px, 2vw, 14px)",
          flexWrap: "wrap",
        }}
      >
        {LEVELS.map((lvl, i) => {
          const active = i === level;
          const cleared = i < level;
          return (
            <div
              key={i}
              style={{
                background: active
                  ? "#FFE4A5"
                  : cleared
                    ? "#D6F0D6"
                    : "white",
                border: active
                  ? "2px solid #FFD060"
                  : cleared
                    ? "2px solid #A8D8A8"
                    : "2px solid #E8DDD0",
                borderRadius: "50px",
                padding: "clamp(4px, 1vw, 6px) clamp(10px, 3vw, 14px)",
                fontSize: "clamp(11px, 3vw, 13px)",
                fontWeight: "800",
                color: "#6B5744",
                boxShadow: active
                  ? "0 2px 10px rgba(255,208,96,0.4)"
                  : "0 2px 6px rgba(0,0,0,0.04)",
                fontFamily: "'Nunito', sans-serif",
                display: "inline-flex",
                alignItems: "center",
                gap: "clamp(4px, 1vw, 6px)",
              }}
            >
              <span>{cleared ? "✅" : active ? "🎯" : "🔒"}</span>
              <span>
                {lvl.pairs * 2} {lang === "pt" ? "cartas" : "kort"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stars / progress */}
      <div style={{ marginBottom: "clamp(8px, 2.5vw, 16px)" }}>
        <Stars count={matchedPairs} />
        <p
          style={{
            fontSize: "clamp(11px, 3vw, 13px)",
            color: "#8B7355",
            fontWeight: "700",
            margin: "4px 0 0",
            textAlign: "center",
          }}
        >
          {matchedPairs} / {totalPairs} {lang === "pt" ? "pares" : "par"}
        </p>
      </div>

      {/* Card grid */}
      <div style={gridStyle}>
        {deck.map((card) => (
          <MemoryCard
            key={card.uid}
            card={card}
            flipped={flipped.includes(card.uid)}
            matched={matched.has(card.animal.id)}
            disabled={lockBoard}
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
            padding: "clamp(16px, 4vw, 32px)",
          }}
        >
          <div
            style={{
              fontSize: "clamp(48px, 12vw, 80px)",
              animation: "bounce 0.8s ease infinite",
            }}
          >
            {isFinalLevel ? "🏆" : "🎉"}
          </div>
          <h2
            style={{
              fontSize: "clamp(24px, 6vw, 42px)",
              fontWeight: "900",
              color: "#4A3728",
              margin: "clamp(8px, 2vw, 16px) 0 clamp(4px, 1vw, 8px)",
              textAlign: "center",
            }}
          >
            {lang === "pt" ? "Parabéns, Theo!" : "Godt klaret, Theo!"}
          </h2>
          <p
            style={{
              fontSize: "clamp(14px, 4vw, 18px)",
              color: "#8B7355",
              fontWeight: "700",
              margin: "0 0 clamp(4px, 1vw, 8px)",
              textAlign: "center",
            }}
          >
            {isFinalLevel
              ? lang === "pt"
                ? "Encontraste todos os pares!"
                : "Du fandt alle parrene!"
              : lang === "pt"
                ? "Boa memória!"
                : "God hukommelse!"}
          </p>
          <Stars count={totalPairs} />

          <div
            style={{
              display: "flex",
              gap: "clamp(8px, 2vw, 12px)",
              marginTop: "clamp(16px, 4vw, 24px)",
              flexWrap: "wrap",
              justifyContent: "center",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            {!isFinalLevel ? (
              <button
                onClick={nextLevel}
                style={{
                  background: "#C7B8E8",
                  border: "3px solid #A88FD3",
                  borderRadius: "50px",
                  padding:
                    "clamp(10px, 2.5vw, 14px) clamp(20px, 5vw, 28px)",
                  fontSize: "clamp(14px, 3.8vw, 17px)",
                  fontWeight: "800",
                  color: "#3D2C5C",
                  cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif",
                  boxShadow: "0 4px 15px rgba(168,143,211,0.45)",
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.95)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {lang === "pt" ? "🚀 Próximo nível!" : "🚀 Næste niveau!"}
              </button>
            ) : (
              <button
                onClick={restartFromStart}
                style={{
                  background: "#FFE4A5",
                  border: "3px solid #FFD060",
                  borderRadius: "50px",
                  padding:
                    "clamp(10px, 2.5vw, 14px) clamp(20px, 5vw, 28px)",
                  fontSize: "clamp(14px, 3.8vw, 17px)",
                  fontWeight: "800",
                  color: "#6B5744",
                  cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif",
                  boxShadow: "0 4px 15px rgba(255,208,96,0.4)",
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.95)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {lang === "pt" ? "🔄 Recomeçar!" : "🔄 Start forfra!"}
              </button>
            )}

            <button
              onClick={playAgain}
              style={{
                background: "white",
                border: "2px solid #E8DDD0",
                borderRadius: "50px",
                padding: "clamp(10px, 2.5vw, 14px) clamp(20px, 5vw, 28px)",
                fontSize: "clamp(14px, 3.8vw, 17px)",
                fontWeight: "800",
                color: "#6B5744",
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.95)")
              }
              onMouseUp={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {lang === "pt" ? "🔁 Outra vez" : "🔁 Igen"}
            </button>

            <Link
              href="/"
              style={{
                background: "white",
                border: "2px solid #E8DDD0",
                borderRadius: "50px",
                padding: "clamp(10px, 2.5vw, 14px) clamp(20px, 5vw, 28px)",
                fontSize: "clamp(14px, 3.8vw, 17px)",
                fontWeight: "800",
                color: "#6B5744",
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {lang === "pt" ? "🏠 Menu" : "🏠 Menu"}
            </Link>
          </div>

          <p
            style={{
              marginTop: "clamp(16px, 4vw, 32px)",
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
