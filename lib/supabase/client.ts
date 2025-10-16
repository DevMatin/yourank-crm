import { createBrowserClient } from '@supabase/ssr';

let supabaseClient: any = null;

export const createClient = () => {
  // Singleton pattern to prevent multiple instances
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
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
        global: {
          fetch: fetch,
        },
      }
    );
  }
  return supabaseClient;
};

export const supabase = createClient();
