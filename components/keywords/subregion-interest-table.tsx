import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  TrendingUp, 
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  MapPin
} from 'lucide-react';

interface SubregionData {
  subregion: string;
  interest_score: number;
  trend: number;
  search_volume?: number;
}

interface SubregionInterestTableProps {
  data: SubregionData[];
  loading?: boolean;
  onExport?: (format: 'csv' | 'json') => void;
}

export function SubregionInterestTable({ data, loading = false, onExport }: SubregionInterestTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof SubregionData>('interest_score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterMinInterest, setFilterMinInterest] = useState('');

  // Filter and sort data
  const filteredData = data
    .filter(item => {
      const matchesSearch = item.subregion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesInterest = !filterMinInterest || item.interest_score >= parseInt(filterMinInterest);
      return matchesSearch && matchesInterest;
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

  const handleSort = (field: keyof SubregionData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortButton = ({ field, children }: { field: keyof SubregionData; children: React.ReactNode }) => (
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

  const getInterestColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend < 0) return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
    return <div className="h-3 w-3 bg-muted rounded-full" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Subregion Interests
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Subregion Interests ({filteredData.length})
          </CardTitle>
          {onExport && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onExport('csv')}>
                <Filter className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => onExport('json')}>
                <Filter className="h-4 w-4 mr-2" />
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
                placeholder="Regionen durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min. Interest"
              value={filterMinInterest}
              onChange={(e) => setFilterMinInterest(e.target.value)}
              className="w-32"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">
                  <SortButton field="subregion">Region</SortButton>
                </th>
                <th className="text-right p-2">
                  <SortButton field="interest_score">Interest Score</SortButton>
                </th>
                <th className="text-right p-2">
                  <SortButton field="trend">Trend</SortButton>
                </th>
                <th className="text-right p-2">
                  <SortButton field="search_volume">Search Volume</SortButton>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="font-medium">{item.subregion}</div>
                    </div>
                  </td>
                  <td className="text-right p-2">
                    <div className="flex items-center justify-end gap-2">
                      <Badge 
                        variant="outline" 
                        className={`${getInterestColor(item.interest_score)} border-current`}
                      >
                        {item.interest_score}
                      </Badge>
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(item.interest_score, 100)}%` }}
                        ></div>
                      </div>
                    </div>
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
                  <td className="text-right p-2">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-sm">
                        {item.search_volume ? formatNumber(item.search_volume) : 'N/A'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Keine Regionen gefunden.</p>
            <p className="text-sm">Versuche andere Filter oder Suchbegriffe.</p>
          </div>
        )}

        {/* Top Regions Summary */}
        {filteredData.length > 0 && (
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-3">Top 3 Regionen</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {filteredData.slice(0, 3).map((item, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{item.subregion}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Interest: {item.interest_score}</span>
                    <span className={item.trend > 0 ? 'text-green-600 dark:text-green-400' : item.trend < 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}>
                      {item.trend > 0 ? '+' : ''}{item.trend.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
