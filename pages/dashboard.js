import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const BettingTips = ({ t }) => {
  return (
    <div className="betting-tips-container">
      <h2 className="tips-title">{t('bettingTipsTitle')}</h2>
      <ul className="tips-list">
        <li className="tip-item">
          <span className="icon">📊</span>
          <span className="tip-text">{t('bettingTips1')}</span>
        </li>
        <li className="tip-item">
          <span className="icon">🎯</span>
          <span className="tip-text">{t('bettingTips2')}</span>
        </li>
        <li className="tip-item">
          <span className="icon">💰</span>
          <span className="tip-text">{t('bettingTips3')}</span>
        </li>
        <li className="tip-item">
          <span className="icon">📈</span>
          <span className="tip-text">{t('bettingTips4')}</span>
        </li>
        <li className="tip-item">
          <span className="icon">📅</span>
          <span className="tip-text">{t('bettingTips5')}</span>
        </li>
        <li className="tip-item">
          <span className="icon">❤️</span>
          <span className="tip-text">{t('bettingTips6')}</span>
        </li>
      </ul>
      
      <h2 className="warning-title">{t('addictionWarningTitle')}</h2>
      <ul className="warning-list">
        <li className="warning-item">
          <span className="icon">🛑</span>
          <span className="warning-text">{t('addictionWarning1')}</span>
        </li>
        <li className="warning-item">
          <span className="icon">⏸</span>
          <span className="warning-text">{t('addictionWarning2')}</span>
        </li>
        <li className="warning-item">
          <span className="icon">📞</span>
          <span className="warning-text">{t('addictionWarning3')}</span>
        </li>
        <li className="warning-item">
          <span className="icon">📚</span>
          <span className="warning-text">{t('addictionWarning4')}</span>
        </li>
      </ul>
    </div>
  );
};

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const { t } = useTranslation('dashboard');

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [accessStatus, setAccessStatus] = useState('loading'); // 'loading', 'trial', 'active', 'expired'
  const [subscription, setSubscription] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && user) {
      const fallbackProfile = {
        first_name: user?.user_metadata?.first_name || '',
        last_name: user?.user_metadata?.last_name || '',
        email: user.email,
      };
      setProfile(fallbackProfile);
    }
  }, [user, loading]);

  useEffect(() => {
    const checkAccess = async () => {
      if (!loading && user) {
        try {
          const response = await fetch('/api/check-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            if (data.message === 'Trial actif') {
              setAccessStatus('trial');
              setTimeRemaining(
                t('trialTimeRemaining', { days: data.trialDaysRemaining })
              );
              setToken(data.token);
            } else if (data.message === 'Abonnement payant actif.') {
              const subscriptionData = data.subscription;
              setSubscription(subscriptionData);
              setAccessStatus('active');
              calculateTimeRemaining(subscriptionData.plan, subscriptionData.updated_at);
              setToken(subscriptionData.token);
            }
          } else {
            setAccessStatus('expired');
            setError(data.message || t('accessDenied'));
          }
        } catch (err) {
          console.error('Erreur lors de la vérification de l\'accès:', err);
          setAccessStatus('expired');
          setError(t('accessCheckError'));
        }
      }
    };

    checkAccess();
  }, [user, loading, t]);

  const calculateTimeRemaining = (plan, updatedAt) => {
    const startDate = new Date(updatedAt);
    let endDate;

    if (plan === 'mensuel') {
      endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else if (plan === 'trimestriel') {
      endDate = new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000);
    } else if (plan === 'annuel') {
      endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    } else {
      endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) {
      setTimeRemaining(t('subscriptionExpired'));
    } else {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      setTimeRemaining(t('timeRemaining', { days }));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error.message);
    }
  };

  const handleCancelAtPeriodEnd = async () => {
    try {
      if (!user) {
        alert(t('loginRequired'));
        return;
      }

      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error('Erreur depuis /api/cancel-subscription:', errData);
        alert(t('cancelError'));
        return;
      }

      const data = await response.json();
      if (data.success) {
        alert(t('cancelSuccess'));
        setSubscription((prev) => {
          if (!prev) return prev;
          return { ...prev, status: 'cancel_pending' };
        });
      } else {
        alert(data.error || t('unknownError'));
      }
    } catch (err) {
      console.error('Erreur interne :', err);
      alert(t('internalError'));
    }
  };

  if (loading || accessStatus === 'loading') return <div>{t('loading')}</div>;

  if (accessStatus === 'expired') {
    return (
      <div className="min-h-screen bg-background text-foreground p-8 transition-all duration-300">
        <h1 className="text-3xl font-bold mb-6">{t('dashboardTitle')}</h1>
        {profile && (
          <p className="mb-4">
            {t('welcome', { firstName: profile.first_name || 'Utilisateur' })}
          </p>
        )}
        <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md mb-4 max-w-md dark:bg-gray-800 dark:text-gray-100">
          <p>{error || t('trialExpired')}</p>
          <Link href="/pricing">
            <span className="text-link hover:text-link-hover cursor-pointer">
              {t('viewPlans')}
            </span>
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
        >
          {t('logout')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8 transition-all duration-300">
      <h1 className="text-3xl font-bold mb-6">{t('dashboardTitle')}</h1>
      {profile && (
        <p className="mb-4">
          {t('welcome', { firstName: profile.first_name || 'Utilisateur' })}
        </p>
      )}
      <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md mb-4 max-w-md dark:bg-gray-800 dark:text-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-100">
          {accessStatus === 'trial' ? t('trialTitle') : t('subscriptionTitle')}
        </h2>
        <p>{timeRemaining}</p>
        {token && (
          <div className="mt-4">
            <a
              href={`https://footballgit-bdx4ln4gduabscvzmzgnyk.streamlit.app/?token=${token}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-link text-white py-2 px-4 rounded hover:bg-link-hover focus:outline-none focus:ring-2 focus:ring-blue-300">
                {t('accessApp')}
              </button>
            </a>
          </div>
        )}
        {accessStatus === 'active' && subscription?.status === 'active' && (
          <div className="mt-4 space-x-2">
            <button
              onClick={() => router.push('/resiliation')}
              className="text-sm bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              {t('cancelByEmail')}
            </button>
            <button
              onClick={handleCancelAtPeriodEnd}
              className="text-sm bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
            >
              {t('cancelAtEnd')}
            </button>
          </div>
        )}
        {subscription?.status === 'cancel_pending' && (
          <p className="mt-4 text-yellow-700 font-semibold dark:text-yellow-400">
            {t('cancelPending')}
          </p>
        )}
      </div>
      
      {/* Ajout du composant BettingTips */}
      <BettingTips t={t} />
      
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
      >
        {t('logout')}
      </button>
    </div>
  );
}
