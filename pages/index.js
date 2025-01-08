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
        <div className="min-h-screen bg-background text-foreground p-8 transition-all duration-300">
          <header className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Foot Predictions</h1>
            <nav className="mt-4 md:mt-0" aria-label="Navigation principale">
              {user ? (
                // Si l'utilisateur est connecté, on affiche un lien vers le dashboard
                <Link href="/dashboard">
                  <span className="text-link hover:text-link-hover cursor-pointer transition-colors duration-300">
                    Accéder au tableau de bord
                  </span>
                </Link>
              ) : (
                // Si l'utilisateur n'est pas connecté, on ne montre plus "Se connecter"
                // (rien ou un <></> vide)
                <></>
              )}
            </nav>
          </header>

          <main className="text-center">
            {user ? (
              <>
                <h2 className="text-3xl font-semibold mb-4">
                  Bienvenue, {user.user_metadata?.first_name || 'Utilisateur'} !
                </h2>
                <p className="mb-6">
                  Vous êtes connecté et prêt à explorer nos prédictions.
                </p>
                <Link href="/dashboard">
                  <span className="bg-link text-white py-2 px-4 rounded hover:bg-link-hover cursor-pointer transition-colors duration-300">
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
                  chaque pronostic est le fruit d’une <strong>analyse statistique approfondie</strong> 
                  : historique des confrontations, forme des équipes, composition, météo… 
                  <strong>Ne laissez plus le hasard décider</strong> de vos gains !
                </p>
                <Link href="/signup">
                  <span className="bg-link text-white py-2 px-4 rounded hover:bg-link-hover cursor-pointer transition-colors duration-300">
                    Créer un compte
                  </span>
                </Link>
              </>
            )}
          </main>

          {/* Section Témoignages */}
          <div className="mt-12">
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
          <footer className="mt-16 text-center text-foreground/60">
            <div className="mb-4">
              <p>Suivez-nous sur :</p>
              <div className="flex justify-center space-x-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61571191483001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:text-link-hover"
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
                  className="text-link hover:text-link-hover"
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
                  className="text-link hover:text-link-hover"
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
                  className="text-link hover:text-link-hover"
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
