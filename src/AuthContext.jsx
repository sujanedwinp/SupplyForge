import { createContext, useContext, useEffect, useState } from 'react';
import { me, getToken, setToken, clearToken } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) { setReady(true); return; }
    me()
      .then(({ user }) => setUser(user))
      .catch(() => clearToken())
      .finally(() => setReady(true));
  }, []);

  const loginWith = (token, u) => {
    setToken(token);
    setUser(u);
  };
  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, ready, loginWith, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
