// pages/api/webhooks/stripe.js
import { buffer } from 'micro';
import { supabaseService } from '../../../utils/supabaseService';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Utilisez la version par défaut

export const config = {
  api: { bodyParser: false },
};

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET est requis.');
}

// Mapping price_id → nom de plan
const planMapping = {
  'price_1QUlyhHd1CTS1QCeLJfFF9Kj': 'mensuel',
  'price_1QUlzrHd1CTS1QCebhWYJdYv': 'trimestriel',
  'price_1QUm0YHd1CTS1QCeSrmFSzI7': 'annuel'
};

async function handleCheckoutSessionCompleted(session) {
  console.log('--- Traitement de checkout.session.completed ---');
  console.log('Session ID:', session.id);
  
  const userId = session.metadata?.user_id;
  const priceId = session.metadata?.price_id;

  console.log('user_id:', userId);
  console.log('price_id:', priceId);

  if (!userId) {
    console.error('user_id manquant dans les métadonnées de la session Stripe');
    throw new Error('user_id manquant');
  }

  if (!priceId) {
    console.error('price_id manquant dans les métadonnées de la session Stripe');
    throw new Error('price_id manquant');
  }

  try {
    // Générer le token JWT
    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '30d' });
    console.log(`Token JWT généré pour l'utilisateur ${userId}:`, token);

    // Déterminer le nom du plan
    const planName = planMapping[priceId] || 'mensuel';
    console.log(`Plan déterminé: ${planName}`);

    // Préparer les données pour l'upsert
    const subscriptionData = {
      user_id: userId,
      session_id: session.id,
      price_id: priceId,
      plan: planName,
      token: token,
      status: 'active',
      updated_at: new Date().toISOString(),
    };

    console.log('Données d\'abonnement à insérer/mise à jour:', subscriptionData);

    // Effectuer l'upsert dans Supabase
    const { error } = await supabaseService
      .from('subscriptions')
      .upsert([subscriptionData], { onConflict: 'session_id' });

    if (error) {
      console.error('Erreur lors de l\'upsert dans subscriptions:', error.message);
      throw error;
    }

    console.log(`Abonnement inséré/activé avec succès pour l'utilisateur ${userId}`);
  } catch (error) {
    console.error('Erreur lors de l\'insertion dans Supabase:', error.message);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log(`Webhook Stripe reçu: ${event.type}`);
  } catch (err) {
    console.error('Erreur de signature du webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      // ... Autres cas si besoin
      default:
        console.warn(`Événement non géré: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erreur lors du traitement de l\'événement:', error.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}
