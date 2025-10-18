'use client';

import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { modules } from '@/config/modules.config';
import { getIconContainerStyle, getComponentClasses } from '@/lib/utils/theme-helpers';
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
  Plus
} from 'lucide-react';
import Link from 'next/link';

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

export function QuickActions() {
  // Beliebte Tools für Quick Actions
  const popularTools = [
    { moduleId: 'keywords', toolId: 'related', name: 'Verwandte Keywords', icon: 'Hash' },
    { moduleId: 'domain', toolId: 'overview', name: 'Domain-Analyse', icon: 'Globe' },
    { moduleId: 'serp', toolId: 'ai-overview', name: 'SERP-Analyse', icon: 'Search' },
    { moduleId: 'keywords', toolId: 'difficulty', name: 'Keyword-Schwierigkeit', icon: 'Hash' },
  ];

  return (
    <GlassCard className="p-6">
      {/* Header mit Icon Container Pattern */}
      <div className="flex items-center gap-2 mb-6">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
            boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
          }}
        >
          <Plus className="h-5 w-5" style={{ color: '#34A7AD' }} />
        </div>
        <h3 className="text-foreground">Schnellstart</h3>
      </div>
      
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {popularTools.map((tool) => {
          const moduleConfig = modules.find(m => m.id === tool.moduleId);
          const Icon = iconMap[tool.icon as keyof typeof iconMap] || Search;
          
          return (
            <Button
              key={`${tool.moduleId}-${tool.toolId}`}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
              asChild
            >
              <Link href={`${moduleConfig?.basePath}/${tool.toolId}`}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color: '#34A7AD' }} />
                  <span className="text-sm font-medium text-foreground">{tool.name}</span>
                </div>
              </Link>
            </Button>
          );
        })}
      </div>
      
      {/* Create Project Button */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <Button 
          variant="ghost" 
          className="w-full hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300" 
          asChild
        >
          <Link href="/dashboard/projects">
            <Plus className="h-4 w-4 mr-2" style={{ color: '#34A7AD' }} />
            <span className="text-foreground">Neues Projekt erstellen</span>
          </Link>
        </Button>
      </div>
    </GlassCard>
  );
}
