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
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setAuthError(error);
        console.log('Error getting session:', error);
      }
      if (mounted) {
        setUser(data.session?.user || null);
        setLoading(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(error);
      console.log('Error signing out:', error);
    } else {
      setUser(null);
      console.log('User signed out');
    }
  }, []);

  // context/AuthContext.js
  // ... (Code précédent)
  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error);
      console.log('Error signing in:', error);
      throw error;
    }

    console.log('User signed in:', data.user);

    // Vérifier si le profil existe, sinon le créer
    const { data: existingProfile, error: profileSelectError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .single();

    if (profileSelectError) {
      if (profileSelectError.code === 'PGRST116') { // No rows found
        console.log('Profile not found, creating profile');
        const { error: profileInsertError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, email: data.user.email }]);
        if (profileInsertError) {
          console.error('Erreur lors de la création du profil:', profileInsertError.message);
        } else {
          console.log('Profile created successfully for user:', data.user.id);
        }
      } else {
        console.error('Error selecting profile:', profileSelectError.message);
      }
    } else {
      console.log('Profile already exists for user:', existingProfile.id);
    }

    return data;
  }, []);
  // ... (Suite du code)


  const signUp = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setAuthError(error);
      console.log('Error signing up:', error);
      throw error;
    }
    console.log('User signed up:', data.user);
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
