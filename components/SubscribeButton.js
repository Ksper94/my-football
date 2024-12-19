// components/SubscribeButton.js
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../utils/supabaseClient';
import PropTypes from 'prop-types';

const SubscribeButton = ({ priceId }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!priceId) {
      setError('priceId est manquant.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!stripePublicKey) throw new Error('Clé publique Stripe manquante.');

      const stripe = await loadStripe(stripePublicKey);

      // Récupération de la session d'auth Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.access_token) {
        throw new Error('Utilisateur non authentifié.');
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur lors de la création de la session.');

      const { sessionId } = data;
      await stripe.redirectToCheckout({ sessionId });
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
