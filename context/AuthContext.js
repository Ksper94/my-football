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
        console.error('Error during sign out:', error.message);
        setAuthError(error);
      } else {
        setUser(null); // Réinitialise l'utilisateur
        console.log('User signed out successfully');
      }
    } catch (err) {
      console.error('Unexpected error during sign out:', err);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      signOut,
    }),
    [user, loading, authError, signOut]
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
