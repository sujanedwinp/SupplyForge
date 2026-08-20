import { useState, useEffect } from 'react';
import ShipmentForm from './ShipmentForm.jsx';
import RiskPanel from './RiskPanel.jsx';
import RouteCards from './RouteCards.jsx';
import NewsPanel from './NewsPanel.jsx';
import { analyzeShipment, saveRoute } from '../api.js';

const AGENT_STEPS = [
  {
    agent: 'DATA AGENT',
    action: 'Parsing trade corridors & geocoding ports',
    status: 'SYNCED'
  },
  {
    agent: 'FEED AGENT',
    action: 'Streaming GDELT global news & Open-Meteo weather',
    status: 'FETCHING'
  },
  {
    agent: 'RISK AGENT',
    action: 'Evaluating geopolitical hazards & port delays via LLM',
    status: 'ANALYZING'
  },
  {
    agent: 'ROUTE AGENT',
    action: 'Calculating low-risk alternate sea lines & carbon metrics',
    status: 'OPTIMIZING'
  },
  {
    agent: 'SYNTHESIZER',
    action: 'Finalizing risk scores & route recommendation payload',
    status: 'READY'
  }
];

export default function CheckRoute({ user, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [lastInput, setLastInput] = useState(null);
  const [saveMsg, setSaveMsg] = useState(null);

  useEffect(() => {
    let interval;

    if (loading) {
      setActiveStep(0);

      interval = setInterval(() => {
        setActiveStep((prev) =>
          prev < AGENT_STEPS.length - 1 ? prev + 1 : prev
        );
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [loading]);

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

    const name = window.prompt(
      'Name this route:',
      `${lastInput.origin} → ${lastInput.dest}`
    );

    if (!name) return;

    try {
      await saveRoute({ name, ...lastInput });
      setSaveMsg('Saved to your routes ✓');
      onSaved?.();
    } catch (e) {
      setSaveMsg(`Save failed: ${e.message}`);
    }
  };

  const progress = Math.min(
    ((activeStep + 1) / AGENT_STEPS.length) * 100,
    100
  );

  return (
    <div
      className="layout"
      style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      <style>{`
        @keyframes progressSweep {
          0% {
            transform: translateX(-120%);
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          85% {
            opacity: 1;
          }

          100% {
            transform: translateX(500%);
            opacity: 0;
          }
        }

        @keyframes redPulse {
          0%, 100% {
            box-shadow:
              0 0 0 0 rgba(225, 60, 50, 0),
              0 0 14px rgba(225, 60, 50, 0.18);
          }

          50% {
            box-shadow:
              0 0 0 5px rgba(225, 60, 50, 0.06),
              0 0 26px rgba(225, 60, 50, 0.42);
          }
        }

        @keyframes nodePulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.25);
            opacity: 0.65;
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }

          100% {
            transform: translateY(400%);
          }
        }

        @keyframes gridMove {
          from {
            background-position: 0 0;
          }

          to {
            background-position: 40px 40px;
          }
        }

        .premium-loader {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(225, 60, 50, 0.075),
              transparent 32%
            ),
            #0b0f14;
          border: 1px solid rgba(255, 255, 255, 0.09);
          box-shadow:
            0 24px 70px rgba(0, 0, 0, 0.42),
            inset 0 1px 0 rgba(255, 255, 255, 0.045);
        }

        .premium-loader::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.22;
          background-image:
            linear-gradient(
              rgba(255,255,255,0.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.025) 1px,
              transparent 1px
            );
          background-size: 40px 40px;
          animation: gridMove 8s linear infinite;
        }

        .premium-loader::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(225, 60, 50, 0.025),
            transparent
          );
          animation: scan 5s linear infinite;
          pointer-events: none;
        }

        .loader-content {
          position: relative;
          z-index: 2;
        }

        .loader-kicker {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.16em;
          color: #7d8794;
          text-transform: uppercase;
        }

        .loader-live {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #E13C32;
          animation: nodePulse 1.4s ease-in-out infinite;
          box-shadow: 0 0 14px rgba(225, 60, 50, 0.8);
        }

        .loader-percent {
          font-size: 32px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #f5f7fa;
          font-variant-numeric: tabular-nums;
        }

        .loader-percent-symbol {
          font-size: 13px;
          color: #E13C32;
          margin-left: 2px;
          font-weight: 700;
        }

        .premium-track {
          position: relative;
          height: 10px;
          width: 100%;
          border-radius: 999px;
          background: #171c23;
          border: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
          box-shadow:
            inset 0 2px 5px rgba(0,0,0,0.45);
        }

        .premium-track-fill {
          position: relative;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #9e211b 0%,
            #E13C32 65%,
            #ff7169 100%
          );
          box-shadow:
            0 0 16px rgba(225, 60, 50, 0.55);
          overflow: hidden;
        }

        .premium-track-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 28%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.8),
            transparent
          );
          filter: blur(1px);
          animation: progressSweep 1.8s ease-in-out infinite;
        }

        .agent-pipeline {
          position: relative;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          margin-top: 28px;
        }

        .agent-pipeline-line {
          position: absolute;
          left: 5%;
          right: 5%;
          top: 15px;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .agent-node {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 0;
        }

        .agent-dot {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #11161d;
          border: 1px solid rgba(255,255,255,0.12);
          color: #4b5563;
          font-size: 11px;
          font-weight: 800;
          transition: all 0.4s ease;
        }

        .agent-node.done .agent-dot {
          background: #171b20;
          border-color: rgba(225, 60, 50, 0.55);
          color: #E13C32;
        }

        .agent-node.active .agent-dot {
          background: #E13C32;
          border-color: #ff8078;
          color: white;
          animation: redPulse 1.8s ease-in-out infinite;
        }

        .agent-label {
          margin-top: 10px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #515b68;
          text-align: center;
          white-space: nowrap;
          transition: color 0.3s ease;
        }

        .agent-node.done .agent-label {
          color: #89929d;
        }

        .agent-node.active .agent-label {
          color: #f1f3f5;
        }

        .agent-action {
          margin-top: 5px;
          font-size: 9px;
          line-height: 1.4;
          color: #46505c;
          text-align: center;
          max-width: 125px;
        }

        .agent-node.active .agent-action {
          color: #9da5af;
        }

        .loader-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 28px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.07);
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
          color: #4f5965;
        }

        @media (max-width: 650px) {
          .agent-pipeline {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .agent-pipeline-line {
            display: none;
          }

          .agent-node {
            flex-direction: row;
            gap: 10px;
            align-items: center;
          }

          .agent-action {
            text-align: left;
            max-width: none;
            margin-top: 0;
          }

          .loader-footer {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <ShipmentForm onSubmit={run} loading={loading} />

      <div
        className="results-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          marginTop: '24px'
        }}
      >
        {loading && (
          <div
            className="card premium-loader"
            style={{
              padding: '30px',
              borderRadius: '18px'
            }}
          >
            <div className="loader-content">

              {/* HEADER */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginBottom: '24px'
                }}
              >
                <div>
                  <div className="loader-kicker">
                    <span className="loader-live" />
                    LIVE INTELLIGENCE PIPELINE
                  </div>

                  <div
                    style={{
                      marginTop: '9px',
                      fontSize: '19px',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: '#f4f5f6'
                    }}
                  >
                    Analyzing maritime corridor
                  </div>

                  <div
                    style={{
                      marginTop: '5px',
                      fontSize: '11px',
                      color: '#697481'
                    }}
                  >
                    Coordinating autonomous risk and routing agents
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="loader-percent">
                    {Math.round(progress)}
                    <span className="loader-percent-symbol">%</span>
                  </div>

                  <div
                    style={{
                      marginTop: '5px',
                      fontSize: '9px',
                      letterSpacing: '0.12em',
                      color: '#555f6b'
                    }}
                  >
                    PIPELINE
                  </div>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="premium-track">
                <div
                  className="premium-track-fill"
                  style={{
                    width: `${progress}%`,
                    transition:
                      'width 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
                  }}
                />
              </div>

              {/* AGENT PIPELINE */}
              <div className="agent-pipeline">
                <div className="agent-pipeline-line" />

                {AGENT_STEPS.map((step, idx) => {
                  const isActive = idx === activeStep;
                  const isDone = idx < activeStep;

                  return (
                    <div
                      key={idx}
                      className={[
                        'agent-node',
                        isDone ? 'done' : '',
                        isActive ? 'active' : ''
                      ].join(' ')}
                    >
                      <div className="agent-dot">
                        {isDone
                          ? '✓'
                          : String(idx + 1).padStart(2, '0')}
                      </div>

                      <div className="agent-label">
                        {step.agent}
                      </div>

                      <div className="agent-action">
                        {isActive
                          ? step.action
                          : isDone
                            ? 'Completed'
                            : 'Queued'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FOOTER */}
              {lastInput && (
                <div className="loader-footer">
                  <span>
                    {lastInput.origin.toUpperCase()} →{' '}
                    {lastInput.dest.toUpperCase()}
                  </span>

                  <span>
                    {lastInput.cargo
                      ? lastInput.cargo.toUpperCase()
                      : 'GENERAL CARGO'}
                  </span>

                  <span style={{ color: '#E13C32' }}>
                    ● SECURE PROCESSING
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="card error">
            ⚠️ {error}
          </div>
        )}

        {result && (
          <>
            <div className="card save-bar">
              <span className="muted small">
                Analysis for{' '}
                {result.shipment?.origin || lastInput?.origin} →{' '}
                {result.shipment?.dest || lastInput?.dest}
              </span>

              {user ? (
                <button
                  className="secondary sm"
                  onClick={save}
                >
                  + Save to my routes
                </button>
              ) : (
                <span className="muted small">
                  Log in to save this route for daily tracking.
                </span>
              )}
            </div>

            {saveMsg && (
              <div className="card muted small">
                {saveMsg}
              </div>
            )}

            <RiskPanel
              risk={result.risk}
              weather={result.weather}
              incidents={result.matchedIncidents}
            />

            <RouteCards routes={result.routes} />

            <NewsPanel news={result.news} />
          </>
        )}

        {!loading && !error && !result && (
          <div
            className="card muted"
            style={{ textAlign: 'center' }}
          >
            Enter a shipment and hit “Check a route”. Works for any
            port worldwide.
          </div>
        )}
      </div>
    </div>
  );
}