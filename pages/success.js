// pages/success.js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { supabaseClient } from '../utils/supabaseClient' // Si vous avez besoin d'interagir avec Supabase
import Spinner from '../components/Spinner' // Un composant spinner réutilisable

export default function Success() {
  const router = useRouter()
  const { session_id } = router.query
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSession = async () => {
      if (!session_id) {
        setError('Session invalide ou expirée. Veuillez réessayer.')
        setLoading(false)
        return
      }

      try {
        // Exemple : Récupérer la session depuis Supabase ou Stripe
        const { data, error } = await supabaseClient
          .from('subscriptions') // Remplacez par votre table appropriée
          .select('*')
          .eq('session_id', session_id)
          .single()

        if (error || !data) {
          setError('Erreur lors de la récupération des détails de l\'abonnement.')
        } else {
          setMessage('Votre abonnement a été créé avec succès !')
          // Vous pouvez ajouter des actions supplémentaires ici, comme envoyer des e-mails ou enregistrer des données supplémentaires
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de la session:', err)
        setError('Une erreur inattendue est survenue.')
      } finally {
        setLoading(false)
      }
    }

    if (router.isReady) {
      fetchSession()
    }
  }, [session_id, router.isReady])

  const handleReturnHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
        {loading ? (
          <Spinner />
        ) : error ? (
          <div>
            <h1 className="text-3xl font-bold mb-4 text-red-500">Erreur</h1>
            <p className="text-lg mb-6">{error}</p>
            <button
              onClick={handleReturnHome}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Retour à l'accueil"
            >
              Retour à l'accueil
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-4">Succès !</h1>
            <p className="text-lg mb-6">{message}</p>
            <button
              onClick={handleReturnHome}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Retour à l'accueil"
            >
              Retour à l'accueil
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

Success.propTypes = {}

