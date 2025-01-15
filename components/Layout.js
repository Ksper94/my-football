import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header
        className="
          bg-gradient-to-r from-gray-900 to-gray-800
          text-white
          p-4
          flex
          justify-between
          items-center
          shadow-lg
          rounded-b-md
        "
      >
        {/* Logo / Titre */}
        <Link href="/">
          <h1
            className="
              text-2xl font-bold text-cyan-400 cursor-pointer
              hover:scale-105
              transition-transform duration-300
            "
          >
            Foot Predictions
          </h1>
        </Link>

        {/* Nav */}
        <nav className="flex items-center space-x-6">
          {user ? (
            <Link href="/dashboard">
              <span
                className="
                  text-cyan-400
                  hover:text-cyan-200
                  transition-colors
                  duration-300
                  cursor-pointer
                  font-semibold
                "
              >
                Tableau de bord
              </span>
            </Link>
          ) : (
            <Link href="/login">
              <span
                className="
                  text-cyan-400
                  hover:text-cyan-200
                  transition-colors
                  duration-300
                  cursor-pointer
                  font-semibold
                "
              >
                Se connecter
              </span>
            </Link>
          )}
        </nav>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow container mx-auto p-6">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="
          bg-gray-900
          text-gray-400
          p-4
          text-center
          text-sm
          rounded-t-md
          shadow-inner
        "
      >
        &copy; {new Date().getFullYear()} Foot Predictions. Tous droits réservés.
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
