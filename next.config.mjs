/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'fr', 'es'], // Ajoutez toutes vos langues
    defaultLocale: 'en',
    localeDetection: false, // Doit être un booléen
  },
};

export default nextConfig;
