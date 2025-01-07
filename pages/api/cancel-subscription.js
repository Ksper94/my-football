// pages/api/cancel-subscription.js
import Stripe from 'stripe';
import { supabaseService } from '../../utils/supabaseService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  try {
    // Récupérer l'userId depuis le body (ou depuis un token, selon ta logique)
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId manquant dans la requête.' });
    }

    // Chercher l'abonnement associé à cet userId
    const { data: subscription, error: subError } = await supabaseService
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .single();

    if (subError || !subscription) {
      console.error("Erreur ou abonnement introuvable :", subError);
      return res.status(404).json({
        error: 'Aucun abonnement trouvé pour cet utilisateur.',
      });
    }

    const stripeSubscriptionId = subscription.stripe_subscription_id;
    if (!stripeSubscriptionId) {
      return res.status(400).json({
        error: "Impossible de résilier : 'stripe_subscription_id' manquant.",
      });
    }

    // Annuler l'abonnement Stripe à la fin de la période
    const updatedSubscription = await stripe.subscriptions.update(
      stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    // Mettre le statut local en 'cancel_pending' (optionnel)
    const { error: updateError } = await supabaseService
      .from('subscriptions')
      .update({ status: 'cancel_pending' })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Erreur mise à jour Supabase :', updateError);
      return res
        .status(500)
        .json({ error: 'Impossible de mettre à jour le statut local.' });
    }

    // Réponse OK
    return res.status(200).json({
      success: true,
      message: 'Abonnement résilié à la fin de la période en cours.',
      updatedSubscription,
    });
  } catch (err) {
    console.error('Erreur dans cancel-subscription:', err);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}
