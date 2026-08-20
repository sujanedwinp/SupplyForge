export default function RouteCards({ routes }) {
  if (!routes?.length) return null;

  return (
    <div className="card">
      <h2>Routes</h2>
      <div className="routes">
        {routes.map((r, i) => (
          <div key={i} className={`route ${r.recommended ? 'route-rec' : ''}`}>
            <div className="route-top">
              <span className="route-name">{r.name}</span>
              {r.recommended && <span className="rec-tag">✓ Recommended</span>}
            </div>
            <div className="route-path">{r.waypoints.join(' → ')}</div>
            {r.rationale && <div className="route-rationale">{r.rationale}</div>}
            <div className="route-stats">
              <span className={`pill pill-${r.risk}`}>{r.risk} risk</span>
              <span className="stat">${Number(r.cost).toLocaleString()}</span>
              <span className="stat">{r.carbon} t CO₂</span>
              <span className="stat muted">{Number(r.distanceKm).toLocaleString()} km</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
