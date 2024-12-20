// pages/dashboard.js
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient' // Assurez-vous que supabase est correctement importé

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      // L’utilisateur n’est pas connecté, on le redirige
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!loading && user && user.id) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, username, full_name, avatar_url')
            .eq('id', user.id)
            .single()
          
          if (profileError) {
            console.error('Erreur lors de la récupération du profil :', profileError.message)
            setError(profileError.message)
          } else {
            setProfile(profileData)
          }
        } catch (err) {
          console.error('Erreur inattendue lors de la récupération du profil :', err)
          setError("Une erreur inattendue est survenue.")
        }
      }
    }
    fetchProfile()
  }, [user, loading])

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
      {/* Ajoutez ici du contenu supplémentaire pour le dashboard */}
    </div>
  )
}
