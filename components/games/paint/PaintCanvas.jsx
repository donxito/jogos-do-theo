"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  playClearSound,
  playSaveSound,
  playStickerSound,
} from "@/components/games/paint/paintSounds";

export function PaintCanvas({
  color,
  brushSize,
  isEraser,
  toolMode,
  selectedSticker,
  stickerSize,
  onSave,
}) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef(null);
  const hasDrawnRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx.drawImage(canvas, 0, 0);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, rect.width, rect.height);
      if (tempCanvas.width > 0 && tempCanvas.height > 0) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(
          tempCanvas,
          0,
          0,
          tempCanvas.width,
          tempCanvas.height,
          0,
          0,
          canvas.width,
          canvas.height,
        );
        ctx.restore();
      }
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };
    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas.parentElement);
    return () => observer.disconnect();
  }, []);

  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const stampSticker = useCallback(
    (pos) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.font = `${stickerSize}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(selectedSticker, pos.x, pos.y);
      ctx.restore();
      hasDrawnRef.current = true;
      playStickerSound();
    },
    [selectedSticker, stickerSize],
  );

  const startDrawing = useCallback(
    (e) => {
      e.preventDefault();
      const pos = getPos(e);
      if (toolMode === "stamp") {
        stampSticker(pos);
        return;
      }
      isDrawingRef.current = true;
      hasDrawnRef.current = true;
      lastPosRef.current = pos;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.beginPath();
      ctx.arc(
        pos.x,
        pos.y,
        (isEraser ? brushSize * 1.5 : brushSize) / 2,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = isEraser ? "#FFFFFF" : color;
      ctx.fill();
      ctx.restore();
    },
    [color, brushSize, isEraser, getPos, toolMode, stampSticker],
  );

  const draw = useCallback(
    (e) => {
      e.preventDefault();
      if (toolMode === "stamp") return;
      if (!isDrawingRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const pos = getPos(e);
      const last = lastPosRef.current;
      const dpr = window.devicePixelRatio || 1;
      if (last) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = isEraser ? "#FFFFFF" : color;
        ctx.lineWidth = isEraser ? brushSize * 1.5 : brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
        ctx.restore();
      }
      lastPosRef.current = pos;
    },
    [color, brushSize, isEraser, getPos, toolMode],
  );

  const stopDrawing = useCallback((e) => {
    if (e) e.preventDefault();
    isDrawingRef.current = false;
    lastPosRef.current = null;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    hasDrawnRef.current = false;
    playClearSound();
  }, []);

  const handleSave = useCallback(() => {
    if (!hasDrawnRef.current) return;
    const canvas = canvasRef.current;
    onSave(canvas.toDataURL("image/png"));
    playSaveSound();
  }, [onSave]);

  const cursorStyle =
    toolMode === "stamp" ? "copy" : isEraser ? "cell" : "crosshair";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          flex: 1,
          position: "relative",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow:
            "inset 0 2px 12px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.08)",
          border: "3px solid #E8DDD0",
          background: "#FFFFFF",
          touchAction: "none",
        }}
      >
        <canvas
          ref={canvasRef}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            cursor: cursorStyle,
            touchAction: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            display: "flex",
            gap: "8px",
            zIndex: 10,
          }}
        >
          <button
            onClick={clearCanvas}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "2px solid #E8DDD0",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              padding: 0,
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              e.currentTarget.style.transform = "scale(0.9)";
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            🗑️
          </button>
          <button
            onClick={handleSave}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "2px solid #2ECC71",
              background: "rgba(46,204,113,0.15)",
              backdropFilter: "blur(8px)",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(46,204,113,0.2)",
              transition: "transform 0.2s",
              padding: 0,
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              e.currentTarget.style.transform = "scale(0.9)";
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            💾
          </button>
        </div>
      </div>
    </div>
  );
}
