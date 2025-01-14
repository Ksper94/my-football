// pages/pricing.js

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialiser Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Charger Stripe avec la clé publique
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Pricing() {
  // Tes différents plans
  const pricingPlans = [
    {
      name: 'Mensuel',
      price: '10€',
      priceId: 'price_1QecamHd1CTS1QCeA27YxMut',
      features: [
        'Accès complet aux prédictions',
        'Mises à jour quotidiennes',
        'Support prioritaire',
      ],
    },
    {
      name: 'Trimestriel',
      price: '27€',
      priceId: 'price_1QecgvHd1CTS1QCeMNW7A4TZ',
      features: [
        'Accès complet aux prédictions',
        'Mises à jour quotidiennes',
        'Support premium',
      ],
    },
    {
      name: 'Annuel',
      price: '100€',
      priceId: 'price_1QecifHd1CTS1QCe6v6bKejO',
      features: [
        'Accès complet aux prédictions',
        'Mises à jour quotidiennes',
        'Support premium VIP',
      ],
    },
  ];

  const { user } = useAuth();
  const router = useRouter();

  // Gérer l'abonnement
  const handleSubscription = async (priceId) => {
    // Vérifier que l'utilisateur est connecté
    if (!user) {
      alert('Vous devez être connecté pour souscrire à un abonnement.');
      router.push('/login');
      return;
    }

    // Récupérer le prénom depuis user.user_metadata
    const firstName = user?.user_metadata?.first_name;
    alert(`Merci, ${firstName || 'Utilisateur'}, de souscrire à notre plan !`);

    try {
      // Récupération du token JWT avec Supabase
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        throw new Error('Impossible de récupérer le token utilisateur.');
      }

      const token = session.access_token;

      // Appel à l'API pour créer la session Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            'Erreur lors de la création de la session de paiement.'
        );
      }

      const { sessionId } = await response.json();

      // Charger Stripe (clé publique)
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('La clé publique Stripe est manquante ou invalide.');
      }

      // Redirection vers la page de paiement Stripe
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Erreur lors de la redirection vers Stripe:', error.message);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
        Choisissez votre abonnement
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingPlans.map((plan) => (
          <div
            key={plan.priceId}
            className="bg-white p-6 rounded-lg shadow-md text-gray-900"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {plan.name}
            </h2>
            <p className="text-2xl font-semibold mb-4 text-gray-900">
              {plan.price}
            </p>
            <ul className="mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-gray-700">
                  - {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscription(plan.priceId)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              S'abonner
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
