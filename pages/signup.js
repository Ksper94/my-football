// pages/signup.js
import { useState } from 'react'
import { supabase } from '../utils/supabaseClient' // Assurez-vous que ce fichier existe et exporte un client supabase

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async () => {
    const { user, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      console.error('Erreur lors de la création du compte :', error.message)
      return
    }

    // L'utilisateur est maintenant connecté. On insère son profil.
    const { data: profileData, error: profileError } = await supabase.from('profiles').insert([
      { 
        id: user.id, 
        username: email.split('@')[0], 
        full_name: '', 
        avatar_url: '',
        email: user.email  // On stocke l'email dans profiles
      }
    ])

    if (profileError) {
      console.error('Erreur lors de la création du profil :', profileError.message)
    } else {
      console.log('Profil créé avec succès :', profileData)
    }
  }

  return (
    <div>
      <h1>Inscription</h1>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Mot de passe" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleSignUp}>S'inscrire</button>
    </div>
  )
}
