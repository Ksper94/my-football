// pages/dashboard.js
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Dashboard() {
  const { user, loading, authError } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (authError) {
      setError(authError.message || 'Erreur d\'authentification.');
    }
  }, [authError]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, username, full_name, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Erreur lors de la récupération du profil :', profileError.message);
        } else {
          setProfile(profileData);
        }
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {profile ? (
        <p className="mb-4">Bienvenue, <strong>{profile.email}</strong>!</p>
      ) : (
        <p className="mb-4">Bienvenue, {user && user.email}</p>
      )}
      <p className="mb-4">Vous n’avez pas d’abonnement actif.</p>
      <button
        onClick={() => router.push('/pricing')}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Choisir une formule
      </button>
    </div>
  );
}
