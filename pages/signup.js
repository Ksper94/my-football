// pages/signup.js

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
  const { signUp } = useAuth();
  const router = useRouter();

  // Mise à jour des champs à chaque saisie
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fonction qui se déclenche au clic sur "Créer un compte"
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
      phoneNumber
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

    // Log pour vérifier le contenu exact avant d'appeler signUp()
    console.log('=== handleSignUp called with ===', {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      country,
      phone_number: phoneNumber,
    });

    try {
      // Appel à la méthode signUp() de l'AuthContext
      const user = await signUp(email, password, {
        // On stocke dans user_metadata (raw_user_meta_data)
        first_name: firstName,   // underscore => dans user.user_metadata?.first_name
        last_name: lastName,
        date_of_birth: dateOfBirth,
        country,
        phone_number: phoneNumber,
      });

      // Si pas d'erreur, log le user renvoyé
      console.log('=== signUp success ===', user);

      // Redirection vers /confirmation
      router.push('/confirmation');
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err);
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Créer un compte</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-2">Prénom</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <label className="block mb-2">Nom</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <label className="block mb-2">Date de naissance</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <label className="block mb-2">Pays</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <label className="block mb-2">Numéro de téléphone (optionnel)</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <label className="block mb-2">Mot de passe</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <label className="block mb-2">Confirmer le mot de passe</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 mb-6 border rounded"
          required
        />

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
