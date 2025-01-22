// pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/Layout'; // Assurez-vous que ce composant existe
import ErrorBoundary from '../components/ErrorBoundary'; // Assurez-vous que ce composant existe
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import '../i18n';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noLayoutRoutes = ['/login', '/signup', '/success'];
  const shouldUseLayout = !noLayoutRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Ajout des scripts Google Ads */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              var _iub = _iub || [];
              _iub.csConfiguration = {
                "siteId": 3904373,
                "cookiePolicyId": 17856381,
                "lang": "fr",
                "storage": {"useSiteId": true}
              };
            `,
          }}
        />
        <script
          type="text/javascript"
          src="https://cs.iubenda.com/autoblocking/3904373.js"
        ></script>
        <script
          type="text/javascript"
          src="//cdn.iubenda.com/cs/gpp/stub.js"
        ></script>
        <script
          type="text/javascript"
          src="//cdn.iubenda.com/cs/iubenda_cs.js"
          charset="UTF-8"
          async
        ></script>
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
