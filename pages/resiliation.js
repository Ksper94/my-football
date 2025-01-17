import Link from 'next/link';
import { useTranslation } from 'react-i18next'; // Importer useTranslation pour les traductions

export default function Resiliation() {
  const { t } = useTranslation('resiliation'); // Charger le namespace "resiliation"

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-2xl mx-auto p-6 rounded shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-4 text-black">{t('title')}</h1>

        <p className="mb-4">
          {t('intro')}{' '}
          <a
            href="mailto:services@foot-predictions.com"
            className="underline text-blue-600 hover:text-blue-800"
          >
            services@foot-predictions.com
          </a>
          .
        </p>

        <p className="mb-4">{t('instructions')}</p>
        <ul className="list-disc list-inside mb-4 ml-4">
          <li>{t('details.name')}</li>
          <li>{t('details.email')}</li>
          <li>{t('details.plan')}</li>
        </ul>

        <p className="mb-4">
          {t('legal.text')}{' '}
          <a
            href="mailto:services@foot-predictions.com"
            className="underline text-blue-600 hover:text-blue-800 ml-1"
          >
            services@foot-predictions.com
          </a>
          .
        </p>

        <div className="mt-6">
          <Link href="/dashboard">
            <span className="text-sm bg-gray-100 text-gray-800 px-3 py-2 rounded hover:bg-gray-200 cursor-pointer">
              {t('returnDashboard')}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
