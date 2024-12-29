import { buffer } from 'micro';
import { supabaseService } from '../../utils/supabaseService';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export const config = {
  api: { bodyParser: false },
};

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET est requis.');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET);
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
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionEvent(event.data.object);
        break;
      default:
        console.warn(`Événement non géré: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erreur lors du traitement de l\'événement:', error.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

async function handleCheckoutSessionCompleted(session) {
  console.log('Session de checkout complétée :', session);

  const userId = session.metadata?.user_id;
  if (!userId) {
    console.error('user_id manquant dans les métadonnées de la session Stripe');
    return;
  }

  try {
    const plan = session.metadata.plan || 'unknown';
    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '30d' });

    const { error } = await supabaseService
      .from('subscriptions')
      .upsert(
        [
          {
            user_id: userId,
            session_id: session.id,
            plan,
            token,
            status: 'active',
            updated_at: new Date(),
          },
        ],
        { onConflict: 'user_id' }
      );

    if (error) throw error;
    console.log(`Abonnement inséré/activé avec succès pour l'utilisateur ${userId}`);
  } catch (error) {
    console.error('Erreur lors de l\'insertion dans Supabase:', error.message);
    throw error;
  }
}

async function handleSubscriptionEvent(subscription) {
  console.log('Événement de subscription :', subscription.id);

  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error('user_id manquant dans les métadonnées de la subscription');
    return;
  }

  try {
    const plan = subscription.metadata.plan || 'unknown';
    const status = subscription.status;

    const token = status === 'active' ? jwt.sign({ userId }, jwtSecret, { expiresIn: '30d' }) : null;

    const { error } = await supabaseService
      .from('subscriptions')
      .upsert(
        [
          {
            user_id: userId,
            session_id: subscription.id,
            plan,
            token,
            status,
            updated_at: new Date(),
          },
        ],
        { onConflict: 'user_id' }
      );

    if (error) throw error;
    console.log(`Abonnement mis à jour pour l'utilisateur ${userId} : Plan ${plan}, Status ${status}`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'abonnement:', error.message);
    throw error;
  }
}
