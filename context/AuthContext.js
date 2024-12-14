// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { supabaseClient } from '../utils/supabaseClient';

const AuthContext = createContext({ user: null });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) {
        console.error('Erreur lors de l\'obtention de la session:', error.message);
        return;
      }
      setUser(data.session?.user ?? null);
    };

    getSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
