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
                <Link href="/dashboard">
                  <span className="text-link hover:text-link-hover cursor-pointer transition-colors duration-300">
                    Accéder au tableau de bord
                  </span>
                </Link>
              ) : (
                <Link href="/login">
                  <span className="text-link hover:text-link-hover cursor-pointer transition-colors duration-300">
                    Se connecter
                  </span>
                </Link>
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
                  Rejoignez-nous pour des prédictions exclusives !
                </h2>
                <p className="mb-6">
                  Inscrivez-vous pour bénéficier de nos analyses détaillées sur le football.
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
                text="Grâce à Foot Predictions, j'ai pu augmenter mes gains !"
                author="Guillaume Lemoine"
              />
              <Testimonial
                text="Un service exceptionnel avec des prédictions fiables."
                author="Eddy Laurens"
              />
              <Testimonial
                text="L'algorithme est incroyablement précis."
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
            &copy; {new Date().getFullYear()} Foot Predictions. Tous droits réservés.
          </footer>
        </div>
      </div>
    </>
  );
}
