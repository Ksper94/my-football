// lib/myUserLogic.js
import { createClient } from '@supabase/supabase-js'

// 1. Créer un client Supabase (tes clés à récupérer dans l'interface Supabase ou via variables d'env)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

/**
 * checkUserCredentials
 * Vérifie que l'email et le mot de passe correspondent à un utilisateur en base.
 * @param {string} email
 * @param {string} password (en clair dans cet exemple — idéalement, compare un hash)
 * @returns {object|null} Renvoie un objet user si OK, sinon null
 */
export async function checkUserCredentials(email, password) {
  try {
    // On suppose que tu as une table 'users' avec les colonnes :
    // - id
    // - email
    // - password (stocké en clair dans cet exemple, mais en vrai on stocke un hash)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      console.error('Erreur Supabase :', error)
      return null
    }

    if (!data) {
      // Aucun user trouvé avec cet email
      return null
    }

    // Comparaison naïve du mot de passe
    // => Dans un vrai projet, on compare un hash bcrypt, argon2, etc.
    if (data.password === password) {
      // Retourne l'objet user (ou au moins { id, email })
      return {
        id: data.id,
        email: data.email,
        // ... toute autre info utile
      }
    } else {
      return null
    }
  } catch (err) {
    console.error('checkUserCredentials - Exception :', err)
    return null
  }
}

/**
 * checkSubscription
 * Vérifie qu'un user a un abonnement encore valide (actif).
 * @param {number} userId
 * @returns {boolean} true = abonnement actif, false = pas d'abonnement actif
 */
export async function checkSubscription(userId) {
  try {
    // On suppose que tu as une table 'subscriptions' qui contient :
    // - user_id
    // - active (booléen)
    // - expiry_date, etc. (selon ton modèle)
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .single()

    if (error) {
      console.error('Erreur Supabase (checkSubscription) :', error)
      return false
    }

    if (!data) {
      // Pas de ligne d'abonnement actif
      return false
    }

    // Optionnel : si tu veux vérifier une date d'expiration
    // if (new Date(data.expiry_date) < new Date()) {
    //   return false
    // }

    // Sinon, on considère l'abonnement actif
    return true
  } catch (err) {
    console.error('checkSubscription - Exception :', err)
    return false
  }
}
