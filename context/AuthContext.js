import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
        console.error('Error fetching session:', error);
        setAuthError(error);
      } else {
        setUser(session?.user || null);
      }
      setLoading(false);
    };

    getSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error('Erreur lors de la création du compte:', error.message);
        throw error;
      }
      console.log('Utilisateur créé avec succès:', data.user);
      return data.user;
    } catch (err) {
      console.error('Erreur inattendue lors de l\'inscription:', err.message);
      throw err;
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Erreur lors de la connexion:', error.message);
        throw error;
      }
      console.log('Connexion réussie:', data.user);
      return data.user;
    } catch (err) {
      console.error('Erreur inattendue lors de la connexion:', err.message);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erreur lors de la déconnexion:', error.message);
        throw error;
      }
      setUser(null);
      console.log('Déconnexion réussie');
    } catch (err) {
      console.error('Erreur inattendue lors de la déconnexion:', err.message);
      throw err;
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
  }), [user, loading, authError, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
