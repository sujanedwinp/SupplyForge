import { useEffect, useState } from 'react';
import { getRoute, refreshRoute } from '../api.js';
import RiskPanel from './RiskPanel.jsx';
import RouteCards from './RouteCards.jsx';
import NewsPanel from './NewsPanel.jsx';
import TrendSparkline from './TrendSparkline.jsx';

export default function RouteDetail({ routeId, onBack }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setError(null);
    try {
      setData(await getRoute(routeId));
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, [routeId]);

  const doRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      await refreshRoute(routeId);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setRefreshing(false);
    }
  };

  if (error) return <div className="card error">⚠️ {error} <button className="link" onClick={onBack}>Back</button></div>;
  if (!data) return <div className="card muted">Loading…</div>;

  const { route, history, latest } = data;

  return (
    <div>
      <div className="detail-head">
        <button className="link" onClick={onBack}>← My routes</button>
        <button className="secondary" onClick={doRefresh} disabled={refreshing}>
          {refreshing ? 'Refreshing…' : '↻ Refresh now'}
        </button>
      </div>

      <div className="card">
        <h2>{route.name}</h2>
        <div className="route-path">{route.origin} → {route.dest}</div>
        <div className="muted small">Cargo: {route.cargo}{route.budget ? ` · Budget $${Number(route.budget).toLocaleString()}` : ''}</div>
        <div className="muted small">
          Last refreshed: {route.last_refreshed_at ? new Date(route.last_refreshed_at).toLocaleString() : 'never'}
        </div>
        <h3 className="trend-title">Risk trend</h3>
        <TrendSparkline history={history} />
      </div>

      {latest ? (
        <>
          <RiskPanel risk={latest.risk} weather={latest.weather} incidents={latest.matchedIncidents} />
          <RouteCards routes={latest.routes} />
          <NewsPanel news={latest.news} />
        </>
      ) : (
        <div className="card muted">No analysis yet — hit “Refresh now”.</div>
      )}
    </div>
  );
}
