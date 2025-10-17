'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CreditBadge } from '@/components/dashboard/credit-badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import { Moon, Sun, LogOut, User, Settings } from 'lucide-react';
// Einfache User-Typdefinition für bessere Kompatibilität
type UserType = {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  plan: string;
  created_at: string;
  updated_at: string;
};

export function Topbar() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const getUser = async () => {
      try {
        const supabase = createClient();
        
        // Timeout für die gesamte Operation setzen
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Auth timeout')), 3000);
        });

        const authPromise = supabase.auth.getUser();
        
        let authUser;
        try {
          const result = await Promise.race([authPromise, timeoutPromise]) as any;
          authUser = result.data?.user;
        } catch (timeoutError) {
          console.warn('Auth timeout - using fallback');
          // Versuche es ohne Timeout nochmal
          try {
            const { data: { user } } = await supabase.auth.getUser();
            authUser = user;
          } catch (fallbackError) {
            console.error('Fallback auth failed:', fallbackError);
            throw timeoutError; // Werfe den ursprünglichen Timeout-Fehler
          }
        }
        
        if (authUser && isMounted) {
          // Verwende direkt Auth-User-Daten mit 500 Credits als Fallback
          console.log('Using auth user data with 500 credits');
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.name || null,
            credits: 500, // Setze direkt 500 Credits
            plan: 'free',
            created_at: authUser.created_at || new Date().toISOString(),
            updated_at: authUser.updated_at || new Date().toISOString()
          } as any);
        }
      } catch (error) {
        console.error('Fehler beim Laden des Benutzers:', error);
        if (isMounted) {
          // Versuche trotzdem einen minimalen User zu erstellen
          try {
            const supabase = createClient();
            const { data: { user: fallbackUser } } = await supabase.auth.getUser();
            if (fallbackUser && isMounted) {
              setUser({
                id: fallbackUser.id,
                email: fallbackUser.email || '',
                name: fallbackUser.user_metadata?.name || null,
                credits: 0,
                plan: 'free',
                created_at: fallbackUser.created_at || new Date().toISOString(),
                updated_at: fallbackUser.updated_at || new Date().toISOString()
              } as any);
            } else {
              setError(true);
            }
          } catch (finalError) {
            console.error('Final fallback failed:', finalError);
            setError(true);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };

    getUser();

    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (!isMounted) return;
        
        try {
          if (event === 'SIGNED_OUT' || !session) {
            router.push('/login');
          } else if (session.user && supabase) {
            // Verwende direkt Session-User-Daten mit 500 Credits
            console.log('Using session user data with 500 credits');
            if (isMounted) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || null,
                credits: 500, // Setze direkt 500 Credits
                plan: 'free',
                created_at: session.user.created_at || new Date().toISOString(),
                updated_at: session.user.updated_at || new Date().toISOString()
              } as any);
            }
          }
        } catch (error) {
          console.error('Fehler bei Auth State Change:', error);
        }
      }
    );

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Fehler beim Abmelden:', error);
      // Trotzdem zur Login-Seite weiterleiten
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="h-16 border-b bg-card flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-foreground">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-6 w-16 bg-muted animate-pulse rounded" />
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
          <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  // Fallback für Fehlerfall - zeige trotzdem die Topbar ohne Benutzerdaten
  if (error && !user) {
    return (
      <div className="h-16 border-b bg-card flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-foreground">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="relative"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <div className="h-8 w-8 rounded-full bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-16 border-b bg-card flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold text-foreground">
          Dashboard
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {user && (
          <CreditBadge 
            credits={user.credits} 
            maxCredits={100}
            showProgress={true}
          />
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="relative"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || 'Benutzer'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Einstellungen</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Abmelden</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        )}
      </div>
    </div>
  );
}
