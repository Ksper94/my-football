// pages/success.js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Success() {
  const router = useRouter()
  const { session_id } = router.query
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (session_id) {
      setMessage('Votre abonnement a été créé avec succès !')
      // Vous pouvez ajouter des actions supplémentaires ici, comme rediriger l'utilisateur
    }
  }, [session_id])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Succès !</h1>
        <p className="text-lg">{message}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  )
}
