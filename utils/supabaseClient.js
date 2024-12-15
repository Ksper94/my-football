// utils/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Initialisez le client Supabase public (côté client)
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export { supabaseClient };
