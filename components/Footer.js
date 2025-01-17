import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation('footer'); // Charger le namespace "footer"

  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-white">{t('siteTitle')}</h2>
            <p className="mt-2 text-sm">{t('description')}</p>
          </div>

          <nav className="mb-6 md:mb-0">
            <ul className="flex flex-col md:flex-row md:space-x-6 items-center">
              <li className="mb-2 md:mb-0">
                <Link href="/" className="hover:text-white transition-colors duration-200">
                  {t('home')}
                </Link>
              </li>
              <li className="mb-2 md:mb-0">
                <Link href="/pricing" className="hover:text-white transition-colors duration-200">
                  {t('pricing')}
                </Link>
              </li>
              <li className="mb-2 md:mb-0">
                <Link href="/about" className="hover:text-white transition-colors duration-200">
                  {t('about')}
                </Link>
              </li>
              <li className="mb-2 md:mb-0">
                <Link href="/contact" className="hover:text-white transition-colors duration-200">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/profile.php?id=61571191483001"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('facebook')}
              className="hover:text-white transition-colors duration-200"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://twitter.com/votrepage"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('twitter')}
              className="hover:text-white transition-colors duration-200"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://www.instagram.com/foot_predictions/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('instagram')}
              className="hover:text-white transition-colors duration-200"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://linkedin.com/in/votrepage"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('linkedin')}
              className="hover:text-white transition-colors duration-200"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />

        <div className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} {t('copyright')}
        </div>
      </div>
    </footer>
  );
}
