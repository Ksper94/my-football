// context/AuthContext.js

import { createContext, useState, useEffect, useContext } from 'react'
import { supabaseClient } from '../utils/supabaseClient'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const session = supabaseClient.auth.session()
    setUser(session?.user ?? null)

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener?.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
