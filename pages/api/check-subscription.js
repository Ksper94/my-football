import { supabaseService } from '../../utils/supabaseService';
import Joi from 'joi';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Cors from 'cors';
import initMiddleware from '../../utils/init-middleware';

const secureCompare = (a, b) => {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};

const schema = Joi.object({
  token: Joi.string().required(),
});

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET est requis dans les variables d\'environnement.');
}

const cors = initMiddleware(
  Cors({
    methods: ['POST', 'OPTIONS'],
    origin: 'https://footballgit-bdx4ln4gduabscvzmzgnyk.streamlit.app',
  })
);

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Méthode non autorisée.' });
  }

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const { token } = value;

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error('Erreur de vérification du token JWT:', err.message);
    return res.status(403).json({ success: false, message: 'Token invalide ou expiré.' });
  }

  const userId = decoded.userId;

  try {
    const { data, error: subscriptionError } = await supabaseService
      .from('subscriptions')
      .select('plan, token')
      .eq('user_id', userId)
      .single();

    if (subscriptionError || !data) {
      return res.status(400).json({ success: false, message: 'Abonnement non trouvé.' });
    }

    const allowedPlans = ['mensuel', 'trimestriel', 'annuel'];

    if (!allowedPlans.includes(data.plan)) {
      return res.status(403).json({ success: false, message: 'Abonnement non valide.' });
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
