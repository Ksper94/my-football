// pages/api/webhooks/stripe.js

import { supabaseAdmin } from '../../../utils/supabaseClient'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const event = req.body

      // Traitez l'événement Stripe ici
      // Exemple : Si vous recevez un événement de création de paiement

      // Utiliser supabaseAdmin pour insérer des données
      const { data, error } = await supabaseAdmin
        .from('payments')
        .insert([
          { 
            stripe_id: event.id,
            amount: event.amount,
            status: event.status,
            created_at: new Date().toISOString()
          },
        ])
      
      if (error) {
        console.error('Erreur lors de l\'insertion dans Supabase :', error)
        return res.status(500).json({ error: 'Erreur interne du serveur' })
      }

      res.status(200).json({ received: true })
    } catch (err) {
      console.error('Erreur lors du traitement du webhook Stripe :', err)
      res.status(400).json({ error: 'Webhook non valide' })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
