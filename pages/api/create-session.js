// pages/api/create-session.js

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Assurez-vous que la clé est bien définie
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-08-16', // Utilisez la version API appropriée
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Exemple de création d'une session de paiement
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'T-shirt',
              },
              unit_amount: 2000, // 20.00 USD
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.error('Erreur lors de la création de la session de paiement:', error.message);
      res.status(500).json({ error: 'Erreur lors de la création de la session de paiement.' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}
