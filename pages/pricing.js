// pages/pricing.js
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Stripe from 'stripe'; // Assurez-vous que Stripe est installé: npm install @stripe/stripe-js
import { loadStripe } from '@stripe/stripe-js';

export default function Pricing() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  const pricingPlans = [
    {
      name: 'Mensuel',
      price: '10€',
      priceId: 'price_1QUlyhHd1CTS1QCeLJfFF9Kj', // Remplacez par votre propre price_id Stripe
      features: [
        'Accès complet aux prédictions',
        'Mises à jour quotidiennes',
        'Support prioritaire',
      ],
    },
    {
      name: 'Trimestriel',
      price: '27€',
      priceId: 'price_1QUlzrHd1CTS1QCebhWYJdYv', // Remplacez par votre propre price_id Stripe
      features: [
        'Accès complet aux prédictions',
        'Mises à jour quotidiennes',
        'Support prioritaire',
        'Réduction de 10%',
      ],
    },
    {
      name: 'Annuel',
      price: '100€',
      priceId: 'price_1QUm0YHd1CTS1QCeSrmFSzI7', // Remplacez par votre propre price_id Stripe
      features: [
        'Accès complet aux prédictions',
        'Mises à jour quotidiennes',
        'Support prioritaire',
        'Réduction de 20%',
        'Accès anticipé aux nouvelles fonctionnalités',
      ],
    },
  ];

  const handleSubscribe = async (priceId) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // <-- Inclure les cookies dans la requête
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (res.ok && data.sessionId) {
        // Initialiser Stripe avec votre clé publique
        const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        setError(data.error || 'Erreur lors de la création de la session de paiement.');
      }
    } catch (err) {
      console.error('Erreur lors de la création de la session de paiement:', err);
      setError('Erreur lors de la création de la session de paiement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Nos Formules</h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        {pricingPlans.map((plan) => (
          <div key={plan.name} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">{plan.name}</h2>
            <p className="text-center text-4xl font-bold mb-6">{plan.price}</p>
            <ul className="mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center mb-2">
                  <svg
                    className="w-6 h-6 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              onClick={() => handleSubscribe(plan.priceId)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Chargement...' : "S'abonner"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}