import { useState } from 'react';

const EXAMPLES = [
  { origin: 'Shanghai', dest: 'Rotterdam', cargo: 'electronics and rare earth magnets', budget: 50000 },
  { origin: 'Singapore', dest: 'Hamburg', cargo: 'consumer goods', budget: 30000 },
  { origin: 'Los Angeles', dest: 'Sydney', cargo: 'machinery', budget: 40000 },
];

export default function ShipmentForm({ onSubmit, loading }) {
  const [form, setForm] = useState(EXAMPLES[0]);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      origin: form.origin.trim(),
      dest: form.dest.trim(),
      cargo: form.cargo.trim(),
      budget: form.budget ? Number(form.budget) : null,
    });
  };

  return (
    <div className="card form">
      <form className="horizontal-form" onSubmit={submit}>
        <label>
          <span>Origin</span>
          <input value={form.origin} onChange={update('origin')} placeholder="Origin (e.g. Shanghai)" required />
        </label>
        <label>
          <span>Destination</span>
          <input value={form.dest} onChange={update('dest')} placeholder="Destination (e.g. Rotterdam)" required />
        </label>
        <label>
          <span>Cargo</span>
          <input value={form.cargo} onChange={update('cargo')} placeholder="Cargo (e.g. Electronics)" required />
        </label>
        <label>
          <span>Budget (USD)</span>
          <input type="number" value={form.budget ?? ''} onChange={update('budget')} placeholder="Budget (USD)" />
        </label>
        <button className="primary" type="submit" disabled={loading} style={{ padding: '10px 24px', whiteSpace: 'nowrap', borderRadius: '4px' }}>
          {loading ? 'Analyzing…' : 'Check a route →'}
        </button>
      </form>

      <div className="examples" style={{ marginTop: '16px' }}>
        {EXAMPLES.map((ex, i) => (
          <button type="button" key={i} className="chip" onClick={() => setForm(ex)}>
            {ex.origin} → {ex.dest}
          </button>
        ))}
      </div>
    </div>
  );
}
