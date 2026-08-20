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
    <form className="card form" onSubmit={submit}>
      <h2>Shipment</h2>
      <div className="grid2">
        <label>
          Origin port
          <input value={form.origin} onChange={update('origin')} placeholder="Shanghai" required />
        </label>
        <label>
          Destination port
          <input value={form.dest} onChange={update('dest')} placeholder="Rotterdam" required />
        </label>
      </div>
      <label>
        Cargo
        <input value={form.cargo} onChange={update('cargo')} placeholder="electronics" required />
      </label>
      <label>
        Budget (USD)
        <input type="number" value={form.budget ?? ''} onChange={update('budget')} placeholder="50000" />
      </label>

      <div className="examples">
        {EXAMPLES.map((ex, i) => (
          <button type="button" key={i} className="chip" onClick={() => setForm(ex)}>
            {ex.origin} → {ex.dest}
          </button>
        ))}
      </div>

      <button className="primary" type="submit" disabled={loading}>
        {loading ? 'Analyzing…' : 'Analyze risk'}
      </button>
    </form>
  );
}
