import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="fr">
        <Head>
          <meta charSet="UTF-8" />
          <meta name="description" content="Foot Predictions - Prédictions précises pour vos paris sportifs" />
          <meta name="keywords" content="football, prédictions, paris sportifs, algorithme" />
          <meta name="author" content="Votre Nom" />
          <meta property="og:title" content="Foot Predictions" />
          <meta property="og:description" content="Prédictions précises pour vos paris sportifs" />
          <meta property="og:image" content="/football-bg.jpg" />
          <meta property="og:url" content="https://foot-predictions.com" />
          <meta property="og:type" content="website" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
          <meta name="theme-color" content="#2563eb" /> {/* Ajustez selon vos couleurs principales */}
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

          {/* Google Ads Global Site Tag */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=AW-11539275720"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'AW-11539275720');
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
