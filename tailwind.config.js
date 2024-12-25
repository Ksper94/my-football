module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        link: 'var(--link-color)',
        linkHover: 'var(--link-hover-color)',
      },
    },
  },
  darkMode: 'media', // Utiliser le système de l'utilisateur
};
