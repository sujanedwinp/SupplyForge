import { useState } from 'react';
import ShipmentForm from './ShipmentForm.jsx';
import RiskPanel from './RiskPanel.jsx';
import RouteCards from './RouteCards.jsx';
import NewsPanel from './NewsPanel.jsx';
import { analyzeShipment, saveRoute } from '../api.js';

export default function CheckRoute({ user, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [lastInput, setLastInput] = useState(null);
  const [saveMsg, setSaveMsg] = useState(null);

  const run = async (payload) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSaveMsg(null);
    setLastInput(payload);
    try {
      setResult(await analyzeShipment(payload));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!lastInput) return;
    const name = window.prompt('Name this route:', `${lastInput.origin} → ${lastInput.dest}`);
    if (!name) return;
    try {
      await saveRoute({ name, ...lastInput });
      setSaveMsg('Saved to your routes ✓');
      onSaved?.();
    } catch (e) {
      setSaveMsg(`Save failed: ${e.message}`);
    }
  };

  return (
    <div className="layout">
      <div className="left">
        <ShipmentForm onSubmit={run} loading={loading} />
      </div>
      <div className="right">
        {loading && <div className="card muted">Running risk &amp; route agents…</div>}
        {error && <div className="card error">⚠️ {error}</div>}
        {result && (
          <>
            <div className="card save-bar">
              <span className="muted small">Analysis for {result.shipment.origin} → {result.shipment.dest}</span>
              {user ? (
                <button className="secondary sm" onClick={save}>+ Save to my routes</button>
              ) : (
                <span className="muted small">Log in to save this route for daily tracking.</span>
              )}
            </div>
            {saveMsg && <div className="card muted small">{saveMsg}</div>}
            <RiskPanel risk={result.risk} weather={result.weather} incidents={result.matchedIncidents} />
            <RouteCards routes={result.routes} />
            <NewsPanel news={result.news} />
          </>
        )}
        {!loading && !error && !result && (
          <div className="card muted">Enter a shipment and hit “Analyze risk”. Works for any port worldwide.</div>
        )}
      </div>
    </div>
  );
}
