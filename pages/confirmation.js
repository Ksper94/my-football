import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function ConfirmationPage() {
  const { t } = useTranslation('confirmation'); // Charger le namespace "confirmation"

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 text-gray-800">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          {t('title')} {/* Traduction de "Compte créé avec succès !" */}
        </h1>

        <p className="text-gray-700 mb-4">
          {t('confirmationEmail')} {/* Traduction de "Un email de confirmation vous a été envoyé." */}
        </p>

        <p className="text-gray-700 mb-6">
          {t('confirmationInstructions')} {/* Traduction de "Après avoir cliqué sur le lien..." */}
        </p>

        <Link
          href="/login"
          className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          {t('loginButton')} {/* Traduction de "Accéder à la page de connexion" */}
        </Link>
      </div>
    </div>
  );
}
