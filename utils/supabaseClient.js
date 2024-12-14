// utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// URL de votre instance Supabase
const supabaseUrl = 'https://ekoagfbqgowuxumvixib.supabase.co';

// Clé de service (Service Role Key) depuis les variables d'environnement
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialisation du client Supabase avec la Service Role Key
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
});
