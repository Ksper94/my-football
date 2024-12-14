// pages/api/get-streamlit-token.js

import jwt from 'jsonwebtoken';
import { supabaseService } from '../../utils/supabaseService';
import { supabaseClient } from '../../utils/supabaseClient';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET est requis.');
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Récupérer l'utilisateur actuel
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    try {
      // Récupérer l'abonnement de l'utilisateur
      const { data, error } = await supabaseService
        .from('subscription')
        .select('token, plan')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération de l\'abonnement:', error.message);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
      }

      if (data.plan !== 'premium') {
        return res.status(403).json({ error: 'Abonnement non premium' });
      }

      // Optionnel : Vérifier la validité du token
      try {
        const decoded = jwt.verify(data.token, jwtSecret);
        if (!decoded) {
          return res.status(403).json({ error: 'Token invalide' });
        }
      } catch (verifyError) {
        console.error('Erreur lors de la vérification du token:', verifyError.message);
        return res.status(403).json({ error: 'Token invalide' });
      }

      res.status(200).json({ token: data.token });
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error.message);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Méthode non autorisée');
  }
}
