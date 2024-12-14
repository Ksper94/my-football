// pages/api/stripe-webhook.js

import { buffer } from 'micro';
import { supabaseService } from '../../utils/supabaseService';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET est requis.');
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET);
      console.log(`Webhook event ${event.type} reçu.`);
    } catch (err) {
      console.error('Erreur de signature du webhook:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Gérer l'événement
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionEvent(event.data.object);
        break;
      // Ajouter d'autres cas si nécessaire
      default:
        console.warn(`Événement non géré: ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}

async function handleCheckoutSessionCompleted(session) {
  console.log('Session de checkout complétée:', session.id);

  const userId = session.metadata.user_id;

  if (!userId) {
    console.error('user_id manquant dans la session metadata');
    return;
  }

  try {
    // Générer un token (JWT)
    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '30d' });
    console.log(`Token généré pour l'utilisateur ${userId}: ${token}`);

    // Insérer ou mettre à jour la table subscription avec le token
    const { data, error } = await supabaseService
      .from('subscription')
      .upsert(
        { user_id: userId, plan: 'premium', updated_at: new Date(), token: token },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Erreur lors de l\'upsert dans subscription:', error.message);
      throw error;
    }

    console.log('Abonnement mis à jour pour l\'utilisateur:', userId, 'Token:', token);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'abonnement:', error.message);
  }
}

async function handleSubscriptionEvent(subscription) {
  console.log('Événement de subscription:', subscription.id);

  const userId = subscription.metadata.user_id;

  if (!userId) {
    console.error('user_id manquant dans la subscription metadata');
    return;
  }

  try {
    let plan = 'free';
    if (subscription.status === 'active') {
      plan = 'premium';
    } else if (subscription.status === 'canceled' || subscription.status === 'past_due') {
      plan = 'canceled';
    }

    let token = null;
    if (plan === 'premium') {
      // Générer un token pour les utilisateurs premium
      token = jwt.sign({ userId }, jwtSecret, { expiresIn: '30d' });
      console.log(`Token généré pour l'utilisateur ${userId}: ${token}`);
    }

    // Mettre à jour la table subscription
    const { data, error } = await supabaseService
      .from('subscription')
      .upsert(
        { user_id: userId, plan: plan, updated_at: new Date(), token: token },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Erreur lors de l\'upsert dans subscription:', error.message);
      throw error;
    }

    console.log('Abonnement mis à jour pour l\'utilisateur:', userId, 'Plan:', plan);
    if (token) {
      console.log('Token généré:', token);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'abonnement:', error.message);
  }
}
