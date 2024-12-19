// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="fr">
        <Head>
          {/* Charset */}
          <meta charSet="UTF-8" />

          {/* Supprimez la balise viewport */}
          {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}

          {/* SEO Meta Tags */}
          <meta name="description" content="Football Predictions - Prédictions précises pour vos paris sportifs" />
          <meta name="keywords" content="football, prédictions, paris sportifs, algorithme" />
          <meta name="author" content="Votre Nom" />

          {/* Open Graph Meta Tags */}
          <meta property="og:title" content="Football Predictions" />
          <meta property="og:description" content="Prédictions précises pour vos paris sportifs" />
          <meta property="og:image" content="/football-bg.jpg" />
          <meta property="og:url" content="https://votre-site.com" />
          <meta property="og:type" content="website" />

          {/* Security Meta Tags */}
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />

          {/* Preconnect for Performance Optimization (e.g., Fonts) */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          
          {/* Example: Google Fonts */}
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />

          {/* Theme Color */}
          <meta name="theme-color" content="#ffffff" />

          {/* Apple Touch Icon */}
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
