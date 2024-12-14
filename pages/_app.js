// pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className={inter.className}>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default MyApp;
