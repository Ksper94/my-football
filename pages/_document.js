// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="fr">
        <Head>
          <meta charSet="UTF-8" />
          <meta name="description" content="Football Predictions - Prédictions précises pour vos paris sportifs" />
          <meta name="keywords" content="football, prédictions, paris sportifs, algorithme" />
          <meta name="author" content="Votre Nom" />
          <meta property="og:title" content="Football Predictions" />
          <meta property="og:description" content="Prédictions précises pour vos paris sportifs" />
          <meta property="og:image" content="/football-bg.jpg" />
          <meta property="og:url" content="https://votre-site.com" />
          <meta property="og:type" content="website" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
          <meta name="theme-color" content="#ffffff" />
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
