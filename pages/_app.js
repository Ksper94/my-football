// pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/Layout'; // Assurez-vous que ce composant existe
import ErrorBoundary from '../components/ErrorBoundary'; // Assurez-vous que ce composant existe
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noLayoutRoutes = ['/login', '/signup', '/success'];
  const shouldUseLayout = !noLayoutRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ErrorBoundary>
        {shouldUseLayout ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default MyApp;
