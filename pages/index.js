// pages/index.js
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import Testimonial from '../components/Testimonial'
import Hero from '../components/Hero' // Importation du composant Hero

export default function Home() {
  const { user } = useAuth()

  return (
    <>
      <Head>
        <title>Football Predictions</title>
        <meta name="description" content="Prédictions précises pour vos paris sportifs de football" />
        <meta name="keywords" content="football, prédictions, paris sportifs, algorithme" />
        <meta name="author" content="Votre Nom" />
      </Head>
      <div>
        {/* Section Hero */}
        <Hero />

        {/* Contenu principal après le Hero */}
        <div className="min-h-screen bg-gray-100 p-8">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Football Predictions</h1>
            <nav>
              {user ? (
                <Link href="/pricing">
                  <a className="text-blue-500 hover:underline">Tarifs</a>
                </Link>
              ) : (
                <Link href="/login">
                  <a className="text-blue-500 hover:underline">Connexion</a>
                </Link>
              )}
            </nav>
          </header>
          <main className="text-center">
            <h2 className="text-3xl font-semibold mb-4">Bienvenue sur Football Predictions</h2>
            <p className="mb-6">
              Notre algorithme avancé calcule les probabilités de chaque match de football en tenant compte de nombreux facteurs tels que la forme des équipes, les statistiques passées, les conditions météorologiques, et bien plus encore.
            </p>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-2xl font-semibold mb-2">Pourquoi choisir notre service ?</h3>
                <ul className="text-left">
                  <li className="flex items-center mb-2">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Analyse approfondie des performances des équipes
                  </li>
                  <li className="flex items-center mb-2">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Mise à jour en temps réel des données
                  </li>
                  <li className="flex items-center mb-2">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Interface utilisateur intuitive et facile à utiliser
                  </li>
                </ul>
              </div>
              <Link href="/pricing">
                <a className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                  Découvrez nos formules
                </a>
              </Link>
            </div>
          </main>

          {/* Section Témoignages */}
          <div className="mt-12">
            <h2 className="text-3xl font-semibold text-center mb-6">Témoignages</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <Testimonial
                text="Grâce à Football Predictions, j'ai pu augmenter mes gains de manière significative en suivant leurs recommandations."
                author="Jean Dupont"
              />
              <Testimonial
                text="Un service exceptionnel avec des prédictions fiables et une interface utilisateur très agréable."
                author="Marie Curie"
              />
              <Testimonial
                text="L'algorithme est incroyablement précis. Je recommande vivement ce service à tous les passionnés de football."
                author="Luc Martin"
              />
            </div>
          </div>

          <footer className="mt-16 text-center text-gray-500">
            &copy; {new Date().getFullYear()} Football Predictions. Tous droits réservés.
          </footer>
        </div>
      </div>
    </>
  )
}
