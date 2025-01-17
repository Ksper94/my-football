import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

// Configuration Supabase et SendGrid
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    // Récupérer les utilisateurs inscrits il y a exactement 7 jours
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, email, created_at, last_email_sent') // Récupère les utilisateurs avec leur email et date d'inscription
      .lt('created_at', sevenDaysAgo) // Inscrits avant il y a 7 jours
      .is('last_email_sent', null); // N'ont jamais reçu d'email

    if (userError) {
      console.error('Erreur lors de la récupération des utilisateurs :', userError);
      return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }

    // Vérifier que ces utilisateurs ne sont pas dans la table `subscriptions`
    const eligibleUsers = [];
    for (const user of users) {
      const { data: subscriptions, error: subError } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id); // Vérifie si l'utilisateur a des abonnements

      if (subError) {
        console.error(`Erreur lors de la vérification des abonnements pour l'utilisateur ${user.id}:`, subError);
        continue;
      }

      // Si aucune souscription trouvée, ajoute l'utilisateur à la liste
      if (subscriptions.length === 0) {
        eligibleUsers.push(user);
      }
    }

    // Envoi des emails et mise à jour du champ `last_email_sent`
    for (const user of eligibleUsers) {
      try {
        // Contenu de l'email
        const emailContent = `
          <p>Bonjour,</p>
          <p>Votre période d’essai gratuite de 7 jours est maintenant terminée.</p>
          <p>Nous vous invitons à découvrir nos formules d'abonnement pour continuer à profiter de nos pronostics ultra-fiables et augmenter vos gains.</p>
          <p>Avec Foot Predictions, vous bénéficiez de l'analyse de notre puissant algorithme pour maximiser vos chances de succès !</p>
          <p>Abonnez-vous dès maintenant et profitez de tous les avantages :</p>
          <ul>
            <li>Prédictions précises basées sur des millions de données !</li>
            <li>Accès exclusif à nos outils premium.</li>
            <li>Support client réactif et personnalisé.</li>
          </ul>
          <a href="https://foot-predictions.com/pricing" style="display:inline-block; padding:10px 20px; background-color:#007bff; color:white; text-decoration:none; border-radius:5px; margin-top:10px;">Voir nos offres</a>
          <p>Merci de votre confiance,</p>
          <p>L’équipe Foot Predictions</p>
        `;

        // Envoi de l'email
        await sgMail.send({
          to: user.email,
          from: 'support@foot-predictions.com',
          subject: 'Votre période d’essai est terminée !',
          html: emailContent,
        });

        console.log(`Email envoyé à ${user.email}`);

        // Met à jour le champ `last_email_sent` dans la base de données
        await supabase
          .from('users')
          .update({ last_email_sent: new Date().toISOString() })
          .eq('id', user.id);
      } catch (error) {
        console.error(`Erreur lors de l'envoi de l'email à ${user.email}:`, error);
      }
    }

    return res.status(200).json({
      message: `${eligibleUsers.length} emails envoyés aux utilisateurs éligibles.`,
    });
  } catch (error) {
    console.error('Erreur générale :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}
