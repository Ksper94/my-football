import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSubscription = async (priceId) => {
    if (!user) {
      alert('Vous devez être connecté pour souscrire à un abonnement.');
      router.push('/login');
      return;
    }

    try {
      const token = supabase.auth.session()?.access_token; // Récupère le token JWT

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Envoi du token JWT
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la session de paiement.');
      }

      const { sessionId } = await response.json();
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Erreur lors de la redirection vers Stripe:', error.message);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Choisissez votre plan</h1>
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => handleSubscription('price_1QUlyhHd1CTS1QCeLJfFF9Kj')}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Mensuel - 10€
        </button>
        <button
          onClick={() => handleSubscription('price_1QUlzrHd1CTS1QCebhWYJdYv')}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Trimestriel - 25€
        </button>
        <button
          onClick={() => handleSubscription('price_1QUm0YHd1CTS1QCeSrmFSzI7')}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Annuel - 90€
        </button>
      </div>
    </div>
  );
}
