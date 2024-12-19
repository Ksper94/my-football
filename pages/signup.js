import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import Link from 'next/link'

console.log("Supabase instance:", supabase)

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSignUp = async () => {
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    if (!email || !password) {
      setErrorMsg("Veuillez renseigner un email et un mot de passe.")
      setLoading(false)
      return
    }

    const { user, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setErrorMsg(error.message)
    } else {
      setSuccessMsg("Compte créé avec succès ! Consultez vos emails pour vérifier votre compte.")
      // Optionnel : on peut ici insérer le profil dans la table profiles si désiré.
      // A condition que les policies RLS soient bien configurées et la colonne email présente.
      const { error: profileError } = await supabase.from('profiles').insert([
        { 
          id: user.id, 
          email: user.email, 
          username: email.split('@')[0], 
          full_name: '', 
          avatar_url: '' 
        }
      ])
      if (profileError) {
        setErrorMsg("Le compte est créé, mais un problème est survenu lors de la création du profil.")
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-md shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Créer un compte</h1>
        
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4">
            {successMsg}
          </div>
        )}

        <label className="block mb-2 font-semibold text-gray-700" htmlFor="email">Adresse Email</label>
        <input 
          type="email" 
          id="email" 
          className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:border-blue-500" 
          placeholder="exemple@email.com"
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
          className={`w-full py-2 px-4 rounded text-white font-semibold ${loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}
          disabled={loading}
        >
          {loading ? 'Création en cours...' : 'Créer mon compte'}
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
