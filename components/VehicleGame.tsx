"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { vehicles, type Vehicle } from "@/lib/vehicles";
import { useLang } from "@/lib/LangContext";
import { BackButton } from "./BackButton";
import { LangToggle } from "./LangToggle";
import { TrafficLights } from "./TrafficLights";
import { VehicleCard } from "./VehicleCard";
import { VehicleConfetti } from "./VehicleConfetti";

export function VehicleGame() {
  const { lang } = useLang();
  const [tappedVehicles, setTappedVehicles] = useState<Set<string>>(new Set());
  const [celebration, setCelebration] = useState(false);

  const handleTap = useCallback((vehicle: Vehicle) => {
    setTappedVehicles((prev) => {
      const next = new Set(prev);
      next.add(vehicle.id);
      if (next.size === vehicles.length) setTimeout(() => setCelebration(true), 300);
      return next;
    });
  }, []);

  const resetGame = () => {
    setTappedVehicles(new Set());
    setCelebration(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg, #F0F7FF 0%, #FFF8F0 40%, #F0FFF4 100%)",
      fontFamily: "'Baloo 2', 'Nunito', sans-serif",
      padding: "16px", paddingTop: "60px", paddingBottom: "100px",
      position: "relative", overflow: "hidden",
    }}>
      <BackButton />

      {/* Animated road */}
      <div style={{ position: "fixed", bottom: "60px", left: 0, right: 0, height: "4px", background: "#E8E0D8", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "1px", left: 0, right: 0, height: "2px",
          backgroundImage: "repeating-linear-gradient(90deg, #D0C8C0 0px, #D0C8C0 15px, transparent 15px, transparent 30px)",
          animation: "roadScroll 1.5s linear infinite",
        }} />
      </div>
      <div style={{ position: "fixed", bottom: "68px", left: 0, fontSize: "24px", animation: "driveAcross 12s linear infinite", zIndex: 0, opacity: 0.15 }}>🚗</div>

      <div style={{ textAlign: "center", marginBottom: "16px", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "clamp(22px, 5.5vw, 34px)", fontWeight: "800", color: "#2C3E50", margin: "0 0 2px 0" }}>
          {lang === "pt" ? "🚗 Veículos do Theo 🚂" : "🚗 Theos Køretøjer 🚂"}
        </h1>
        <p style={{ fontSize: "14px", color: "#7F8C8D", margin: "0 0 12px 0", fontWeight: "600" }}>
          {lang === "pt" ? "Toca nos veículos e ouve o som!" : "Tryk på køretøjerne og hør lyden!"}
        </p>
        <LangToggle />
      </div>

      <div style={{ marginBottom: "14px", position: "relative", zIndex: 1 }}>
        <TrafficLights count={tappedVehicles.size} total={vehicles.length} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", maxWidth: "420px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} lang={lang} onTap={handleTap} />)}
      </div>

      {celebration && (
        <>
          <VehicleConfetti />
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(255,255,255,0.94)", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", zIndex: 100, animation: "popIn 0.4s ease",
          }}>
            <div style={{ fontSize: "72px", animation: "bounce 0.8s ease infinite" }}>🏆</div>
            <h2 style={{ fontSize: "clamp(26px, 6.5vw, 40px)", fontWeight: "800", color: "#2C3E50", margin: "14px 0 6px", textAlign: "center" }}>
              {lang === "pt" ? "Parabéns, Theo!" : "Godt klaret, Theo!"}
            </h2>
            <p style={{ fontSize: "17px", color: "#7F8C8D", fontWeight: "700", margin: "0 0 12px", textAlign: "center" }}>
              {lang === "pt" ? "Encontraste todos os veículos!" : "Du fandt alle køretøjerne!"}
            </p>
            <TrafficLights count={vehicles.length} total={vehicles.length} />
            <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={resetGame} style={{
                background: "linear-gradient(135deg, #2ECC71, #27AE60)", border: "none", borderRadius: "50px",
                padding: "14px 28px", fontSize: "17px", fontWeight: "800", color: "white",
                cursor: "pointer", fontFamily: "'Nunito', sans-serif", boxShadow: "0 4px 15px rgba(46,204,113,0.4)",
              }} onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")} onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                {lang === "pt" ? "🔄 Jogar de novo!" : "🔄 Spil igen!"}
              </button>
              <Link href="/" style={{
                background: "white", border: "2px solid #E0E0E0", borderRadius: "50px",
                padding: "14px 28px", fontSize: "17px", fontWeight: "800", color: "#555",
                cursor: "pointer", fontFamily: "'Nunito', sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                textDecoration: "none", display: "inline-flex", alignItems: "center",
              }} onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")} onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                {lang === "pt" ? "🏠 Menu" : "🏠 Menu"}
              </Link>
            </div>
            <p style={{ marginTop: "28px", fontSize: "12px", color: "#BDC3C7", fontWeight: "600", fontStyle: "italic" }}>
              Feito com amor pelo Papi 💛
            </p>
          </div>
        </>
      )}
    </div>
  );
}
