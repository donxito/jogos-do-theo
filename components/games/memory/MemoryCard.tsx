"use client";

import { type Animal } from "@/lib/animals";

export type MemoryCardData = {
  uid: string;
  animal: Animal;
};

function MemoryCard({
  card,
  flipped,
  matched,
  disabled,
  lang,
  onTap,
}: {
  card: MemoryCardData;
  flipped: boolean;
  matched: boolean;
  disabled: boolean;
  lang: string;
  onTap: (card: MemoryCardData) => void;
}) {
  const showFront = flipped || matched;
  const name = lang === "pt" ? card.animal.pt : card.animal.da;

  const handleTap = () => {
    if (disabled || showFront) return;
    onTap(card);
  };

  return (
    <div
      onClick={handleTap}
      style={{
        position: "relative",
        aspectRatio: "1",
        cursor: disabled || showFront ? "default" : "pointer",
        perspective: "1000px",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transition: "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transformStyle: "preserve-3d",
          transform: showFront ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Back (face down) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "clamp(16px, 4.5vw, 24px)",
            background:
              "linear-gradient(135deg, #B8A4D9 0%, #8E7BC7 50%, #6F5CB8 100%)",
            boxShadow:
              "0 6px 18px rgba(110,92,184,0.35), inset 0 2px 6px rgba(255,255,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "3px solid rgba(255,255,255,0.4)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20%",
              right: "-20%",
              width: "70%",
              height: "70%",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-15%",
              left: "-15%",
              width: "50%",
              height: "50%",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div
            style={{
              fontSize: "clamp(28px, 8vw, 56px)",
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
              animation: "memoryBackPulse 2.4s ease-in-out infinite",
            }}
          >
            🐾
          </div>
        </div>

        {/* Front (face up) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "clamp(16px, 4.5vw, 24px)",
            background: card.animal.bg,
            boxShadow: matched
              ? `0 8px 26px ${card.animal.bg}cc, 0 0 0 4px ${card.animal.color}55`
              : `0 4px 16px ${card.animal.bg}aa`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(8px, 2.5vw, 14px) clamp(6px, 2vw, 10px)",
            overflow: "hidden",
            border: "3px solid rgba(255,255,255,0.55)",
            animation: matched ? "memoryMatchPulse 0.6s ease" : "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-12%",
              right: "-12%",
              width: "55%",
              height: "55%",
              borderRadius: "50%",
              background: `${card.animal.color}10`,
            }}
          />
          <div
            style={{
              fontSize: "clamp(34px, 9vw, 64px)",
              lineHeight: 1,
              filter: matched
                ? "drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
                : "none",
            }}
          >
            {card.animal.emoji}
          </div>
          <div
            style={{
              marginTop: "clamp(2px, 1vw, 6px)",
              fontSize: "clamp(11px, 3vw, 16px)",
              fontWeight: "800",
              color: card.animal.color,
              fontFamily: "'Nunito', sans-serif",
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            {name}
          </div>
          {matched && (
            <div
              style={{
                position: "absolute",
                top: "6px",
                right: "8px",
                fontSize: "clamp(14px, 3.5vw, 18px)",
                animation: "starPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              ✨
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemoryCard;
