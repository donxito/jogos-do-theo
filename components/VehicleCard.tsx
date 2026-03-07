"use client";

import { useState, useEffect, useRef } from "react";
import { type Vehicle } from "@/lib/vehicles";
import { playVehicleSound } from "./playVehicleSound";

export function VehicleCard({
  vehicle,
  lang,
  onTap,
}: {
  vehicle: Vehicle;
  lang: string;
  onTap: (vehicle: Vehicle) => void;
}) {
  const [tapped, setTapped] = useState(false);
  const [showSound, setShowSound] = useState(false);
  const t1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTap = () => {
    setTapped(true);
    setShowSound(true);
    playVehicleSound(vehicle.id);
    onTap(vehicle);
    if (t1.current) clearTimeout(t1.current);
    if (t2.current) clearTimeout(t2.current);
    t1.current = setTimeout(() => setTapped(false), 800);
    t2.current = setTimeout(() => setShowSound(false), 2000);
  };

  useEffect(() => () => {
    if (t1.current) clearTimeout(t1.current);
    if (t2.current) clearTimeout(t2.current);
  }, []);

  const animClass = tapped ? `vehicle-anim-${vehicle.id}` : "";

  return (
    <div
      onClick={handleTap}
      className={animClass}
      style={{
        background: `linear-gradient(135deg, ${vehicle.bg} 0%, ${vehicle.bg}dd 100%)`,
        borderRadius: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transform: tapped ? "scale(1.08)" : "scale(1)",
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow: tapped
          ? `0 8px 32px ${vehicle.accent}55, 0 0 0 3px ${vehicle.accent}40`
          : `0 4px 16px ${vehicle.bg}88`,
        aspectRatio: "1",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        padding: "10px",
      }}
    >
      {/* Road decoration */}
      <div style={{ position: "absolute", bottom: "28%", left: 0, right: 0, height: "3px", background: `${vehicle.color}15`, borderRadius: "2px" }} />
      <div style={{ position: "absolute", bottom: "calc(28% + 1px)", left: "10%", right: "10%", height: "1px", backgroundImage: `repeating-linear-gradient(90deg, ${vehicle.color}20 0px, ${vehicle.color}20 6px, transparent 6px, transparent 12px)` }} />

      {/* Motion lines */}
      {tapped && [0, 1, 2].map((i) => (
        <div key={i} style={{
          position: "absolute", left: `${6 + i * 3}px`, top: `${45 + i * 5}%`,
          width: `${18 - i * 2}px`, height: "2px", background: `${vehicle.color}${25 + i * 5}`,
          borderRadius: "1px", animation: `motionLine 0.4s ${i * 0.05}s ease-out forwards`,
        }} />
      ))}

      {showSound && (
        <div style={{
          position: "absolute", top: "5px", right: "8px", background: "white", borderRadius: "16px",
          padding: "3px 10px", fontSize: "13px", fontWeight: "800", color: vehicle.color,
          boxShadow: `0 2px 10px ${vehicle.accent}30`, animation: "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          fontFamily: "'Baloo 2', 'Nunito', sans-serif", zIndex: 2,
        }}>
          {vehicle.sound}
        </div>
      )}

      <div style={{
        fontSize: "clamp(44px, 11vw, 66px)", lineHeight: 1,
        transform: tapped ? "translateX(6px)" : "translateX(0)",
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)", zIndex: 1,
      }}>
        {vehicle.emoji}
      </div>

      {tapped && ["car", "truck", "motorcycle", "bicycle"].includes(vehicle.id) && (
        <div style={{ position: "absolute", bottom: "26%", display: "flex", gap: "20px" }}>
          {[0, 1].map((i) => (
            <div key={i} style={{
              width: "8px", height: "8px", borderRadius: "50%",
              border: `2px solid ${vehicle.color}40`, animation: "wheelSpin 0.3s linear infinite",
            }} />
          ))}
        </div>
      )}

      <div style={{
        marginTop: "6px", fontSize: "clamp(14px, 3.5vw, 20px)", fontWeight: "800",
        color: vehicle.color, fontFamily: "'Baloo 2', 'Nunito', sans-serif",
        textAlign: "center", zIndex: 1, lineHeight: 1.2,
      }}>
        {lang === "pt" ? vehicle.pt : vehicle.da}
      </div>
    </div>
  );
}
