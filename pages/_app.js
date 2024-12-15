// pages/_app.js
import '../styles/globals.css'
import { AuthProvider } from '../context/AuthContext'
import Navbar from '../components/Navbar'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
