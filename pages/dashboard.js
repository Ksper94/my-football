// pages/dashboard.js

import { useAuth } from '../context/AuthContext';
import SubscribeButton from '../components/SubscribeButton';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function Dashboard() {
  const { user, loading, authError } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (authError) {
      setError(authError.message || 'Erreur d\'authentification.');
    }
  }, [authError]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="mb-4">Bienvenue, <strong>{user.email}</strong>!</p>
      <SubscribeButton />
      {/* Autres contenus du dashboard */}
    </div>
  );
}

/**
 * Composant Spinner pour l'indicateur de chargement
 */
function Spinner() {
  return (
    <svg
      className="animate-spin h-10 w-10 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Chargement"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
  );
}

Spinner.propTypes = {};

SubscribeButton.propTypes = {};
