// pages/login.js
import { useState } from 'react'
import { supabaseClient } from '../utils/supabaseClient'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleAuth = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      let { user, error } = isLogin
        ? await supabase.auth.signIn({ email, password })
        : await supabase.auth.signUp({ email, password })

      if (error) throw error

      setMessage(isLogin ? 'Connexion réussie !' : 'Inscription réussie !')

      if (isLogin) {
        router.push('/pricing')
      }
    } catch (error) {
      setMessage(error.error_description || error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg">
        <h1 className="text-2xl font-bold text-center">{isLogin ? 'Connexion' : 'Inscription'}</h1>
        <form className="space-y-6" onSubmit={handleAuth}>
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Mot de passe</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            {isLogin ? 'Se connecter' : 'S\'inscrire'}
          </button>
        </form>
        <p className="text-sm text-center">
          {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? 'Inscrivez-vous' : 'Connectez-vous'}
          </button>
        </p>
        {message && <p className={`text-center ${isLogin ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
      </div>
    </div>
  )
}
