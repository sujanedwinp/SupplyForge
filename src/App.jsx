import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { useAuth } from './AuthContext.jsx';
import Home from './pages/Home.jsx';
import Analyze from './pages/Analyze.jsx';
import SavedRoutes from './pages/SavedRoutes.jsx';
import RouteDetailPage from './pages/RouteDetailPage.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';

function Protected({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div className="card muted">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="analyze" element={<Analyze />} />
        <Route path="routes" element={<Protected><SavedRoutes /></Protected>} />
        <Route path="routes/:id" element={<Protected><RouteDetailPage /></Protected>} />
        <Route path="profile" element={<Protected><Profile /></Protected>} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
