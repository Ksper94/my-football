import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import SubscribeButton from '../components/SubscribeButton';

export default function Pricing() {
  const pricingPlans = [
    {
      name: 'Mensuel',
      price: '10€',
      priceId: 'price_1QUlyhHd1CTS1QCeLJfFF9Kj',
      features: ['Accès complet aux prédictions', 'Mises à jour quotidiennes', 'Support prioritaire'],
    },
    {
      name: 'Trimestriel',
      price: '27€',
      priceId: 'price_1QUlzrHd1CTS1QCebhWYJdYv',
      features: ['Accès complet aux prédictions', 'Mises à jour quotidiennes', 'Support prioritaire', 'Réduction de 10%'],
    },
    {
      name: 'Annuel',
      price: '100€',
      priceId: 'price_1QUm0YHd1CTS1QCeSrmFSzI7',
      features: [
        'Accès complet aux prédictions',
        'Mises à jour quotidiennes',
        'Support prioritaire',
        'Réduction de 20%',
        'Accès anticipé aux nouvelles fonctionnalités',
      ],
    },
  ];

  const handleSubscription = async (priceId) => {
    try {
      // Rediriger vers la page de paiement
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await response.json();

      if (!sessionId) {
        throw new Error('Session de paiement introuvable.');
      }

      const stripe = await getStripe(); // Initialisation de Stripe
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Erreur lors de la redirection vers le paiement :', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 transition-all duration-300">
      <h1 className="text-4xl font-bold text-center mb-8">Nos Formules</h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        {pricingPlans.map((plan) => (
          <div
            key={plan.priceId}
            className="w-full max-w-sm bg-white text-gray-900 p-6 rounded-lg shadow-lg transition-colors duration-300"
          >
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">{plan.name}</h2>
            <p className="text-center text-4xl font-bold mb-6">{plan.price}</p>
            <ul className="mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center mb-2">
                  <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscription(plan.priceId)}
              className="bg-link text-white py-2 px-4 rounded hover:bg-link-hover focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              S'abonner
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

async function getStripe() {
  if (!window.Stripe) {
    const stripeJs = await import('@stripe/stripe-js');
    return stripeJs.loadStripe('votre-clé-publique-Stripe'); // Remplacez par votre clé publique Stripe
  }
  return window.Stripe;
}
