import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { supabaseClient } from '../utils/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const getSession = useCallback(async () => {
    try {
      const { data, error } = await supabaseClient.auth.getSession();
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

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [getSession, handleAuthStateChange]);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error.message);
      setAuthError(error);
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
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
      const { data, error } = await supabaseClient.auth.signUp({ email, password });
      if (error) throw error;
      setUser(data.user);
  
      // Créer un profil pour l'utilisateur
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert([{ id: data.user.id, email: data.user.email }]);
      if (profileError) throw profileError;
  
      // Rediriger vers le tableau de bord après l'inscription
      router.push('/dashboard');
      return data;
    } catch (error) {
      console.error('Error signing up:', error.message);
      setAuthError(error);
      throw error;
    }
  }, []);
  

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
