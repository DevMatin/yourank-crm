import { createBrowserClient } from '@supabase/ssr';

let supabaseClient: any = null;

export const createClient = () => {
  // Singleton pattern to prevent multiple instances
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
        // Vereinfachte Konfiguration für bessere Kompatibilität
        global: {
          fetch: fetch,
        },
      }
    );
  }
  return supabaseClient;
};

export const supabase = createClient();
