// components/Navbar.js
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { supabaseClient } from '../utils/supabaseClient'
import { useRouter } from 'next/router'

export default function Navbar() {
  const { user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="text-white text-xl font-bold">Football Predictions</a>
        </Link>
        <div>
          {user ? (
            <>
              <Link href="/pricing">
                <a className="text-white mr-4">Tarifs</a>
              </Link>
              <button onClick={handleLogout} className="text-white">Déconnexion</button>
            </>
          ) : (
            <Link href="/login">
              <a className="text-white">Connexion</a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
