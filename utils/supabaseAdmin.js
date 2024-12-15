// utils/supabaseAdmin.js

import { createClient } from '@supabase/supabase-js'

// Récupérer les variables d'environnement
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SERVICE_KEY

// Vérifier que les variables d'environnement sont définies
if (!SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL n\'est pas défini dans les variables d\'environnement.')
}
if (!SERVICE_KEY) {
  throw new Error('SERVICE_KEY n\'est pas défini dans les variables d\'environnement.')
}

// Client Supabase Admin pour le backend (API routes)
export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY)
