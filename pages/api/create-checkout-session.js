import Stripe from 'stripe';
import { supabaseService } from '../../utils/supabaseService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const planMapping = {
  'price_1QecamHd1CTS1QCeA27YxMut': 'mensuel',
  'price_1QecgvHd1CTS1QCeMNW7A4TZ': 'trimestriel',
  'price_1QecifHd1CTS1QCe6v6bKejO': 'annuel',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    console.error('Token JWT manquant');
    return res.status(401).json({ error: 'Utilisateur non authentifié. Token JWT manquant.' });
  }

  try {
    const { data: { user }, error: userError } = await supabaseService.auth.getUser(token);
    if (userError || !user) {
      console.error('Erreur d\'authentification Supabase:', userError?.message || 'Utilisateur inexistant');
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    const { priceId } = req.body;
    if (!priceId || !planMapping[priceId]) {
      console.error('Plan d\'abonnement invalide ou priceId manquant');
      return res.status(400).json({ error: 'Plan d\'abonnement invalide.' });
    }

    console.log('Création de la session Stripe avec les métadonnées :', {
      user_id: user.id,
      plan: planMapping[priceId],
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/pricing`,
      metadata: { user_id: user.id, plan: planMapping[priceId] },
    });

    console.log('Session Stripe créée avec succès:', session.id);

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error.message);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}
