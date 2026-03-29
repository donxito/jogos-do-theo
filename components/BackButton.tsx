"use client";

import Link from "next/link";

export function BackButton() {
  return (
    <Link
      href="/"
      style={{
        position: "fixed",
        top: "clamp(8px, 2vw, 12px)",
        left: "clamp(8px, 2vw, 12px)",
        zIndex: 200,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(8px)",
        border: "2px solid #E8DDD0",
        borderRadius: "50%",
        width: "clamp(36px, 9vw, 44px)",
        height: "clamp(36px, 9vw, 44px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "clamp(16px, 4.5vw, 20px)",
        cursor: "pointer",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        transition: "transform 0.2s ease",
        fontFamily: "'Nunito', sans-serif",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      ←
    </Link>
  );
}
