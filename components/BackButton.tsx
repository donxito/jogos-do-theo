"use client";

import Link from "next/link";

export function BackButton() {
  return (
    <Link
      href="/"
      style={{
        position: "fixed",
        top: "12px",
        left: "12px",
        zIndex: 200,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(8px)",
        border: "2px solid #E8DDD0",
        borderRadius: "50%",
        width: "44px",
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
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
