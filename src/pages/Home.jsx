import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const FEATURES = [
  { icon: '🌦️', title: 'Live weather', text: 'Corridor wind & precipitation from Open-Meteo.' },
  { icon: '🌍', title: 'World news', text: 'Real-time geopolitical & trade headlines via GDELT.' },
  { icon: '⚖️', title: 'Export controls', text: 'Sanctions & export-ban exposure for your cargo.' },
  { icon: '🚢', title: 'Alternate routes', text: 'When risk is high, get ranked alternatives by cost & carbon.' },
];

export default function Home() {
  const { user } = useAuth();
  return (
    <div>
      <section className="hero">
        <h1>Know the risk before you ship.</h1>
        <p className="hero-sub">
          Enter any shipment — origin, destination, cargo — and get a multi-agent
          risk assessment across weather, geopolitics, ports, and export controls,
          with recommended alternate routes. Works for any port on Earth.
        </p>
        <div className="hero-cta">
          <Link to="/analyze" className="primary btn-lg">Check a route →</Link>
          {user ? (
            <Link to="/routes" className="secondary btn-lg">My saved routes</Link>
          ) : (
            <Link to="/login" className="secondary btn-lg">Log in to save routes</Link>
          )}
        </div>
      </section>

      <section className="feature-grid">
        {FEATURES.map((f) => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </section>

      <section className="card how">
        <h2>How it works</h2>
        <ol className="how-steps">
          <li>Describe your shipment (from, to, cargo, budget).</li>
          <li>A Risk Agent scores four categories from live + curated data.</li>
          <li>If risk is high, a Route Agent proposes alternates, ranked by cost & carbon.</li>
          <li>Save routes to your profile — they’re auto-refreshed every 24h so you can watch the risk trend.</li>
        </ol>
      </section>
    </div>
  );
}
