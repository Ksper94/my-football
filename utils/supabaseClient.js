// utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// URL de votre instance Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Clé anonyme (client-side) Supabase
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Clé de service (server-side) Supabase
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client Supabase pour le frontend
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Client Supabase pour le backend (API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
