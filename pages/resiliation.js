// pages/resiliation.js

import Link from 'next/link';

export default function Resiliation() {
  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-2xl mx-auto p-6 rounded shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Résiliation de l’abonnement
        </h1>

        <p className="mb-4">
          Nous sommes désolés de vous voir partir ! Si vous souhaitez mettre un terme à votre abonnement, 
          veuillez nous envoyer un email à l’adresse suivante :{' '}
          <a 
            href="mailto:services@foot-predictions.com"
            className="underline text-blue-600 hover:text-blue-800"
          >
            services@foot-predictions.com
          </a>.
        </p>

        <p className="mb-4">
          Pour faciliter le traitement de votre demande, merci de préciser :
        </p>
        <ul className="list-disc list-inside mb-4 ml-4">
          <li>Votre nom et prénom</li>
          <li>L’adresse e-mail associée à votre compte</li>
          <li>Le plan auquel vous avez souscrit (mensuel, trimestriel, annuel…)</li>
        </ul>

        <p className="mb-4">
          Conformément aux dispositions du Code de la consommation, vous disposez d’un droit de rétractation et 
          pouvez à tout moment demander la résiliation de votre abonnement. Toutefois, selon l’article L.221-28 du 
          Code de la consommation, certains services pleinement exécutés avant la fin du délai de 14 jours peuvent 
          ne pas donner lieu à remboursement.
          <br />
          <br />
          En cas de question ou de doute, n’hésitez pas à nous contacter via l’adresse 
          <a 
            href="mailto:services@foot-predictions.com" 
            className="underline text-blue-600 hover:text-blue-800 ml-1"
          >
            services@foot-predictions.com
          </a>.
        </p>

        <div className="mt-6">
          <Link href="/dashboard">
            <span className="text-sm bg-gray-100 text-gray-800 px-3 py-2 rounded hover:bg-gray-200 cursor-pointer">
              Retour au Dashboard
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
