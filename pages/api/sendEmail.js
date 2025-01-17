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
    const now = new Date();

    // Fonction pour envoyer un email et mettre à jour la colonne correspondante
    const sendEmail = async (user, subject, htmlContent, updateColumn) => {
      try {
        await sgMail.send({
          to: user.email,
          from: 'support@foot-predictions.com',
          subject: subject,
          html: htmlContent,
        });

        console.log(`Email envoyé à ${user.email}`);
        // Met à jour la colonne correspondante (par exemple, last_email_sent, second_email_sent, etc.)
        await supabase
          .from('user_metadata')
          .update({ [updateColumn]: now.toISOString() })
          .eq('id', user.id);
      } catch (error) {
        console.error(`Erreur lors de l'envoi de l'email à ${user.email}:`, error);
      }
    };

    // 1. Récupérer les utilisateurs éligibles pour le 1er rappel (7 jours)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: firstReminderUsers } = await supabase
      .from('auth.users')
      .select('id, email, created_at')
      .lt('created_at', sevenDaysAgo) // Inscrits depuis au moins 7 jours
      .in(
        'id',
        supabase
          .from('user_metadata')
          .select('id')
          .is('last_email_sent', null) // Premier email non envoyé
      );

    // 2. Récupérer les utilisateurs éligibles pour le 2ème rappel (14 jours)
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data: secondReminderUsers } = await supabase
      .from('auth.users')
      .select('id, email, created_at')
      .lt('created_at', fourteenDaysAgo) // Inscrits depuis au moins 14 jours
      .in(
        'id',
        supabase
          .from('user_metadata')
          .select('id')
          .is('second_email_sent', null) // Deuxième email non envoyé
          .not('last_email_sent', 'is', null) // Premier email déjà envoyé
      );

    // 3. Récupérer les utilisateurs éligibles pour le 3ème rappel (30 jours)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: thirdReminderUsers } = await supabase
      .from('auth.users')
      .select('id, email, created_at')
      .lt('created_at', thirtyDaysAgo) // Inscrits depuis au moins 30 jours
      .in(
        'id',
        supabase
          .from('user_metadata')
          .select('id')
          .is('third_email_sent', null) // Troisième email non envoyé
          .not('second_email_sent', 'is', null) // Deuxième email déjà envoyé
      );

    // 4. Récupérer les utilisateurs pour les rappels mensuels (4 à 8 semaines)
    const monthlyReminderLimit = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: monthlyReminderUsers } = await supabase
      .from('auth.users')
      .select('id, email, created_at')
      .in(
        'id',
        supabase
          .from('user_metadata')
          .select('id')
          .lt('last_reminder_sent', monthlyReminderLimit) // Dernier rappel mensuel envoyé il y a 30+ jours
      );

    // 1. Envoi du 1er rappel
    for (const user of firstReminderUsers || []) {
      await sendEmail(
        user,
        'Votre période d’essai est terminée — continuez à gagner gros !',
        `<p>Bonjour,</p>
        <p>Votre période d’essai gratuite de 7 jours est maintenant terminée, mais ce n’est que le début !</p>
        <p>Avec <strong>Foot Predictions</strong>, rejoignez des milliers de parieurs qui maximisent leurs gains chaque semaine.</p>
        <a href="https://foot-predictions.com/pricing" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Je m’abonne maintenant</a>`,
        'last_email_sent'
      );
    }

    // 2. Envoi du 2ème rappel
    for (const user of secondReminderUsers || []) {
      await sendEmail(
        user,
        'Offre limitée : 50% de réduction sur votre premier mois !',
        `<p>Bonjour,</p>
        <p>➡️ <strong>50% de réduction sur votre premier mois</strong> avec le code : <span style="background-color: #ff5722; color: white; padding: 5px 10px; font-weight: bold;">PROMO-FOOT</span></p>
        <p>Profitez de cette offre pour maximiser vos gains !</p>
        <a href="https://foot-predictions.com/pricing" style="background-color: #ff5722; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Activer l’offre</a>`,
        'second_email_sent'
      );
    }

    // 3. Envoi du 3ème rappel
    for (const user of thirdReminderUsers || []) {
      await sendEmail(
        user,
        'Rejoignez les gagnants : découvrez leurs histoires !',
        `<p>Bonjour,</p>
        <p>Des milliers de parieurs ont transformé leurs gains grâce à <strong>Foot Predictions</strong>.</p>
        <blockquote style="border-left: 5px solid #007bff; padding-left: 10px;">« Grâce à Foot Predictions, j’ai doublé mes gains en un mois ! »</blockquote>
        <a href="https://foot-predictions.com/pricing" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Je veux réussir aussi</a>`,
        'third_email_sent'
      );
    }

    // 4. Envoi des rappels mensuels
    for (const user of monthlyReminderUsers || []) {
      await sendEmail(
        user,
        'Un cadeau pour vous : 50% sur votre premier mois !',
        `<p>Bonjour,</p>
        <p>➡️ <strong>50% de réduction sur votre premier mois</strong> avec le code : <span style="background-color: #ff5722; color: white; padding: 5px 10px; font-weight: bold;">PROMO-FOOT</span></p>
        <a href="https://foot-predictions.com/pricing" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Activer l’offre</a>`,
        'last_reminder_sent'
      );
    }

    return res.status(200).json({
      message: `Emails envoyés : ${firstReminderUsers?.length || 0} (1er rappel), ${secondReminderUsers?.length || 0} (2ème rappel), ${thirdReminderUsers?.length || 0} (3ème rappel), ${monthlyReminderUsers?.length || 0} (mensuels).`,
    });
  } catch (error) {
    console.error('Erreur générale :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}
