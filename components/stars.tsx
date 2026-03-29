function Stars({ count }: { count: number }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "clamp(2px, 0.8vw, 4px)",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: "clamp(16px, 4.5vw, 20px)",
            animation: `starPop 0.4s ${i * 0.08}s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
          }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}

export default Stars;
