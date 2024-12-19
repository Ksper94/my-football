// pages/signup.js
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const { signUp } = useAuth()

  const handleSignUp = async () => {
    setErrorMsg('')
    setSuccessMsg('')
    if (!email || !password) {
      setErrorMsg("Veuillez renseigner un email et un mot de passe.")
      return
    }
    try {
      await signUp(email, password)
      setSuccessMsg("Un email de confirmation vous a été envoyé. Veuillez confirmer votre adresse avant de vous connecter.")
    } catch (error) {
      setErrorMsg(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-md shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Créer un compte</h1>

        {errorMsg && <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">{errorMsg}</div>}
        {successMsg && <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4">{successMsg}</div>}

        <label className="block mb-2 font-semibold text-gray-700" htmlFor="email">Adresse Email</label>
        <input 
          type="email" 
          id="email" 
          className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:border-blue-500" 
          placeholder="votre email"
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
          onClick={handleSignUp}
          className="w-full py-2 px-4 rounded text-white font-semibold bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          Créer mon compte
        </button>
      </div>
    </div>
  )
}
