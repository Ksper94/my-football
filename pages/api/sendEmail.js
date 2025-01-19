import { createClient } from '@supabase/supabase-js';
import SibApiV3Sdk from 'sib-api-v3-sdk';

/**
 * CONFIGURATION
 * -------------
 * 1) Créez dans votre fichier .env.local (ou .env) :
 *    SUPABASE_URL=<url-de-votre-projet-supabase>
 *    SUPABASE_SERVICE_ROLE_KEY=<cle-service-role>
 *    BREVO_API_KEY=<votre-api-key-brevo>
 * 2) Pour Next.js, redémarrez le serveur après ajout des variables d'environnement.
 */

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Configuration de l'API Brevo
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Handler principal pour l'envoi des rappels.
 *
 * On attend un appel POST sur /api/sendEmail
 */
export default async function handler(req, res) {
  // On n'accepte que la méthode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    // Petite helper date
    const now = new Date();

    /**
     * Fonction utilitaire pour envoyer l'email via Brevo
     * puis mettre à jour le champ user_metadata.<updateColumn>
     */
    const sendEmail = async (user, subject, htmlContent, updateColumn) => {
      try {
        // 1) Envoi de l'email via Brevo
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = htmlContent;
        sendSmtpEmail.sender = {"name":"Foot Predictions", "email":"support@foot-predictions.com"};
        sendSmtpEmail.to = [{"email":user.email}];
        
        const { response } = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`Email envoyé à ${user.email}`);

        // 2) Mise à jour du user_metadata
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
          user_metadata: {
            ...user.user_metadata,
            [updateColumn]: now.toISOString()
          }
        });

        if (updateError) {
          console.error(`Erreur mise à jour user_metadata pour ${user.id} :`, updateError);
        }
      } catch (error) {
        console.error(`Erreur lors de l'envoi de l'email à ${user.email}:`, error);
      }
    };

    /**
     * 1) Premier rappel (après 7 jours) => last_email_sent = NULL
     */
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: firstReminderUsers, error: firstError } = await supabase.auth.admin.listUsers({
      filter: {
        created_at: { lt: sevenDaysAgo },
        'raw_user_meta_data->>last_email_sent': { is: null }
      }
    });

    if (firstError) {
      console.error('Erreur chargement 1er rappel:', firstError);
    }

    /**
     * 2) Deuxième rappel (après 14 jours) => second_email_sent = NULL && last_email_sent != NULL
     */
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data: secondReminderUsers, error: secondError } = await supabase.auth.admin.listUsers({
      filter: {
        created_at: { lt: fourteenDaysAgo },
        'raw_user_meta_data->>second_email_sent': { is: null },
        'raw_user_meta_data->>last_email_sent': { not: null }
      }
    });

    if (secondError) {
      console.error('Erreur chargement 2e rappel:', secondError);
    }

    /**
     * 3) Troisième rappel (après 30 jours) => third_email_sent = NULL && second_email_sent != NULL
     */
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: thirdReminderUsers, error: thirdError } = await supabase.auth.admin.listUsers({
      filter: {
        created_at: { lt: thirtyDaysAgo },
        'raw_user_meta_data->>third_email_sent': { is: null },
        'raw_user_meta_data->>second_email_sent': { not: null }
      }
    });

    if (thirdError) {
      console.error('Erreur chargement 3e rappel:', thirdError);
    }

    /**
     * 4) Rappel mensuel (au moins 30 jours depuis last_reminder_sent)
     *    => last_reminder_sent < now - 30 jours
     */
    const monthlyReminderLimit = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: monthlyReminderUsers, error: monthlyError } = await supabase.auth.admin.listUsers({
      filter: {
        'raw_user_meta_data->>last_reminder_sent': { lt: monthlyReminderLimit }
      }
    });

    if (monthlyError) {
      console.error('Erreur chargement rappel mensuel:', monthlyError);
    }

    /**
     * 1. Envoi du 1er rappel
     */
    for (const user of firstReminderUsers?.users || []) {
      await sendEmail(
        user,
        'Votre période d’essai est terminée — continuez à gagner gros !',
        `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #0066cc;">Foot Predictions - Premier Rappel</h2>
          <p>Bonjour <strong>${user.email}</strong>,</p>
          <p>
            Votre période d’année de 7 jours est maintenant terminée,
            mais ce n’est que le début ! Avec <strong>Foot Predictions</strong>,
            rejoignez des milliers de parieurs qui maximisent leurs gains
            chaque semaine.
          </p>
          <p>
            Profitez de nos prédictions exclusives et reprenez dès aujourd'hui
            votre ascension vers la victoire.
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
          <hr/>
          <p style="font-size: 12px; color: #999;">
            Ceci est un email automatique. Merci de ne pas y répondre directement.
          </p>
        </div>
        `,
        'last_email_sent'
      );
    }

    /**
     * 2. Envoi du 2e rappel
     */
    for (const user of secondReminderUsers?.users || []) {
      await sendEmail(
        user,
        'Offre limitée : 50% de réduction sur votre premier mois !',
        `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #ff5722;">Foot Predictions - Deuxième Rappel</h2>
          <p>Bonjour <strong>${user.email}</strong>,</p>
          <p>
            Votre <strong>deuxième rappel</strong> est là avec une
            <strong>offre exceptionnelle</strong> :
          </p>
          <p style="text-align: center; font-size: 1.2em;">
            <strong>50% de réduction</strong> sur votre premier mois
            avec le code : 
            <span 
              style="
                background-color: #ff5722; 
                color: white; 
                padding: 5px 10px; 
                font-weight: bold;
                border-radius: 3px;
              "
            >
              PROMO-FOOT
            </span>
          </p>
          <p>
            Rejoignez la communauté Foot Predictions et maximisez vos gains dès aujourd'hui.
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
              Activer l'offre maintenant
            </a>
          </p>
          <hr/>
          <p style="font-size: 12px; color: #999;">
            Ceci est un email automatique. Merci de ne pas y répondre directement.
          </p>
        </div>
        `,
        'second_email_sent'
      );
    }

    /**
     * 3. Envoi du 3e rappel
     */
    for (const user of thirdReminderUsers?.users || []) {
      await sendEmail(
        user,
        'Rejoignez les gagnants : découvrez leurs histoires !',
        `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #007bff;">Foot Predictions - Troisième Rappel</h2>
          <p>Bonjour <strong>${user.email}</strong>,</p>
          <p>
            Saviez-vous que des milliers de parieurs ont déjà 
            <strong>augmenté leurs gains</strong> grâce à Foot Predictions ?
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
          <p>
            Découvrez les témoignages de nos membres et rejoignez-les sans plus tarder !
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
              Je veux réussir aussi
            </a>
          </p>
          <hr/>
          <p style="font-size: 12px; color: #999;">
            Ceci est un email automatique. Merci de ne pas y répondre directement.
          </p>
        </div>
        `,
        'third_email_sent'
      );
    }

    /**
     * 4. Envoi des rappels mensuels
     */
    for (const user of monthlyReminderUsers?.users || []) {
      await sendEmail(
        user,
        'Un cadeau pour vous : 50% sur votre premier mois !',
        `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #28a745;">Foot Predictions - Rappel Mensuel</h2>
          <p>Bonjour <strong>${user.email}</strong>,</p>
          <p>
            Il n'est jamais trop tard pour rejoindre les parieurs qui 
            <strong>cartonnent</strong> grâce à nos prédictions exclusives.
          </p>
          <p>
            Profitez dès maintenant de <strong>50% de réduction</strong> sur votre
            premier mois avec le code :
          </p>
          <p style="text-align: center; font-size: 1.2em;">
            <span 
              style="
                background-color: #28a745; 
                color: white; 
                padding: 5px 10px; 
                font-weight: bold;
                border-radius: 3px;
              "
            >
          PROMO-FOOT
            </span>
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
              J'active mon offre
            </a>
          </p>
          <hr/>
          <p style="font-size: 12px; color: #999;">
            Ceci est un email automatique. Merci de ne pas y répondre directement.
          </p>
        </div>
        `,
        'last_reminder_sent'
      );
    }

    // Petits compteurs pour le retour de l'API
    const nbFirst = firstReminderUsers?.length || 0;
    const nbSecond = secondReminderUsers?.length || 0;
    const nbThird = thirdReminderUsers?.length || 0;
    const nbMonthly = monthlyReminderUsers?.length || 0;

    // Réponse finale
    return res.status(200).json({
      message: `Emails envoyés :
        ${nbFirst} (1er rappel),
        ${nbSecond} (2ème rappel),
        ${nbThird} (3ème rappel),
        ${nbMonthly} (mensuels).`,
    });

  } catch (error) {
    console.error('Erreur générale :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}