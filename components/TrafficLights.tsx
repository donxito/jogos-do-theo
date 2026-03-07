export function TrafficLights({ count, total }: { count: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", padding: "4px 0" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: i < count ? "#2ECC71" : "#E0E0E0",
            boxShadow: i < count ? "0 0 8px #2ECC7166" : "none",
            transition: "all 0.3s ease",
            animation: i < count ? `lightOn 0.3s ${i * 0.06}s cubic-bezier(0.34, 1.56, 0.64, 1) both` : "none",
          }}
        />
      ))}
    </div>
  );
}
