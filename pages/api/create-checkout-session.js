// pages/api/create-checkout-session.js

import { supabaseService } from '../../utils/supabaseService'; // Utilisez supabaseService
import Stripe from 'stripe';

// Initialisation de Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

// Activer le body parser pour JSON
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Requête POST reçue');

    const { priceId } = req.body;

    if (!priceId) {
      console.error('priceId manquant dans la requête');
      return res.status(400).json({ error: 'Missing priceId' });
    }

    // Extraire le token d'authentification depuis l'en-tête Authorization
    const authHeader = req.headers.authorization;
    console.log('En-tête Authorization:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Utilisateur non authentifié');
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extrait:', token);

    try {
      // Utiliser Supabase pour obtenir l'utilisateur à partir du token
      const { data: { user }, error: userError } = await supabaseService.auth.getUser(token);

      if (userError || !user) {
        console.error('Utilisateur non trouvé ou erreur lors de la récupération de l\'utilisateur');
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      const userId = user.id; // Récupérer l'ID utilisateur

      if (!userId) {
        console.error('user_id manquant dans le token');
        return res.status(400).json({ error: 'ID utilisateur manquant dans le token.' });
      }

      // Créer la session de checkout avec les métadonnées utilisateur
      const sessionStripe = await stripe.checkout.sessions.create({
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
          user_id: userId, // Ajouter l'ID utilisateur aux métadonnées
        },
      });

      console.log('Session de checkout créée:', sessionStripe.id);
      res.status(200).json({ url: sessionStripe.url });
    } catch (error) {
      console.error('Erreur lors de la création de la session de checkout:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    console.warn(`Méthode HTTP ${req.method} non autorisée`);
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
