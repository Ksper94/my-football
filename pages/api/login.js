import jwt from 'jsonwebtoken'
import { checkUserCredentials, checkSubscription } from '../../lib/myUserLogic'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' })
  }

  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email ou mot de passe manquant.' })
  }

  try {
    // 1) Vérification Supabase Auth
    const user = await checkUserCredentials(email, password)
    if (!user) {
      // => 401 => identifiants invalides
      return res.status(401).json({ success: false, message: 'Email ou mot de passe invalide.' })
    }

    // 2) Vérification subscription
    const hasActiveSubscription = await checkSubscription(user.id)
    if (!hasActiveSubscription) {
      return res.status(200).json({
        success: false,
        message: "Votre abonnement n'est pas valide ou a expiré."
      })
    }

    // 3) Génération d'un token JWT si besoin
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    })

    // 4) Succès
    return res.status(200).json({
      success: true,
      message: 'Authentification réussie !',
      token
    })
  } catch (err) {
    console.error('Erreur login:', err)
    return res.status(500).json({ success: false, message: 'Erreur serveur. Veuillez réessayer.' })
  }
}
