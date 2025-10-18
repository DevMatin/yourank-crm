'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Hash, Search, TrendingUp, Brain, BarChart3, Zap, Package, Users, Layers, Map, Target, Filter } from 'lucide-react';
import Link from 'next/link';
import { useUserSettings } from '@/lib/hooks/use-user-settings';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  credits: number;
  status: 'active' | 'coming_soon' | 'beta';
  href: string;
  category: 'google-ads' | 'bing' | 'clickstream' | 'dataforseo-trends' | 'general';
  functionality: 'search-volume' | 'keyword-ideas' | 'traffic-analysis' | 'trends' | 'performance' | 'audience';
}

const tools: Tool[] = [
  {
    id: 'related',
    name: 'Related Keywords',
    description: 'Finde verwandte Keywords zu deinem Suchbegriff',
    icon: Hash,
    credits: 1,
    status: 'active',
    href: '/keywords/related',
    category: 'general',
    functionality: 'keyword-ideas'
  },
  {
    id: 'suggestions',
    name: 'Keyword Suggestions',
    description: 'Automatische Keyword-Vorschläge basierend auf deinem Input',
    icon: Search,
    credits: 1,
    status: 'active',
    href: '/keywords/suggestions',
    category: 'general',
    functionality: 'keyword-ideas'
  },
  {
    id: 'ideas',
    name: 'Keyword Ideas',
    description: 'Kreative Keyword-Ideen für deine Content-Strategie',
    icon: Brain,
    credits: 1,
    status: 'active',
    href: '/keywords/ideas',
    category: 'general',
    functionality: 'keyword-ideas'
  },
  {
    id: 'difficulty',
    name: 'Keyword Difficulty',
    description: 'Bewerte die Schwierigkeit von Keywords für deine Domain',
    icon: TrendingUp,
    credits: 1,
    status: 'active',
    href: '/keywords/difficulty',
    category: 'general',
    functionality: 'performance'
  },
  {
    id: 'overview',
    name: 'Keyword Overview',
    description: 'Umfassende Keyword-Analyse mit allen wichtigen Metriken',
    icon: BarChart3,
    credits: 2,
    status: 'active',
    href: '/keywords/overview',
    category: 'general',
    functionality: 'search-volume'
  },
  {
    id: 'google-ads-keywords-for-keywords',
    name: 'Google Ads Keywords for Keywords',
    description: 'Keyword-Ideen basierend auf Google Ads Daten',
    icon: Hash,
    credits: 2,
    status: 'active',
    href: '/keywords/google-ads-keywords-for-keywords',
    category: 'google-ads',
    functionality: 'keyword-ideas'
  },
  {
    id: 'bing-keywords-for-keywords',
    name: 'Bing Keywords for Keywords',
    description: 'Bing-spezifische Keyword-Vorschläge mit Device-Filter',
    icon: Hash,
    credits: 1,
    status: 'active',
    href: '/keywords/bing-keywords-for-keywords',
    category: 'bing',
    functionality: 'keyword-ideas'
  },
  {
    id: 'google-ads-ad-traffic',
    name: 'Google Ads Ad Traffic',
    description: 'Traffic-Schätzungen für Keywords basierend auf Geboten',
    icon: TrendingUp,
    credits: 3,
    status: 'active',
    href: '/keywords/google-ads-ad-traffic',
    category: 'google-ads',
    functionality: 'traffic-analysis'
  },
  {
    id: 'bing-keyword-performance',
    name: 'Bing Keyword Performance',
    description: 'Performance-Metriken für Bing Keywords mit Filtern',
    icon: TrendingUp,
    credits: 2,
    status: 'active',
    href: '/keywords/bing-keyword-performance',
    category: 'bing',
    functionality: 'performance'
  },
  {
    id: 'bing-search-volume-history',
    name: 'Bing Search Volume History',
    description: 'Historische Suchvolumen-Daten mit monatlichen Zeitreihen',
    icon: BarChart3,
    credits: 2,
    status: 'active',
    href: '/keywords/bing-search-volume-history',
    category: 'bing',
    functionality: 'search-volume'
  },
  {
    id: 'clickstream-dataforseo-search-volume',
    name: 'Clickstream DataForSEO Search Volume',
    description: 'DataForSEO-eigene Suchvolumen-Berechnung',
    icon: Zap,
    credits: 2,
    status: 'active',
    href: '/keywords/clickstream-dataforseo-search-volume',
    category: 'clickstream',
    functionality: 'search-volume'
  },
  {
    id: 'clickstream-bulk-search-volume',
    name: 'Clickstream Bulk Search Volume',
    description: 'Bulk-Verarbeitung für große Keyword-Mengen',
    icon: Package,
    credits: 1,
    status: 'active',
    href: '/keywords/clickstream-bulk-search-volume',
    category: 'clickstream',
    functionality: 'search-volume'
  },
  {
    id: 'dataforseo-trends-demography',
    name: 'DataForSEO Trends Demography',
    description: 'Demografische Trend-Analyse mit Alters- und Geschlechts-Daten',
    icon: Users,
    credits: 3,
    status: 'active',
    href: '/keywords/dataforseo-trends-demography',
    category: 'dataforseo-trends',
    functionality: 'trends'
  },
  {
    id: 'dataforseo-trends-merged-data',
    name: 'DataForSEO Trends Merged Data',
    description: 'Kombinierte Trend-Daten aus verschiedenen Quellen',
    icon: Layers,
    credits: 3,
    status: 'active',
    href: '/keywords/dataforseo-trends-merged-data',
    category: 'dataforseo-trends',
    functionality: 'trends'
  },
  {
    id: 'dataforseo-trends-subregion-interests',
    name: 'DataForSEO Trends Subregion Interests',
    description: 'Regionale Interessen-Trends auf Subregion-Ebene',
    icon: Map,
    credits: 3,
    status: 'active',
    href: '/keywords/dataforseo-trends-subregion-interests',
    category: 'dataforseo-trends',
    functionality: 'trends'
  },
  {
    id: 'bing-audience-estimation',
    name: 'Bing Audience Estimation',
    description: 'LinkedIn Ads Audience Targeting Schätzungen',
    icon: Target,
    credits: 5,
    status: 'active',
    href: '/keywords/bing-audience-estimation',
    category: 'bing',
    functionality: 'audience'
  },
  {
    id: 'google-ads-search-volume',
    name: 'Google Ads Search Volume',
    description: 'Präzise Google Ads Suchvolumen-Daten',
    icon: BarChart3,
    credits: 2,
    status: 'active',
    href: '/keywords/google-ads-search-volume',
    category: 'google-ads',
    functionality: 'search-volume'
  },
  {
    id: 'google-ads-keywords-for-site',
    name: 'Google Ads Keywords for Site',
    description: 'Keywords die für eine Website relevant sind',
    icon: Hash,
    credits: 5,
    status: 'active',
    href: '/keywords/google-ads-keywords-for-site',
    category: 'google-ads',
    functionality: 'keyword-ideas'
  },
  {
    id: 'bing-keywords-for-site',
    name: 'Bing Keywords for Site',
    description: 'Bing Keywords für eine bestimmte Website',
    icon: Hash,
    credits: 3,
    status: 'active',
    href: '/keywords/bing-keywords-for-site',
    category: 'bing',
    functionality: 'keyword-ideas'
  },
  {
    id: 'bing-search-volume',
    name: 'Bing Search Volume',
    description: 'Bing-spezifische Suchvolumen-Daten',
    icon: BarChart3,
    credits: 1,
    status: 'active',
    href: '/keywords/bing-search-volume',
    category: 'bing',
    functionality: 'search-volume'
  },
  {
    id: 'clickstream-global-search-volume',
    name: 'Clickstream Global Search Volume',
    description: 'Erweiterte Clickstream Suchvolumen-Daten',
    icon: Zap,
    credits: 2,
    status: 'active',
    href: '/keywords/clickstream-global-search-volume',
    category: 'clickstream',
    functionality: 'search-volume'
  },
  {
    id: 'google-trends-explore',
    name: 'Google Trends Explore',
    description: 'Trend-Analysen und Suchvolumen-Trends',
    icon: TrendingUp,
    credits: 3,
    status: 'active',
    href: '/keywords/google-trends-explore',
    category: 'general',
    functionality: 'trends'
  }
];

