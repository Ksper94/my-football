import Head from 'next/head';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
  const { t } = useTranslation('privacyPolicy'); // Charger le namespace "privacyPolicy"

  return (
    <>
      <Head>
        <title>{t('title')} | Foot Predictions</title>
        <meta
          name="description"
          content={t('description')}
        />
      </Head>

      <div className="min-h-screen bg-background text-foreground p-8">
        <h1 className="text-4xl font-bold mb-6">{t('title')}</h1>

        <section className="space-y-6">
          <p>
            <strong>{t('lastUpdated')}</strong> 04/01/2025
          </p>

          {/* Introduction */}
          <h2 className="text-2xl font-semibold">{t('sections.introduction.title')}</h2>
          <p dangerouslySetInnerHTML={{ __html: t('sections.introduction.content') }} />

          {/* Données collectées */}
          <h2 className="text-2xl font-semibold">{t('sections.dataCollected.title')}</h2>
          <h3 className="text-xl font-medium">{t('sections.dataCollected.userProvided.title')}</h3>
          <p>{t('sections.dataCollected.userProvided.content')}</p>
          <h3 className="text-xl font-medium">{t('sections.dataCollected.automaticallyCollected.title')}</h3>
          <p>{t('sections.dataCollected.automaticallyCollected.content')}</p>

          {/* Utilisation des données */}
          <h2 className="text-2xl font-semibold">{t('sections.dataUsage.title')}</h2>
          <p>{t('sections.dataUsage.content')}</p>

          {/* Partage des données */}
          <h2 className="text-2xl font-semibold">{t('sections.dataSharing.title')}</h2>
          <p>{t('sections.dataSharing.content')}</p>

          {/* Protection des données */}
          <h2 className="text-2xl font-semibold">{t('sections.dataProtection.title')}</h2>
          <p>{t('sections.dataProtection.content')}</p>

          {/* Droits des utilisateurs */}
          <h2 className="text-2xl font-semibold">{t('sections.userRights.title')}</h2>
          <p>{t('sections.userRights.content')}</p>

          {/* Cookies */}
          <h2 className="text-2xl font-semibold">{t('sections.cookies.title')}</h2>
          <p>{t('sections.cookies.content')}</p>

          {/* Modifications de cette politique */}
          <h2 className="text-2xl font-semibold">{t('sections.policyChanges.title')}</h2>
          <p>{t('sections.policyChanges.content')}</p>

          {/* Contact */}
          <h2 className="text-2xl font-semibold">{t('sections.contact.title')}</h2>
          <p>{t('sections.contact.content')}</p>
        </section>

        <footer className="mt-16 text-center text-foreground/60">
          &copy; {new Date().getFullYear()} Foot Predictions. {t('footerRights')}
        </footer>
      </div>
    </>
  );
}
