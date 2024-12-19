// pages/login.js
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const { signIn } = useAuth()
  const router = useRouter()

  const handleLogin = async () => {
    setErrorMsg('')
    if (!email || !password) {
      setErrorMsg("Veuillez saisir votre email et mot de passe.")
      return
    }
    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (error) {
      setErrorMsg(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-md shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Se connecter</h1>

        {errorMsg && <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">{errorMsg}</div>}

        <label className="block mb-2 font-semibold text-gray-700" htmlFor="email">Adresse Email</label>
        <input 
          type="email" 
          id="email" 
          className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:border-blue-500" 
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-2 font-semibold text-gray-700" htmlFor="password">Mot de passe</label>
        <input 
          type="password" 
          id="password"
          className="w-full border border-gray-300 rounded p-2 mb-6 focus:outline-none focus:border-blue-500"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full py-2 px-4 rounded text-white font-semibold bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          Se connecter
        </button>
      </div>
    </div>
  )
}
