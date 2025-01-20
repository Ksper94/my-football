import { createClient } from '@supabase/supabase-js';
import SibApiV3Sdk from 'sib-api-v3-sdk';

// Configuration Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Configuration Brevo
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    const now = new Date();

    // Fonction pour envoyer un email
    const sendEmail = async (user, subject, htmlContent, updateColumn) => {
      try {
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = htmlContent;
        sendSmtpEmail.sender = { name: 'Foot Predictions', email: 'support@foot-predictions.com' };
        sendSmtpEmail.to = [{ email: user.email }];

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`Email envoyé à ${user.email}`);

        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
          user_metadata: {
            ...user.raw_user_meta_data,
            [updateColumn]: now.toISOString(),
          },
        });

        if (updateError) {
          console.error(`Erreur mise à jour user_metadata pour ${user.id} :`, updateError);
        }
      } catch (error) {
        console.error(`Erreur lors de l'envoi de l'email à ${user.email}:`, error);
      }
    };

    // Fonction pour récupérer les utilisateurs en fonction des critères
    const fetchUsers = async (daysAgo, column) => {
      const dateLimit = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        return [];
      }

      // Utilisation de `data.users` pour accéder aux utilisateurs
      const users = data.users || [];
      return users.filter((user) => {
        const userMetadata = user.raw_user_meta_data || {};
        const userCreatedAt = new Date(user.created_at);
        return (
          userCreatedAt < new Date(dateLimit) &&
          !userMetadata[column] &&
          (!userMetadata.subscription_status || userMetadata.subscription_status !== 'active')
        );
      });
    };

    // Récupération des utilisateurs pour chaque rappel
    const firstReminderUsers = await fetchUsers(7, 'last_email_sent');
    const secondReminderUsers = await fetchUsers(14, 'second_email_sent');
    const thirdReminderUsers = await fetchUsers(30, 'third_email_sent');
    const monthlyReminderUsers = await fetchUsers(30, 'last_reminder_sent');

    // 1er rappel
    for (const user of firstReminderUsers) {
      await sendEmail(
        user,
        'Votre période d’essai est terminée — continuez à gagner gros !',
        `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #0066cc;">Foot Predictions - Premier Rappel</h2>
          <p>Bonjour <strong>${user.email}</strong>,</p>
          <p>
            Votre période d’essai gratuite de 7 jours est maintenant terminée,
            mais ce n’est que le début ! Rejoignez les milliers de parieurs
            qui maximisent leurs gains chaque semaine grâce à nos prédictions.
          </p>
          <p style="text-align: center;">
            <a 
              href="https://www.foot-predictions.com/pricing"
              style="
                background-color: #007bff; 
                color: #fff; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 5px;
                font-size: 16px;
              "
            >
              Je m’abonne maintenant
            </a>
          </p>
        </div>
        `,
        'last_email_sent'
      );
    }

    // 2ème rappel
    for (const user of secondReminderUsers) {
      await sendEmail(
        user,
        'Offre limitée : 50% de réduction sur votre premier mois !',
        `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #ff5722;">Foot Predictions - Deuxième Rappel</h2>
          <p>Bonjour <strong>${user.email}</strong>,</p>
          <p>
            Nous avons une offre exclusive pour vous : 
            <strong>50% de réduction</strong> sur votre premier mois
            avec le code : <span style="background-color: #ff5722; color: white; padding: 5px 10px; font-weight: bold;">PROMO-FOOT</span>.
          </p>
          <p style="text-align: center;">
            <a 
              href="https://www.foot-predictions.com/pricing"
              style="
                background-color: #ff5722; 
                color: #fff; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 5px;
                font-size: 16px;
              "
            >
              J’active mon offre
            </a>
          </p>
        </div>
        `,
        'second_email_sent'
      );
    }

    // 3ème rappel
    for (const user of thirdReminderUsers) {
      await sendEmail(
        user,
        'Rejoignez les gagnants : découvrez leurs histoires !',
        `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #007bff;">Foot Predictions - Troisième Rappel</h2>
          <p>Bonjour <strong>${user.email}</strong>,</p>
          <p>
            Découvrez comment des milliers de parieurs ont doublé leurs gains 
            avec nos prédictions exclusives.
          </p>
          <blockquote 
            style="
              border-left: 5px solid #007bff; 
              padding-left: 10px; 
              font-style: italic; 
              margin: 1em 0;
            "
          >
            « Grâce à Foot Predictions, j’ai doublé mes gains en un mois ! ».
          </blockquote>
          <p style="text-align: center;">
            <a 
              href="https://www.foot-predictions.com/pricing"
              style="
                background-color: #007bff; 
                color: #fff; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 5px;
                font-size: 16px;
              "
            >
              Je veux réussir aussi
            </a>
          </p>
        </div>
        `,
        'third_email_sent'
      );
    }

    // Rappel mensuel
    for (const user of monthlyReminderUsers) {
      await sendEmail(
        user,
        'Un cadeau pour vous : 50% sur votre premier mois !',
        `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #28a745;">Foot Predictions - Rappel Mensuel</h2>
          <p>Bonjour <strong>${user.email}</strong>,</p>
          <p>
            Ne manquez pas cette opportunité : 50% de réduction sur votre
            premier mois avec le code : 
            <span style="background-color: #28a745; color: white; padding: 5px 10px; font-weight: bold;">PROMO-FOOT</span>.
          </p>
          <p style="text-align: center;">
            <a 
              href="https://www.foot-predictions.com/pricing"
              style="
                background-color: #28a745; 
                color: #fff; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 5px;
                font-size: 16px;
              "
            >
              J’active mon offre
            </a>
          </p>
        </div>
        `,
        'last_reminder_sent'
      );
    }

    res.status(200).json({
      message: `Emails envoyés :
        ${firstReminderUsers.length} (1er rappel),
        ${secondReminderUsers.length} (2ème rappel),
        ${thirdReminderUsers.length} (3ème rappel),
        ${monthlyReminderUsers.length} (mensuels).`,
    });
  } catch (error) {
    console.error('Erreur générale :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}
