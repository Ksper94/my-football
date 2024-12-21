// pages/api/register.js

import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import Joi from 'joi';
import Cors from 'cors';
import initMiddleware from '../../utils/init-middleware';

// Initialiser le middleware CORS
const cors = initMiddleware(
  Cors({
    methods: ['POST', 'OPTIONS'],
    origin: 'https://footballgit-bdx4ln4gduabscvzmzgnyk.streamlit.app', // Remplacez par votre domaine exact
  })
);

// Définir le schéma de validation avec Joi
const schema = Joi.object({
  user_id: Joi.string().uuid().required(),
  plan: Joi.string().valid('mensuel', 'trimestriel', 'annuel').required(),
});

// Charger la clé secrète JWT depuis les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET est requis dans les variables d\'environnement.');
}

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour générer un token unique
function generateToken(userId) {
  const payload = {
    userId: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 jours
  };
  return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });
}

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

  const { user_id, plan } = value;

  console.log(`Inscription d'un utilisateur: user_id=${user_id}, plan=${plan}`);

  try {
    // Vérifier si l'utilisateur existe déjà dans la table des abonnements
    const { data: existingSubscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // 'PGRST116' = No rows found
      console.error(fetchError);
      return res.status(500).json({ success: false, message: 'Erreur lors de la récupération de l\'abonnement.' });
    }

    if (existingSubscription) {
      console.log(`Abonnement déjà existant pour user_id=${user_id}`);
      return res.status(400).json({ success: false, message: 'Abonnement déjà existant pour cet utilisateur.' });
    }

    // Générer un token unique
    const token = generateToken(user_id);
    console.log(`Token généré pour user_id=${user_id}: ${token}`);

    // Insérer dans Supabase
    const { data, error: insertError } = await supabase
      .from('subscriptions')
      .insert([{ user_id, plan, token }]);

    if (insertError) {
      console.error(insertError);
      return res.status(500).json({ success: false, message: 'Erreur lors de l\'insertion dans la base de données.' });
    }

    console.log(`Abonnement créé pour user_id=${user_id} avec token=${token}`);

    return res.status(201).json({ success: true, token });
  } catch (err) {
    console.error('Erreur serveur:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
}
