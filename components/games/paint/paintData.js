// Colors, brushes, stickers, and gallery helpers for Paint game

export const COLORS = [
  { hex: "#E74C3C", pt: "Vermelho", da: "Rød", emoji: "🔴" },
  { hex: "#E67E22", pt: "Laranja", da: "Orange", emoji: "🟠" },
  { hex: "#F1C40F", pt: "Amarelo", da: "Gul", emoji: "🟡" },
  { hex: "#2ECC71", pt: "Verde", da: "Grøn", emoji: "🟢" },
  { hex: "#3498DB", pt: "Azul", da: "Blå", emoji: "🔵" },
  { hex: "#9B59B6", pt: "Roxo", da: "Lilla", emoji: "🟣" },
  { hex: "#E91E8A", pt: "Rosa", da: "Pink", emoji: "💗" },
  { hex: "#1C1C1C", pt: "Preto", da: "Sort", emoji: "⚫" },
  { hex: "#FFFFFF", pt: "Branco", da: "Hvid", emoji: "⚪" },
  { hex: "#8B4513", pt: "Marrom", da: "Brun", emoji: "🤎" },
];

export const BRUSH_SIZES = [
  { size: 6, name: { pt: "Fino", da: "Tynd" } },
  { size: 14, name: { pt: "Médio", da: "Medium" } },
  { size: 28, name: { pt: "Grosso", da: "Tyk" } },
];

export const STICKER_CATEGORIES = [
  {
    id: "animals",
    emoji: "🐾",
    pt: "Animais",
    da: "Dyr",
    stickers: ["🐶", "🐱", "🐮", "🐷", "🦁", "🐸", "🦆", "🦋", "🐴", "🐰", "🐻", "🦊", "🐢", "🐠", "🐍"],
  },
  {
    id: "vehicles",
    emoji: "🚗",
    pt: "Veículos",
    da: "Køretøjer",
    stickers: ["🚗", "🚂", "🚒", "✈️", "🚁", "⛵", "🏍", "🚀", "🚲", "🚴", "🚌", "🚐"],
  },
  {
    id: "food",
    emoji: "🍎",
    pt: "Comida",
    da: "Mad",
    stickers: ["🍎", "🍕", "🍦", "🧁", "🍩", "🍪", "🍌", "🍓", "🥕", "🌽", "🍫", "🧃"],
  },
  {
    id: "nature",
    emoji: "🌸",
    pt: "Natureza",
    da: "Natur",
    stickers: ["🌸", "🌻", "🌈", "⭐", "🌙", "☀️", "🍀", "🌊", "🌴", "❄️", "🔥", "🌧"],
  },
  {
    id: "fun",
    emoji: "🎈",
    pt: "Diversão",
    da: "Sjov",
    stickers: ["🎈", "🎉", "🎶", "🎸", "🎭", "🤩", "💎", "⚡", "🏆", "🎯", "🎹", "🕶️"],
  },
];

export const STICKER_SIZES = [
  { size: 28, name: { pt: "Pequeno", da: "Lille" } },
  { size: 44, name: { pt: "Médio", da: "Medium" } },
  { size: 64, name: { pt: "Grande", da: "Stor" } },
];

// Gallery storage helpers
const GALLERY_KEY = "theo_paintings";
const MAX_PAINTINGS = 20;

export function loadGallery() {
  try {
    const data = localStorage.getItem(GALLERY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveToGallery(dataUrl) {
  try {
    const gallery = loadGallery();
    const painting = { id: Date.now(), dataUrl, date: new Date().toISOString() };
    gallery.unshift(painting);
    localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery.slice(0, MAX_PAINTINGS)));
    return painting;
  } catch {
    return null;
  }
}

export function deletePainting(id) {
  try {
    const gallery = loadGallery().filter((p) => p.id !== id);
    localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
    return gallery;
  } catch {
    return [];
  }
}

export function formatDate(isoString, lang) {
  const d = new Date(isoString);
  const months = {
    pt: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    da: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
  };
  return `${d.getDate()} ${(months[lang] || months.pt)[d.getMonth()]} ${d.getFullYear()}`;
}
