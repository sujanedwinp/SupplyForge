const CATEGORY_LABELS = {
  weather: 'Weather',
  geopolitical: 'Geopolitical',
  port: 'Port',
  export_ban: 'Export / Sanctions',
};

function levelFromScore(score) {
  if (score >= 66) return 'high';
  if (score >= 33) return 'medium';
  return 'low';
}

export default function RiskPanel({ risk, weather, incidents }) {
  return (
    <div className="card">
      <div className="risk-header">
        <h2>Risk assessment</h2>
        <span className={`badge badge-${risk.overall_risk}`}>
          {risk.overall_risk.toUpperCase()} · {risk.overall_score}/100
        </span>
      </div>
      <p className="summary">{risk.summary}</p>

      <div className="categories">
        {Object.entries(risk.categories).map(([key, c]) => {
          const lvl = levelFromScore(c.score);
          return (
            <div key={key} className={`cat cat-${lvl}`}>
              <div className="cat-top">
                <span className="cat-name">{CATEGORY_LABELS[key] || key}</span>
                <span className="cat-score">{c.score}</span>
              </div>
              <div className="cat-flag">{c.flag}</div>
              <div className="meter">
                <div className={`meter-fill fill-${lvl}`} style={{ width: `${c.score}%` }} />
              </div>
              <div className="cat-why">{c.why}</div>
            </div>
          );
        })}
      </div>

      {weather?.summary && <p className="weather">🌊 {weather.summary}</p>}

      {incidents?.length > 0 && (
        <details className="incidents">
          <summary>{incidents.length} matched incident(s)</summary>
          <ul>
            {incidents.map((i) => (
              <li key={i.id}>
                <span className={`dot dot-${i.severity}`} />
                <strong>{i.title}</strong> — {i.summary}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
