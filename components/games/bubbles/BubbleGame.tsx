"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLang } from "@/lib/LangContext";
import Stars from "@/components/ui/Stars";
import { BackButton } from "@/components/layout/BackButton";
import { LangToggle } from "@/components/layout/LangToggle";
import Link from "next/link";

// ── Content packs: animals first, numbers & letters unlock ──────────────
const CONTENT_PACKS = [
  {
    id: "animals",
    pt: "Animais",
    da: "Dyr",
    icon: "🐾",
    items: [
      { display: "🐄", pt: "Vaca", da: "Ko", color: "#2D5016", bg: "#A8E6CF" },
      { display: "🐕", pt: "Cachorro", da: "Hund", color: "#8B4513", bg: "#FFD3B6" },
      { display: "🐱", pt: "Gato", da: "Kat", color: "#8B2252", bg: "#FFAAA5" },
      { display: "🦆", pt: "Pato", da: "And", color: "#8B7500", bg: "#FFF6A5" },
      { display: "🐷", pt: "Porco", da: "Gris", color: "#8B3A62", bg: "#FFB7C5" },
      { display: "🦁", pt: "Leão", da: "Løve", color: "#8B6914", bg: "#FFE4A5" },
      { display: "🐸", pt: "Sapo", da: "Frø", color: "#2E8B57", bg: "#B5EAD7" },
      { display: "🐦", pt: "Pássaro", da: "Fugl", color: "#3A4A8B", bg: "#C7CEEA" },
      { display: "🐴", pt: "Cavalo", da: "Hest", color: "#6B4226", bg: "#E8D5B7" },
    ],
  },
  {
    id: "numbers",
    pt: "Números",
    da: "Tal",
    icon: "🔢",
    items: [
      { display: "1", pt: "Um", da: "En", color: "#C62828", bg: "#FFCDD2" },
      { display: "2", pt: "Dois", da: "To", color: "#AD1457", bg: "#F8BBD0" },
      { display: "3", pt: "Três", da: "Tre", color: "#6A1B9A", bg: "#E1BEE7" },
      { display: "4", pt: "Quatro", da: "Fire", color: "#283593", bg: "#C5CAE9" },
      { display: "5", pt: "Cinco", da: "Fem", color: "#00695C", bg: "#B2DFDB" },
    ],
  },
  {
    id: "letters",
    pt: "Letras",
    da: "Bogstaver",
    icon: "🔤",
    items: [
      { display: "A", pt: "A de Abelha", da: "A for Abe", color: "#E65100", bg: "#FFE0B2" },
      { display: "B", pt: "B de Bola", da: "B for Bold", color: "#2E7D32", bg: "#C8E6C9" },
      { display: "C", pt: "C de Casa", da: "C for Citron", color: "#1565C0", bg: "#BBDEFB" },
      { display: "D", pt: "D de Dado", da: "D for Drage", color: "#6A1B9A", bg: "#E1BEE7" },
      { display: "E", pt: "E de Elefante", da: "E for Elefant", color: "#C62828", bg: "#FFCDD2" },
    ],
  },
];

type ContentItem = {
  display: string;
  pt: string;
  da: string;
  color: string;
  bg: string;
};

type BubbleData = {
  id: number;
  item: ContentItem;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  wobbleSpeed: number;
  wobbleDelay: number;
};

const BUBBLE_COLORS = [
  "rgba(168, 230, 207, 0.85)",
  "rgba(255, 211, 182, 0.85)",
  "rgba(255, 170, 165, 0.85)",
  "rgba(255, 246, 165, 0.85)",
  "rgba(255, 183, 197, 0.85)",
  "rgba(181, 234, 215, 0.85)",
  "rgba(199, 206, 234, 0.85)",
  "rgba(255, 228, 165, 0.85)",
];

// ── Pop sound via Web Audio API ──────────────────────────────────────────
function playPopSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(600, now);
    osc1.frequency.exponentialRampToValueAtTime(200, now + 0.08);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.1);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1200, now + 0.02);
    osc2.frequency.exponentialRampToValueAtTime(800, now + 0.12);
    gain2.gain.setValueAtTime(0.1, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.02);
    osc2.stop(now + 0.12);
  } catch {
    // Audio not supported
  }
}

function playUnlockSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = ctx.currentTime;
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.3);
    });
  } catch {
    // Audio not supported
  }
}

function playCelebrationSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = ctx.currentTime;
    const melody = [523, 587, 659, 784, 659, 784, 1047];
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.25);
    });
  } catch {
    // Audio not supported
  }
}

