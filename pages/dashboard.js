// pages/dashboard.js

import { useAuth } from '../context/AuthContext';
import AccessStreamlit from '../components/AccessStreamlit';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <AccessStreamlit />
      {/* Autres contenus du dashboard */}
    </div>
  );
}

