/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', // Bleu foncé
        secondary: '#3B82F6', // Bleu clair
        accent: '#F59E0B', // Jaune
      },
    },
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [],
}
