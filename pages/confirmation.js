// pages/confirmation.js
import Link from 'next/link';

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 text-gray-800">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Compte créé avec succès !
        </h1>

        <p className="text-gray-700 mb-4">
          Un email de confirmation vous a été envoyé. 
          Veuillez vérifier votre boîte de réception.
        </p>

        <p className="text-gray-700 mb-6">
          Après avoir cliqué sur le lien de confirmation, 
          vous pourrez vous connecter à votre compte.
        </p>

        <Link
          href="/login"
          className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Accéder à la page de connexion
        </Link>
      </div>
    </div>
  );
}
