// utils/supabaseService.js

import { createClient } from '@supabase/supabase-js';

// Initialisez le client Supabase avec les clés de service
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export { supabaseService };
