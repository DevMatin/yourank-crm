import { createBrowserClient } from '@supabase/ssr';

let supabaseClient: any = null;

export function createClient() {
  // Singleton pattern to prevent multiple instances
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    try {
      // Einfache Konfiguration ohne komplexe Typisierung
      supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          get(name: string) {
            if (typeof document !== 'undefined') {
              const value = `; ${document.cookie}`;
              const parts = value.split(`; ${name}=`);
              if (parts.length === 2) return parts.pop()?.split(';').shift();
            }
            return undefined;
          },
          set(name: string, value: string, options: any) {
            if (typeof document !== 'undefined') {
              document.cookie = `${name}=${value}; path=/; ${options?.maxAge ? `max-age=${options.maxAge}` : ''}`;
            }
          },
          remove(name: string, options: any) {
            if (typeof document !== 'undefined') {
              document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            }
          },
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (error) {
      console.error('Error creating Supabase client:', error);
      // Fallback: Versuche es ohne erweiterte Konfiguration
      try {
        supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
      } catch (fallbackError) {
        console.error('Fallback Supabase client creation failed:', fallbackError);
        throw new Error('Failed to create Supabase client');
      }
    }
  }
  return supabaseClient;
}

// Alternative Export für bessere Kompatibilität
export default createClient;
