// pages/api/check-subscription.js

import { supabaseService } from '../../utils/supabaseService';
import Joi from 'joi';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Cors from 'cors';
import initMiddleware from '../../utils/init-middleware';

// Fonction de comparaison sécurisée (pour éviter timing attacks)
const secureCompare = (a, b) => {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};

// On attend un champ "token" (string)
const schema = Joi.object({
  token: Joi.string().required(),
});

// On récupère la clé pour JWT
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET est requis dans les variables d'environnement.");
}

// Initialisation du middleware Cors
const cors = initMiddleware(
  Cors({
    methods: ['POST', 'OPTIONS'],
    origin: 'https://footballgit-bdx4ln4gduabscvzmzgnyk.streamlit.app', // Adapter selon votre domaine
  })
);

// Petit helper pour calculer le nombre de jours entre 2 dates
function daysBetween(date1, date2) {
  const msBetween = date2.getTime() - date1.getTime();
  return Math.floor(msBetween / (1000 * 60 * 60 * 24));
}

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      success: false,
      message: 'Méthode non autorisée. Utilisez POST.',
    });
  }

  console.log('Requête reçue à /api/check-subscription');

  // Validation du body
  const { error, value } = schema.validate(req.body);
  if (error) {
    console.error('Validation échouée :', error.details[0].message);
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  const { token } = value;
  console.log('Token reçu :', token);

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    console.log('Décodage JWT réussi :', decoded);
  } catch (err) {
    console.error('Erreur de vérification du token JWT :', err.message);
    return res
      .status(403)
      .json({ success: false, message: 'Token invalide ou expiré.' });
  }

  const userId = decoded.userId;
  console.log("Recherche d'abonnement pour userId :", userId);

  try {
    // On récupère la subscription correspondante
    const { data, error: subscriptionError } = await supabaseService
      .from('subscriptions')
      .select('plan, token, status, created_at')
      .eq('user_id', userId)
      .single();

    if (subscriptionError || !data) {
      console.error(
        "Erreur lors de la récupération de l'abonnement :",
        subscriptionError?.message
      );
      return res
        .status(400)
        .json({ success: false, message: 'Abonnement non trouvé.' });
    }

    console.log('Abonnement trouvé :', data);

    // On compare le token stocké avec celui reçu (sécurité)
    if (!secureCompare(data.token || '', token)) {
      console.error('Le token stocké ne correspond pas au token fourni.');
      return res.status(403).json({ success: false, message: 'Token invalide.' });
    }

    // -- GESTION DU TRIAL --
    if (data.plan === 'trial' && data.status === 'active') {
      const createdAt = new Date(data.created_at);
      const now = new Date();
      const diffDays = daysBetween(createdAt, now);
      console.log(`Trial commencé depuis ${diffDays} jour(s)`);

      if (diffDays < 7) {
        // => Période d'essai encore active
        console.log('Trial valide => accès autorisé.');
        return res
          .status(200)
          .json({ success: true, message: 'Accès trial valide.' });
      } else {
        // => Expiré
        console.warn('Trial expiré => on met status=expired et on refuse');
        await supabaseService
          .from('subscriptions')
          .update({ status: 'expired' })
          .eq('user_id', userId);
        return res
          .status(403)
          .json({ success: false, message: 'Trial expiré.' });
      }
    }

    // -- GESTION DES PLANS PAYANTS --
    const allowedPlans = ['mensuel', 'trimestriel', 'annuel'];
    if (!allowedPlans.includes(data.plan)) {
      console.error('Plan non valide ou pas autorisé :', data.plan);
      return res
        .status(403)
        .json({ success: false, message: 'Abonnement non valide.' });
    }

    if (!['active', 'cancel_pending'].includes(data.status)) {
      console.error("L'abonnement existe, mais il est inactif :", data.status);
      return res
        .status(403)
        .json({ success: false, message: 'Abonnement inactif.' });
    }

    // Si on arrive ici => tout va bien (plan mensuel, etc. + status actif)
    console.log('Validation réussie pour userId :', userId);
    return res.status(200).json({ success: true, message: 'Token valide.' });
  } catch (err) {
    console.error('Erreur lors de la vérification du token :', err.message);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
    });
  }
}
