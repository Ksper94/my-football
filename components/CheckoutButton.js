// components/CheckoutButton.js
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

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
        credentials: 'include',
        body: JSON.stringify({ priceId: productId, email: user.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erreur lors de la création de la session de paiement:', data.error);
        throw new Error(data.error || "Une erreur est survenue lors de la création de la session.");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Erreur lors de l’initialisation de Stripe.');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (stripeError) {
        console.error('Erreur lors de la redirection vers Checkout:', stripeError);
        throw new Error(stripeError.message);
      }

    } catch (err) {
      console.error('Erreur lors de la requête de paiement:', err);
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
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
