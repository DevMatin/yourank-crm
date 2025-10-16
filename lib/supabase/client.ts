import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Edge Runtime kompatible Konfiguration
      global: {
        fetch: fetch,
      },
      // Deaktiviere Realtime für bessere Edge Runtime Kompatibilität
      realtime: {
        enabled: false,
      },
    }
  );
};

export const supabase = createClient();
