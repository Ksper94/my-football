// pages/api/check-subscription.js

import { supabaseService } from '../../utils/supabaseService'; // Utilisez supabaseService

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ valid: false, message: 'Token manquant.' });
    }

    try {
      // Utiliser Supabase pour obtenir l'utilisateur à partir du token
      const { data: { user }, error: userError } = await supabaseService.auth.getUser(token);

      if (userError || !user) {
        return res.status(403).json({ valid: false, message: 'Token invalide ou expiré.' });
      }

      const userId = user.id;

      // Vérifier dans la table subscription si l'utilisateur a un abonnement premium valide
      const { data, error } = await supabaseService
        .from('subscription')
        .select('plan, token')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return res.status(400).json({ valid: false, message: 'Abonnement non trouvé.' });
      }

      if (data.plan !== 'premium') {
        return res.status(403).json({ valid: false, message: 'Abonnement non premium.' });
      }

      // Vérifier si le token correspond
      if (data.token !== token) {
        return res.status(403).json({ valid: false, message: 'Token invalide.' });
      }

      return res.status(200).json({ valid: true, message: 'Token valide.' });
    } catch (err) {
      console.error('Erreur lors de la vérification du token:', err.message);
      return res.status(403).json({ valid: false, message: 'Token invalide ou expiré.' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}
