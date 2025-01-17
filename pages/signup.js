import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next'; // Importer useTranslation

export default function SignUpPage() {
  const { t } = useTranslation('signup'); // Charger le namespace "signup"
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    country: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async () => {
    setError('');

    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      dateOfBirth,
      country,
      phoneNumber,
    } = formData;

    if (!email || !password || !firstName || !lastName || !dateOfBirth || !country) {
      setError(t('error.missingFields')); // Traduction des messages d'erreur
      return;
    }
    if (password !== confirmPassword) {
      setError(t('error.passwordMismatch')); // Traduction
      return;
    }

    try {
      const user = await signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            country,
            phone_number: phoneNumber,
          },
        },
      });

      console.log('=== signUp success ===', user);
      router.push('/confirmation');
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err);
      setError(err.message || t('error.generic')); // Traduction
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">{t('title')}</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-2 font-medium text-gray-700">{t('fields.firstName')}</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-900"
          placeholder={t('placeholders.firstName')}
          required
        />

        <label className="block mb-2 font-medium text-gray-700">{t('fields.lastName')}</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-900"
          placeholder={t('placeholders.lastName')}
          required
        />

        <label className="block mb-2 font-medium text-gray-700">{t('fields.dateOfBirth')}</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-900"
          required
        />

        <label className="block mb-2 font-medium text-gray-700">{t('fields.country')}</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-900"
          placeholder={t('placeholders.country')}
          required
        />

        <label className="block mb-2 font-medium text-gray-700">{t('fields.phoneNumber')}</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-900"
          placeholder={t('placeholders.phoneNumber')}
        />

        <label className="block mb-2 font-medium text-gray-700">{t('fields.email')}</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-900"
          placeholder={t('placeholders.email')}
          required
        />

        <label className="block mb-2 font-medium text-gray-700">{t('fields.password')}</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-gray-900 pr-10"
            placeholder={t('placeholders.password')}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-2 text-sm text-gray-500 hover:text-gray-700"
          >
            {showPassword ? t('actions.hide') : t('actions.show')}
          </button>
        </div>

        <label className="block mb-2 font-medium text-gray-700">{t('fields.confirmPassword')}</label>
        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-gray-900 pr-10"
            placeholder={t('placeholders.confirmPassword')}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-2 top-2 text-sm text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? t('actions.hide') : t('actions.show')}
          </button>
        </div>

        <button
          onClick={handleSignUp}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {t('actions.signUp')}
        </button>
      </div>
    </div>
  );
}
