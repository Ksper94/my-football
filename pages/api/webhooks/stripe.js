// pages/api/webhooks/stripe.js
import { supabaseService } from '../../../utils/supabaseService'
import { buffer } from 'micro'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']

  let event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Erreur de signature du webhook :', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Traiter l'événement
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object

      // Utiliser supabaseService pour enregistrer les informations dans Supabase
      const { error } = await supabaseService
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('session_id', session.id)
      
      if (error) {
        console.error('Erreur lors de l\'insertion dans Supabase :', error.message)
        return res.status(500).send('Erreur interne')
      }

      break
    // Traitez d'autres types d'événements si nécessaire
    default:
      console.warn(`Événement non traité : ${event.type}`)
  }

  res.status(200).json({ received: true })
}
