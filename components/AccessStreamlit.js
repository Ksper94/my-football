// components/AccessStreamlit.js

import { useState } from 'react';
import axios from 'axios';

export default function AccessStreamlit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAccess = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/get-streamlit-token');
      const { token } = response.data;

      // Rediriger vers Streamlit avec le token
      window.location.href = `https://your-streamlit-app.com/?token=${token}`;
    } catch (err) {
      console.error('Erreur lors de la récupération du token:', err);
      setError('Impossible d\'accéder à Streamlit. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleAccess}
        disabled={loading}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? 'Accès en cours...' : 'Accéder à Streamlit'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
