import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { signup, login } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function Login() {
  const { user, loginWith } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/routes" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const fn = mode === 'signup' ? signup : login;
      const { token, user } = await fn(email.trim(), password);
      loginWith(token, user);
      navigate('/routes');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card form auth-card">
        <h2>{mode === 'signup' ? 'Create account' : 'Log in'}</h2>
        <form onSubmit={submit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="at least 6 characters" required />
          </label>
          {error && <div className="auth-error">⚠️ {error}</div>}
          <button className="primary" type="submit" disabled={busy}>
            {busy ? '…' : mode === 'signup' ? 'Sign up' : 'Log in'}
          </button>
        </form>
        <p className="auth-toggle">
          {mode === 'signup' ? 'Already have an account?' : 'New here?'}{' '}
          <button type="button" className="link" onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(null); }}>
            {mode === 'signup' ? 'Log in' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  );
}
