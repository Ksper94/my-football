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
    let mounted = true;

    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setAuthError(error);
        }
        if (mounted) {
          setUser(data.session?.user || null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Unexpected error getting session:', err);
        if (mounted) setLoading(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        setAuthError(error);
      } else {
        setUser(null);
        console.log('User signed out');
      }
    } catch (err) {
      console.error('Unexpected error signing out:', err);
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Error signing in:', error);
      setAuthError(error);
      throw error;
    }

    console.log('User signed in:', data.user);

    // Upsert du profil
    const { error: profileUpsertError } = await supabase
      .from('profiles')
      .upsert([{ id: data.user.id, email: data.user.email }], { onConflict: 'id' });

    if (profileUpsertError) {
      console.error('Error upserting profile:', profileUpsertError.message);
    } else {
      console.log('Profile upserted successfully for user:', data.user.id);
    }

    return data;
  }, []);

  const signUp = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Error signing up:', error);
      setAuthError(error);
      throw error;
    }
    console.log('User signed up:', data.user);
    // Un email de confirmation est envoyé, pas de création de profil ici.
    return data;
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
