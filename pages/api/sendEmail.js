import { createClient } from '@supabase/supabase-js';
import SibApiV3Sdk from 'sib-api-v3-sdk';

// 1. Configuration Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 2. Configuration Brevo (ex Sendinblue)
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

    // -------------------------------------------------------------------
    //  A. Fonction pour envoyer un e‑mail via Brevo
    // -------------------------------------------------------------------
    const sendEmail = async (user, subject, htmlContent, updateColumn) => {
      try {
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = htmlContent;
        sendSmtpEmail.sender = { name: 'Foot Predictions', email: 'support@foot-predictions.com' };
        sendSmtpEmail.to = [{ email: user.email }];

        // Envoi de l'e‑mail
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`✔️ Email envoyé à ${user.email}`);

        // Mise à jour du user_metadata pour noter la date d'envoi
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
          user_metadata: {
            ...user.user_metadata,
            [updateColumn]: now.toISOString(),
          },
        });
        if (updateError) {
          console.error(`❌ Erreur mise à jour user_metadata pour ${user.id} :`, updateError);
        }
      } catch (error) {
        console.error(`❌ Erreur lors de l'envoi de l'email à ${user.email}:`, error);
      }
    };

    // -------------------------------------------------------------------
    //  B. Récupérer utilisateurs sans abonnement actif (via admin.listUsers)
    // -------------------------------------------------------------------
    /**
     * On va :
     *   1) Lister tous les utilisateurs (ou la première page).
     *   2) Filtrer en mémoire par :
     *       - Créé il y a plus de "daysAgo" jours
     *       - user_metadata[column] n'existe pas ou est null
     *   3) Récupérer leurs abonnements (table "subscriptions") séparément
     *   4) Exclure ceux qui ont un abonnement "active"
     */
    const fetchUsersWithoutActiveSubscription = async (daysAgo, column) => {
      const dateLimit = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      console.log(`\n[fetchUsersWithoutActiveSubscription] column=${column}, daysAgo=${daysAgo}`);
      console.log(`→ dateLimit (JS Date) = ${dateLimit.toISOString()}`);

      // 1) Lister les utilisateurs via admin.listUsers
      const { data, error } = await supabase.auth.admin.listUsers({
        page: 1,        // Page 1
        perPage: 10000, // Récupère jusqu'à 10 000 utilisateurs
      });

      if (error) {
        console.error(`❌ Erreur listUsers() pour ${column} :`, error);
        return [];
      }

      if (!data || !data.users) {
        console.log('Aucun utilisateur retourné par listUsers()');
        return [];
      }

      // data.users est un tableau de { id, email, user_metadata, created_at, ... }
      let users = data.users;
      console.log(`→ Nombre total d'utilisateurs listés : ${users.length}`);

      // 2) Filtrer en mémoire
      //    - created_at < dateLimit
      //    - user.user_metadata?.[column] == null
      users = users.filter((u) => {
        const userCreatedAt = new Date(u.created_at);
        const isOldEnough = userCreatedAt < dateLimit;

        const metaValue = u.user_metadata?.[column];
        // On considère qu'aucune clé ou valeur null => pas encore envoyé
        const isNullOrUndefined = metaValue === null || metaValue === undefined;

        return isOldEnough && isNullOrUndefined;
      });

      console.log(`→ ${users.length} utilisateurs après filtre "date & metadata null"`);

      if (users.length === 0) return [];

      // 3) Récupérer leurs abonnements depuis la table "subscriptions"
      const userIds = users.map((u) => u.id);
      const { data: subsData, error: subsError } = await supabase
        .from('subscriptions')
        .select('user_id, status')
        .in('user_id', userIds);

      if (subsError) {
        console.error(`❌ Erreur récupération subscriptions pour ${column} :`, subsError);
        // En cas d'erreur, on renvoie quand même la liste filtrée (date & metadata)
        return users;
      }

      // Construire un map: user_id -> array of status
      const subMap = {};
      subsData.forEach((s) => {
        if (!subMap[s.user_id]) {
          subMap[s.user_id] = [];
        }
        subMap[s.user_id].push(s.status);
      });

      // 4) Exclure ceux qui ont un abonnement "active"
      const final = users.filter((u) => {
        const statuses = subMap[u.id] || [];
        return !statuses.includes('active');
      });

      console.log(`→ ${final.length} utilisateurs éligibles après filtre "abonnement actif".\n`);
      return final;
    };

    // -------------------------------------------------------------------
    //  C. Récupération des utilisateurs pour chaque type de rappel
    // -------------------------------------------------------------------
    const firstReminderUsers   = await fetchUsersWithoutActiveSubscription(7,  'last_email_sent');
    const secondReminderUsers  = await fetchUsersWithoutActiveSubscription(14, 'second_email_sent');
    const thirdReminderUsers   = await fetchUsersWithoutActiveSubscription(30, 'third_email_sent');
    const monthlyReminderUsers = await fetchUsersWithoutActiveSubscription(30, 'last_reminder_sent');

    // -------------------------------------------------------------------
    //  D. Logs finaux
    // -------------------------------------------------------------------
    console.log('[MAIN] firstReminderUsers   =', firstReminderUsers.map(u => u.email));
    console.log('[MAIN] secondReminderUsers  =', secondReminderUsers.map(u => u.email));
    console.log('[MAIN] thirdReminderUsers   =', thirdReminderUsers.map(u => u.email));
    console.log('[MAIN] monthlyReminderUsers =', monthlyReminderUsers.map(u => u.email));

    // -------------------------------------------------------------------
    //  E. Envoi des e‑mails pour chaque catégorie d'utilisateurs
    // -------------------------------------------------------------------

    // 1er rappel
    for (const user of firstReminderUsers) {
      await sendEmail(
        user,
        'Votre période d’essai est terminée — continuez à gagner gros !',
        `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
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
        </div>`,
        'last_email_sent'
      );
    }

    // 2e rappel
    for (const user of secondReminderUsers) {
      await sendEmail(
        user,
        'Offre limitée : 50% de réduction sur votre premier mois !',
        `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
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
        </div>`,
        'second_email_sent'
      );
    }

    // 3e rappel
    for (const user of thirdReminderUsers) {
      await sendEmail(
        user,
        'Rejoignez les gagnants : découvrez leurs histoires !',
        `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
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
            « Grâce à Foot Predictions, j’ai doublé mes gains en un mois ! »
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
        </div>`,
        'third_email_sent'
      );
    }

    // Rappel mensuel
    for (const user of monthlyReminderUsers) {
      await sendEmail(
        user,
        'Un cadeau pour vous : 50% sur votre premier mois !',
        `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
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
        </div>`,
        'last_reminder_sent'
      );
    }

    // -------------------------------------------------------------------
    //  Réponse finale
    // -------------------------------------------------------------------
    res.status(200).json({
      message: `Emails envoyés :
        ${firstReminderUsers.length} (1er rappel),
        ${secondReminderUsers.length} (2ème rappel),
        ${thirdReminderUsers.length} (3ème rappel),
        ${monthlyReminderUsers.length} (mensuels).`,
    });
  } catch (error) {
    console.error('❌ Erreur générale :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}
