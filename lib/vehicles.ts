export type Vehicle = {
  id: string;
  emoji: string;
  sound: string;
  pt: string;
  da: string;
  bg: string;
  color: string;
  accent: string;
};

export const vehicles: Vehicle[] = [
  { id: "car", emoji: "🚗", sound: "Vrum vrum!", pt: "Carro", da: "Bil", bg: "#FFE0E0", color: "#C0392B", accent: "#E74C3C" },
  { id: "truck", emoji: "🚚", sound: "Brrrum!", pt: "Caminhão", da: "Lastbil", bg: "#FFE8CC", color: "#D35400", accent: "#E67E22" },
  { id: "train", emoji: "🚂", sound: "Tchu tchu!", pt: "Trem", da: "Tog", bg: "#E8DAEF", color: "#7D3C98", accent: "#9B59B6" },
  { id: "plane", emoji: "✈️", sound: "Vuuuu!", pt: "Avião", da: "Fly", bg: "#D6EAF8", color: "#2471A3", accent: "#3498DB" },
  { id: "boat", emoji: "⛵", sound: "Tuuut!", pt: "Barco", da: "Båd", bg: "#D5F5E3", color: "#1E8449", accent: "#27AE60" },
  { id: "firetruck", emoji: "🚒", sound: "Pin pon!", pt: "Bombeiros", da: "Brandbil", bg: "#FDEDEC", color: "#B03A2E", accent: "#E74C3C" },
  { id: "helicopter", emoji: "🚁", sound: "Tchop tchop!", pt: "Helicóptero", da: "Helikopter", bg: "#EBF5FB", color: "#2E86C1", accent: "#5DADE2" },
  { id: "motorcycle", emoji: "🏍️", sound: "Vraaau!", pt: "Moto", da: "Motorcykel", bg: "#FDEBD0", color: "#B9770E", accent: "#F39C12" },
  { id: "bicycle", emoji: "🚲", sound: "Trim trim!", pt: "Bicicleta", da: "Cykel", bg: "#E8F8F5", color: "#148F77", accent: "#1ABC9C" },
];
