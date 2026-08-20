import CheckRoute from '../components/CheckRoute.jsx';
import { useAuth } from '../AuthContext.jsx';

export default function Analyze() {
  const { user } = useAuth();
  return (
    <div>
      <div className="page-head">
        <h1>Check a route</h1>
        <p className="muted">Analyze any shipment worldwide. Log in to save it for daily tracking.</p>
      </div>
      <CheckRoute user={user} />
    </div>
  );
}
