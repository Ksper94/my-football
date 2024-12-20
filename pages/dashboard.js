import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'
import Link from 'next/link'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [subscription, setSubscription] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!loading && user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, username, full_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Erreur lors de la récupération du profil :', profileError.message);
          setError(profileError.message)
        } else {
          setProfile(profileData);
        }
      }
    };
    fetchProfile();
  }, [user, loading])

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!loading && user) {
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('plan, status, token, updated_at')
          .eq('user_id', user.id)
          .maybeSingle();

        if (subError) {
          console.error('Erreur lors de la récupération de l\'abonnement :', subError.message);
          // Pas d'abonnement ? L'utilisateur peut-être pas encore souscrit
          // Vous pouvez choisir de ne pas afficher d'erreur si pas d'abonnement
          setSubscription(null)
        } else {
          setSubscription(subData);
          // Calcul du temps restant
          calculateTimeRemaining(subData.plan, subData.updated_at)
        }
      }
    };
    fetchSubscription();
  }, [user, loading])

  const calculateTimeRemaining = (plan, updatedAt) => {
    // Convertir updatedAt en date
    const startDate = new Date(updatedAt);
    let endDate;

    // Ajustez la durée selon votre logique d'abonnement
    // Par exemple, si plan = 'mensuel', durée = 30 jours
    // Si plan = 'annuel', durée = 365 jours
    if (plan === 'mensuel') {
      endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else if (plan === 'trimestriel') {
      endDate = new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000);
    } else if (plan === 'annuel') {
      endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    } else {
      // Si pas de plan défini, pas de calcul
      endDate = startDate;
    }

    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) {
      setTimeRemaining('Votre abonnement est expiré');
    } else {
      // Calculer nombre de jours restants
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      setTimeRemaining(`Temps restant : ${days} jour(s)`);
    }
  }

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {profile ? (
        <p className="mb-4">Bienvenue, <strong>{profile.email}</strong>!</p>
      ) : (
        <p className="mb-4">Bienvenue !</p>
      )}

      {subscription ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-4 max-w-md">
          <h2 className="text-2xl font-semibold mb-2">Votre Abonnement</h2>
          <p>Plan : <strong>{subscription.plan}</strong></p>
          <p>Status : <strong>{subscription.status}</strong></p>
          <p>{timeRemaining}</p>

          {/* Lien vers l'appli Streamlit */}
          {/* Supposons que subscription.token est le token dont vous avez besoin pour l'accès */}
          {subscription.token && (
            <div className="mt-4">
              <Link href={`https://footballgit-bdx4ln4gduabscvzmzgnyk.streamlit.app/?token=${subscription.token}`}>
                <span className="text-blue-500 hover:underline cursor-pointer">
                  Accéder à l'appli Streamlit
                </span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md mb-4 max-w-md">
          <p>Vous n'avez pas d'abonnement actif.</p>
          <Link href="/pricing">
            <span className="text-blue-500 hover:underline cursor-pointer">
              Découvrez nos formules
            </span>
          </Link>
        </div>
      )}
    </div>
  )
}
