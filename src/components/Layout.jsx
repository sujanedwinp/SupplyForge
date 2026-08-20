import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import Avatar from '../Avatar.jsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">🚢 <span>RouteRisk</span></Link>

        <nav className="mainnav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>Home</NavLink>
          <NavLink to="/analyze" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>Check a route</NavLink>
          <NavLink to="/routes" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>My routes</NavLink>
        </nav>

        <div className="topbar-right">
          {user ? (
            <>
              <Link to="/profile" className="avatar-link" title="Profile">
                <Avatar seed={user.avatar_seed} size={34} />
              </Link>
              <button className="link" onClick={doLogout}>Log out</button>
            </>
          ) : (
            <Link to="/login" className="secondary sm">Log in</Link>
          )}
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
