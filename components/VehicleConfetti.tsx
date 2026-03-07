export function VehicleConfetti() {
  const items = ["🚗", "🚂", "✈️", "🚒", "⛵", "🚁", "🏍️", "🚲", "🚚", "⭐", "🎉", "🎊"];
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 101 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          position: "absolute", left: `${8 + (i * 7.5) % 85}%`, top: "-40px", fontSize: "28px",
          animation: `confettiFall ${2 + (i % 3) * 0.5}s ${i * 0.15}s ease-in forwards`, opacity: 0.9,
        }}>
          {item}
        </div>
      ))}
    </div>
  );
}
