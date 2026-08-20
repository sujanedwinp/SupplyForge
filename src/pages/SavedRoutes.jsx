import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listRoutes, refreshRoute, deleteRoute } from '../api.js';

function riskBadge(risk, score) {
  if (!risk) return <span className="badge badge-medium">not analyzed</span>;
  return <span className={`badge badge-${risk}`}>{risk.toUpperCase()} · {score}/100</span>;
}

export default function SavedRoutes() {
  const [routes, setRoutes] = useState(null);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setError(null);
    try {
      const { routes } = await listRoutes();
      setRoutes(routes);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const doRefresh = async (id) => {
    setBusyId(id);
    try { await refreshRoute(id); await load(); }
    catch (e) { setError(e.message); }
    finally { setBusyId(null); }
  };

  const doDelete = async (id) => {
    setBusyId(id);
    try { await deleteRoute(id); await load(); }
    catch (e) { setError(e.message); }
    finally { setBusyId(null); }
  };

  return (
    <div>
      <div className="page-head" style={{ textAlign: 'center', paddingTop: '40px' }}>
        <h1>My routes</h1>
        <p className="muted">Saved routes are re-analyzed automatically every 24h.</p>
      </div>

      {error && <div className="card error">⚠️ {error}</div>}
      {!routes && <div className="card muted">Loading…</div>}
      {routes && routes.length === 0 && (
        <div className="card muted">
          No saved routes yet. Analyze one in <Link to="/analyze" className="link">Check a route</Link> and click “Save to my routes”.
        </div>
      )}

      {routes && routes.length > 0 && (
        <div className="routes">
          <div className="saved-route label-caps" style={{ borderBottom: '1px solid var(--surface-2)', paddingBottom: '8px', color: 'var(--text-muted)' }}>
            <div>Route Name</div>
            <div>Path & Cargo</div>
            <div>Status</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>
          {routes.map((r) => (
            <div key={r.id} className="route saved-route">
              <div className="route-top">
                <button className="link route-name" onClick={() => navigate(`/routes/${r.id}`)}>{r.name}</button>
                <div className="muted small">last refreshed {r.last_refreshed_at ? new Date(r.last_refreshed_at).toLocaleDateString() : 'never'}</div>
              </div>
              <div className="route-path">
                {r.origin} → {r.dest}
                <div className="muted small">{r.cargo}</div>
              </div>
              <div>
                {riskBadge(r.current_risk, r.current_score)}
              </div>
              <div className="saved-actions">
                <button className="secondary sm" onClick={() => navigate(`/routes/${r.id}`)}>Open</button>
                <button className="secondary sm" onClick={() => doRefresh(r.id)} disabled={busyId === r.id}>
                  {busyId === r.id ? '…' : '↻ Refresh'}
                </button>
                <button className="danger sm" onClick={() => doDelete(r.id)} disabled={busyId === r.id}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
