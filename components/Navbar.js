import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation('navbar'); // Charger le namespace "navbar"

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login'); // Redirection après déconnexion
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error.message);
    }
  };

  if (loading) {
    return null; // Afficher un loader si nécessaire
  }

  return (
    <nav className="bg-background shadow-md p-4 flex justify-between items-center transition-all duration-300">
      <Link href="/" className="text-xl font-bold text-foreground">
        {t('siteTitle')} {/* Traduction de "Foot Predictions" */}
      </Link>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-foreground focus:outline-none"
        aria-label={t('menuToggle')} // Traduction pour "Ouvrir le menu"
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
          <Link href="/pricing" className="text-link hover:text-link-hover transition-colors duration-300">
            {t('pricing')} {/* Traduction pour "Tarifs" */}
          </Link>
          <Link href="/about" className="text-link hover:text-link-hover transition-colors duration-300">
            {t('about')} {/* Traduction pour "À propos" */}
          </Link>
          {user ? (
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-4 md:mt-0">
              <span className="text-foreground">{t('welcome', { email: user.email })}</span> {/* "Bienvenue, {email}" */}
              <button
                onClick={handleLogout}
                className="text-link hover:text-link-hover focus:outline-none mt-2 md:mt-0 transition-colors duration-300"
                aria-label={t('logout')} // Traduction pour "Se déconnecter"
              >
                {t('logout')} {/* Traduction pour "Se déconnecter" */}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-link hover:text-link-hover mt-4 md:mt-0 transition-colors duration-300"
            >
              {t('login')} {/* Traduction pour "Se connecter" */}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
