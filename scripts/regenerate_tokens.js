// scripts/regenerate_tokens.js

require('dotenv').config(); // Charger les variables d'environnement depuis le fichier .env
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

// Récupérer les variables d'environnement
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

// Vérifier que toutes les variables nécessaires sont définies
if (!supabaseUrl || !supabaseKey || !JWT_SECRET) {
  throw new Error('SUPABASE_URL, SUPABASE_KEY et JWT_SECRET doivent être définis dans les variables d\'environnement.');
}

// Initialiser le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour générer un token unique
function generateToken(userId) {
  const payload = {
    userId: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 jours
  };
  return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });
}

// Fonction pour régénérer les tokens
async function regenerateTokens() {
  try {
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*');

    if (error) {
      console.error('Erreur lors de la récupération des abonnements:', error);
      return;
    }

    for (const sub of subscriptions) {
      const userId = sub.user_id;
      const newToken = generateToken(userId);

      const { data, error: updateError } = await supabase
        .from('subscriptions')
        .update({ token: newToken })
        .eq('id', sub.id);

      if (updateError) {
        console.error(`Erreur lors de la mise à jour du token pour l'utilisateur ${userId}:`, updateError);
      } else {
        console.log(`Token régénéré pour l'utilisateur ${userId}: ${newToken}`);
      }
    }

    console.log('Régénération des tokens terminée.');
  } catch (err) {
    console.error('Erreur:', err);
  }
}

// Exécuter la fonction de régénération des tokens
regenerateTokens();
