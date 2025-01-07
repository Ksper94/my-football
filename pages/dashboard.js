import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');

  // 1) Rediriger si pas connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // 2) Initialiser "profile" depuis user_metadata (pas de table profiles)
  useEffect(() => {
    if (!loading && user) {
      const fallbackProfile = {
        first_name: user?.user_metadata?.first_name || '',
        last_name: user?.user_metadata?.last_name || '',
        email: user.email,
      };
      setProfile(fallbackProfile);
    }
  }, [user, loading]);

  // 3) Récupérer la subscription (si elle existe)
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!loading && user) {
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('plan, status, token, updated_at, stripe_subscription_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (subError) {
          console.error(
            "Erreur lors de la récupération de l'abonnement :",
            subError.message
          );
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

  // 4) Calculer le temps restant (mensuel, trimestriel, annuel...)
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

  // 5) Gérer la déconnexion
  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error.message);
    }
  };

  /**
   * 6) Nouvelle fonction : Résilier à la fin de la période
   */
  const handleCancelAtPeriodEnd = async () => {
    try {
      if (!user) {
        alert("Vous devez être connecté pour résilier.");
        return;
      }

      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error('Erreur depuis /api/cancel-subscription:', errData);
        alert('Impossible de résilier à la fin de la période.');
        return;
      }

      const data = await response.json();
      if (data.success) {
        alert('Votre abonnement sera résilié à la fin de la période.');
        // Optionnel: rechargement ou mise à jour de l'état local
        setSubscription((prev) => {
          if (!prev) return prev;
          return { ...prev, status: 'cancel_pending' };
        });
      } else {
        alert(data.error || 'Une erreur est survenue.');
      }
    } catch (err) {
      console.error('Erreur interne :', err);
      alert("Erreur interne lors de la résiliation.");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-8 transition-all duration-300">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {profile ? (
        <p className="mb-4">
          Bienvenue, <strong>{profile.first_name || 'Utilisateur'}</strong>
          {profile.last_name ? ` ${profile.last_name}` : ''} !
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

          {/* Bouton pour accéder à l'application Streamlit si un token est présent */}
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

          {/* Boutons de résiliation : seulement si status = 'active' */}
          {subscription.status === 'active' && (
            <div className="mt-4 space-x-2">
              <button
                onClick={() => router.push('/resiliation')}
                className="text-sm bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300"
              >
                Annuler (par email)
              </button>

              <button
                onClick={handleCancelAtPeriodEnd}
                className="text-sm bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
              >
                Résilier à la fin de la période
              </button>
            </div>
          )}

          {/* Si le statut est déjà "cancel_pending", afficher un message */}
          {subscription.status === 'cancel_pending' && (
            <div className="mt-4">
              <p className="text-yellow-700 font-semibold">
                Votre résiliation est programmée à la fin de la période en cours.
              </p>
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
