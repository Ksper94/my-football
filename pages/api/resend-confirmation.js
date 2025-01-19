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
    // 1. Vérifier si un user existe avec cet email
    const { data: user, error } = await supabaseAdmin
      .from('auth.users')
      .select('*')
      .ilike('email', email)
      .single(); // On veut une seule ligne

    if (error || !user) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email" });
    }

    // 2. Envoyer (ou renvoyer) l'email de confirmation
    // Supabase n'a pas d'API "resend email confirmation" prête à l'emploi, 
    // mais on peut "mettre à jour" (par ex. user) ou recréer un lien de magic link, etc.

    // Méthode 1 : Inviter un user => renvoie un email d'activation
    // (non standard, vérifier la doc):
    // const { data: inviteData, error: inviteErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    // Méthode 2 : Envoi d'un "magic link" (si passwordless config)
    // const { data: magicData, error: magicErr } = await supabaseAdmin.auth.admin.generateLink({
    //   type: 'magiclink',
    //   email
    // });

    // Méthode 3 : Envoi d'un email custom via SendGrid/Nodemailer
    // ...

    // Pour la démo, on va juste renvoyer "OK" simulé :
    return res.status(200).json({ message: 'Confirmation email resent (simulation)' });
  } catch (err) {
    console.error('Erreur envoi confirmation:', err);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
}
