'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
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
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          try {
            const { data: userData, error } = await supabase
              .from('users')
              .select('*')
              .filter('id', 'eq', authUser.id)
              .maybeSingle();
            
            if (error) {
              console.error('Fehler beim Laden der Benutzerdaten:', error);
            } else if (userData) {
              setUser(userData as any);
            }
          } catch (dbError) {
            console.error('Datenbankfehler:', dbError);
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden des Benutzers:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'SIGNED_OUT' || !session) {
            router.push('/login');
          } else if (session.user) {
            try {
              const { data: userData, error } = await supabase
                .from('users')
                .select('*')
                .filter('id', 'eq', session.user.id)
                .maybeSingle();
              
              if (error) {
                console.error('Fehler beim Laden der Benutzerdaten:', error);
              } else if (userData) {
                setUser(userData as any);
              }
            } catch (dbError) {
              console.error('Datenbankfehler:', dbError);
            }
          }
        } catch (error) {
          console.error('Fehler bei Auth State Change:', error);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
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
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
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
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        
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
      </div>
    </div>
  );
}
