import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function SignUpPage() {
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

  const [showPassword, setShowPassword] = useState(false);         // <-- nouvel état
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // idem

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

    // Vérifications basiques
    if (!email || !password || !firstName || !lastName || !dateOfBirth || !country) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      // En Supabase JS v2, on doit passer "options" dans le même objet
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
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Créer un compte</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-2 font-medium text-gray-700">Prénom</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-900"
          placeholder="Votre prénom"
          required
        />

        <label className="block mb-2 font-medium text-gray-700">Nom</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-900"
          placeholder="Votre nom"
          required
        />

        <label className="block mb-2 font-medium text-gray-700">Date de naissance</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-900"
          required
        />

        <label className="block mb-2 font-medium text-gray-700">Pays</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-900"
          placeholder="Votre pays"
          required
        />

        <label className="block mb-2 font-medium text-gray-700">Numéro de téléphone (optionnel)</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-900"
          placeholder="06 12 34 56 78"
        />

        <label className="block mb-2 font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-900"
          placeholder="votre@email.com"
          required
        />

        <label className="block mb-2 font-medium text-gray-700">Mot de passe</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-gray-900 pr-10"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-2 text-sm text-gray-500 hover:text-gray-700"
          >
            {showPassword ? 'Masquer' : 'Afficher'}
          </button>
        </div>

        <label className="block mb-2 font-medium text-gray-700">Confirmer le mot de passe</label>
        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-gray-900 pr-10"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-2 top-2 text-sm text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? 'Masquer' : 'Afficher'}
          </button>
        </div>

        <button
          onClick={handleSignUp}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Créer un compte
        </button>
      </div>
    </div>
  );
}
