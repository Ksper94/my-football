// pages/api/create-checkout-session.js
import { supabase } from '../../utils/supabaseClient'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { priceId } = req.body

  const { user } = await supabase.auth.api.getUserByCookie(req)

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      client_reference_id: user.id,
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Error creating Stripe Checkout Session:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
