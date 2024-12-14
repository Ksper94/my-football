// pages/api/webhooks/stripe.js
import { buffer } from 'micro'
import Stripe from 'stripe'
import { supabase } from '../../utils/supabaseClient'

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature']
  const buf = await buffer(req)

  let event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed.', err)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    const userId = session.client_reference_id
    const subscriptionId = session.subscription

    if (userId && subscriptionId) {
      // Récupérer les détails de l'abonnement
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const validUntil = new Date(subscription.current_period_end * 1000)

      // Mettre à jour la base de données Supabase
      const { data, error } = await supabase
        .from('subscriptions')
        .upsert([
          {
            id: userId,
            stripe_subscription_id: subscriptionId,
            status: subscription.status,
            valid_until: validUntil,
          },
        ])

      if (error) {
        console.error('Error updating subscription in Supabase:', error)
        return res.status(500).json({ error: 'Failed to update subscription' })
      }

      console.log(`Subscription updated for user ${userId}`)
    }
  }

  res.status(200).json({ received: true })
}
