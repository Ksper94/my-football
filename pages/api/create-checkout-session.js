// pages/api/create-checkout-session.js

import { supabaseAdmin } from '../../utils/supabaseClient';
import Stripe from 'stripe';
import cookie from 'cookie';

// Initialiser Stripe avec votre clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Parser les cookies de la requête
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    console.log('Cookies reçus:', cookies);

    const token = cookies['sb-access-token'] || '';
    console.log('Token extrait:', token);

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // Récupérer l'utilisateur authentifié à partir du token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    console.log('Résultat de getUser:', { user, userError });

    if (userError || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Récupérer les données de la requête (par exemple, l'ID du prix Stripe)
    const { priceId } = req.body;
    console.log('Price ID reçu:', priceId);

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Créer une session de paiement Stripe directement avec priceId
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Utiliser priceId directement
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      customer_email: user.email, // Optionnel : Associe l'email de l'utilisateur
    });
    console.log('Session Stripe créée:', session.id);

    // Renvoyer l'ID de la session Stripe au frontend
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
