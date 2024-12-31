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
        console.error('Error fetching session:', error);
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

    // Gestion en temps réel de l'authentification
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Créer un compte + envoyer les métadonnées dans user_metadata
   * => L'email de confirmation sera envoyé automatiquement par Supabase (si activé).
   *
   * En Supabase JS v2, on doit passer "email", "password" et "options" dans un seul objet.
   * Exemple d'utilisation :
   *   signUp({
   *     email: '...',
   *     password: '...',
   *     options: {
   *       data: {
   *         first_name: 'Hugo',
   *         last_name: 'Stephan',
   *       },
   *     },
   *   });
   */
  const signUp = useCallback(async ({ email, password, options }) => {
    try {
      // Supabase JS v2 requiert cette forme
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
      });

      if (error) {
        console.error('Erreur lors de la création du compte:', error.message);
        throw error;
      }

      console.log('Utilisateur créé (email envoyé) :', data.user);
      return data.user;
    } catch (err) {
      console.error("Erreur inattendue lors de l'inscription:", err.message);
      throw err;
    }
  }, []);

  /**
   * Connexion standard
   */
  const signIn = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('Erreur lors de la connexion:', error.message);
        throw error;
      }
      if (data.user) {
        console.log('Connexion réussie:', data.user);
        setUser(data.user);
      }
      return data.user;
    } catch (err) {
      console.error('Erreur inattendue lors de la connexion:', err.message);
      throw err;
    }
  }, []);

  /**
   * Déconnexion
   */
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