// Kategorien-Definitionen
interface CategoryConfig {
  name: string;
  description: string;
  color: string;
  icon: string;
}

const categoryConfig: Record<string, CategoryConfig> = {
  'google-ads': {
    name: 'Google Ads',
    description: 'Tools basierend auf Google Ads Daten',
    color: 'bg-blue-50 border-blue-200',
    icon: '🔵'
  },
  'bing': {
    name: 'Bing',
    description: 'Bing-spezifische Keyword-Tools',
    color: 'bg-orange-50 border-orange-200',
    icon: '🟠'
  },
  'clickstream': {
    name: 'Clickstream',
    description: 'Erweiterte Clickstream-Daten',
    color: 'bg-purple-50 border-purple-200',
    icon: '🟣'
  },
  'dataforseo-trends': {
    name: 'DataForSEO Trends',
    description: 'Trend-Analysen und Demografie',
    color: 'bg-green-50 border-green-200',
    icon: '🟢'
  },
  'general': {
    name: 'Allgemein',
    description: 'Allgemeine Keyword-Tools',
    color: 'bg-muted border-border',
    icon: '⚪'
  }
};

const functionalityConfig: Record<string, CategoryConfig> = {
  'search-volume': {
    name: 'Suchvolumen & Daten',
    description: 'Suchvolumen-Analysen und historische Daten',
    color: 'bg-blue-50 border-blue-200',
    icon: '📊'
  },
  'keyword-ideas': {
    name: 'Keyword-Ideen & Vorschläge',
    description: 'Keyword-Recherche und Ideen-Generierung',
    color: 'bg-green-50 border-green-200',
    icon: '💡'
  },
  'traffic-analysis': {
    name: 'Traffic & Performance',
    description: 'Traffic-Schätzungen und Performance-Metriken',
    color: 'bg-orange-50 border-orange-200',
    icon: '🚀'
  },
  'trends': {
    name: 'Trends & Demografie',
    description: 'Trend-Analysen und demografische Daten',
    color: 'bg-purple-50 border-purple-200',
    icon: '📈'
  },
  'performance': {
    name: 'Performance-Analyse',
    description: 'Keyword-Schwierigkeit und Performance-Bewertung',
    color: 'bg-red-50 border-red-200',
    icon: '⚡'
  },
  'audience': {
    name: 'Audience & Targeting',
    description: 'Audience-Schätzungen und Targeting-Daten',
    color: 'bg-indigo-50 border-indigo-200',
    icon: '🎯'
  }
};

