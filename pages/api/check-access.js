import { supabaseService } from '../../utils/supabaseService';

export default async function handler(req, res) {
  try {
    const { userId } = req.body; // par exemple
    
    // 1) Récupérer l’utilisateur dans Supabase Auth
    const { data: userData, error: userError } = await supabaseService.auth.admin.getUserById(userId);
    if (userError || !userData?.user) {
      return res.status(400).json({ success: false, message: 'Utilisateur introuvable.' });
    }

    const user = userData.user; 
    // user.created_at => "2025-01-11T10:23:00Z" par ex.

    // 2) Calculer le nombre de jours depuis creation
    const createdAt = new Date(user.created_at);
    const now = new Date();
    const diffMs = now - createdAt;
    const diffDays = diffMs / (1000 * 60 * 60 * 24); // nb de jours

    if (diffDays < 7) {
      // => Il est encore dans sa période d’essai
      return res.status(200).json({ success: true, message: 'Trial actif.' });
    }

    // 3) Vérifier un éventuel abonnement payant dans la table 'subscriptions'
    const { data: subData, error: subErr } = await supabaseService
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (subErr) {
      console.error('Erreur supabase:', subErr);
      return res.status(500).json({ success: false, message: 'Erreur interne' });
    }

    if (!subData) {
      // Pas de ligne => pas d’abonnement
      return res.status(403).json({ success: false, message: 'Aucun abonnement actif et trial expiré.' });
    }

    // 4) Logique d’abonnement payant
    if (subData.status === 'active' || subData.status === 'cancel_pending') {
      // => OK
      return res.status(200).json({ success: true, message: 'Abonnement actif.' });
    }

    // Sinon => refus
    return res.status(403).json({ success: false, message: 'Abonnement inactif ou trial expiré.' });
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
}
