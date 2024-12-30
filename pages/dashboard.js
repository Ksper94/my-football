import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  // On va stocker soit le profil venant de "profiles", soit un "profil virtuel"
  const [profile, setProfile] = useState(null);

  const [error, setError] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Redirect si pas connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // 1) Tenter de récupérer la ligne "profiles" depuis Supabase
  //    Si elle n’existe pas ou RLS bloquée, on se rabat sur user_metadata
  useEffect(() => {
    const fetchProfile = async () => {
      if (!loading && user) {
        try {
          const { data: profileData, error: profileError, status } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, username, full_name, avatar_url')
            .eq('id', user.id)
            .maybeSingle();

          if (profileError && status !== 406) {
            // status 406 = "not found" => pas de profil => pas forcément grave
            console.error('Erreur lors de la récupération du profil :', profileError.message);
            setError(profileError.message);
          }

          // Si on n’a pas de data ou qu’on a un 401, on utilise user_metadata
          if (!profileData) {
            // On crée un "fallback" à partir de user_metadata
            const fallbackProfile = {
              first_name: user.user_metadata?.first_name || '',
              last_name: user.user_metadata?.last_name || '',
              email: user.email, // l'email du compte
            };
            setProfile(fallbackProfile);
          } else {
            setProfile(profileData);
          }
        } catch (err) {
          // Si vraiment ça pète (ex: 401), on fait un fallback
          console.error('Erreur fetchProfile:', err);
          const fallbackProfile = {
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            email: user.email,
          };
          setProfile(fallbackProfile);
        }
      }
    };

    fetchProfile();
  }, [user, loading]);

  // 2) Récupérer la subscription (si elle existe)
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!loading && user) {
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('plan, status, token, updated_at')
          .eq('user_id', user.id)
          .maybeSingle();

        if (subError) {
          console.error("Erreur lors de la récupération de l'abonnement :", subError.message);
          setSubscription(null);
        } else if (!subData) {
          setSubscription(null);
        } else {
          setSubscription(subData);
          calculateTimeRemaining(subData.plan, subData.updated_at);
        }
      }
    };
    fetchSubscription();
  }, [user, loading]);

  // 3) Calculer le temps restant (mois, trimestre, annuel, etc.)
  const calculateTimeRemaining = (plan, updatedAt) => {
    const startDate = new Date(updatedAt);
    let endDate;

    if (plan === 'mensuel') {
      endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else if (plan === 'trimestriel') {
      endDate = new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000);
    } else if (plan === 'annuel') {
      endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    } else {
      // par défaut, on considère 30 jours
      endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) {
      setTimeRemaining('Votre abonnement est expiré');
    } else {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      setTimeRemaining(`Temps restant : ${days} jour(s)`);
    }
  };

  // 4) Gérer la déconnexion
  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error.message);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-8 transition-all duration-300">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {profile ? (
        <p className="mb-4">
          Bienvenue,{' '}
          <strong>
            {profile.first_name || 'Utilisateur'}
          </strong>{' '}
          {profile.last_name && profile.last_name}.
        </p>
      ) : (
        <p className="mb-4">Bienvenue !</p>
      )}

      {/* Bloc abonnement */}
      {subscription ? (
        <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md mb-4 max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Votre Abonnement
          </h2>
          <p>
            Plan : <strong>{subscription.plan}</strong>
          </p>
          <p>
            Status : <strong>{subscription.status}</strong>
          </p>
          <p>{timeRemaining}</p>

          {subscription.token && (
            <div className="mt-4">
              <a
                href={`https://footballgit-bdx4ln4gduabscvzmzgnyk.streamlit.app/?token=${subscription.token}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-link text-white py-2 px-4 rounded hover:bg-link-hover focus:outline-none focus:ring-2 focus:ring-blue-300">
                  Accéder à l'application Streamlit
                </button>
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md mb-4 max-w-md">
          <p>Vous n'avez pas d'abonnement actif.</p>
          <Link href="/pricing">
            <span className="text-link hover:text-link-hover cursor-pointer">
              Découvrez nos formules
            </span>
          </Link>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
      >
        Se déconnecter
      </button>
    </div>
  );
}
