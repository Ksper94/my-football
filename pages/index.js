import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Testimonial from '../components/Testimonial';
import Hero from '../components/Hero';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Football Predictions</title>
        <meta
          name="description"
          content="Prédictions précises pour vos paris sportifs de football"
        />
      </Head>

      <div>
        {/* Section Hero */}
        <Hero />

        {/* Contenu principal */}
        <div className="min-h-screen bg-gray-100 p-8">
          <header className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Football Predictions</h1>
            <nav className="mt-4 md:mt-0" aria-label="Navigation principale">
              {user ? (
                // Si l'utilisateur est connecté, bouton vers dashboard
                <Link href="/dashboard">
                  <span className="text-blue-500 hover:underline cursor-pointer">
                    Accéder au tableau de bord
                  </span>
                </Link>
              ) : (
                // Si l'utilisateur n'est pas connecté, bouton vers login
                <Link href="/login">
                  <span className="text-blue-500 hover:underline cursor-pointer">
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
                  Bienvenue, {user.email} !
                </h2>
                <p className="mb-6">
                  Vous êtes connecté et prêt à explorer nos prédictions.
                </p>
                <Link href="/dashboard">
                  <span className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer">
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
                  <span className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer">
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
                text="Grâce à Football Predictions, j'ai pu augmenter mes gains !"
                author="Jean Dupont"
              />
              <Testimonial
                text="Un service exceptionnel avec des prédictions fiables."
                author="Marie Curie"
              />
              <Testimonial
                text="L'algorithme est incroyablement précis."
                author="Luc Martin"
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center text-gray-500">
            &copy; {new Date().getFullYear()} Football Predictions. Tous droits réservés.
          </footer>
        </div>
      </div>
    </>
  );
}
