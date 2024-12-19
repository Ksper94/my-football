// pages/api/get-streamlit-token.js

import jwt from 'jsonwebtoken';
import { supabaseService } from '../../utils/supabaseService';
import { supabaseClient } from '../../utils/supabaseClient';
import PropTypes from 'prop-types';

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
    // Récupérer l'utilisateur actuel
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Récupérer l'abonnement de l'utilisateur
    const { data, error } = await supabaseService
      .from('subscription')
      .select('token, plan')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      console.error('Erreur lors de la récupération de l\'abonnement:', error ? error.message : 'Aucune donnée trouvée');
      return res.status(500).json({ error: 'Erreur interne du serveur' });
    }

    if (data.plan !== 'premium') {
      return res.status(403).json({ error: 'Abonnement non premium' });
    }

    // Vérifier la validité du token
    let decoded;
    try {
      decoded = jwt.verify(data.token, jwtSecret);
    } catch (verifyError) {
      console.error('Erreur lors de la vérification du token:', verifyError.message);
      return res.status(403).json({ error: 'Token invalide' });
    }

    // Optionnel : Vérifier des informations supplémentaires dans le token
    if (!decoded || typeof decoded !== 'object') {
      return res.status(403).json({ error: 'Token invalide' });
    }

    // Si toutes les vérifications sont passées, renvoyer le token
    res.status(200).json({ token: data.token });
  } catch (err) {
    console.error('Erreur lors de la récupération du token:', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}
