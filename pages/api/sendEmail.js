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
    // Récupérer les utilisateurs inscrits il y a 7 jours ou plus
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: users, error: userError } = await supabase
      .from('auth.users')
      .select('id, email, created_at')
      .lt('created_at', sevenDaysAgo); // Inscrits avant il y a 7 jours

    if (userError) {
      console.error('Erreur lors de la récupération des utilisateurs :', userError);
      return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }

    // Vérifier que ces utilisateurs ne sont pas dans la table `subscriptions` et n'ont pas reçu d'email
    const eligibleUsers = [];
    for (const user of users) {
      const { data: subscriptions, error: subError } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id);

      const { data: metadata, error: metadataError } = await supabase
        .from('user_metadata')
        .select('last_email_sent')
        .eq('id', user.id)
        .single();

      if (subError || metadataError) {
        console.error(`Erreur pour l'utilisateur ${user.id}:`, subError || metadataError);
        continue;
      }

      // Si pas d'abonnement et aucun email envoyé, l'utilisateur est éligible
      if (subscriptions.length === 0 && (!metadata || !metadata.last_email_sent)) {
        eligibleUsers.push(user);
      }
    }

    // Envoi des emails et mise à jour de `last_email_sent`
    for (const user of eligibleUsers) {
      try {
        await sgMail.send({
          to: user.email,
          from: 'support@foot-predictions.com',
          subject: 'Votre période d’essai est terminée !',
          html: `
            <p>Bonjour,</p>

            <p>Votre période d’essai gratuite de 7 jours est maintenant terminée.</p>

            <p>
              Ne laissez pas vos paris devenir un jeu de hasard ! Avec <strong>Foot Predictions</strong>, 
              accédez à des pronostics basés sur des analyses ultra-précises 
              grâce à notre puissant algorithme.
            </p>

            <p>
              Voici pourquoi des milliers de parieurs nous font déjà confiance :
            </p>
            <ul>
              <li>💡 <strong>Prédictions 100% basées sur des données scientifiques</strong> : Analyse de la forme des équipes, historique des matchs, météo, et bien plus !</li>
              <li>⚡ <strong>Boostez vos gains</strong> : Fini les paris au hasard, placez vos mises avec confiance.</li>
              <li>🔒 <strong>Accès exclusif</strong> : Bénéficiez d’outils premium et d’un support dédié.</li>
            </ul>

            <p>
              🎯 <strong>Rejoignez-nous dès maintenant</strong> et prenez l’avantage sur les autres parieurs !
            </p>

            <p>
              Découvrez nos formules d’abonnement adaptées à tous les budgets et commencez à maximiser vos profits dès aujourd’hui.
            </p>

            <a href="https://foot-predictions.com/pricing" 
               style="display:inline-block; padding:15px 25px; background-color:#ff5722; color:white; font-weight:bold; text-decoration:none; border-radius:8px; margin-top:20px;">
               Je m’abonne maintenant
            </a>

            <p>
              Ne manquez pas cette opportunité ! Chaque jour sans Foot Predictions, c’est une opportunité de gagner que vous laissez passer.
            </p>

            <p>
              À très bientôt,<br />
              <strong>L’équipe Foot Predictions</strong>
            </p>
          `,
        });

        console.log(`Email envoyé à ${user.email}`);

        // Met à jour `last_email_sent` dans la base de données
        await supabase
          .from('user_metadata')
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
