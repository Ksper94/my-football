// lib/myUserLogic.js

import { createClient } from '@supabase/supabase-js'

// 1) Créez un client Supabase avec les variables d'environnement
// (Si besoin d'un accès plus complet, utilisez la service_key au lieu de l'anon_key)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

/**
 * checkUserCredentials
 * Utilise supabase.auth.signInWithPassword pour vérifier email + password.
 * Si OK, Supabase renvoie data.user (objet user).
 * Sinon, null => "Email ou mot de passe invalide."
 */
export async function checkUserCredentials(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('checkUserCredentials error:', error)
      return null
    }

    // data.user contient l'utilisateur logué (id, email, etc.) si tout est ok
    return data.user
  } catch (err) {
    console.error('Exception in checkUserCredentials:', err)
    return null
  }
}

/**
 * checkSubscription
 * Vérifie dans la table "subscriptions" s'il existe une ligne pour user_id = userId
 * ET un status dans ['active', 'cancel_pending'].
 * => true si trouvé
 * => false sinon
 */
export async function checkSubscription(userId) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)         // Filtre par user_id
      .in('status', ['active', 'cancel_pending']) // On autorise ces 2 statuts
      .single()

    if (error) {
      console.error('checkSubscription error:', error)
      return false
    }

    // data sera null/undefined s'il n'y a pas de ligne correspondante
    if (!data) {
      return false
    }

    return true
  } catch (err) {
    console.error('Exception in checkSubscription:', err)
    return false
  }
}
