// components/SubscribeButton.js

import { useState } from 'react';
import { supabase } from '../utils/supabaseClient'; // Assurez-vous que supabaseClient est correctement configuré

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      // Obtenir la session actuelle de Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setError('Utilisateur non authentifié.');
        setLoading(false);
        return;
      }

      const token = session.access_token;

      // Créer une session de checkout en envoyant le token dans les en-têtes
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Inclure le token JWT ici
        },
        body: JSON.stringify({ priceId: 'price_1QUlyhHd1CTS1QCeLJfFF9Kj' }),
      });

      const data = await response.json();

      if (response.ok) {
        // Rediriger l'utilisateur vers Stripe Checkout
        window.location.href = data.url;
      } else {
        setError(data.error || 'Erreur lors de la création de la session de checkout.');
      }
    } catch (err) {
      console.error('Erreur lors de la requête:', err);
      setError('Erreur lors de la création de la session de checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? 'Chargement...' : 'S\'abonner'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
