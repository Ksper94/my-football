import { createClient } from '@supabase/supabase-js';
import SibApiV3Sdk from 'sib-api-v3-sdk';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Configuration de l'API Brevo
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

    const fetchUsers = async (daysAgo, column) => {
      const dateLimit = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('auth.users')
        .select('id, email, raw_user_meta_data')
        .lt('created_at', dateLimit)
        .is(`raw_user_meta_data->>${column}`, null)
        .not('subscriptions.status', 'eq', 'active', { foreignTable: 'subscriptions' });

      if (error) {
        console.error(`Erreur chargement utilisateurs pour ${column}:`, error);
        return [];
      }

      return data || [];
    };

    const firstReminderUsers = await fetchUsers(7, 'last_email_sent');
    const secondReminderUsers = await fetchUsers(14, 'second_email_sent');
    const thirdReminderUsers = await fetchUsers(30, 'third_email_sent');
    const monthlyReminderUsers = await fetchUsers(30, 'last_reminder_sent');

    for (const user of firstReminderUsers) {
      await sendEmail(
        user,
        'Votre période d’essai est terminée — continuez à gagner gros !',
        `
        <div>
          <h2>Foot Predictions - Premier Rappel</h2>
          <p>Bonjour ${user.email},</p>
          <p>Votre période d’essai gratuite de 7 jours est maintenant terminée...</p>
        </div>
        `,
        'last_email_sent'
      );
    }

    for (const user of secondReminderUsers) {
      await sendEmail(
        user,
        'Offre limitée : 50% de réduction sur votre premier mois !',
        `
        <div>
          <h2>Foot Predictions - Deuxième Rappel</h2>
          <p>Bonjour ${user.email},</p>
          <p>Profitez de 50% de réduction...</p>
        </div>
        `,
        'second_email_sent'
      );
    }

    for (const user of thirdReminderUsers) {
      await sendEmail(
        user,
        'Rejoignez les gagnants : découvrez leurs histoires !',
        `
        <div>
          <h2>Foot Predictions - Troisième Rappel</h2>
          <p>Bonjour ${user.email},</p>
          <p>Découvrez comment des milliers de parieurs...</p>
        </div>
        `,
        'third_email_sent'
      );
    }

    for (const user of monthlyReminderUsers) {
      await sendEmail(
        user,
        'Un cadeau pour vous : 50% sur votre premier mois !',
        `
        <div>
          <h2>Foot Predictions - Rappel Mensuel</h2>
          <p>Bonjour ${user.email},</p>
          <p>Ne manquez pas cette opportunité...</p>
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
