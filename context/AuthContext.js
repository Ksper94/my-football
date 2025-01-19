// context/AuthContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        setAuthError(error);
      } else {
        if (session?.session?.user) {
          setUser(session.session.user);
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    };

    getSession();

    // Gestion en temps réel des changements d'état d'authentification
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    // Nettoyage de l'abonnement lors du démontage du composant
    return () => subscription.unsubscribe();
  }, []);

  // Fonction pour s'inscrire
  const signUp = useCallback(async ({ email, password, options }) => {
    // Les options incluent maintenant les nouveaux champs pour le suivi des emails de rappel
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });
    if (error) {
      throw error;
    }
    // Retourne l'utilisateur créé, qui inclut le champ 'created_at' et les métadonnées
    return data.user;
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    if (data.user) {
      setUser(data.user);
    }
    return data.user;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      signUp,
      signIn,
      signOut,
    }),
    [user, loading, authError, signUp, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
