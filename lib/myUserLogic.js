import { createClient } from '@supabase/supabase-js'

// Créez votre client Supabase en utilisant les clés d'environnement
// (Attention : si vous voulez faire ces vérifications côté serveur Next.js,
// il vaut mieux utiliser la "service_role" KEY pour pouvoir lire/écrire librement.
// Sinon, l'anon key peut suffire si vous avez mis en place les bonnes policies RLS.)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

/**
 * checkUserCredentials
 * Utilise supabase.auth.signInWithPassword pour vérifier email + password
 * Si le login réussit, on récupère data.user, sinon null
 */
export async function checkUserCredentials(email, password) {
  try {
    // Cette méthode interroge automatiquement la table `auth.users` (non visible en public)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('checkUserCredentials error:', error)
      // Retourne null => signale "aucun user" au code appelant
      return null
    }

    // Si pas d'erreur, data.user contient les infos de l'utilisateur (id, email, etc.)
    return data.user // { id: '...', email: '...', ... }
  } catch (err) {
    console.error('Exception in checkUserCredentials:', err)
    return null
  }
}

/**
 * checkSubscription
 * Vérifie dans la table `public.subscriptions` si l'utilisateur (userId)
 * a un abonnement actif. On suppose qu'il y a une colonne `active` booléenne,
 * et qu'on stocke dans `user_id` le même UUID que `auth.users.id`.
 */
export async function checkSubscription(userId) {
  try {
    // On recherche un abonnement (row) pour ce user, avec active = true
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .single()

    if (error) {
      console.error('checkSubscription error:', error)
      return false
    }

    // data est null ou undefined si pas trouvé
    // s'il y a un abonnement actif, data contiendra la ligne correspondante
    return !!data
  } catch (err) {
    console.error('Exception in checkSubscription:', err)
    return false
  }
}
