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
];
