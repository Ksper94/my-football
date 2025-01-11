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

/**
 * Crée la souscription "trial" pour 7 jours dans la table "subscriptions"
 * plan = 'trial', status = 'active'
 */
async function createTrialSubscription(userId) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id: userId,
          plan: 'trial',
          status: 'active',
          // created_at s'inscrit automatiquement si DEFAULT now() dans la DB
        },
      ])
      .single();

    if (error) {
      console.error('Erreur lors de la création du trial :', error.message);
      return null;
    }
    console.log('Trial créé :', data);
    return data;
  } catch (err) {
    console.error('Exception dans createTrialSubscription :', err);
    return null;
  }
}

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
   * Inscription => Crée un compte + envoie un email de confirmation
   * En Supabase JS v2, on doit passer "email", "password" et "options"
   */
  const signUp = useCallback(async ({ email, password, options }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
      });

      if (error) {
        console.error('Erreur lors de la création du compte:', error.message);
        throw error;
      }

      // data.user => l'utilisateur fraichement créé
      if (data?.user?.id) {
        // ==> On crée la subscription "trial" pour 7 jours
        await createTrialSubscription(data.user.id);
      }

      console.log('Utilisateur créé (email de confirmation envoyé) :', data.user);
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
