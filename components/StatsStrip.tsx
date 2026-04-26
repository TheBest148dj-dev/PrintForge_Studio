const stats = [
  { label: "Productietijd", value: "48u - 7d" },
  { label: "Materialen", value: "12+" },
  { label: "Klanttevredenheid", value: "4.9/5" },
  { label: "Custom aanvragen", value: "Onbeperkt" }
];

export function StatsStrip() {
  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-panel"
          style={{ padding: 22, borderRadius: 22, display: "grid", gap: 6 }}
        >
          <span className="muted">{stat.label}</span>
          <strong style={{ fontSize: "1.6rem" }}>{stat.value}</strong>
        </div>
      ))}
    </div>
  );
}
