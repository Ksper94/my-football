import Stripe from 'stripe';
import { supabaseService } from '../../utils/supabaseService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

// Vérification des plans d'abonnement
const planMapping = {
  'price_1QUlyhHd1CTS1QCeLJfFF9Kj': 'mensuel',
  'price_1QUlzrHd1CTS1QCebhWYJdYv': 'trimestriel',
  'price_1QUm0YHd1CTS1QCeSrmFSzI7': 'annuel',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  // Extraction du token JWT depuis les en-têtes
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    console.error('Token JWT manquant');
    return res.status(401).json({ error: 'Utilisateur non authentifié. Token JWT manquant.' });
  }

  try {
    // Authentification de l'utilisateur avec Supabase
    const { data: { user }, error: userError } = await supabaseService.auth.getUser(token);
    if (userError || !user) {
      console.error('Erreur d\'authentification Supabase:', userError?.message || 'Utilisateur inexistant');
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    // Vérification des paramètres requis
    const { priceId } = req.body;
    if (!priceId) {
      console.error('priceId manquant dans la requête');
      return res.status(400).json({ error: 'Le champ priceId est requis.' });
    }

    if (!Object.keys(planMapping).includes(priceId)) {
      console.error(`Plan d'abonnement invalide: ${priceId}`);
      return res.status(400).json({ error: 'Plan d\'abonnement invalide.' });
    }

    console.log('Utilisateur authentifié avec succès:', user.email);

    // Création de la session Stripe
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
      metadata: { user_id: user.id, plan: planMapping[priceId] },
    });

    console.log('Session Stripe créée avec succès:', session.id);

    // Retourner l'ID de la session Stripe au frontend
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error.message);
    res.status(500).json({ error: 'Erreur interne du serveur. Veuillez réessayer plus tard.' });
  }
}
