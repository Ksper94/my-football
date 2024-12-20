// pages/api/check-subscription.js
import { supabaseService } from '../../utils/supabaseService';
import Joi from 'joi';
import crypto from 'crypto';

const secureCompare = (a, b) => {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return crypto.timingSafeEqual(bufA, bufB);
};

const schema = Joi.object({
  token: Joi.string().required(),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Méthode non autorisée.' });
  }

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const { token } = value;

  try {
    const { data: { user }, error: userError } = await supabaseService.auth.getUser(token);

    if (userError || !user) {
      console.error('Erreur d\'authentification du token:', userError?.message);
      return res.status(403).json({ success: false, message: 'Token invalide ou expiré.' });
    }

    const userId = user.id;

    const { data, error: subscriptionError } = await supabaseService
      .from('subscriptions')
      .select('plan, token')
      .eq('user_id', userId)
      .single();

    if (subscriptionError || !data) {
      console.error('Erreur lors de la récupération de l\'abonnement:', subscriptionError?.message);
      return res.status(400).json({ success: false, message: 'Abonnement non trouvé.' });
    }

    if (data.plan !== 'premium') {
      return res.status(403).json({ success: false, message: 'Abonnement non premium.' });
    }

    if (!secureCompare(data.token, token)) {
      return res.status(403).json({ success: false, message: 'Token invalide.' });
    }

    return res.status(200).json({ success: true, message: 'Token valide.' });
  } catch (err) {
    console.error('Erreur lors de la vérification du token:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
  }
}
