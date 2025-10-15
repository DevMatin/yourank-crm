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
    }
  );

  // Use getUser() instead of getSession() for better security
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
      console.log('🔍 Middleware - Path:', req.nextUrl.pathname, 'User exists:', !!user, 'User ID:', user?.id);
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
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs', // Verwende Node.js Runtime statt Edge Runtime für Supabase-Kompatibilität
};