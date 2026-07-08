import { createClient } from '@supabase/supabase-js';

// The Supabase client requires the plain project base URL (e.g. https://xyz.supabase.co).
// Strip any accidental /rest/v1 suffix — if present it corrupts storage API paths and
// causes StorageApiError "Invalid path specified in request URL" (404/PGRST125).
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Initialize Supabase Client with the Service Role key
// We use the service role key since these are server actions managing files
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
