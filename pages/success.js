import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import Spinner from '../components/Spinner';
import { useTranslation } from 'react-i18next'; // Importer useTranslation

export default function Success() {
  const { t } = useTranslation('success'); // Charger le namespace "success"
  const router = useRouter();
  const { session_id } = router.query;

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      if (!session_id) {
        setErrorMsg(t('errors.invalidSession'));
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('session_id', session_id)
          .maybeSingle();

        if (error) {
          console.error(t('errors.fetchError'), error);
          setErrorMsg(t('errors.subscriptionFetch'));
        } else if (!data) {
          // Aucun abonnement trouvé pour cette session_id
          setErrorMsg(t('errors.noSubscription'));
        } else {
          setMessage(t('successMessage'));
        }
      } catch (err) {
        console.error(t('errors.unexpectedError'), err);
        setErrorMsg(t('errors.unexpectedError'));
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      fetchSession();
    }
  }, [session_id, router.isReady, t]);

  const handleReturnHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8 text-gray-800">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
        {loading ? (
          <Spinner />
        ) : errorMsg ? (
          <div>
            <h1 className="text-3xl font-bold mb-4 text-red-500">{t('errorTitle')}</h1>
            <p className="text-lg mb-6">{errorMsg}</p>
            <button
              onClick={handleReturnHome}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label={t('returnHome')}
            >
              {t('returnHome')}
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">{t('successTitle')}</h1>
            <p className="text-lg mb-6 text-gray-700">{message}</p>
            <button
              onClick={handleReturnHome}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label={t('returnHome')}
            >
              {t('returnHome')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
