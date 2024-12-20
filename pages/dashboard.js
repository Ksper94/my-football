// pages/dashboard.js
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'

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
          .maybeSingle();

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
          setSubscription(null)
        } else if (!subData) {
          // Aucune ligne trouvée
          setSubscription(null)
        } else {
          setSubscription(subData);
          calculateTimeRemaining(subData.plan, subData.updated_at)
        }
      }
    };
    fetchSubscription();
  }, [user, loading])

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
      endDate = startDate;
    }

    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) {
      setTimeRemaining('Votre abonnement est expiré');
    } else {
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

          {subscription.token && (
            <div className="mt-4">
              <a
                href={`https://footballgit-bdx4ln4gduabscvzmzgnyk.streamlit.app/?token=${subscription.token}`}
                className="text-blue-500 hover:underline"
              >
                Accéder à l'appli Streamlit
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md mb-4 max-w-md">
          <p>Vous n'avez pas d'abonnement actif.</p>
          <a href="/pricing" className="text-blue-500 hover:underline">
            Découvrez nos formules
          </a>
        </div>
      )}
    </div>
  )
}