export default function KeywordsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use user settings hook for keywords filter
  const { 
    value: filterType, 
    setValue: setFilterType,
    loading: filterLoading 
  } = useUserSettings('keywords_filter_type', 'category');

  const handleFilterChange = async (newFilterType: 'category' | 'functionality') => {
    try {
      await setFilterType(newFilterType);
    } catch (error) {
      console.error('Failed to save filter preference:', error);
    }
  };

  // Filter Tools basierend auf Suchanfrage
  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Gruppiere Tools basierend auf Filter-Typ
  const groupedTools = filteredTools.reduce((groups, tool) => {
    const key = filterType === 'category' ? tool.category : tool.functionality;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(tool);
    return groups;
  }, {} as Record<string, Tool[]>);

  const config = filterType === 'category' ? categoryConfig : functionalityConfig;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Keywords Data</h1>
        <p className="text-muted-foreground">
          Keyword-Recherche und Difficulty-Analyse für deine SEO-Strategie
        </p>
      </div>

      {/* Filter-Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Tools filtern
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter-Toggle */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Gruppierung:</span>
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => handleFilterChange('category')}
                disabled={filterLoading}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filterType === 'category'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                } ${filterLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Nach Datenquelle
              </button>
              <button
                onClick={() => handleFilterChange('functionality')}
                disabled={filterLoading}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filterType === 'functionality'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                } ${filterLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Nach Funktionalität
              </button>
            </div>
          </div>

          {/* Suchfeld */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tools durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Gruppierte Tools */}
      <div className="space-y-8">
        {Object.entries(groupedTools).map(([groupKey, groupTools]) => {
          const groupConfig = config[groupKey as keyof typeof config];
          if (!groupConfig) return null;

          return (
            <div key={groupKey} className="space-y-4">
              {/* Kategorie-Header */}
              <div className={`p-4 rounded-lg border ${groupConfig.color}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{groupConfig.icon}</span>
                  <div>
                    <h2 className="text-xl font-semibold">{groupConfig.name}</h2>
                    <p className="text-sm text-muted-foreground">{groupConfig.description}</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {groupTools.length} Tools
                  </Badge>
                </div>
              </div>

              {/* Tools in dieser Kategorie */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupTools.map((tool) => {
                  const Icon = tool.icon;
                  
                  return (
                    <Card key={tool.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{tool.name}</CardTitle>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {tool.credits} Credits
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          {tool.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant={tool.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {tool.status === 'active' ? 'Verfügbar' : 'In Entwicklung'}
                          </Badge>
                          
                          <Button asChild disabled={tool.status !== 'active'}>
                            <Link href={tool.href}>
                              Tool öffnen
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Über Keywords Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p>
              Das Keywords Data Modul bietet dir umfassende Tools für die Keyword-Recherche 
              und -Analyse. Mit diesen Tools kannst du:
            </p>
            <ul>
              <li><strong>Verwandte Keywords</strong> zu deinen Hauptbegriffen finden</li>
              <li><strong>Keyword-Vorschläge</strong> basierend auf Suchvolumen und Trends erhalten</li>
              <li><strong>Kreative Keyword-Ideen</strong> für deine Content-Strategie entwickeln</li>
              <li><strong>Keyword-Schwierigkeit</strong> bewerten und realistische Ziele setzen</li>
              <li><strong>Umfassende Übersichten</strong> mit allen wichtigen Metriken erstellen</li>
            </ul>
            <p>
              Alle Tools nutzen die neuesten Daten von DataForSEO und bieten dir 
              präzise, aktuelle Informationen für deine SEO-Entscheidungen.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
