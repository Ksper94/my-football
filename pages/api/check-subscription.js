// pages/api/check-subscription.js 
import { supabaseService } from '../../utils/supabaseService';
import Joi from 'joi';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Cors from 'cors';
import initMiddleware from '../../utils/init-middleware';

// Fonction de comparaison sécurisée des chaînes
const secureCompare = (a, b) => {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return crypto.timingSafeEqual(bufA, bufB);
};

// Définir le schéma de validation avec Joi
const schema = Joi.object({
  token: Joi.string().required(),
});

// Charger la clé secrète JWT depuis les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET est requis dans les variables d\'environnement.');
}

// Initialiser le middleware CORS
const cors = initMiddleware(
  Cors({
    methods: ['POST', 'OPTIONS'],
    origin: 'https://footballgit-bdx4ln4gduabscvzmzgnyk.streamlit.app', // Remplacez par votre domaine Streamlit exact
  })
);

export default async function handler(req, res) {
  // Appliquer le middleware CORS
  await cors(req, res);

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Méthode non autorisée.' });
  }

  // Valider le corps de la requête
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const { token } = value;

  // Vérifier et décoder le JWT
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error('Erreur de vérification du token JWT:', err.message);
    return res.status(403).json({ success: false, message: 'Token invalide ou expiré.' });
  }

  const userId = decoded.userId;

  try {
    // Récupérer l'abonnement de l'utilisateur dans Supabase
    const { data, error: subscriptionError } = await supabaseService
      .from('subscriptions')
      .select('plan, token')
      .eq('user_id', userId)
      .single();

    if (subscriptionError || !data) {
      console.error('Erreur lors de la récupération de l\'abonnement:', subscriptionError?.message);
      return res.status(400).json({ success: false, message: 'Abonnement non trouvé.' });
    }

    // Définir une liste de plans valides
    const allowedPlans = ['mensuel', 'trimestriel', 'annuel']; // Ajoutez d'autres plans si nécessaire

    // Vérifier que l'abonnement est valide
    if (!allowedPlans.includes(data.plan)) {
      return res.status(403).json({ success: false, message: 'Abonnement non valide.' });
    }

    // Comparer le token stocké avec celui fourni
    if (!secureCompare(data.token, token)) {
      return res.status(403).json({ success: false, message: 'Token invalide.' });
    }

    // Si tout est correct, renvoyer une réponse de succès
    return res.status(200).json({ success: true, message: 'Token valide.' });
  } catch (err) {
    console.error('Erreur lors de la vérification du token:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
  }
}
