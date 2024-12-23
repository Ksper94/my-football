import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link'; // Import du composant Link
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        {/* Ajout du lien vers l'index */}
        <Link href="/">
          <h1 className="text-2xl font-bold cursor-pointer">Mon Application</h1>
        </Link>
        <nav>
          {user ? (
            // Bouton "Dashboard" si connecté
            <Link href="/dashboard">
              <span className="text-white hover:underline cursor-pointer">
                Tableau de bord
              </span>
            </Link>
          ) : (
            // Bouton "Se connecter" si non connecté
            <Link href="/login">
              <span className="text-white hover:underline cursor-pointer">
                Se connecter
              </span>
            </Link>
          )}
        </nav>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow container mx-auto p-4">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} Mon Application. Tous droits réservés.
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
