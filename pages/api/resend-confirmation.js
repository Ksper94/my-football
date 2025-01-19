// pages/api/resend-confirmation.js
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Missing email' });
  }

  try {
    // 1. Rechercher l'utilisateur par e-mail via listUsers()
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      filter: `email.eq.${email}`
    });

    if (error) {
      console.error('Erreur listUsers:', error);
      return res.status(500).json({ message: 'Erreur lors de la récupération du compte.' });
    }

    const users = data?.users || [];
    if (users.length === 0) {
      return res.status(404).json({ message: 'Aucun utilisateur trouvé avec cet email' });
    }

    // 2. Récupérer l'utilisateur
    const user = users[0];
    console.log('Utilisateur trouvé :', user.email);

    // 3. Envoyer l'e-mail d'invitation via inviteUserByEmail()
    //    Cela va déclencher l'envoi du template "Invite" configuré dans la console Supabase
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (inviteError) {
      console.error('Erreur inviteUserByEmail:', inviteError);
      return res.status(500).json({ message: 'Impossible de renvoyer l\'invitation.' });
    }

    // inviteData contiendra par exemple l'ID de l'utilisateur invité (ou une confirmation)
    console.log('Invitation envoyée avec succès :', inviteData);

    return res.status(200).json({ message: 'Invitation envoyée avec succès !' });
  } catch (err) {
    console.error('Erreur envoi confirmation:', err);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
}
