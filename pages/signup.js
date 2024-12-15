// components/Signup.js

import { useState } from 'react'
import { supabaseClient } from '../utils/supabaseClient'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setMessage(null)
      } else {
        setMessage('Inscription réussie! Vérifiez votre email pour confirmer votre compte.')
        setError(null)
      }
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err)
      setError('Une erreur inattendue est survenue.')
      setMessage(null)
    }
  }

  return (
    <form onSubmit={handleSignup}>
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
      <button type="submit">S'inscrire</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </form>
  )
}

export default Signup
