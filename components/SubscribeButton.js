import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';

const SubscribeButton = ({ priceId }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async () => {
    if (!user) {
      router.push('/login'); // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
      return;
    }

    if (!priceId) {
      setError('Le plan d\'abonnement est introuvable (priceId manquant).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Initialiser Stripe
      const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!stripePublicKey) throw new Error('Clé publique Stripe manquante.');

      const stripe = await loadStripe(stripePublicKey);
      if (!stripe) throw new Error('Erreur lors de l’initialisation de Stripe.');

      // Appel à l'API backend pour créer une session Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Récupère le token JWT de Supabase
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      // Gestion des erreurs de l'API
      if (!response.ok || !data.sessionId) {
        throw new Error(data.error || 'Erreur lors de la création de la session Stripe.');
      }

      // Redirection vers la page de paiement Stripe
      const { sessionId } = data;
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      if (stripeError) throw new Error(stripeError.message);
    } catch (err) {
      console.error('Erreur lors de l\'abonnement:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSubscribe}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Chargement...' : 'S\'abonner'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

SubscribeButton.propTypes = {
  priceId: PropTypes.string.isRequired,
};

export default SubscribeButton;
