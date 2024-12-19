// pages/login.js

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { user, loading, authError, signIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await signIn(email, password);
      if (error) {
        alert(error.message);
      } else {
        router.push('/');
      }
    } catch (error) {
      alert('Erreur lors de la connexion. Veuillez réessayer.');
    }
  };

  // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
  if (!loading && user) {
    router.push('/');
    return <p>Redirection en cours...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Connexion</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Se connecter
        </button>
      </form>
      {authError && <p className="text-red-500 mt-4">{authError.message}</p>}
    </div>
  );
}
