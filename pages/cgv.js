import Head from 'next/head';

export default function CGV() {
  return (
    <>
      <Head>
        <title>Conditions Générales de Vente | Foot Predictions</title>
        <meta
          name="description"
          content="Consultez les conditions générales de vente de Foot Predictions"
        />
      </Head>

      <div className="min-h-screen bg-background text-foreground p-8">
        <h1 className="text-4xl font-bold mb-6">Conditions Générales de Vente</h1>

        <section className="space-y-6">
          <p><strong>Dernière mise à jour :</strong> 04/01/2025</p>

          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p>
            Les présentes Conditions Générales de Vente (ci-après "CGV") régissent les modalités de souscription, 
            d'accès et d'utilisation des services proposés sur le site <strong>foot-predictions.com</strong> 
            (ci-après "le Site"). En utilisant ou en souscrivant aux services du Site, vous acceptez expressément 
            les présentes CGV.
          </p>

          <h2 className="text-2xl font-semibold">2. Informations légales</h2>
          <p>
            Le site <strong>Foot Predictions</strong> est édité par Foot Predictions, immatriculée au [registre 
            concerné], sous le numéro [numéro SIRET ou autre].<br />
            Contact : services@foot-predictions.com
          </p>

          <h2 className="text-2xl font-semibold">3. Description des services</h2>
          <p>
            <strong>Foot Predictions</strong> propose des abonnements payants permettant d'accéder à une application 
            générant des probabilités et prédictions sur les matchs de football à venir, basées sur des algorithmes 
            avancés. Ces services sont destinés à accompagner les utilisateurs dans leurs prises de décisions pour 
            leurs paris sportifs.
          </p>

          <h2 className="text-2xl font-semibold">4. Conditions d'accès aux services</h2>
          <h3 className="text-xl font-medium">4.1. Création de compte</h3>
          <p>
            Pour accéder aux services, l'utilisateur doit créer un compte en fournissant des informations exactes et 
            complètes. Toute inexactitude pourrait entraîner une suspension ou une résiliation du compte.
          </p>

          <h3 className="text-xl font-medium">4.2. Abonnement</h3>
          <p>
            L'accès aux fonctionnalités complètes du Site est soumis à un abonnement payant. Les détails des tarifs 
            et des modalités d'abonnement sont précisés sur la page dédiée.
          </p>

          <h3 className="text-xl font-medium">4.3. Restrictions d'utilisation</h3>
          <p>
            L'utilisateur s'engage à ne pas :<br />
            - Reproduire ou redistribuer les contenus du Site sans autorisation préalable.<br />
            - Utiliser les prédictions pour des activités illégales ou non conformes aux lois en vigueur.
          </p>

          <h2 className="text-2xl font-semibold">5. Tarifs et modalités de paiement</h2>
          <h3 className="text-xl font-medium">5.1. Tarifs</h3>
          <p>
            Les tarifs des abonnements sont indiqués en euros (€) et incluent toutes les taxes applicables. Ils 
            peuvent être révisés à tout moment. Toute modification sera communiquée aux utilisateurs existants.
          </p>

          <h3 className="text-xl font-medium">5.2. Paiement</h3>
          <p>
            Le paiement s'effectue en ligne via les moyens sécurisés proposés sur le Site. L'utilisateur garantit 
            disposer des autorisations nécessaires pour utiliser le mode de paiement choisi.
          </p>

          <h3 className="text-xl font-medium">5.3. Remboursement</h3>
          <p>
            Conformément aux articles L.221-18 et suivants du Code de la consommation, l'utilisateur bénéficie d'un 
            délai de rétractation de 14 jours après la souscription, sauf si l'accès au service a été activé 
            immédiatement après l'achat, avec consentement exprès de l'utilisateur.
          </p>

          <h2 className="text-2xl font-semibold">6. Responsabilité</h2>
          <p>
            Le Site s'efforce de fournir des prédictions précises, mais ne garantit pas la réussite des paris réalisés 
            sur la base des analyses proposées. L'utilisateur assume l'entière responsabilité de ses décisions.
          </p>

          <h2 className="text-2xl font-semibold">7. Propriété intellectuelle</h2>
          <p>
            Tous les contenus présents sur le Site, y compris les algorithmes, textes, graphiques et logos, sont 
            protégés par des droits de propriété intellectuelle. Toute reproduction ou utilisation non autorisée est 
            strictement interdite.
          </p>

          <h2 className="text-2xl font-semibold">8. Résiliation</h2>
          <p>
            Le Site se réserve le droit de suspendre ou résilier l'accès aux services en cas de non-respect des CGV 
            ou d'utilisation frauduleuse.
          </p>

          <h2 className="text-2xl font-semibold">9. Protection des données personnelles</h2>
          <p>
            Les données personnelles collectées lors de l'utilisation du Site sont traitées conformément à notre 
            <Link href="/privacy-policy">
              <a className="text-link hover:text-link-hover">Politique de Confidentialité</a>
            </Link>.
          </p>

          <h2 className="text-2xl font-semibold">10. Loi applicable et règlement des litiges</h2>
          <p>
            Les présentes CGV sont soumises à la législation française. Tout litige relatif à leur interprétation ou 
            exécution sera soumis aux tribunaux compétents.
          </p>

          <h2 className="text-2xl font-semibold">11. Contact</h2>
          <p>
            Pour toute question relative aux présentes CGV, vous pouvez nous contacter à l’adresse suivante : 
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
