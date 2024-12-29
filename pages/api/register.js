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
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  date_of_birth: Joi.date().required(),
  country: Joi.string().required(),
  phone_number: Joi.string().allow('', null), // Numéro de téléphone optionnel
});

// Charger la clé secrète JWT depuis les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET est requis dans les variables d'environnement.");
}

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Autoriser uniquement les méthodes POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await cors(req, res);

  // Valider les données reçues
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const { email, password, first_name, last_name, date_of_birth, country, phone_number } = value;

  try {
    // Créer un utilisateur dans Supabase
    const { user, error: authError } = await supabase.auth.signUp(
      {
        email,
        password,
      },
      {
        data: {
          first_name,
          last_name,
          date_of_birth,
          country,
          phone_number,
        },
      }
    );

    if (authError) {
      throw authError;
    }

    // Générer un token JWT pour l'utilisateur
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ success: true, message: 'Inscription réussie !', token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
