'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { modules, getDeprecatedTools, getActiveTools, getComingSoonTools } from '@/config/modules.config';
import { useUserSettings } from '@/lib/hooks/use-user-settings';
import { 
  Search, 
  Hash, 
  Globe, 
  FlaskConical, 
  Link as LinkIcon, 
  FileText, 
  PenTool, 
  ShoppingCart, 
  Smartphone, 
  Building2, 
  Database, 
  Brain,
  ChevronRight,
  Filter,
  Database as DatabaseIcon,
  Zap,
  BarChart3,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';


const iconMap = {
  Search,
  Hash,
  Globe,
  FlaskConical,
  Link: LinkIcon,
  FileText,
  PenTool,
  ShoppingCart,
  Smartphone,
  Building2,
  Database,
  Brain,
  BarChart3,
  Target,
  TrendingUp,
  Users,
};

// SEMrush-Style Keywords Hauptkategorien
const keywordsMainCategories = [
  {
    id: 'overview',
    name: 'Overview',
    description: 'All-in-One Keyword Zusammenfassung',
    href: '/keywords/overview-v2',
    icon: 'BarChart3',
    status: 'active' as const
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Keyword-Ideen und Vorschläge',
    href: '/keywords/research',
    icon: 'Search',
    status: 'active' as const
  },
  {
    id: 'competition',
    name: 'Competition',
    description: 'Keyword-Schwierigkeit und Wettbewerb',
    href: '/keywords/competition',
    icon: 'Target',
    status: 'active' as const
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Traffic und Clickstream-Daten',
    href: '/keywords/performance',
    icon: 'TrendingUp',
    status: 'active' as const
  },
  {
    id: 'trends',
    name: 'Trends',
    description: 'Trend-Analysen und Demografie',
    href: '/keywords/trends',
    icon: 'BarChart3',
    status: 'active' as const
  },
  {
    id: 'audience',
    name: 'Audience',
    description: 'Zielgruppen und Targeting',
    href: '/keywords/audience',
    icon: 'Users',
    status: 'active' as const
  }
];

export function Sidebar() {
  const pathname = usePathname();
  
  // State für Keywords Dropdown
  const [isKeywordsOpen, setIsKeywordsOpen] = useState(false);
  const hasLoadedFromStorage = useRef(false);
  
  // Use user settings hook for legacy tools visibility
  const { 
    value: showLegacyTools, 
    setValue: setShowLegacyTools,
    loading: settingsLoading 
  } = useUserSettings('show_legacy_keyword_tools', false);

  // Lade Keywords Dropdown-Status aus localStorage (nur beim ersten Laden)
  useEffect(() => {
    if (hasLoadedFromStorage.current) return; // Verhindere doppelte Ausführung
    
    const savedKeywordsState = localStorage.getItem('keywords-dropdown-open');
    
    if (savedKeywordsState !== null) {
      const parsedState = JSON.parse(savedKeywordsState);
      setIsKeywordsOpen(parsedState);
    } else {
      // Nur beim ersten Laden: öffne wenn Keywords-Seite aktiv
      const currentPath = window.location.pathname;
      const isKeywordsActive = currentPath.startsWith('/keywords');
      setIsKeywordsOpen(isKeywordsActive);
    }
    
    hasLoadedFromStorage.current = true;
  }, []); // Leere Dependency Array - läuft nur einmal beim Mount

  // Speichere Keywords Dropdown-Status in localStorage
  useEffect(() => {
    localStorage.setItem('keywords-dropdown-open', JSON.stringify(isKeywordsOpen));
  }, [isKeywordsOpen]);

  const handleLegacyToggle = async () => {
    try {
      await setShowLegacyTools(!showLegacyTools);
    } catch (error) {
      console.error('Failed to save legacy tools preference:', error);
    }
  };

  return (
    <div 
      className="flex h-full flex-col" 
      style={{
        width: '256px',
        background: 'var(--glass-sidebar-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--glass-card-border)'
      }}
    >
      <div 
        className="flex h-16 items-center px-6" 
        style={{borderBottom: '1px solid var(--glass-card-border)'}}
      >
        <Link href="/dashboard" className="flex items-center space-x-2 group">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
              boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
            }}
          >
            <span style={{color: '#34A7AD', fontWeight: 'bold', fontSize: '14px'}}>YR</span>
          </div>
          <span className="font-bold text-foreground" style={{fontSize: '18px', color: '#34A7AD'}}>yourank.ai</span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {modules.map((module) => {
          const Icon = iconMap[module.icon as keyof typeof iconMap] || Search;
          const isActive = pathname.startsWith(module.basePath);
          const hasActiveChild = module.tools.some(tool => 
            pathname === `${module.basePath}/${tool.id}`
          );
          const isKeywordsModule = module.id === 'keywords';

          return (
            <div key={module.id}>
              <Collapsible 
                open={isKeywordsModule ? isKeywordsOpen : (isActive || hasActiveChild)}
                onOpenChange={isKeywordsModule ? setIsKeywordsOpen : undefined}
              >
                <CollapsibleTrigger asChild>
                  <div
                    className={cn(
                      "relative flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 cursor-pointer",
                      isActive || hasActiveChild
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-white/10"
                    )}
                    style={{
                      background: isActive || hasActiveChild ? 'rgba(255,255,255,0.1)' : 'transparent'
                    }}
                  >
                    {(isActive || hasActiveChild) && (
                      <div 
                        className="absolute left-0 h-6 rounded-r"
                        style={{
                          width: '4px',
                          background: '#34A7AD',
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}
                      />
                    )}
                    <div className="flex items-center space-x-3">
                      <Icon 
                        className="h-4 w-4" 
                        style={{ color: isActive || hasActiveChild ? '#34A7AD' : undefined }}
                      />
                      <span>{module.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-90" />
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="space-y-1 mt-1">
                  {/* SEMrush-Style Keywords Hauptkategorien */}
                  {isKeywordsModule ? (
                    <div className="space-y-1">
                      {/* Neue Hauptkategorien */}
                      {keywordsMainCategories.map((category) => {
                        const CategoryIcon = iconMap[category.icon as keyof typeof iconMap] || Search;
                        const isCategoryActive = pathname === category.href;

                        return (
                          <Link
                            key={category.id}
                            href={category.href}
                            className={cn(
                              "flex items-center justify-between w-full px-6 py-2 text-sm rounded-lg transition-all duration-300 backdrop-blur-sm",
                              isCategoryActive
                                ? "bg-white/10 text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-white/10"
                            )}
                          >
                            <div className="flex items-center space-x-3">
                              <CategoryIcon 
                                className="h-4 w-4" 
                                style={{ color: isCategoryActive ? '#34A7AD' : undefined }}
                              />
                              <span>{category.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {['competition', 'performance', 'trends', 'audience'].includes(category.id) && (
                                <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full backdrop-blur-sm border border-primary/30">
                                  New
                                </span>
                              )}
                            </div>
                          </Link>
                        );
                      })}

                      {/* Legacy Tools Toggle */}
                      <div className="px-6 py-2 mt-4">
                        <button
                          onClick={handleLegacyToggle}
                          disabled={settingsLoading}
                          className={cn(
                            "flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors",
                            settingsLoading && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          <Filter className="h-3 w-3" />
                          {showLegacyTools ? 'Legacy Tools ausblenden' : 'Legacy Tools anzeigen'}
                        </button>
                      </div>

                      {/* Legacy Tools (Collapsible) */}
                      {showLegacyTools && (
                        <Collapsible defaultOpen={false}>
                          <CollapsibleTrigger asChild>
                            <div className="px-6 py-1 cursor-pointer hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-all duration-300 backdrop-blur-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">🔧</span>
                                <span className="text-xs font-medium text-muted-foreground">
                                  Legacy Tools
                                </span>
                                <span className="text-xs bg-destructive/20 text-destructive px-1.5 py-0.5 rounded-full backdrop-blur-sm border border-destructive/30">
                                  Deprecated
                                </span>
                                <ChevronRight className="h-3 w-3 text-muted-foreground ml-auto transition-transform duration-200 data-[state=open]:rotate-90" />
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent className="space-y-1">
                            {/* Deprecated Tools */}
                            {getDeprecatedTools().map((tool) => {
                              const toolPath = `${module.basePath}/${tool.id}`;
                              const isToolActive = pathname === toolPath;

                              return (
                                <Link
                                  key={tool.id}
                                  href={toolPath}
                                  className={cn(
                                    "flex items-center justify-between w-full px-8 py-2 text-sm rounded-lg transition-all duration-300 backdrop-blur-sm opacity-75",
                                  isToolActive
                                    ? "bg-white/10 text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-white/10"
                                  )}
                                >
                                  <span className="truncate">{tool.name}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs bg-destructive/20 text-destructive px-1.5 py-0.5 rounded-full backdrop-blur-sm border border-destructive/30">
                                      Deprecated
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {tool.credits}
                                    </span>
                                  </div>
                                </Link>
                              );
                            })}
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                  ) : (
                    /* Normale Tools für andere Module */
                    module.tools.map((tool) => {
                      const toolPath = `${module.basePath}/${tool.id}`;
                      const isToolActive = pathname === toolPath;

                      return (
                        <Link
                          key={tool.id}
                          href={toolPath}
                          className={cn(
                            "flex items-center justify-between w-full px-6 py-2 text-sm rounded-lg transition-all duration-300 backdrop-blur-sm",
                                  isToolActive
                                    ? "bg-white/10 text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-white/10"
                          )}
                        >
                          <span>{tool.name}</span>
                          <div className="flex items-center space-x-2">
                            {tool.status === 'beta' && (
                              <span className="text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-1.5 py-0.5 rounded-full backdrop-blur-sm border border-yellow-500/30">
                                Beta
                              </span>
                            )}
                            {tool.status === 'coming_soon' && (
                              <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full backdrop-blur-sm border border-border">
                                Soon
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {tool.credits}
                            </span>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
