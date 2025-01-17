import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'react-i18next'; // Import pour la traduction

export default function LoginPage() {
  const { t } = useTranslation('login'); // Charger le namespace "login"
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg(t('errorEmptyFields')); // Traduction du message d'erreur
      return;
    }

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setErrorMsg(error.message || t('errorLogin')); // Traduction du message d'erreur
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-md shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          {t('loginTitle')} {/* Traduction du titre */}
        </h1>

        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
            {errorMsg}
          </div>
        )}

        <label className="block mb-2 font-semibold text-black" htmlFor="email">
          {t('emailLabel')} {/* Traduction du label */}
        </label>
        <input
          type="email"
          id="email"
          className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:border-blue-500 text-black"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-2 font-semibold text-black" htmlFor="password">
          {t('passwordLabel')} {/* Traduction du label */}
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className="w-full border border-gray-300 rounded p-2 mb-6 focus:outline-none focus:border-blue-500 text-black pr-10"
            placeholder={t('passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-sm text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? t('hidePassword') : t('showPassword')} {/* Traduction */}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-2 px-4 rounded text-white font-semibold bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          {t('loginButton')} {/* Traduction du bouton */}
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-700">
            {t('noAccount')}{' '}
            <Link href="/signup">
              <span className="text-blue-600 hover:underline cursor-pointer">
                {t('signupLink')} {/* Traduction du lien */}
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
