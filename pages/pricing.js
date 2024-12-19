// pages/pricing.js

import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SubscribeButton from '../components/SubscribeButton';

export default function Pricing() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const pricingPlans = [
    {
      name: 'Mensuel',
      price: '10€',
      priceId: 'price_1QUlyhHd1CTS1QCeLJfFF9Kj',
      features: [
        'Accès complet aux prédictions',
        'Mises à jour quotidiennes',
        'Support prioritaire',
      ],
    },
    {
      name: 'Trimestriel',
      price: '27€',
      priceId: 'price_1QUlzrHd1CTS1QCebhWYJdYv',
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Nos Formules</h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        {pricingPlans.map((plan) => (
          <div key={plan.priceId} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
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
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <SubscribeButton priceId={plan.priceId} />
          </div>
        ))}
      </div>
    </div>
  );
}
