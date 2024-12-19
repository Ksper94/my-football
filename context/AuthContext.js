// context/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Récupération de la session actuelle
    const session = supabase.auth.session();
    setUser(session?.user || null);
    setLoading(false);

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(error);
    } else {
      setUser(null);
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signIn({ email, password });
    if (error) {
      setAuthError(error);
      throw error;
    }

    // Utilisateur connecté. On insère le profil si non existant.
    const { data: existingProfile, error: profileSelectError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .single();

    if (profileSelectError && profileSelectError.details?.includes('No rows')) {
      // Pas de profil, on le crée
      const { error: profileInsertError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, email: data.user.email }]);
      if (profileInsertError) {
        console.error('Erreur lors de la création du profil:', profileInsertError.message);
      }
    }

    return data;
  }, []);

  const signUp = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setAuthError(error);
      throw error;
    }
    // Email de confirmation envoyé. Pas de création de profil ici.
    return data;
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
