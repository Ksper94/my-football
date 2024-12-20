// components/Footer.js
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-white">Football Predictions</h2>
            <p className="mt-2 text-sm">
              Prédictions précises pour vos paris sportifs de football. Analyse approfondie et mise à jour en temps réel.
            </p>
          </div>

          <nav className="mb-6 md:mb-0">
            <ul className="flex flex-col md:flex-row md:space-x-6 items-center">
              <li className="mb-2 md:mb-0">
                <Link href="/" className="hover:text-white transition-colors duration-200">Accueil</Link>
              </li>
              <li className="mb-2 md:mb-0">
                <Link href="/pricing" className="hover:text-white transition-colors duration-200">Tarifs</Link>
              </li>
              <li className="mb-2 md:mb-0">
                <Link href="/about" className="hover:text-white transition-colors duration-200">À propos</Link>
              </li>
              <li className="mb-2 md:mb-0">
                <Link href="/contact" className="hover:text-white transition-colors duration-200">Contact</Link>
              </li>
            </ul>
          </nav>

          <div className="flex space-x-4">
            <a href="https://facebook.com/votrepage" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white transition-colors duration-200">
              <FaFacebook size={20} />
            </a>
            <a href="https://twitter.com/votrepage" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-white transition-colors duration-200">
              <FaTwitter size={20} />
            </a>
            <a href="https://instagram.com/votrepage" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors duration-200">
              <FaInstagram size={20} />
            </a>
            <a href="https://linkedin.com/in/votrepage" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors duration-200">
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />

        <div className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Football Predictions. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
