import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Testimonial from '../components/Testimonial';
import Hero from '../components/Hero';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { user, loading } = useAuth();

  // Récupère t (pour traduire) et i18n (pour changer la langue)
  const { t, i18n } = useTranslation('home');

  // Petite fonction utilitaire pour basculer la langue
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang); // Si tu utilises Next-i18next, tu utiliserais peut-être router.push(...). 
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground transition-all duration-300">
        <p>{t('loading')}</p> {/* "Chargement..." */}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{t('pageTitle')}</title>
        <meta name="description" content={t('pageDescription')} />
      </Head>

      <div>
        {/* Section Hero */}
        <Hero />

        {/* Contenu principal */}
        <div className="min-h-screen bg-background text-foreground transition-all duration-300">
          
          {/* HEADER */}
          <header
            className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg rounded-b-md py-4 px-8 flex flex-col md:flex-row justify-between items-center"
          >
            <h1
              className="text-4xl font-bold tracking-wide hover:scale-105 transition-transform duration-300 text-cyan-400"
            >
              {t('headerTitle')} {/* "Foot Predictions" */}
            </h1>

            <nav
              className="mt-4 md:mt-0 flex items-center gap-6"
              aria-label="Navigation principale"
            >
              {/* Lien vers le tableau de bord si user connecté */}
              {user ? (
                <Link href="/dashboard">
                  <span className="cursor-pointer text-sm uppercase tracking-wider text-cyan-400 hover:text-cyan-200 transition-colors duration-300">
                    {t('dashboard')} {/* "Tableau de bord" */}
                  </span>
                </Link>
              ) : null}
              
              {/* AJOUT DES DRAPEAUX */}
              <div className="flex items-center gap-2">
                {/* Bouton français */}
                <button onClick={() => changeLanguage('fr')}>
                  <img
                    src="/flags/fr.png"
                    alt="Français"
                    className="w-5 h-5"
                  />
                </button>
                
                {/* Bouton anglais */}
                <button onClick={() => changeLanguage('en')}>
                  <img
                    src="/flags/gb.png"
                    alt="English"
                    className="w-5 h-5"
                  />
                </button>
                
                {/* Bouton espagnol */}
                <button onClick={() => changeLanguage('es')}>
                  <img
                    src="/flags/es.png"
                    alt="Español"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </nav>
          </header>

          <main className="text-center px-8 py-12">
            {user ? (
              <>
                <h2 className="text-3xl font-semibold mb-4">
                  {t('welcome', { firstName: user.user_metadata?.first_name || t('user') })}
                </h2>
                <p className="mb-6">{t('readyToExplore')}</p>
                <Link href="/dashboard">
                  <span className="bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-400 cursor-pointer transition-colors duration-300">
                    {t('dashboard')} {/* "Accéder au tableau de bord" */}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-semibold mb-4">{t('joinUs')}</h2>
                <p className="mb-6 max-w-2xl mx-auto">{t('algorithmDescription')}</p>
                <p className="mb-8 max-w-2xl mx-auto">{t('advancedAnalysis')}</p>
                <p className="mb-8 max-w-2xl mx-auto font-bold">{t('trialOffer')}</p>
                <Link href="/signup">
                  <span className="bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-400 cursor-pointer transition-colors duration-300">
                    {t('createAccount')} {/* "Créer un compte" */}
                  </span>
                </Link>
              </>
            )}
          </main>

          {/* Section Témoignages */}
          <div className="mt-12 px-8">
            <h2 className="text-3xl font-semibold text-center mb-6">{t('testimonialsTitle')}</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <Testimonial
                text={t('testimonial1.text')}
                author={t('testimonial1.author')}
              />
              <Testimonial
                text={t('testimonial2.text')}
                author={t('testimonial2.author')}
              />
              <Testimonial
                text={t('testimonial3.text')}
                author={t('testimonial3.author')}
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center text-foreground/60 py-8">
            <div className="mb-4">
              <p>{t('followUs')}</p>
              <div className="flex justify-center space-x-4 mt-2">
                {/* Réseaux sociaux */}
                {['facebook', 'twitter', 'instagram', 'tiktok'].map((network) => (
                  <a
                    key={network}
                    href={t(`social.${network}.link`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-300"
                  >
                    <img
                      src={t(`social.${network}.icon`)}
                      alt={t(`social.${network}.alt`)}
                      className="w-6 h-6"
                    />
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <Link href="/cgv">
                <a className="text-link hover:text-link-hover">
                  {t('termsAndConditions')} {/* "Conditions Générales de Vente" */}
                </a>
              </Link>
            </div>
            <p>&copy; {new Date().getFullYear()} {t('footer')}</p>
          </footer>
        </div>
      </div>
    </>
  );
}
