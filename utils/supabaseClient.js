// utils/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

// Récupérer les variables d'environnement
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Vérifier que les variables d'environnement sont définies
if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Les variables d\'environnement Supabase ne sont pas définies correctement.')
}

// Client Supabase pour le frontend
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Client Supabase Admin pour le backend (API routes)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
