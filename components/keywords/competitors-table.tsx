import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  TrendingUp, 
  Users, 
  Hash,
  Search,
  Filter,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface CompetitorData {
  domain: string;
  domain_authority: number;
  organic_position: number;
  traffic_estimate: number;
  visibility: number;
  keywords_count: number;
}

interface CompetitorsTableProps {
  data: CompetitorData[];
  loading?: boolean;
  onExport?: (format: 'csv' | 'json') => void;
}

export function CompetitorsTable({ data, loading = false, onExport }: CompetitorsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof CompetitorData>('domain_authority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterMinAuthority, setFilterMinAuthority] = useState('');

  // Filter and sort data
  const filteredData = data
    .filter(item => {
      const matchesSearch = item.domain.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAuthority = !filterMinAuthority || item.domain_authority >= parseInt(filterMinAuthority);
      return matchesSearch && matchesAuthority;
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

  const handleSort = (field: keyof CompetitorData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortButton = ({ field, children }: { field: keyof CompetitorData; children: React.ReactNode }) => (
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

  const getAuthorityColor = (authority: number) => {
    if (authority >= 80) return 'text-green-600 bg-green-50';
    if (authority >= 60) return 'text-blue-600 bg-blue-50';
    if (authority >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600';
    if (position <= 10) return 'text-blue-600';
    if (position <= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Top Competitors
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
            Top Competitors ({filteredData.length})
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
                placeholder="Domains durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min. Authority"
              value={filterMinAuthority}
              onChange={(e) => setFilterMinAuthority(e.target.value)}
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
                  <SortButton field="domain">Domain</SortButton>
                </th>
                <th className="text-right p-2">
                  <SortButton field="domain_authority">Authority</SortButton>
                </th>
                <th className="text-right p-2">
                  <SortButton field="organic_position">Position</SortButton>
                </th>
                <th className="text-right p-2">
                  <SortButton field="traffic_estimate">Traffic</SortButton>
                </th>
                <th className="text-right p-2">
                  <SortButton field="visibility">Visibility</SortButton>
                </th>
                <th className="text-right p-2">
                  <SortButton field="keywords_count">Keywords</SortButton>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div className="font-medium">{item.domain}</div>
                    </div>
                  </td>
                  <td className="text-right p-2">
                    <Badge 
                      variant="outline" 
                      className={`${getAuthorityColor(item.domain_authority)} border-current`}
                    >
                      {item.domain_authority}
                    </Badge>
                  </td>
                  <td className="text-right p-2">
                    <span className={`font-medium ${getPositionColor(item.organic_position)}`}>
                      #{item.organic_position}
                    </span>
                  </td>
                  <td className="text-right p-2">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {formatNumber(item.traffic_estimate)}
                      </span>
                    </div>
                  </td>
                  <td className="text-right p-2">
                    <div className="flex items-center justify-end gap-1">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(item.visibility * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.visibility.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="text-right p-2">
                    <div className="flex items-center justify-end gap-1">
                      <Hash className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {formatNumber(item.keywords_count)}
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
            <p>Keine Konkurrenten gefunden.</p>
            <p className="text-sm">Versuche andere Filter oder Suchbegriffe.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
