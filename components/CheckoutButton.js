// components/CheckoutButton.js

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialiser Stripe en dehors du composant pour éviter de le recharger à chaque rendu
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutButton({ productId }) {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Inclure les cookies dans la requête
        body: JSON.stringify({ priceId: productId, email: user.email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Obtenir l'instance Stripe
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe failed to initialize.');
        }
        // Rediriger vers la page de paiement Stripe
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
        if (stripeError) {
          console.error('Erreur lors de la redirection vers Checkout:', stripeError);
          setError(stripeError.message);
        }
      } else {
        console.error('Erreur lors de la création de la session de paiement:', data.error);
        setError(data.error);
      }
    } catch (error) {
      console.error('Erreur lors de la requête de paiement:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Chargement...' : 'Acheter'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
