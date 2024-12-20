// components/Navbar.js
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Navbar = () => {
  const { user, loading, signOut, authError } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error.message);
    }
  };

  if (loading) {
    return null; // Afficher un loader si nécessaire
  }

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">Football Predictions</Link>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-gray-700 focus:outline-none"
        aria-label="Ouvrir le menu"
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'transform rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <div className={`md:flex items-center ${isOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col md:flex-row md:space-x-6">
          <Link href="/pricing" className="text-blue-500 hover:underline">Tarifs</Link>
          <Link href="/about" className="text-blue-500 hover:underline">À propos</Link>
          {user ? (
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-4 md:mt-0">
              <span className="text-gray-700">Bienvenue, {user.email}</span>
              <button
                onClick={handleLogout}
                className="text-blue-500 hover:underline focus:outline-none mt-2 md:mt-0"
                aria-label="Se déconnecter"
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-blue-500 hover:underline mt-4 md:mt-0">
              Se connecter
            </Link>
          )}
        </div>
      </div>
      {authError && <p className="text-red-500 mt-2">{authError.message}</p>}
    </nav>
  );
};

export default Navbar;
