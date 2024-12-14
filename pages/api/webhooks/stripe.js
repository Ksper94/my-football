// pages/api/webhooks/stripe.js
import { supabaseAdmin } from '../../../utils/supabaseClient';
import Stripe from 'stripe';
import { buffer } from 'micro';
import cookie from 'cookie';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'];
    const buf = await buffer(req);
    let event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Récupérer l'utilisateur associé à la session
        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(session.client_reference_id);

        if (userError || !user) {
          console.log('Utilisateur non trouvé pour la session:', session.id);
          return res.status(400).send('Utilisateur non trouvé');
        }

        // Mettre à jour l'utilisateur ou effectuer d'autres actions
        // Exemple : Ajouter un rôle premium
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({ role: 'premium' })
          .eq('id', user.id);

        if (updateError) {
          console.log('Erreur lors de la mise à jour de l\'utilisateur:', updateError.message);
          return res.status(400).send('Erreur lors de la mise à jour de l\'utilisateur');
        }

        console.log(`🔔  Utilisateur ${user.email} mis à jour avec succès.`);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Retourner un succès pour Stripe
    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
