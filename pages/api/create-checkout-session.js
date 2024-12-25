import Stripe from 'stripe';
import { supabaseService } from '../../utils/supabaseService';
import jwt from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

// Mapping price_id → nom de plan
const planMapping = {
  'price_1QUlyhHd1CTS1QCeLJfFF9Kj': 'mensuel',
  'price_1QUlzrHd1CTS1QCebhWYJdYv': 'trimestriel',
  'price_1QUm0YHd1CTS1QCeSrmFSzI7': 'annuel'
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

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    console.error('Token utilisateur manquant');
    return res.status(401).json({ error: 'Token utilisateur manquant.' });
  }

  try {
    // Authentification de l'utilisateur via Supabase
    const { data: { user }, error: userError } = await supabaseService.auth.getUser(token);
    if (userError || !user) {
      console.error('Erreur d\'authentification:', userError?.message);
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    const { priceId } = req.body;
    if (!priceId) {
      console.error('priceId manquant');
      return res.status(400).json({ error: 'priceId est requis.' });
    }

    console.log('Création de la session Stripe pour priceId:', priceId, 'et utilisateur:', user.email);

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
      metadata: { user_id: user.id, price_id: priceId },
    });

    console.log('Session Stripe créée avec succès. Session ID:', session.id);

    // Déterminer le nom du plan à partir du price_id
    const planName = planMapping[priceId] || 'mensuel';
    const userId = user.id;

    // Générer un token d'accès pour l'utilisateur
    const generatedToken = jwt.sign({ userId }, jwtSecret, { expiresIn: '30d' });

    console.log('Token généré pour l\'utilisateur:', userId);

    // Insérer l'abonnement dans la base de données
    const { error: insertError } = await supabaseService
      .from('subscriptions')
      .insert([{
        user_id: user.id,
        session_id: session.id,
        price_id: priceId,
        plan: planName,
        token: generatedToken,
        status: 'pending',
        updated_at: new Date().toISOString(),
      }]);

    if (insertError) {
      console.error('Erreur lors de l\'insertion dans subscriptions:', insertError.message);
      return res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'abonnement.' });
    }

    console.log('Abonnement inséré dans la base de données avec succès.');

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error.message);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}
