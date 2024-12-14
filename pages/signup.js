// pages/signup.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabaseClient } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Signup() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log('Utilisateur inscrit:', data.user);
      router.push('/dashboard');
    }
  };

  // Rediriger si l'utilisateur est déjà connecté
  if (user) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Inscription</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          S'inscrire
        </button>
        <p className="mt-4 text-center">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Connectez-vous
          </Link>
        </p>
      </form>
    </div>
  );
}
