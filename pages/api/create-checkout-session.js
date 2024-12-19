// pages/api/create-checkout-session.js
import Stripe from 'stripe';
import { supabaseService } from '../../utils/supabaseService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token utilisateur manquant.' });
  }

  try {
    const { data: { user }, error: userError } = await supabaseService.auth.getUser(token);
    if (userError || !user) {
      console.error('Erreur d\'authentification:', userError?.message);
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    const { priceId } = req.body;
    if (!priceId) {
      return res.status(400).json({ error: 'priceId est requis.' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/pricing`,
      metadata: { user_id: user.id, price_id: priceId },
    });

    const { error: insertError } = await supabaseService
      .from('subscriptions')
      .insert([{
        user_id: user.id,
        session_id: session.id,
        price_id: priceId,
        plan: priceId,
        status: 'pending',
        updated_at: new Date().toISOString(),
      }]);

    if (insertError) {
      console.error('Erreur lors de l\'insertion dans subscriptions:', insertError.message);
      return res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'abonnement.' });
    }

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error.message);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}
