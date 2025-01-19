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
    // 1. Utiliser la méthode admin.listUsers() avec un filtre pour chercher l'utilisateur par e-mail
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      filter: `email.eq.${email}`
      // ou filter: `email.ilike.${email}` si tu veux ignorer la casse
    });

    if (error) {
      console.error('Erreur listUsers:', error);
      return res.status(500).json({ message: 'Erreur lors de la récupération du compte.' });
    }

    const users = data?.users || [];
    if (users.length === 0) {
      return res.status(404).json({ message: 'Aucun utilisateur trouvé avec cet email' });
    }

    // 2. Récupérer l'utilisateur (supposons qu'il n'y en ait qu'un)
    const user = users[0];
    console.log('Utilisateur trouvé :', user.email);

    // 3. Envoyer (ou renvoyer) l'email de confirmation
    // Supabase n'a pas d'API "resend email confirmation" prête à l'emploi,
    // mais tu peux utiliser inviteUserByEmail ou generateLink,
    // ou encore faire un envoi custom via SendGrid/Nodemailer.

    // Ex. Méthode d'invitation:
    // const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    // Ex. Magic link (si config passwordless) :
    // const { data: magicData, error: magicErr } = await supabaseAdmin.auth.admin.generateLink({
    //   type: 'magiclink',
    //   email
    // });

    // Ici, on simule juste un envoi
    return res.status(200).json({ message: 'Confirmation email resent (simulation)' });
  } catch (err) {
    console.error('Erreur envoi confirmation:', err);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
}
