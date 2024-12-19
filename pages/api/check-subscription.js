// pages/api/check-subscription.js

import { supabaseService } from '../../utils/supabaseService';
import Joi from 'joi';
import crypto from 'crypto';

/**
 * Comparaison sécurisée des chaînes de caractères pour éviter les attaques par timing.
 * @param {string} a - Première chaîne à comparer.
 * @param {string} b - Deuxième chaîne à comparer.
 * @returns {boolean} - Vrai si les chaînes sont identiques, faux sinon.
 */
const secureCompare = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return crypto.timingSafeEqual(bufA, bufB);
};

/**
 * Schéma de validation des entrées avec Joi.
 */
const schema = Joi.object({
  token: Joi.string().required(),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Méthode non autorisée.' });
  }

  // Validation du corps de la requête
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const { token } = value;

  try {
    // Utiliser Supabase pour obtenir l'utilisateur à partir du token
    const { data: { user }, error: userError } = await supabaseService.auth.getUser(token);

    if (userError || !user) {
      return res.status(403).json({ success: false, message: 'Token invalide ou expiré.' });
    }

    const userId = user.id;

    // Vérifier dans la table subscription si l'utilisateur a un abonnement premium valide
    const { data, error: subscriptionError } = await supabaseService
      .from('subscriptions')
      .select('plan, token')
      .eq('user_id', userId)
      .single();

    if (subscriptionError || !data) {
      return res.status(400).json({ success: false, message: 'Abonnement non trouvé.' });
    }

    if (data.plan !== 'premium') {
      return res.status(403).json({ success: false, message: 'Abonnement non premium.' });
    }

    // Vérifier si le token correspond de manière sécurisée
    if (!secureCompare(data.token, token)) {
      return res.status(403).json({ success: false, message: 'Token invalide.' });
    }

    return res.status(200).json({ success: true, message: 'Token valide.' });
  } catch (err) {
    console.error('Erreur lors de la vérification du token:', err);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
  }
}
