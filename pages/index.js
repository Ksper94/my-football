import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Testimonial from '../components/Testimonial';
import Hero from '../components/Hero';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground transition-all duration-300">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Foot Predictions</title>
        <meta
          name="description"
          content="Prédictions précises pour vos paris sportifs de football"
        />
      </Head>

      <div>
        {/* Section Hero */}
        <Hero />

        {/* Contenu principal */}
        <div className="min-h-screen bg-background text-foreground transition-all duration-300">

          {/*
            HEADER "futuriste"
            - Dégradé sombre -> touche de modernité
            - Couleur flashy pour le logo/titre (ex: un violet ou un cyan)
          */}
          <header 
            className="
              bg-gradient-to-r from-gray-900 to-gray-800
              text-white
              shadow-lg
              rounded-b-md
              py-4
              px-8
              flex 
              flex-col 
              md:flex-row 
              justify-between 
              items-center
            "
          >
            <h1 
              className="
                text-4xl 
                font-bold 
                tracking-wide
                hover:scale-105 
                transition-transform 
                duration-300
                text-cyan-400
              "
            >
              Foot Predictions
            </h1>

            <nav
              className="mt-4 md:mt-0 flex items-center gap-6"
              aria-label="Navigation principale"
            >
              {user ? (
                <Link href="/dashboard">
                  <span className="cursor-pointer text-sm uppercase tracking-wider text-cyan-400 hover:text-cyan-200 transition-colors duration-300">
                    Tableau de bord
                  </span>
                </Link>
              ) : (
                // On peut éventuellement proposer un lien 'Créer un compte' dans le header
                <></>
              )}
            </nav>
          </header>

          <main className="text-center px-8 py-12">
            {user ? (
              <>
                <h2 className="text-3xl font-semibold mb-4">
                  Bienvenue, {user.user_metadata?.first_name || 'Utilisateur'} !
                </h2>
                <p className="mb-6">
                  Vous êtes connecté et prêt à explorer nos prédictions.
                </p>
                <Link href="/dashboard">
                  <span className="bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-400 cursor-pointer transition-colors duration-300">
                    Accéder au tableau de bord
                  </span>
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-semibold mb-4">
                  Rejoignez-nous et boostez vos paris sportifs !
                </h2>
                <p className="mb-6 max-w-2xl mx-auto">
                  Notre algorithme <strong>analyse des millions de données</strong>  
                  en temps réel pour vous fournir des <strong>prédictions précises</strong>  
                  et fiables. Que vous soyez débutant ou parieur confirmé, 
                  <strong>Foot Predictions</strong> vous donne un <strong>avantage décisif</strong>  
                  pour miser sur les bons matchs. 
                </p>
                <p className="mb-8 max-w-2xl mx-auto">
                  Grâce à notre expertise et à la puissance de nos serveurs, 
                  chaque pronostic est le fruit d’une 
                  <strong> analyse statistique approfondie</strong> : historique des confrontations,
                  forme des équipes, composition, météo… 
                  <strong> Ne laissez plus le hasard décider</strong> de vos gains !
                </p>

                {/* === Ajout de la mention concernant la période d'essai de 1 semaine === */}
                <p className="mb-8 max-w-2xl mx-auto font-bold">
                  En vous inscrivant gratuitement dès maintenant, vous bénéficiez 
                  automatiquement d’une <strong>période d’essai de 1 semaine</strong> 
                  pour tester notre super application et découvrir 
                  la <strong>puissance de notre algorithme</strong>.
                </p>
                {/* ============================================================== */}

                <Link href="/signup">
                  <span className="bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-400 cursor-pointer transition-colors duration-300">
                    Créer un compte
                  </span>
                </Link>
              </>
            )}
          </main>

          {/* Section Témoignages */}
          <div className="mt-12 px-8">
            <h2 className="text-3xl font-semibold text-center mb-6">Témoignages</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <Testimonial
                text="Grâce à Foot Predictions, j'ai pu augmenter mes gains de manière significative !"
                author="Guillaume Lemoine"
              />
              <Testimonial
                text="Un service exceptionnel avec des prédictions fiables et un support réactif."
                author="Eddy Laurens"
              />
              <Testimonial
                text="L'algorithme est incroyablement précis, c'est un vrai game changer."
                author="Vanessa Sadon"
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center text-foreground/60 py-8">
            <div className="mb-4">
              <p>Suivez-nous sur :</p>
              <div className="flex justify-center space-x-4 mt-2">
                <a
                  href="https://www.facebook.com/profile.php?id=61571191483001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-300"
                >
                  <img
                    src="/icons/facebook.png"
                    alt="Facebook"
                    className="w-6 h-6"
                  />
                </a>
                <a
                  href="https://x.com/footprediction2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-300"
                >
                  <img
                    src="/icons/x.png"
                    alt="X (Twitter)"
                    className="w-6 h-6"
                  />
                </a>
                <a
                  href="https://www.instagram.com/foot_predictions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-300"
                >
                  <img
                    src="/icons/instagram.png"
                    alt="Instagram"
                    className="w-6 h-6"
                  />
                </a>
                <a
                  href="https://www.tiktok.com/@footpredictions2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-300"
                >
                  <img
                    src="/icons/tiktok.png"
                    alt="TikTok"
                    className="w-6 h-6"
                  />
                </a>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/cgv">
                <a className="text-link hover:text-link-hover">
                  Conditions Générales de Vente
                </a>
              </Link>
            </div>
            <p>&copy; {new Date().getFullYear()} Foot Predictions. Tous droits réservés.</p>
          </footer>
        </div>
      </div>
    </>
  );
}
