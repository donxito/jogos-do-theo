export type GameEntry = {
  id: string;
  route: string;
  emoji: string;
  pt: { name: string; desc: string };
  da: { name: string; desc: string };
  bg: string;
  color: string;
};

export const GAMES: GameEntry[] = [
  {
    id: "animals",
    route: "/animals",
    emoji: "🦁",
    pt: { name: "Animais", desc: "Ouve os sons dos animais!" },
    da: { name: "Dyr", desc: "Hør dyrenes lyde!" },
    bg: "linear-gradient(135deg, #A8E6CF, #FFD3B6)",
    color: "#2D5016",
  },
  {
    id: "vehicles",
    route: "/vehicles",
    emoji: "🚗",
    pt: { name: "Veículos", desc: "Ouve os sons dos veículos!" },
    da: { name: "Køretøjer", desc: "Hør køretøjernes lyde!" },
    bg: "linear-gradient(135deg, #D6EAF8, #FFE0E0)",
    color: "#2471A3",
  },
  {
    id: "bubbles",
    route: "/bubbles",
    emoji: "🫧",
    pt: { name: "Bolhas", desc: "Estoura as bolhas!" },
    da: { name: "Bobler", desc: "Pop boblerne!" },
    bg: "linear-gradient(135deg, #FFF6A5, #C7CEEA)",
    color: "#8B7500",
  },
  {
  id: "paint",
  route: "/paint",
  emoji: "🎨",
  pt: { name: "Pinta", desc: "Pinta com os dedos!" },
  da: { name: "Mal", desc: "Mal med fingrene!" },
  bg: "linear-gradient(135deg, #FDCB6E, #E17055, #6C5CE7)",
  color: "#6C3483",
},
  {
    id: "memory",
    route: "/memory",
    emoji: "🧠",
    pt: { name: "Memória", desc: "Encontra os pares de animais!" },
    da: { name: "Hukommelse", desc: "Find dyrenes par!" },
    bg: "linear-gradient(135deg, #C7B8E8, #A8D8E0, #FFD3B6)",
    color: "#5B3A8B",
  },
];
