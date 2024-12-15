// components/Login.js

import { useState } from 'react'
import { supabaseClient } from '../utils/supabaseClient'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setMessage(null)
      } else {
        setMessage('Connexion réussie!')
        setError(null)
        // Rediriger ou mettre à jour l'état de l'utilisateur
      }
    } catch (err) {
      console.error('Erreur lors de la connexion:', err)
      setError('Une erreur inattendue est survenue.')
      setMessage(null)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Se connecter</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </form>
  )
}

export default Login
