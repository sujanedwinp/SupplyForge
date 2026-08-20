import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { useState, useEffect } from 'react';

const FEATURES = [
  { title: 'Live weather', text: 'Corridor wind & precipitation from Open-Meteo.' },
  { title: 'World news', text: 'Real-time geopolitical & trade headlines via GDELT.' },
  { title: 'Export controls', text: 'Sanctions & export-ban exposure for your cargo.' },
  { title: 'Alternate routes', text: 'When risk is high, get ranked alternatives by cost & carbon.' },
];

export default function Home() {
  const { user } = useAuth();

  const [animStep, setAnimStep] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimStep(1), 500);
    const t2 = setTimeout(() => setAnimStep(2), 1500); // ms
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 10 && !scrolled) {
        setScrolled(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrolled]);

  return (
    <div style={{ minHeight: scrolled ? 'auto' : '150vh' }}>
      <section className="hero">
        <h1>
          <span>Know the <i>risk</i></span>
          <span style={{ opacity: animStep >= 1 ? 1 : 0, transition: 'opacity 0.4s' }}>, before you <i>ship</i>.</span>
        </h1>
        <div style={{ opacity: animStep >= 2 ? 1 : 0, transition: 'opacity 0.4s', transform: animStep >= 2 ? 'translateY(0)' : 'translateY(10px)' }}>
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
        </div>
      </section>

      <div style={{ opacity: scrolled ? 1 : 0, transition: 'opacity 0.8s ease-in, transform 0.8s ease-out', transform: scrolled ? 'translateY(0)' : 'translateY(40px)', pointerEvents: scrolled ? 'auto' : 'none' }}>
        <section className="feature-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`feature-card ${i === 0 || i === 3 ? 'ivory' : ''}`}>
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
    </div>
  );
}