// ── Bubble component ─────────────────────────────────────────────────────
function Bubble({ bubble, onPop, lang }: { bubble: BubbleData; onPop: (id: number) => void; lang: string }) {
  const [popping, setPopping] = useState(false);
  const isEmoji = /\p{Emoji}/u.test(bubble.item.display) && bubble.item.display.length > 1;

  const handlePop = () => {
    if (popping) return;
    setPopping(true);
    playPopSound();
    onPop(bubble.id);
  };

  const label = lang === "pt" ? bubble.item.pt : bubble.item.da;

  return (
    <div
      onClick={handlePop}
      style={{
        position: "absolute",
        left: `${bubble.x}%`,
        bottom: `${bubble.y}%`,
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
        borderRadius: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.6), ${bubble.color} 70%)`,
        boxShadow: `0 4px 20px ${bubble.color}, inset 0 -4px 8px rgba(0,0,0,0.05), inset 0 4px 8px rgba(255,255,255,0.5)`,
        border: "2px solid rgba(255,255,255,0.4)",
        transform: popping ? "scale(1.4)" : "scale(1)",
        opacity: popping ? 0 : 1,
        transition: popping
          ? "transform 0.25s ease-out, opacity 0.25s ease-out"
          : "none",
        animation: popping
          ? "none"
          : `bubbleFloatUp ${bubble.speed}s linear forwards, bubbleWobble ${bubble.wobbleSpeed}s ease-in-out infinite`,
        animationDelay: popping ? "0s" : `0s, ${bubble.wobbleDelay}s`,
        zIndex: popping ? 10 : 1,
      }}
    >
      {/* Shine highlight */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "20%",
          width: "30%",
          height: "20%",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.5)",
          transform: "rotate(-30deg)",
        }}
      />

      {/* Content */}
      <div
        style={{
          fontSize: isEmoji ? `${bubble.size * 0.4}px` : `${bubble.size * 0.35}px`,
          fontWeight: "900",
          fontFamily: "'Nunito', sans-serif",
          color: bubble.item.color || "#4A3728",
          lineHeight: 1,
          textShadow: isEmoji ? "none" : "0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        {bubble.item.display}
      </div>

      {/* Label shown below content */}
      <div
        style={{
          fontSize: `${Math.max(10, bubble.size * 0.14)}px`,
          fontWeight: "700",
          fontFamily: "'Nunito', sans-serif",
          color: bubble.item.color || "#6B5744",
          marginTop: "2px",
          textAlign: "center",
          lineHeight: 1.1,
          maxWidth: "90%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>

      {/* Pop particles */}
      {popping && (
        <>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: bubble.color,
                animation: `bubbleParticle${i} 0.4s ease-out forwards`,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

// ── Pack selector pill ───────────────────────────────────────────────────
function PackPill({
  pack,
  lang,
  unlocked,
  active,
  onSelect,
}: {
  pack: (typeof CONTENT_PACKS)[number];
  lang: string;
  unlocked: boolean;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const name = lang === "pt" ? pack.pt : pack.da;

  return (
    <button
      onClick={() => unlocked && onSelect(pack.id)}
      style={{
        background: active ? "#FFE4A5" : unlocked ? "white" : "#E8E8E8",
        border: active ? "2px solid #FFD060" : "2px solid #E8DDD0",
        borderRadius: "50px",
        padding: "clamp(4px, 1vw, 6px) clamp(10px, 3vw, 14px)",
        fontSize: "clamp(11px, 3vw, 13px)",
        fontWeight: "800",
        color: unlocked ? "#6B5744" : "#B0A898",
        cursor: unlocked ? "pointer" : "default",
        fontFamily: "'Nunito', sans-serif",
        display: "inline-flex",
        alignItems: "center",
        gap: "clamp(4px, 1vw, 6px)",
        boxShadow: active
          ? "0 2px 10px rgba(255,208,96,0.4)"
          : "0 2px 6px rgba(0,0,0,0.04)",
        transition: "all 0.2s ease",
        opacity: unlocked ? 1 : 0.6,
      }}
    >
      <span>{unlocked ? pack.icon : "🔒"}</span>
      <span>{name}</span>
    </button>
  );
}

// ── Main game component ──────────────────────────────────────────────────
export function BubbleGame() {
  const { lang } = useLang();
  const [activePack, setActivePack] = useState("animals");
  const [unlockedPacks, setUnlockedPacks] = useState(new Set(["animals"]));
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [celebration, setCelebration] = useState(false);
  const [showUnlock, setShowUnlock] = useState<string | null>(null);
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  const currentPackForRound = CONTENT_PACKS.find((p) => p.id === activePack);
  const roundTotal = currentPackForRound?.items.length ?? 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bubbleIdRef = useRef(0);
  const activePackRef = useRef(activePack);

  useEffect(() => {
    activePackRef.current = activePack;
  }, [activePack]);

  const getCurrentPack = useCallback(() => {
    return CONTENT_PACKS.find((p) => p.id === activePackRef.current);
  }, []);

  const createBubble = useCallback((): BubbleData | null => {
    const pack = getCurrentPack();
    if (!pack) return null;

    const item = pack.items[Math.floor(Math.random() * pack.items.length)];
    const id = ++bubbleIdRef.current;
    // Responsive bubble size: smaller on narrow screens
    const vw = typeof window !== "undefined" ? window.innerWidth : 390;
    const baseSize = Math.min(vw * 0.18, 80);
    const size = baseSize + Math.random() * (baseSize * 0.25);

    return {
      id,
      item,
      x: 5 + Math.random() * 70,
      y: -15,
      size,
      color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
      speed: 6 + Math.random() * 4,
      wobbleSpeed: 2 + Math.random() * 2,
      wobbleDelay: Math.random() * 2,
    };
  }, [getCurrentPack]);

  const startSpawning = useCallback(() => {
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);

    const initial: BubbleData[] = [];
    for (let i = 0; i < 4; i++) {
      const b = createBubble();
      if (b) {
        b.y = -15 - i * 20;
        initial.push(b);
      }
    }
    setBubbles(initial);

    spawnTimerRef.current = setInterval(() => {
      setBubbles((prev) => {
        if (prev.length >= 5) return prev;
        const b = createBubble();
        return b ? [...prev, b] : prev;
      });
    }, 2500);
  }, [createBubble]);

  useEffect(() => {
    const runId = { cancelled: false };
    queueMicrotask(() => {
      if (!runId.cancelled) startSpawning();
    });

    return () => {
      runId.cancelled = true;
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [activePack, startSpawning]);

  const handlePop = useCallback(
    (bubbleId: number) => {
      setBubbles((prev) => prev.filter((b) => b.id !== bubbleId));

      setPoppedCount((prev) => {
        const next = prev + 1;
        const pack = getCurrentPack();
        if (pack && next >= pack.items.length) {
          if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
          setCelebration(true);
          playCelebrationSound();

          setRoundsCompleted((rc) => {
            const newRc = rc + 1;
            if (newRc >= 1 && !unlockedPacks.has("numbers")) {
              setTimeout(() => {
                setUnlockedPacks((up) => new Set([...up, "numbers"]));
                setShowUnlock("numbers");
                playUnlockSound();
                setTimeout(() => setShowUnlock(null), 3000);
              }, 2000);
            }
            if (newRc >= 2 && !unlockedPacks.has("letters")) {
              setTimeout(() => {
                setUnlockedPacks((up) => new Set([...up, "letters"]));
                setShowUnlock("letters");
                playUnlockSound();
                setTimeout(() => setShowUnlock(null), 3000);
              }, 2000);
            }
            return newRc;
          });
        }
        return next;
      });
    },
    [getCurrentPack, unlockedPacks]
  );

  const resetRound = () => {
    setPoppedCount(0);
    setCelebration(false);
    startSpawning();
  };

  const switchPack = (packId: string) => {
    setPoppedCount(0);
    setCelebration(false);
    setActivePack(packId);
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        height: "100dvh",
        background:
          "linear-gradient(180deg, #E8F4FD 0%, #F0F4FF 40%, #FFF9F0 100%)",
        fontFamily: "'Nunito', sans-serif",
        padding: "clamp(8px, 2vw, 16px)",
        paddingTop: "clamp(48px, 8vw, 60px)",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <BackButton />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "clamp(4px, 1.5vw, 12px)" }}>
        <h1
          style={{
            fontSize: "clamp(20px, 5.5vw, 36px)",
            fontWeight: "900",
            color: "#4A3728",
            margin: "0 0 2px 0",
            letterSpacing: "-0.5px",
          }}
        >
          {lang === "pt" ? "🫧 Bolhas do Theo 🫧" : "🫧 Theos Bobler 🫧"}
        </h1>

        <p
          style={{
            fontSize: "clamp(12px, 3.2vw, 14px)",
            color: "#8B7355",
            margin: "0 0 clamp(4px, 1.5vw, 10px) 0",
            fontWeight: "600",
          }}
        >
          {lang === "pt" ? "Estoura as bolhas!" : "Pop boblerne!"}
        </p>

        <LangToggle />
      </div>

      {/* Pack selector */}
      <div
        style={{
          display: "flex",
          gap: "clamp(4px, 1.5vw, 8px)",
          justifyContent: "center",
          marginBottom: "clamp(6px, 1.5vw, 12px)",
          flexWrap: "wrap",
        }}
      >
        {CONTENT_PACKS.map((pack) => (
          <PackPill
            key={pack.id}
            pack={pack}
            lang={lang}
            unlocked={unlockedPacks.has(pack.id)}
            active={activePack === pack.id}
            onSelect={switchPack}
          />
        ))}
      </div>

      {/* Progress */}
      <div style={{ textAlign: "center", marginBottom: "clamp(4px, 1vw, 8px)" }}>
        <Stars count={poppedCount} />
        <p
          style={{
            fontSize: "clamp(11px, 3vw, 13px)",
            color: "#8B7355",
            fontWeight: "700",
            margin: "2px 0 0",
          }}
        >
          {poppedCount} / {roundTotal}
        </p>
      </div>

      {/* Bubble play area */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "420px",
          flex: 1,
          minHeight: 0,
          margin: "0 auto",
          borderRadius: "clamp(16px, 4vw, 24px)",
          background: "rgba(255,255,255,0.3)",
          border: "2px dashed rgba(200,190,175,0.3)",
          overflow: "hidden",
        }}
      >
        {bubbles.map((bubble) => (
          <Bubble
            key={bubble.id}
            bubble={bubble}
            onPop={handlePop}
            lang={lang}
          />
        ))}

        {/* Empty state hint */}
        {bubbles.length === 0 && !celebration && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "#B0A898",
              fontWeight: "700",
              fontSize: "16px",
            }}
          >
            🫧
            <br />
            {lang === "pt" ? "As bolhas vêm aí..." : "Boblerne kommer..."}
          </div>
        )}
      </div>

      {/* Unlock notification */}
      {showUnlock && (
        <div
          style={{
            position: "fixed",
            bottom: "clamp(16px, 4vw, 30px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #FFE4A5, #FFD060)",
            borderRadius: "20px",
            padding: "clamp(10px, 3vw, 14px) clamp(20px, 5vw, 28px)",
            boxShadow: "0 8px 30px rgba(255,208,96,0.5)",
            animation: "bubbleUnlockSlide 3s ease forwards",
            zIndex: 50,
            textAlign: "center",
            fontFamily: "'Nunito', sans-serif",
            width: "max-content",
            maxWidth: "calc(100vw - 32px)",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "4px" }}>🔓✨</div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "800",
              color: "#6B5744",
            }}
          >
            {lang === "pt" ? "Novo desbloqueado!" : "Nyt låst op!"}
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: "#8B7355",
            }}
          >
            {CONTENT_PACKS.find((p) => p.id === showUnlock)?.[
              lang === "pt" ? "pt" : "da"
            ] || ""}
          </div>
        </div>
      )}

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
            🎉
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
            }}
          >
            {lang === "pt"
              ? "Estouraste todas as bolhas!"
              : "Du poppede alle boblerne!"}
          </p>
          <Stars count={roundTotal} />

          <div style={{
            display: "flex",
            gap: "clamp(8px, 2vw, 12px)",
            marginTop: "clamp(16px, 4vw, 24px)",
            flexWrap: "wrap",
            justifyContent: "center",
            width: "100%",
            maxWidth: "400px",
          }}>
            <button
              onClick={resetRound}
              style={{
                background: "#FFE4A5",
                border: "3px solid #FFD060",
                borderRadius: "50px",
                padding: "clamp(10px, 2.5vw, 14px) clamp(24px, 6vw, 36px)",
                fontSize: "clamp(15px, 4vw, 18px)",
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
              {lang === "pt" ? "🫧 Jogar de novo!" : "🫧 Spil igen!"}
            </button>

            <Link
              href="/"
              style={{
                background: "white",
                border: "3px solid #E8DDD0",
                borderRadius: "50px",
                padding: "clamp(10px, 2.5vw, 14px) clamp(24px, 6vw, 36px)",
                fontSize: "clamp(15px, 4vw, 18px)",
                fontWeight: "800",
                color: "#6B5744",
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                transition: "transform 0.2s ease",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {lang === "pt" ? "🏠 Início" : "🏠 Hjem"}
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
