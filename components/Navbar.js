// components/Navbar.js

import { supabaseClient } from '../utils/supabaseClient';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (session && session.user) {
        setUser(session.user);
      }
    };

    fetchUser();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Mon Application</h1>
      <div>
        {user ? (
          <p>Bienvenue, {user.email}</p>
        ) : (
          <a href="/login" className="text-blue-500">Se connecter</a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
