// components/Hero.js
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative bg-cover bg-center h-screen flex items-center justify-center"
      style={{ backgroundImage: `url('/football-bg.jpg')` }} // Assurez-vous d'avoir cette image dans le dossier public
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Contenu du Hero avec animation */}
      <motion.div
        className="relative z-10 text-center text-white px-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Football Predictions
        </h1>
        <p className="text-xl md:text-2xl mb-6">
          Prédictions précises pour vos paris sportifs de football
        </p>
        <Link
          href="/signup"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition duration-300"
        >
          Commencez Maintenant
        </Link>
      </motion.div>
    </motion.section>
  );
}
