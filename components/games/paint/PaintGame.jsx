"use client";

import { useState, useCallback } from "react";
import { useLang } from "@/lib/LangContext";
import { BackButton } from "@/components/layout/BackButton";
import { PaintCanvas } from "@/components/games/paint/PaintCanvas";
import { GalleryView } from "@/components/games/paint/GalleryView";
import {
  COLORS,
  BRUSH_SIZES,
  STICKER_CATEGORIES,
  STICKER_SIZES,
  loadGallery,
  saveToGallery,
} from "@/components/games/paint/paintData";
import { playPickSound, playEraserSound, playStickerSound } from "@/components/games/paint/paintSounds";

// ── Save Toast ──────────────────────────────────────────────────
function SaveToast({ show, lang }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
      background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", borderRadius: "24px",
      padding: "28px 36px", boxShadow: "0 8px 40px rgba(0,0,0,0.15)", zIndex: 500,
      textAlign: "center", animation: "toastPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      fontFamily: "'Nunito', sans-serif", border: "3px solid #2ECC7140",
    }}>
      <style>{`
        @keyframes toastPop { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; } 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
        @keyframes toastStar { 0% { transform: scale(0) rotate(-30deg); } 100% { transform: scale(1) rotate(0deg); } }
      `}</style>
      <div style={{ fontSize: "56px", marginBottom: "8px", animation: "toastStar 0.5s 0.1s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}>⭐</div>
      <div style={{ fontSize: "20px", fontWeight: "900", color: "#2D5016", marginBottom: "4px" }}>
        {lang === "pt" ? "Pintura guardada!" : "Maleri gemt!"}
      </div>
      <div style={{ fontSize: "14px", fontWeight: "600", color: "#8B7355" }}>
        {lang === "pt" ? "Que bonito, Theo! 🎨" : "Hvor flot, Theo! 🎨"}
      </div>
    </div>
  );
}

