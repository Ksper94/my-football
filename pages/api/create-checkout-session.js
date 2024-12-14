// pages/api/create-checkout-session.js

import { supabaseService } from '../../utils/supabaseService';
import Stripe from 'stripe';
import { supabaseClient } from '../../utils/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Requête POST reçue');
    console.log('Corps de la requête:', req.body);

    const { priceId } = req.body;

    if (!priceId) {
      console.error('priceId manquant dans la requête');
      return res.status(400).json({ error: 'Missing priceId' });
    }

    // Récupérer l'utilisateur actuel
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.error('Utilisateur non authentifié');
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
        metadata: {
          user_id: user.id, // Ajoutez l'ID utilisateur ici
        },
      });

      console.log('Session de checkout créée:', session.id);
      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.error('Erreur lors de la création de la session de checkout:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    console.warn(`Méthode HTTP ${req.method} non autorisée`);
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
