// pages/success.js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { supabaseClient } from '../utils/supabaseClient' // Assurez-vous que ce fichier est correct
import Spinner from '../components/Spinner' // Assurez-vous que ce composant existe

export default function Success() {
  const router = useRouter()
  const { session_id } = router.query
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const fetchSession = async () => {
      if (!session_id) {
        setErrorMsg('Session invalide ou expirée. Veuillez réessayer.')
        setLoading(false)
        return
      }

      try {
        const { data, error: fetchError } = await supabaseClient
          .from('subscriptions') // Ajustez le nom de la table si nécessaire
          .select('*')
          .eq('session_id', session_id)
          .single()

        if (fetchError || !data) {
          console.error('Erreur lors de la récupération de la session :', fetchError)
          setErrorMsg('Erreur lors de la récupération des détails de l\'abonnement.')
        } else {
          setMessage('Votre abonnement a été créé avec succès !')
          // Actions supplémentaires si besoin
        }
      } catch (err) {
        console.error('Erreur inattendue lors de la récupération de la session:', err)
        setErrorMsg('Une erreur inattendue est survenue.')
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
        ) : errorMsg ? (
          <div>
            <h1 className="text-3xl font-bold mb-4 text-red-500">Erreur</h1>
            <p className="text-lg mb-6">{errorMsg}</p>
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

Success.propTypes = {
  // Pas nécessairement utile si aucun prop n'est passé
}
