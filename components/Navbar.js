// components/Navbar.js
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-500">
          Football Predictions
        </Link>
        <div>
          {user ? (
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-500 mr-4">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="text-gray-700 hover:text-blue-500 mr-4">
              Connexion
            </Link>
          )}
          <Link href="/pricing" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Tarifs
          </Link>
        </div>
      </div>
    </nav>
  )
}
