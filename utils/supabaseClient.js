// utils/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

// Récupérer les variables d'environnement
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Vérifier que les variables d'environnement sont définies
if (!SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL n\'est pas défini dans les variables d\'environnement.')
}
if (!SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY n\'est pas défini dans les variables d\'environnement.')
}

// Client Supabase pour le frontend
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
