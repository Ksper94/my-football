// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content="Football Predictions - Prédictions précises pour vos paris sportifs" />
          <meta name="keywords" content="football, prédictions, paris sportifs, algorithme" />
          <meta name="author" content="Votre Nom" />
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
