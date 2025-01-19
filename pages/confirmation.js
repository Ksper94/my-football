import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

export default function ConfirmationPage() {
  const { t } = useTranslation('confirmation'); // namespace "confirmation"
  
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [resendStatus, setResendStatus] = useState(null); // pour afficher success/error

  // Au montage, si l'URL contient ?email=..., on l'utilise
  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email);
    }
  }, [router.query.email]);

  // Handler pour renvoyer l'email de confirmation
  const handleResendEmail = async (e) => {
    e.preventDefault();
    setResendStatus(null);

    // Vérification simple format email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setResendStatus({ error: t('invalidEmail') });
      return;
    }

    try {
      const res = await fetch('/api/resend-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setResendStatus({ error: errorData.message || t('errorResend') });
      } else {
        // Réponse OK => mail envoyé
        setResendStatus({ success: t('resendSuccess') });
      }
    } catch (error) {
      console.error('Erreur de renvoi:', error);
      setResendStatus({ error: t('errorResend') });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 text-gray-800">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        
        {/* Titre */}
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          {t('title')} {/* "Compte créé avec succès !" */}
        </h1>

        {/* Message confirm */}
        <p className="text-gray-700 mb-4">
          {t('confirmationEmail')} {/* "Un email de confirmation vous a été envoyé." */}
        </p>
        <p className="text-gray-700 mb-6">
          {t('confirmationInstructions')} {/* "Après avoir cliqué sur le lien..." */}
        </p>

        {/* Lien vers la page de connexion */}
        <Link
          href="/login"
          className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors mb-4"
        >
          {t('loginButton')} {/* "Accéder à la page de connexion" */}
        </Link>

        {/* Formulaire pour renvoyer l'email de confirmation */}
        <div className="mt-6 text-left">
          <form onSubmit={handleResendEmail}>
            <label htmlFor="email" className="block mb-2 font-semibold">
              {t('emailLabel')} 
              {/* "Si vous vous êtes trompé d'adresse, corrigez-la ci-dessous" */}
            </label>
            <input
              id="email"
              type="email"
              className="border border-gray-300 rounded w-full p-2 mb-4"
              placeholder={t('emailPlaceholder')} // "Votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              {t('resendButton')} 
              {/* "Renvoyer l'email de confirmation" */}
            </button>
          </form>

          {/* Affichage du statut (erreur ou success) */}
          {resendStatus?.error && (
            <p className="mt-3 text-red-600 text-center">{resendStatus.error}</p>
          )}
          {resendStatus?.success && (
            <p className="mt-3 text-green-600 text-center">{resendStatus.success}</p>
          )}
        </div>
      </div>
    </div>
  );
}
