// components/Hero.js
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

export default function Hero({
  title = 'Foot Predictions : Votre allié pour des paris gagnants',
  subtitle = 'Notre algorithme d’IA analyse des millions de données pour vous fournir des pronostics ultra-fiables',
  backgroundImage = '/football-bg.jpg',
  buttonText = 'Découvrez nos formules',
}) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/pricing');
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative bg-cover bg-center h-screen flex items-center justify-center"
      style={{ backgroundImage: `url('${encodeURI(backgroundImage)}')` }}
      aria-label="Section d'accueil principale"
    >
      <div className="absolute inset-0 bg-black opacity-50" aria-hidden="true"></div>

      <motion.div
        className="relative z-10 text-center text-white px-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4">{title}</h1>
        <p className="text-xl md:text-2xl mb-6">{subtitle}</p>
        <button
          onClick={handleRedirect}
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Découvrez nos formules"
        >
          {buttonText}
        </button>
      </motion.div>
    </motion.section>
  );
}

Hero.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  backgroundImage: PropTypes.string,
  buttonText: PropTypes.string,
};
