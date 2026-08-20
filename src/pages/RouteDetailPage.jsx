import { useParams, useNavigate } from 'react-router-dom';
import RouteDetail from '../components/RouteDetail.jsx';

export default function RouteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <RouteDetail routeId={id} onBack={() => navigate('/routes')} />;
}
