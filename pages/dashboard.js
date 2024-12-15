// pages/dashboard.js

import { useAuth } from '../context/AuthContext';
import SubscribeButton from '../components/SubscribeButton';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!user) {
    return <p>Vous devez être connecté pour accéder au tableau de bord.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>Bienvenue, {user.email}!</p>
      <SubscribeButton />
      {/* Autres contenus du dashboard */}
    </div>
  );
}
