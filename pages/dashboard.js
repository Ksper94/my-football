// pages/dashboard.js

import { useEffect, useState } from 'react';
import { supabaseClient } from '../utils/supabaseClient'; // Utilisez supabaseClient
import SubscribeButton from '../components/SubscribeButton';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (session && session.user) {
        setUser(session.user);
      }
    };

    fetchUser();

    // Écouter les changements d'état d'authentification
    const { data: authListener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!user) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <SubscribeButton />
      {/* Autres contenus du dashboard */}
    </div>
  );
}
