import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

export default function Hero({ backgroundImage = '/football-bg.jpg' }) {
  const { t } = useTranslation('hero'); // Charger le namespace "hero"
  const router = useRouter();

  const handlePricingRedirect = () => {
    router.push('/pricing');
  };

  const handleSignupRedirect = () => {
    router.push('/signup');
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative bg-cover bg-center h-screen flex items-center justify-center"
      style={{ backgroundImage: `url('${encodeURI(backgroundImage)}')` }}
      aria-label={t('sectionLabel')} // Traduction pour le label ARIA
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black opacity-50" aria-hidden="true" />

      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {/* Titre traduit */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-cyan-400">
          {t('title')} {/* Traduction de 'title' */}
        </h1>

        {/* Sous-titre traduit */}
        <p className="text-xl md:text-2xl mb-6 text-cyan-200">
          {t('subtitle')} {/* Traduction de 'subtitle' */}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          {/* Premier bouton traduit */}
          <button
            onClick={handlePricingRedirect}
            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label={t('discoverPlans')} // Traduction pour l'ARIA label
          >
            {t('discoverPlans')} {/* Traduction de 'discoverPlans' */}
          </button>

          {/* Second bouton traduit */}
          <button
            onClick={handleSignupRedirect}
            className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            aria-label={t('tryNow')} // Traduction pour l'ARIA label
          >
            {t('tryNow')} {/* Traduction de 'tryNow' */}
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}

Hero.propTypes = {
  backgroundImage: PropTypes.string,
};
