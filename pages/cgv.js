import Head from 'next/head';
import Link from 'next/link'; // Import de Link pour éviter l'erreur
import { useTranslation } from 'react-i18next'; // Importer useTranslation

export default function CGV() {
  const { t } = useTranslation('cgv'); // Charger le namespace "cgv"

  return (
    <>
      <Head>
        <title>{t('pageTitle')} | Foot Predictions</title>
        <meta name="description" content={t('pageDescription')} />
      </Head>

      <div className="min-h-screen bg-background text-foreground p-8">
        <h1 className="text-4xl font-bold mb-6">{t('title')}</h1>

        <section className="space-y-6">
          <p>
            <strong>{t('lastUpdate')}:</strong> 04/01/2025
          </p>

          <h2 className="text-2xl font-semibold">{t('section1.title')}</h2>
          <p>{t('section1.content')}</p>

          <h2 className="text-2xl font-semibold">{t('section2.title')}</h2>
          <p>{t('section2.content')}</p>

          <h2 className="text-2xl font-semibold">{t('section3.title')}</h2>
          <p>{t('section3.content')}</p>

          <h2 className="text-2xl font-semibold">{t('section4.title')}</h2>
          <h3 className="text-xl font-medium">{t('section4.sub1.title')}</h3>
          <p>{t('section4.sub1.content')}</p>
          <h3 className="text-xl font-medium">{t('section4.sub2.title')}</h3>
          <p>{t('section4.sub2.content')}</p>
          <h3 className="text-xl font-medium">{t('section4.sub3.title')}</h3>
          <p>{t('section4.sub3.content')}</p>
        </section>

        <footer className="mt-16 text-center text-foreground/60">
          &copy; {new Date().getFullYear()} Foot Predictions. Tous droits réservés.
        </footer>
      </div>
    </>
  );
}
