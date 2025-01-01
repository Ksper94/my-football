// pages/api/login.js

import jwt from 'jsonwebtoken';
import { checkUserCredentials, checkSubscription } from '../../lib/myUserLogic';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email ou mot de passe manquant.' });
  }

  try {
    // 1. Vérifier que l'email+password est correct
    const user = await checkUserCredentials(email, password);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe invalide.' });
    }

    // 2. Vérifier l’abonnement
    const hasActiveSubscription = await checkSubscription(user.id);
    if (!hasActiveSubscription) {
      return res
        .status(200)
        .json({ success: false, message: "Votre abonnement n'est pas valide ou a expiré." });
    }

    // 3. Générer un token JWT (optionnel si vous en avez besoin côté Streamlit)
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // 4. Retourner un succès
    return res.status(200).json({ 
      success: true,
      message: 'Authentification réussie !',
      token
    });
  } catch (err) {
    console.error('Erreur login:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur. Veuillez réessayer.' });
  }
}
