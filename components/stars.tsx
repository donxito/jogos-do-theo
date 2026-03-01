function Stars({ count }: { count: number }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: "20px",
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
