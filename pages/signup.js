import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Veuillez renseigner un email et un mot de passe.');
      return;
    }

    try {
      await signUp(email, password);
      setSuccess('Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Créer un compte</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 border rounded"
        />
        <button
          onClick={handleSignUp}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Créer un compte
        </button>
      </div>
    </div>
  );
}
