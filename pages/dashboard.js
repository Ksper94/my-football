// pages/dashboard.js

import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import SubscribeButton from '../components/SubscribeButton';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.unsubscribe();
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

