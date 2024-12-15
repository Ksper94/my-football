// pages/login.js

import { supabaseClient } from '../utils/supabaseClient';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const { setUser } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Connexion réussie !');
        setUser(data.user);
        router.push('/dashboard'); // Redirigez l'utilisateur vers le dashboard
      }
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      setError('Une erreur inattendue est survenue.');
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Se connecter</h2>
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
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {message && <p className="text-green-500 mt-2">{message}</p>}
    </form>
  );
};

export default Login;
