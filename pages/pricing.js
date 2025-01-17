import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';
import { useTranslation } from 'react-i18next'; // Import pour les traductions

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Pricing() {
  const { t } = useTranslation('pricing'); // Namespace "pricing"
  const { user } = useAuth();
  const router = useRouter();

  const plans = [
    {
      id: 'monthly',
      priceId: 'price_1QecamHd1CTS1QCeA27YxMut'
    },
    {
      id: 'quarterly',
      priceId: 'price_1QecgvHd1CTS1QCeMNW7A4TZ'
    },
    {
      id: 'yearly',
      priceId: 'price_1QecifHd1CTS1QCe6v6bKejO'
    }
  ];

  const handleSubscription = async (priceId) => {
    if (!user) {
      alert(t('loginPrompt'));
      router.push('/login');
      return;
    }

    try {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();

      if (error || !session) {
        throw new Error('Unable to fetch user session.');
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ priceId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session.');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe public key is missing or invalid.');
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error during subscription:', error.message);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
        {t('title')}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white p-6 rounded-lg shadow-md text-gray-900"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {t(`plans.${plan.id}.name`)}
            </h2>
            <p className="text-2xl font-semibold mb-4 text-gray-900">
              {t(`plans.${plan.id}.price`)}
            </p>
            <ul className="mb-6">
              {t(`plans.${plan.id}.features`, { returnObjects: true }).map(
                (feature, index) => (
                  <li key={index} className="text-gray-700">
                    - {feature}
                  </li>
                )
              )}
            </ul>
            <button
              onClick={() => handleSubscription(plan.priceId)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              {t('subscribeButton')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
