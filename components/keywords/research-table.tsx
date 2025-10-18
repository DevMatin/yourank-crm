import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  TrendingUp, 
  DollarSign, 
  Target,
  Download,
  Filter,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface KeywordData {
  keyword: string;
  search_volume: number;
  competition: number;
  cpc: number;
  trend: number;
  related_keywords?: string[];
  low_top_of_page_bid?: number;
  high_top_of_page_bid?: number;
}

interface ResearchTableProps {
  data: KeywordData[];
  loading?: boolean;
  source: string;
  onExport?: (format: 'csv' | 'json') => void;
}

export function ResearchTable({ data, loading = false, source, onExport }: ResearchTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof KeywordData>('search_volume');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterMinVolume, setFilterMinVolume] = useState('');
  const [filterMaxCpc, setFilterMaxCpc] = useState('');

  // Filter and sort data
  const filteredData = data
    .filter(item => {
      const matchesSearch = item.keyword.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVolume = !filterMinVolume || item.search_volume >= parseInt(filterMinVolume);
      const matchesCpc = !filterMaxCpc || item.cpc <= parseFloat(filterMaxCpc);
      return matchesSearch && matchesVolume && matchesCpc;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  const handleSort = (field: keyof KeywordData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortButton = ({ field, children }: { field: keyof KeywordData; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="h-3 w-3" /> : 
            <ChevronDown className="h-3 w-3" />
        )}
      </div>
    </Button>
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    return `$${num.toFixed(2)}`;
  };

  const formatCompetition = (num: number) => {
    return `${Math.round(num * 100)}%`;
  };

  const getCompetitionColor = (num: number) => {
    if (num >= 0.7) return 'text-red-600';
    if (num >= 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-3 w-3 text-green-500 dark:text-green-400" />;
    if (trend < 0) return <TrendingUp className="h-3 w-3 text-red-500 dark:text-red-400 rotate-180" />;
    return <div className="h-3 w-3 bg-muted rounded-full" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {source} Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-glass-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" style={{color: '#34A7AD'}} />
            <span className="text-foreground">{source} Results ({filteredData.length})</span>
          </CardTitle>
          {onExport && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onExport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => onExport('json')}>
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Keywords durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min. Volume"
              value={filterMinVolume}
              onChange={(e) => setFilterMinVolume(e.target.value)}
              className="w-32"
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Max. CPC"
              value={filterMaxCpc}
              onChange={(e) => setFilterMaxCpc(e.target.value)}
              className="w-32"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20 dark:border-white/10 bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm">
                <th className="text-left p-2 text-foreground">
                  <SortButton field="keyword">Keyword</SortButton>
                </th>
                <th className="text-right p-2 text-foreground">
                  <SortButton field="search_volume">Volume</SortButton>
                </th>
                <th className="text-right p-2 text-foreground">
                  <SortButton field="competition">Competition</SortButton>
                </th>
                <th className="text-right p-2 text-foreground">
                  <SortButton field="cpc">CPC</SortButton>
                </th>
                <th className="text-right p-2 text-foreground">
                  <SortButton field="trend">Trend</SortButton>
                </th>
                {source === 'for-site' && (
                  <>
                    <th className="text-right p-2 text-foreground">Low Bid</th>
                    <th className="text-right p-2 text-foreground">High Bid</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="border-b border-white/10 dark:border-white/5 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200">
                  <td className="p-2">
                    <div className="font-medium text-foreground">{item.keyword}</div>
                    {item.related_keywords && item.related_keywords.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Related: {item.related_keywords.slice(0, 3).join(', ')}
                        {item.related_keywords.length > 3 && '...'}
                      </div>
                    )}
                  </td>
                  <td className="text-right p-2">
                    <Badge variant="outline">
                      {formatNumber(item.search_volume)}
                    </Badge>
                  </td>
                  <td className="text-right p-2">
                    <span className={`font-medium ${getCompetitionColor(item.competition)}`}>
                      {formatCompetition(item.competition)}
                    </span>
                  </td>
                  <td className="text-right p-2">
                    <Badge variant="secondary">
                      {formatCurrency(item.cpc)}
                    </Badge>
                  </td>
                  <td className="text-right p-2">
                    <div className="flex items-center justify-end gap-1">
                      {getTrendIcon(item.trend)}
                      <span className={`text-sm ${
                        item.trend > 0 ? 'text-green-600 dark:text-green-400' : 
                        item.trend < 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
                      }`}>
                        {item.trend > 0 ? '+' : ''}{item.trend.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  {source === 'for-site' && (
                    <>
                      <td className="text-right p-2">
                        <Badge variant="outline">
                          {formatCurrency(item.low_top_of_page_bid || 0)}
                        </Badge>
                      </td>
                      <td className="text-right p-2">
                        <Badge variant="outline">
                          {formatCurrency(item.high_top_of_page_bid || 0)}
                        </Badge>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Keine Keywords gefunden.</p>
            <p className="text-sm">Versuche andere Filter oder Suchbegriffe.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
