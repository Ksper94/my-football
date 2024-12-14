// components/ProtectedRoute.js
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === null) { // Vérifiez si user est null
      router.push('/login')
    }
  }, [user, router])

  if (user === null) { // Renvoyez null si l'utilisateur n'est pas connecté
    return null
  }

  return children
}
