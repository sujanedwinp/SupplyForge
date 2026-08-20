// Inline-SVG risk-score trend. No chart library.
export default function TrendSparkline({ history }) {
  const points = (history || []).filter((h) => h.overall_score != null);
  if (points.length < 2) {
    return <div className="muted small">Trend appears after 2+ refreshes.</div>;
  }

  const W = 320;
  const H = 70;
  const pad = 6;
  const scores = points.map((p) => p.overall_score);
  const n = points.length;

  const x = (i) => pad + (i * (W - 2 * pad)) / (n - 1);
  const y = (s) => H - pad - (s / 100) * (H - 2 * pad); // 0..100 → bottom..top

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.overall_score).toFixed(1)}`).join(' ');

  const colorFor = (s) => (s >= 66 ? 'var(--high)' : s >= 33 ? 'var(--medium)' : 'var(--low)');
  const last = points[n - 1];

  return (
    <div className="trend">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="none" className="trend-svg">
        {[33, 66].map((g) => (
          <line key={g} x1={pad} x2={W - pad} y1={y(g)} y2={y(g)} className="trend-grid" />
        ))}
        <path d={path} className="trend-line" fill="none" />
        {points.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p.overall_score)} r={i === n - 1 ? 4 : 2.5} fill={colorFor(p.overall_score)} />
        ))}
      </svg>
      <div className="trend-caption">
        <span>{n} snapshots</span>
        <span style={{ color: colorFor(last.overall_score) }}>
          latest {last.overall_score}/100
        </span>
      </div>
    </div>
  );
}