// ── Main Paint Game Component ───────────────────────────────────
export function PaintGame() {
  const { lang } = useLang();
  const [selectedColor, setSelectedColor] = useState(0);
  const [brushSizeIdx, setBrushSizeIdx] = useState(1);
  const [isEraser, setIsEraser] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [paintingCount, setPaintingCount] = useState(() => loadGallery().length);

  // Sticker state
  const [toolMode, setToolMode] = useState("brush"); // "brush" | "stamp"
  const [stickerCategoryIdx, setStickerCategoryIdx] = useState(0);
  const [selectedSticker, setSelectedSticker] = useState("🐶");
  const [stickerSizeIdx, setStickerSizeIdx] = useState(1);

  const handleColorSelect = (idx) => {
    setSelectedColor(idx);
    setIsEraser(false);
    setToolMode("brush");
    playPickSound(idx);
  };

  const handleEraserToggle = () => {
    if (isEraser) { setIsEraser(false); }
    else { setIsEraser(true); setToolMode("brush"); }
    if (!isEraser) playEraserSound();
  };

  const handleStickerSelect = (sticker) => {
    setSelectedSticker(sticker);
    setToolMode("stamp");
    setIsEraser(false);
    playStickerSound();
  };

  const handleSave = useCallback((dataUrl) => {
    const result = saveToGallery(dataUrl);
    if (result) {
      setPaintingCount((c) => c + 1);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  }, []);

  const currentCategory = STICKER_CATEGORIES[stickerCategoryIdx];

  return (
    <div style={{
      height: "100dvh", display: "flex", flexDirection: "column",
      background: "linear-gradient(170deg, #FFF8F0 0%, #FFF0E8 40%, #F8F0FF 100%)",
      fontFamily: "'Nunito', sans-serif", overflow: "hidden", position: "relative",
    }}>
      <style>{`
        @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes stickerBounce { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
      `}</style>

      <BackButton />

      {/* Compact header */}
      <div style={{ padding: "4px 16px 2px", textAlign: "center", flexShrink: 0, paddingTop: "clamp(40px, 7vw, 50px)" }}>
        <h1 style={{ fontSize: "clamp(16px, 4.5vw, 22px)", fontWeight: "900", color: "#3D2C1E", margin: 0 }}>
          {lang === "pt" ? "🎨 Pinta, Theo!" : "🎨 Mal, Theo!"}
        </h1>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, padding: "4px 8px", minHeight: 0 }}>
        <PaintCanvas
          color={COLORS[selectedColor].hex}
          brushSize={BRUSH_SIZES[brushSizeIdx].size}
          isEraser={isEraser}
          toolMode={toolMode}
          selectedSticker={selectedSticker}
          stickerSize={STICKER_SIZES[stickerSizeIdx].size}
          onSave={handleSave}
        />
      </div>

      {/* Bottom toolbar — compact */}
      <div style={{
        padding: "6px 8px", paddingBottom: "max(6px, env(safe-area-inset-bottom))",
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
        borderTop: "2px solid #F0E8DD", flexShrink: 0,
      }}>

        {/* Mode toggle: Brush / Stickers */}
        <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginBottom: "6px" }}>
          <button onClick={() => { setToolMode("brush"); setIsEraser(false); }} style={{
            flex: 1, maxWidth: "120px", padding: "4px 0", borderRadius: "10px",
            border: "2px solid " + (toolMode === "brush" ? "#3D2C1E" : "#E0D8D0"),
            background: toolMode === "brush" ? "#3D2C1E" : "#FFF",
            color: toolMode === "brush" ? "#FFF" : "#6B5744",
            fontSize: "12px", fontWeight: "800", cursor: "pointer",
            fontFamily: "'Nunito', sans-serif", transition: "all 0.15s",
            WebkitTapHighlightColor: "transparent",
          }}>
            🖌️ {lang === "pt" ? "Pintar" : "Male"}
          </button>
          <button onClick={() => { setToolMode("stamp"); setIsEraser(false); }} style={{
            flex: 1, maxWidth: "120px", padding: "4px 0", borderRadius: "10px",
            border: "2px solid " + (toolMode === "stamp" ? "#6C5CE7" : "#E0D8D0"),
            background: toolMode === "stamp" ? "#6C5CE7" : "#FFF",
            color: toolMode === "stamp" ? "#FFF" : "#6B5744",
            fontSize: "12px", fontWeight: "800", cursor: "pointer",
            fontFamily: "'Nunito', sans-serif", transition: "all 0.15s",
            WebkitTapHighlightColor: "transparent",
          }}>
            ⭐ Stickers
          </button>
        </div>

        {/* BRUSH MODE TOOLBAR */}
        {toolMode === "brush" && (
          <>
            {/* Colors + eraser + gallery in one row */}
            <div style={{ display: "flex", gap: "5px", justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: "5px" }}>
              {COLORS.map((c, i) => (
                <button key={c.hex} onClick={() => handleColorSelect(i)} style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  border: selectedColor === i && !isEraser ? "3px solid #3D2C1E" : c.hex === "#FFFFFF" ? "2px solid #DDD" : "2px solid transparent",
                  background: c.hex, cursor: "pointer", transition: "all 0.15s",
                  transform: selectedColor === i && !isEraser ? "scale(1.15)" : "scale(1)",
                  boxShadow: selectedColor === i && !isEraser ? `0 0 0 2px ${c.hex}40` : "0 1px 3px rgba(0,0,0,0.1)",
                  WebkitTapHighlightColor: "transparent", padding: 0,
                }} />
              ))}
            </div>
            {/* Brush sizes + eraser + gallery */}
            <div style={{ display: "flex", gap: "6px", justifyContent: "center", alignItems: "center" }}>
              {BRUSH_SIZES.map((b, i) => (
                <button key={i} onClick={() => { setBrushSizeIdx(i); setIsEraser(false); }} style={{
                  width: "32px", height: "32px", borderRadius: "10px",
                  border: brushSizeIdx === i && !isEraser ? "2px solid #3D2C1E" : "2px solid #E0D8D0",
                  background: brushSizeIdx === i && !isEraser ? "#F5F0E8" : "#FFF",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s", WebkitTapHighlightColor: "transparent", padding: 0,
                }}>
                  <div style={{
                    width: Math.min(b.size, 20) + "px", height: Math.min(b.size, 20) + "px", borderRadius: "50%",
                    background: isEraser ? "#CCC" : COLORS[selectedColor].hex,
                    border: COLORS[selectedColor].hex === "#FFFFFF" && !isEraser ? "1px solid #DDD" : "none",
                  }} />
                </button>
              ))}
              <div style={{ width: "1px", height: "22px", background: "#E0D8D0" }} />
              <button onClick={handleEraserToggle} style={{
                width: "32px", height: "32px", borderRadius: "10px",
                border: isEraser ? "2px solid #3D2C1E" : "2px solid #E0D8D0",
                background: isEraser ? "#F5F0E8" : "#FFF",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", transition: "all 0.15s", WebkitTapHighlightColor: "transparent", padding: 0,
              }}>🧹</button>
              <div style={{ width: "1px", height: "22px", background: "#E0D8D0" }} />
              <button onClick={() => setShowGallery(true)} style={{
                height: "32px", borderRadius: "10px", border: "2px solid #E0D8D0",
                background: "#FFF", cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "3px", fontSize: "14px", fontWeight: "800",
                color: "#6B5744", fontFamily: "'Nunito', sans-serif", padding: "0 8px",
                transition: "all 0.15s", WebkitTapHighlightColor: "transparent",
              }}>
                🖼️
                {paintingCount > 0 && <span style={{
                  fontSize: "10px", background: "#6C5CE7", color: "#FFF", borderRadius: "8px",
                  padding: "1px 5px", fontWeight: "800",
                }}>{paintingCount}</span>}
              </button>
            </div>
          </>
        )}

        {/* STICKER MODE TOOLBAR */}
        {toolMode === "stamp" && (
          <>
            {/* Category tabs — emoji only */}
            <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginBottom: "5px" }}>
              {STICKER_CATEGORIES.map((cat, i) => (
                <button key={cat.id} onClick={() => setStickerCategoryIdx(i)} style={{
                  width: "34px", height: "30px", borderRadius: "8px", border: "none",
                  background: stickerCategoryIdx === i ? "#6C5CE7" : "rgba(0,0,0,0.04)",
                  fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", transition: "all 0.15s",
                  WebkitTapHighlightColor: "transparent",
                }}>
                  {cat.emoji}
                </button>
              ))}
            </div>
            {/* Sticker grid — compact */}
            <div style={{
              display: "flex", gap: "3px", justifyContent: "center", flexWrap: "wrap", marginBottom: "5px",
              maxHeight: "68px", overflowY: "auto", WebkitOverflowScrolling: "touch",
            }}>
              {currentCategory.stickers.map((sticker) => (
                <button key={sticker} onClick={() => handleStickerSelect(sticker)} style={{
                  width: "34px", height: "34px", borderRadius: "10px",
                  border: selectedSticker === sticker ? "2px solid #6C5CE7" : "2px solid transparent",
                  background: selectedSticker === sticker ? "#F0EDFF" : "rgba(0,0,0,0.02)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", transition: "all 0.15s",
                  WebkitTapHighlightColor: "transparent", padding: 0,
                }}>{sticker}</button>
              ))}
            </div>
            {/* Sticker size + gallery */}
            <div style={{ display: "flex", gap: "6px", justifyContent: "center", alignItems: "center" }}>
              {STICKER_SIZES.map((s, i) => (
                <button key={i} onClick={() => setStickerSizeIdx(i)} style={{
                  width: "32px", height: "32px", borderRadius: "10px",
                  border: stickerSizeIdx === i ? "2px solid #6C5CE7" : "2px solid #E0D8D0",
                  background: stickerSizeIdx === i ? "#F0EDFF" : "#FFF",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: Math.max(12, s.size * 0.35) + "px", transition: "all 0.15s",
                  WebkitTapHighlightColor: "transparent", padding: 0,
                }}>{selectedSticker}</button>
              ))}
              <div style={{ width: "1px", height: "22px", background: "#E0D8D0" }} />
              <button onClick={() => setShowGallery(true)} style={{
                height: "32px", borderRadius: "10px", border: "2px solid #E0D8D0",
                background: "#FFF", cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "3px", fontSize: "14px", fontWeight: "800",
                color: "#6B5744", fontFamily: "'Nunito', sans-serif", padding: "0 8px",
                transition: "all 0.15s", WebkitTapHighlightColor: "transparent",
              }}>
                🖼️
                {paintingCount > 0 && <span style={{
                  fontSize: "10px", background: "#6C5CE7", color: "#FFF", borderRadius: "8px",
                  padding: "1px 5px", fontWeight: "800",
                }}>{paintingCount}</span>}
              </button>
            </div>
          </>
        )}
      </div>

      {showGallery && <GalleryView onClose={() => { setShowGallery(false); setPaintingCount(loadGallery().length); }} lang={lang} />}
      <SaveToast show={showToast} lang={lang} />
    </div>
  );
}
