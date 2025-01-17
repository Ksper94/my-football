/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['fr', 'en', 'es'], // Langues supportées
    defaultLocale: 'fr', // Langue par défaut
    localeDetection: true, // Détecte automatiquement la langue du navigateur
  },
};

export default nextConfig;
