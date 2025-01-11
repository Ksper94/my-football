// pages/api/check-subscription.js
import { supabaseService } from '../../utils/supabaseService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode POST requise.' });
  }

  const { userId } = req.body; // par ex. { userId: "abcd-..." }

  if (!userId) {
    return res.status(400).json({ success: false, message: "Paramètre 'userId' manquant." });
  }

  try {
    // 1) Récupération de l'utilisateur
    const { data: userData, error: userError } = await supabaseService.auth.admin.getUserById(userId);
    if (userError || !userData?.user) {
      console.error('Erreur getUserById:', userError);
      return res.status(400).json({ success: false, message: 'Utilisateur introuvable.' });
    }
    const user = userData.user; // contient user.created_at

    // 2) Calcul du nombre de jours depuis la création du compte
    const createdAt = new Date(user.created_at);
    const now = new Date();
    const diffMs = now - createdAt;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      // => Période d’essai de 7 jours
      return res.status(200).json({ success: true, message: 'Trial actif', trialDaysRemaining: 7 - diffDays });
    }

    // 3) Si trial expiré, vérifier un abonnement payant
    const { data: subscription, error: subErr } = await supabaseService
      .from('subscriptions')
      .select('plan, status, token, updated_at, stripe_subscription_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (subErr) {
      console.error('Erreur supabase select:', subErr);
      return res.status(500).json({ success: false, message: 'Erreur interne' });
    }

    // Pas de ligne => pas d’abonnement payant
    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: 'Trial expiré, aucun abonnement actif.',
      });
    }

    // Vérifier le status de l’abonnement
    if (['active', 'cancel_pending'].includes(subscription.status)) {
      return res.status(200).json({ success: true, message: 'Abonnement payant actif.', subscription });
    }

    // Sinon => inactif
    return res.status(403).json({
      success: false,
      message: 'Trial expiré, abonnement inactif.',
    });
  } catch (err) {
    console.error('Erreur interne:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
}
