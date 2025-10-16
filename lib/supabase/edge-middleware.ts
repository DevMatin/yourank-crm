import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from '@/types/database';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  try {
    // Edge Runtime kompatible Supabase Client-Konfiguration
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            req.cookies.set(name, value);
            res.cookies.set(name, value, options);
          },
          remove(name: string, options: any) {
            req.cookies.set(name, '');
            res.cookies.set(name, '', options);
          },
        },
        // Edge Runtime spezifische Konfiguration
        global: {
          fetch: fetch,
        },
        // Edge Runtime kompatible Auth-Konfiguration
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
        // Deaktiviere Realtime in Edge Runtime
        realtime: {
          disabled: true,
        },
      }
    );

    // Verwende eine einfachere Authentifizierungsprüfung für Edge Runtime
    const authHeader = req.headers.get('authorization');
    const cookieHeader = req.headers.get('cookie');
    
    let user = null;
    
    // Versuche User aus Cookie zu extrahieren (vereinfachte Methode für Edge Runtime)
    if (cookieHeader) {
      try {
        const { data: { user: userData } } = await supabase.auth.getUser();
        user = userData;
      } catch (error) {
        // Bei Fehlern in Edge Runtime einfach null setzen
        user = null;
      }
    }

    // Debug logging basierend auf Environment-Variablen
    const debugMiddleware = process.env.DEBUG_MIDDLEWARE === 'true';
    const debugVerbose = process.env.DEBUG_MIDDLEWARE_VERBOSE === 'true';
    const debugPaths = process.env.DEBUG_MIDDLEWARE_PATHS?.split(',') || [];
    
    if (debugMiddleware) {
      const shouldLog = debugVerbose || 
                       debugPaths.some(path => req.nextUrl.pathname.includes(path)) ||
                       req.nextUrl.pathname === '/' ||
                       req.nextUrl.pathname.startsWith('/dashboard');
      
      if (shouldLog) {
        console.log('🔍 Edge Middleware - Path:', req.nextUrl.pathname, 'User exists:', !!user, 'User ID:', user?.id);
      }
    }

    // If user is signed in and the current path is /login or /signup redirect the user to /dashboard
    if (user && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
      console.log('Redirecting authenticated user to dashboard');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // If user is not signed in and the current path is not /login or /signup redirect the user to /login
    if (!user && (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname === '/')) {
      console.log('Redirecting unauthenticated user to login');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return res;
  } catch (error) {
    console.error('Edge Middleware error:', error);
    // Bei Fehlern einfach weiterleiten ohne Authentifizierung
    return res;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'edge',
};
