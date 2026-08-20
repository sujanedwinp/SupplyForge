const TOKEN_KEY = 'scr_token';

// Base URL for the deployed backend (Cloudflare tunnel). Override with VITE_API_BASE if needed.
const API_BASE = 'http://localhost:8000' || 'https://phillips-factors-alan-incidence.trycloudflare.com';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// --- ad-hoc analysis ---
export const analyzeShipment = (payload) => request('/api/analyze', { method: 'POST', body: payload });

// --- auth ---
export const signup = (email, password) => request('/api/auth/signup', { method: 'POST', body: { email, password } });
export const login = (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } });
export const me = () => request('/api/auth/me', { auth: true });
export const updateProfile = (payload) => request('/api/auth/profile', { method: 'PUT', body: payload, auth: true });

// --- saved routes ---
export const listRoutes = () => request('/api/routes', { auth: true });
export const getRoute = (id) => request(`/api/routes/${id}`, { auth: true });
export const saveRoute = (payload) => request('/api/routes', { method: 'POST', body: payload, auth: true });
export const refreshRoute = (id) => request(`/api/routes/${id}/refresh`, { method: 'POST', auth: true });
export const deleteRoute = (id) => request(`/api/routes/${id}`, { method: 'DELETE', auth: true });
