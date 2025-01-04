import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Politique de Confidentialité | Foot Predictions</title>
        <meta
          name="description"
          content="Découvrez comment Foot Predictions collecte, utilise et protège vos données personnelles."
        />
      </Head>

      <div className="min-h-screen bg-background text-foreground p-8">
        <h1 className="text-4xl font-bold mb-6">Politique de Confidentialité</h1>

        <section className="space-y-6">
          <p><strong>Dernière mise à jour :</strong> 04/01/2025</p>

          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p>
            Chez <strong>Foot Predictions</strong>, la confidentialité de vos données personnelles est une priorité. 
            La présente politique de confidentialité explique comment nous collectons, utilisons et protégeons vos 
            informations personnelles lorsque vous utilisez notre site.
          </p>

          <h2 className="text-2xl font-semibold">2. Données collectées</h2>
          <h3 className="text-xl font-medium">2.1. Données fournies par l'utilisateur</h3>
          <p>
            Lorsque vous créez un compte ou vous abonnez à nos services, nous collectons des informations telles que : 
            votre nom, prénom, adresse e-mail et autres informations nécessaires à la gestion de votre compte.
          </p>

          <h3 className="text-xl font-medium">2.2. Données collectées automatiquement</h3>
          <p>
            Nous collectons également des informations automatiquement via des cookies, telles que votre adresse IP, 
            le type de navigateur, les pages consultées et la durée de votre visite.
          </p>

          <h2 className="text-2xl font-semibold">3. Utilisation des données</h2>
          <p>
            Les données collectées sont utilisées pour :<br />
            - Fournir et gérer les services proposés sur notre site.<br />
            - Personnaliser votre expérience utilisateur.<br />
            - Envoyer des communications marketing ou des mises à jour concernant nos services.<br />
            - Respecter nos obligations légales.
          </p>

          <h2 className="text-2xl font-semibold">4. Partage des données</h2>
          <p>
            Vos données personnelles ne sont jamais vendues ou louées à des tiers. Cependant, nous pouvons les 
            partager avec :<br />
            - Nos prestataires de services (paiements, hébergement, etc.) pour assurer le bon fonctionnement du site.<br />
            - Les autorités compétentes si la loi l'exige.
          </p>

          <h2 className="text-2xl font-semibold">5. Protection des données</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données contre tout 
            accès non autorisé, perte, destruction ou altération.
          </p>

          <h2 className="text-2xl font-semibold">6. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants :<br />
            - Droit d'accès : Vous pouvez demander une copie des données que nous détenons à votre sujet.<br />
            - Droit de rectification : Vous pouvez demander la correction de vos informations personnelles inexactes.<br />
            - Droit à l'effacement : Vous pouvez demander la suppression de vos données, sauf si nous devons les 
            conserver pour des raisons légales.<br />
            - Droit d'opposition : Vous pouvez vous opposer à l'utilisation de vos données à des fins marketing.<br />
            - Droit à la portabilité : Vous pouvez demander à recevoir vos données dans un format structuré et lisible.
          </p>

          <h2 className="text-2xl font-semibold">7. Cookies</h2>
          <p>
            Nous utilisons des cookies pour améliorer votre expérience utilisateur et analyser le trafic du site. Vous 
            pouvez configurer votre navigateur pour refuser les cookies, mais cela pourrait limiter certaines 
            fonctionnalités.
          </p>

          <h2 className="text-2xl font-semibold">8. Modifications de cette politique</h2>
          <p>
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications 
            seront publiées sur cette page avec une date de mise à jour.
          </p>

          <h2 className="text-2xl font-semibold">9. Contact</h2>
          <p>
            Pour toute question ou demande concernant cette politique de confidentialité, vous pouvez nous contacter à : 
            services@foot-predictions.com
          </p>
        </section>

        <footer className="mt-16 text-center text-foreground/60">
          &copy; {new Date().getFullYear()} Foot Predictions. Tous droits réservés.
        </footer>
      </div>
    </>
  );
}
