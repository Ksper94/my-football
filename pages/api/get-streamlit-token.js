// pages/api/get-streamlit-token.js
import jwt from 'jsonwebtoken';
import { supabaseService } from '../../utils/supabaseService';
import { supabase } from '../../utils/supabaseClient'; // Note: vous importiez supabaseClient mais pas besoin de propTypes ici

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET est requis.');
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Erreur d\'authentification:', authError?.message);
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const { data, error } = await supabaseService
      .from('subscriptions')
      .select('token, plan')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      console.error('Erreur lors de la récupération de l\'abonnement:', error?.message);
      return res.status(500).json({ error: 'Erreur interne du serveur' });
    }

    if (data.plan !== 'premium') {
      return res.status(403).json({ error: 'Abonnement non premium' });
    }

    try {
      jwt.verify(data.token, jwtSecret);
    } catch (verifyError) {
      console.error('Erreur lors de la vérification du token:', verifyError.message);
      return res.status(403).json({ error: 'Token invalide' });
    }

    res.status(200).json({ token: data.token });
  } catch (err) {
    console.error('Erreur lors de la récupération du token:', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}
