'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { modules } from '@/config/modules.config';
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
  ChevronRight
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">YR</span>
          </div>
          <span className="font-display font-bold text-lg">yourank.ai</span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {modules.map((module) => {
          const Icon = iconMap[module.icon as keyof typeof iconMap] || Search;
          const isActive = pathname.startsWith(module.basePath);
          const hasActiveChild = module.tools.some(tool => 
            pathname === `${module.basePath}/${tool.id}`
          );

          return (
            <Collapsible key={module.id} defaultOpen={isActive || hasActiveChild}>
              <CollapsibleTrigger asChild>
                <div
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                    isActive || hasActiveChild
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <span>{module.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-90" />
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-1 mt-1">
                {module.tools.map((tool) => {
                  const toolPath = `${module.basePath}/${tool.id}`;
                  const isToolActive = pathname === toolPath;

                  return (
                    <Link
                      key={tool.id}
                      href={toolPath}
                      className={cn(
                        "flex items-center justify-between w-full px-6 py-2 text-sm rounded-md transition-colors",
                        isToolActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      <span>{tool.name}</span>
                      <div className="flex items-center space-x-2">
                        {tool.status === 'beta' && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                            Beta
                          </span>
                        )}
                        {tool.status === 'coming_soon' && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            Soon
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {tool.credits}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>
    </div>
  );
}
