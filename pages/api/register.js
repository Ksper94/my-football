import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import Joi from 'joi';
import Cors from 'cors';
import initMiddleware from '../../utils/init-middleware';

const cors = initMiddleware(
  Cors({
    methods: ['POST', 'OPTIONS'],
    origin: 'https://my-football-zeta.vercel.app', // Remplacez par votre domaine exact
  })
);

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  date_of_birth: Joi.date().required(),
  country: Joi.string().required(),
  phone_number: Joi.string().allow('', null),
});

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET est requis dans les variables d'environnement.");
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await cors(req, res);

  console.log("Données reçues pour inscription :", req.body); // Log des données reçues

  const { error, value } = schema.validate(req.body);
  if (error) {
    console.error("Validation échouée :", error.details);
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const { email, password, first_name, last_name, date_of_birth, country, phone_number } = value;

  try {
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
      console.error("Erreur lors de la création de l'utilisateur Supabase :", authError);
      throw authError;
    }

    console.log("Utilisateur créé avec succès :", user);

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ success: true, message: 'Inscription réussie !', token });
  } catch (err) {
    console.error("Erreur lors de l'inscription :", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}
