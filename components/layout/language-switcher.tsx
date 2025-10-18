'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Globe } from 'lucide-react';
import { locales, localeConfig } from '../../i18n';
import { useLanguagePreference } from '@/lib/hooks/use-user-settings';

export function LanguageSwitcher() {
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { setLocale } = useLanguagePreference();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-muted animate-pulse" />
    );
  }

  const handleLanguageChange = async (newLocale: string) => {
    try {
      // Save language preference to database and localStorage
      await setLocale(newLocale as any);
      
      // Navigate to new locale
      const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
      router.push(newPath);
    } catch (error) {
      console.error('Failed to change language:', error);
      // Fallback: just navigate without saving preference
      const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
      router.push(newPath);
    }
  };

  const currentLocaleConfig = localeConfig[locale as keyof typeof localeConfig];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:bg-white/20 dark:hover:bg-white/10"
          style={{
            background: 'var(--glass-card-bg)',
            border: '1px solid var(--glass-card-border)'
          }}
        >
          <span className="text-sm">{currentLocaleConfig?.flag || '🌐'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48"
        style={{
          background: 'var(--glass-card-bg)',
          border: '1px solid var(--glass-card-border)',
          backdropFilter: 'blur(12px)',
          boxShadow: 'var(--glass-card-shadow)'
        }}
      >
        {locales.map((loc) => {
          const config = localeConfig[loc];
          const isActive = loc === locale;
          
          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => handleLanguageChange(loc)}
              className={`
                flex items-center gap-3 px-3 py-2 cursor-pointer transition-all
                ${isActive 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
                }
                hover:bg-white/20 dark:hover:bg-white/10
              `}
            >
              <span className="text-lg">{config.flag}</span>
              <span className="flex-1 text-sm">{config.nativeName}</span>
              {isActive && (
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#34A7AD' }}
                />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
