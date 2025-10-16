import { createBrowserClient } from '@supabase/ssr';

let supabaseClient: any = null;

export function createClient() {
  // Singleton pattern to prevent multiple instances
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Debug logging to help troubleshoot environment variable loading
    console.log('Supabase environment variables check:', {
      url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING',
      key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
      nodeEnv: process.env.NODE_ENV
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables:', {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey
      });
      console.error('Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
      console.error('Make sure to restart your development server after adding environment variables');
      // Return null instead of throwing to prevent app crash
      return null;
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
      
      // Verify that the client was created successfully
      if (!supabaseClient) {
        throw new Error('Supabase client creation returned null/undefined');
      }
      
      console.log('Supabase client created successfully');
    } catch (error) {
      console.error('Error creating Supabase client:', error);
      // Fallback: Versuche es ohne erweiterte Konfiguration
      try {
        supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
        if (!supabaseClient) {
          throw new Error('Fallback client creation returned null/undefined');
        }
        console.log('Supabase client created successfully (fallback mode)');
      } catch (fallbackError) {
        console.error('Fallback Supabase client creation failed:', fallbackError);
        // Return null instead of throwing to prevent app crash
        return null;
      }
    }
  }
  return supabaseClient;
}

// Alternative Export für bessere Kompatibilität
export default createClient;
