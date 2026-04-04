"use client";

import { useState } from "react";
import { loadGallery, deletePainting, formatDate } from "@/components/games/paint/paintData";

export function GalleryView({ onClose, lang }) {
  const [paintings, setPaintings] = useState(() => loadGallery());
  const [selectedPainting, setSelectedPainting] = useState(null);
  const handleDelete = (id) => { setPaintings(deletePainting(id)); setSelectedPainting(null); };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)",
      zIndex: 300, display: "flex", flexDirection: "column",
      fontFamily: "'Nunito', sans-serif", animation: "gallerySlideIn 0.3s ease",
    }}>
      <style>{`@keyframes gallerySlideIn { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }`}</style>
      <div style={{
        padding: "16px 20px", display: "flex", alignItems: "center",
        justifyContent: "space-between", borderBottom: "2px solid #F0E8DD",
      }}>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "900", color: "#3D2C1E" }}>
          {lang === "pt" ? "🖼️ Galeria do Theo" : "🖼️ Theos Galleri"}
        </h2>
        <button onClick={onClose} style={{
          background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%",
          width: "40px", height: "40px", fontSize: "20px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "16px", WebkitOverflowScrolling: "touch" }}>
        {paintings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#B0A090" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px", opacity: 0.5 }}>🎨</div>
            <p style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 8px" }}>
              {lang === "pt" ? "Nenhuma pintura ainda!" : "Ingen malerier endnu!"}
            </p>
            <p style={{ fontSize: "14px", fontWeight: "600" }}>
              {lang === "pt" ? "Pinta algo bonito e guarda aqui!" : "Mal noget smukt og gem det her!"}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px" }}>
            {paintings.map((painting) => (
              <div key={painting.id} onClick={() => setSelectedPainting(painting)} style={{
                borderRadius: "16px", overflow: "hidden", border: "2px solid #E8DDD0",
                background: "#FFF", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              }}>
                <div style={{ aspectRatio: "1", background: `url(${painting.dataUrl}) center/cover` }} />
                <div style={{ padding: "8px 10px", fontSize: "11px", fontWeight: "700", color: "#9B8D7E", textAlign: "center" }}>
                  📅 {formatDate(painting.date, lang)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedPainting && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.85)", zIndex: 400, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "20px",
        }} onClick={() => setSelectedPainting(null)}>
          <img src={selectedPainting.dataUrl} alt="Painting" style={{
            maxWidth: "100%", maxHeight: "70vh", borderRadius: "16px", boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          }} />
          <div style={{ marginTop: "16px", color: "#FFF", fontSize: "14px", fontWeight: "700", fontFamily: "'Nunito', sans-serif" }}>
            📅 {formatDate(selectedPainting.date, lang)}
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button onClick={(e) => { e.stopPropagation(); setSelectedPainting(null); }} style={{
              background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)",
              borderRadius: "50px", padding: "10px 24px", fontSize: "15px", fontWeight: "800",
              color: "#FFF", cursor: "pointer", fontFamily: "'Nunito', sans-serif",
            }}>← {lang === "pt" ? "Voltar" : "Tilbage"}</button>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(selectedPainting.id); }} style={{
              background: "rgba(231,76,60,0.2)", border: "2px solid rgba(231,76,60,0.4)",
              borderRadius: "50px", padding: "10px 24px", fontSize: "15px", fontWeight: "800",
              color: "#E74C3C", cursor: "pointer", fontFamily: "'Nunito', sans-serif",
            }}>🗑️ {lang === "pt" ? "Apagar" : "Slet"}</button>
          </div>
          <p style={{
            marginTop: "20px", fontSize: "11px", color: "rgba(255,255,255,0.4)",
            fontWeight: "600", fontStyle: "italic", fontFamily: "'Nunito', sans-serif",
          }}>Feito com amor pelo Papi 💛</p>
        </div>
      )}
    </div>
  );
}
