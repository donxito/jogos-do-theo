"use client";

import { useState, useEffect, useRef } from "react";
import { type Animal } from "@/lib/animals";
import { playTone } from "./playTone";

function AnimalCard({
  animal,
  lang,
  onTap,
}: {
  animal: Animal;
  lang: string;
  onTap: (animal: Animal) => void;
}) {
  const [tapped, setTapped] = useState(false);
  const [showSound, setShowSound] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const soundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTap = () => {
    setTapped(true);
    setShowSound(true);
    playTone(animal.id);
    onTap(animal);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (soundTimeoutRef.current) clearTimeout(soundTimeoutRef.current);

    timeoutRef.current = setTimeout(() => setTapped(false), 500);
    soundTimeoutRef.current = setTimeout(() => setShowSound(false), 1800);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (soundTimeoutRef.current) clearTimeout(soundTimeoutRef.current);
    };
  }, []);

  const name = lang === "pt" ? animal.pt : animal.da;

  return (
    <div
      onClick={handleTap}
      style={{
        background: animal.bg,
        borderRadius: "clamp(18px, 5vw, 28px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transform: tapped ? "scale(1.12)" : "scale(1)",
        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow: tapped
          ? `0 8px 30px ${animal.bg}aa, 0 0 0 4px ${animal.color}30`
          : `0 4px 15px ${animal.bg}66`,
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        padding: "clamp(12px, 3.5vw, 20px) clamp(8px, 2vw, 12px)",
        aspectRatio: "1",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          right: "-15%",
          width: "60%",
          height: "60%",
          borderRadius: "50%",
          background: `${animal.color}08`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-10%",
          width: "40%",
          height: "40%",
          borderRadius: "50%",
          background: `${animal.color}06`,
        }}
      />

      {/* Sound bubble */}
      {showSound && (
        <div
          style={{
            position: "absolute",
            top: "6px",
            right: "10px",
            background: "white",
            borderRadius: "20px",
            padding: "clamp(2px, 0.8vw, 4px) clamp(6px, 2vw, 10px)",
            fontSize: "clamp(11px, 3vw, 14px)",
            fontWeight: "700",
            color: animal.color,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            animation: "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          {animal.sound}
        </div>
      )}

      {/* Emoji */}
      <div
        style={{
          fontSize: "clamp(36px, 9vw, 72px)",
          lineHeight: 1,
          transform: tapped ? "rotate(-8deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
        }}
      >
        {animal.emoji}
      </div>

      {/* Name */}
      <div
        style={{
          marginTop: "clamp(4px, 1vw, 8px)",
          fontSize: "clamp(13px, 3.5vw, 22px)",
          fontWeight: "800",
          color: animal.color,
          fontFamily: "'Nunito', sans-serif",
          letterSpacing: "0.5px",
          textAlign: "center",
        }}
      >
        {name}
      </div>
    </div>
  );
}

export default AnimalCard;
