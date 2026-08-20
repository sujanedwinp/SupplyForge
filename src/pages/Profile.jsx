import { useState } from 'react';
import { updateProfile } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import Avatar from '../Avatar.jsx';

const INDUSTRIES = [
  '', 'Freight forwarding', 'Manufacturing', 'Retail / E-commerce', 'Automotive',
  'Electronics', 'Pharmaceuticals', 'Agriculture / Food', 'Energy', 'Chemicals', 'Other',
];

function randomSeed() {
  // client-side random seed for avatar shuffle
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    display_name: user.display_name || '',
    org_name: user.org_name || '',
    org_industry: user.org_industry || '',
    org_country: user.org_country || '',
  });
  const [seed, setSeed] = useState(user.avatar_seed);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const { user: updated } = await updateProfile({ ...form, avatar_seed: seed });
      setUser(updated);
      setMsg('Profile saved ✓');
    } catch (err) {
      setMsg(`Save failed: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="page-head">
        <h1>Profile</h1>
        <p className="muted">Your details and organization. These personalize your dashboard.</p>
      </div>

      <div className="profile-grid">
        <div className="card avatar-card">
          <Avatar seed={seed} size={96} />
          <div className="avatar-name">{form.display_name || user.email}</div>
          {form.org_name && <div className="muted small">{form.org_name}</div>}
          <button type="button" className="secondary sm" onClick={() => setSeed(randomSeed())}>🎲 Shuffle avatar</button>
        </div>

        <form className="card form" onSubmit={save}>
          <label>
            Display name
            <input value={form.display_name} onChange={update('display_name')} placeholder="Your name" />
          </label>
          <label>
            Email
            <input value={user.email} disabled />
          </label>
          <h3 className="section-title">Organization</h3>
          <label>
            Organization name
            <input value={form.org_name} onChange={update('org_name')} placeholder="Acme Logistics" />
          </label>
          <div className="grid2">
            <label>
              Industry
              <select value={form.org_industry} onChange={update('org_industry')}>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i || '— select —'}</option>)}
              </select>
            </label>
            <label>
              HQ country
              <input value={form.org_country} onChange={update('org_country')} placeholder="India" />
            </label>
          </div>
          {msg && <div className="muted small">{msg}</div>}
          <button className="primary" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
        </form>
      </div>
    </div>
  );
}
