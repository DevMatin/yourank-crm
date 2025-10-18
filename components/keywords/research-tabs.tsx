import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Hash, 
  Search, 
  Lightbulb, 
  Globe, 
  Target,
  Loader2
} from 'lucide-react';

interface ResearchTab {
  id: 'related' | 'suggestions' | 'ideas' | 'for-site' | 'for-keywords';
  label: string;
  description: string;
  icon: any;
  credits: number;
  status: 'active' | 'coming_soon';
}

const researchTabs: ResearchTab[] = [
  {
    id: 'related',
    label: 'Related',
    description: 'Verwandte Keywords finden',
    icon: Hash,
    credits: 1,
    status: 'active'
  },
  {
    id: 'suggestions',
    label: 'Suggestions',
    description: 'Keyword-Vorschläge',
    icon: Search,
    credits: 1,
    status: 'active'
  },
  {
    id: 'ideas',
    label: 'Ideas',
    description: 'Kreative Keyword-Ideen',
    icon: Lightbulb,
    credits: 1,
    status: 'active'
  },
  {
    id: 'for-site',
    label: 'For Site',
    description: 'Keywords für Website',
    icon: Globe,
    credits: 5,
    status: 'active'
  },
  {
    id: 'for-keywords',
    label: 'For Keywords',
    description: 'Keywords für Keywords',
    icon: Target,
    credits: 2,
    status: 'active'
  }
];

interface ResearchTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  loading?: boolean;
}

export function ResearchTabs({ activeTab, onTabChange, loading = false }: ResearchTabsProps) {
  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {researchTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              disabled={loading || tab.status === 'coming_soon'}
              className="flex items-center gap-2 h-auto py-3 px-4"
            >
              <Icon className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs opacity-70">{tab.description}</div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                {loading && isActive && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                <Badge 
                  variant={tab.status === 'active' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {tab.credits} Credits
                </Badge>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Active Tab Info */}
      {activeTab && (
        <div className="p-4 bg-muted/50 rounded-lg">
          {(() => {
            const tab = researchTabs.find(t => t.id === activeTab);
            if (!tab) return null;
            
            const Icon = tab.icon;
            
            return (
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">{tab.label}</h3>
                  <p className="text-sm text-muted-foreground">{tab.description}</p>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {tab.credits} Credits
                </Badge>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
