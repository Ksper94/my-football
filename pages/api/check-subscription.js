// pages/api/check-subscription.js
import { supabaseService } from '../../utils/supabaseService';
import jwt from 'jsonwebtoken';

// Assurez-vous d'ajouter `JWT_SECRET` dans vos variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET;

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
      // Générer un token pour Streamlit
      const trialToken = jwt.sign(
        { userId: user.id, type: 'trial' },
        JWT_SECRET,
        { expiresIn: '7d' } // Token valide pour 7 jours
      );

      return res.status(200).json({
        success: true,
        message: 'Trial actif',
        trialDaysRemaining: 7 - diffDays,
        token: trialToken, // Ajouter le token
      });
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
      // Générer un token pour Streamlit si nécessaire
      const subscriptionToken = subscription.token || jwt.sign(
        { userId: user.id, type: 'subscription' },
        JWT_SECRET,
        { expiresIn: '30d' } // Adapter la durée selon le plan
      );

      return res.status(200).json({
        success: true,
        message: 'Abonnement payant actif.',
        subscription: { ...subscription, token: subscriptionToken },
      });
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
