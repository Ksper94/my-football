// context/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const getSession = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      setAuthError(error);
    }
    if (data?.session?.user) {
      setUser(data.session.user);
    }
    setLoading(false);
  }, []);

  const handleAuthStateChange = useCallback((_event, session) => {
    setUser(session?.user ?? null);
  }, []);

  useEffect(() => {
    getSession();
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [getSession, handleAuthStateChange]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(error);
    }
    setUser(null);
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error);
      throw error;
    }

    // L'utilisateur est maintenant authentifié si l'email est confirmé.
    // On peut insérer le profil si besoin (uniquement si ce n'est pas déjà fait).
    // Par exemple, on peut tenter une insertion, si duplicate, ce n'est pas grave.
    const { error: profileError } = await supabase.from('profiles')
      .insert([{ id: data.user.id, email: data.user.email }])
      .select(); // select() pour vérifier l'insertion

    if (profileError && !profileError.message.includes('duplicate key')) {
      // Si c'est une autre erreur que la clé dupliquée, on la log.
      console.error('Erreur lors de la création du profil:', profileError.message);
    }

    return data;
  }, []);

  const signUp = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setAuthError(error);
      throw error;
    }
    // A ce stade, un email de confirmation a été envoyé.
    // Pas de création de profil, on attend la confirmation et la connexion.
    return data;
  }, []);

  const contextValue = useMemo(
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
