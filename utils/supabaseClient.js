// utils/supabaseClient.js

import { createClient } from '@supabase/supabase-js'
import PropTypes from 'prop-types'

/**
 * Configuration Supabase
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Vérifie que les variables d'environnement sont définies
if (!SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL n\'est pas défini dans les variables d\'environnement.')
}
if (!SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY n\'est pas défini dans les variables d\'environnement.')
}

/**
 * Création d'une instance unique de SupabaseClient (Singleton)
 */
let supabaseClientInstance

if (!supabaseClientInstance) {
  supabaseClientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

/**
 * Client Supabase exporté pour utilisation dans l'application
 */
export const supabase = supabaseClientInstance

// (Facultatif) Vérification des propTypes si nécessaire
supabase.propTypes = {
  auth: PropTypes.object,
}
