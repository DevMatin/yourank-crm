import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Einfache Cookie-basierte Authentifizierungsprüfung für Edge Runtime
  // Supabase verwendet verschiedene Cookie-Namen, prüfe die wichtigsten
  const supabaseAccessToken = req.cookies.get('sb-access-token')?.value;
  const supabaseRefreshToken = req.cookies.get('sb-refresh-token')?.value;
  const supabaseSession = req.cookies.get('supabase-auth-token')?.value;
  
  // Prüfe ob User authentifiziert ist (vereinfachte Methode)
  // Prüfe verschiedene mögliche Cookie-Namen
  const isAuthenticated = !!(
    supabaseAccessToken || 
    supabaseRefreshToken || 
    supabaseSession ||
    // Fallback: Prüfe auf alle Cookies die mit 'sb-' beginnen
    Array.from(req.cookies.getAll()).some(cookie => 
      cookie.name.startsWith('sb-') && cookie.value && cookie.value.length > 10
    )
  );

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
      console.log('🔍 Simple Middleware - Path:', req.nextUrl.pathname, 'Authenticated:', isAuthenticated);
    }
  }

  // If user is signed in and the current path is /login or /signup redirect the user to /dashboard
  if (isAuthenticated && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    console.log('Redirecting authenticated user to dashboard');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If user is not signed in and the current path is not /login or /signup redirect the user to /login
  if (!isAuthenticated && (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname === '/')) {
    console.log('Redirecting unauthenticated user to login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'edge',
};
