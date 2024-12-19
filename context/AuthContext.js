import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../utils/supabaseClient'; // Utiliser { supabase } et non { supabaseClient }
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const getSession = useCallback(async () => {
    try {
      // Récupération de la session actuelle
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (data.session?.user) {
        setUser(data.session.user);
      }
    } catch (error) {
      console.error('Error fetching session:', error.message);
      setAuthError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAuthStateChange = useCallback((_event, session) => {
    setUser(session?.user ?? null);
  }, []);

  useEffect(() => {
    getSession();

    // Écoute les changements d'état d'auth
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [getSession, handleAuthStateChange]);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error.message);
      setAuthError(error);
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Error signing in:', error.message);
      setAuthError(error);
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setUser(data.user);

      // Insertion du profil dans la table profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, email: data.user.email }]);
      if (profileError) throw profileError;

      // Redirection vers le dashboard
      router.push('/dashboard');
      return data;
    } catch (error) {
      console.error('Error signing up:', error.message);
      setAuthError(error);
      throw error;
    }
  }, [router]);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      authError,
      signIn,
      signUp,
      signOut,
    }),
    [user, loading, authError, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
