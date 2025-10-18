'use client';

import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingUp, TrendingDown, Minus, Hash, AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface RelatedKeyword {
  keyword: string;
  search_volume: number;
  competition: number;
  cpc: number;
  trend: number;
  related_keywords: string[];
}

interface RelatedKeywordsTableProps {
  data: RelatedKeyword[];
}

export function RelatedKeywordsTable({ data }: RelatedKeywordsTableProps) {
  const t = useTranslations('keywords');
  
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
        <p className="text-muted-foreground">{t('noRelatedKeywordsFound')}</p>
        <p className="text-xs text-orange-500 mt-1">
          {t('relatedKeywordsDataNotLoaded')}
        </p>
      </div>
    );
  }
  const getCompetitionColor = (competition: number) => {
    if (competition < 0.3) return {
      backgroundColor: 'rgba(16,185,129,0.15)',
      color: '#10B981'
    };
    if (competition < 0.7) return {
      backgroundColor: 'rgba(245,158,11,0.15)',
      color: '#F59E0B'
    };
    return {
      backgroundColor: 'rgba(239,68,68,0.15)',
      color: '#EF4444'
    };
  };

  const getCompetitionText = (competition: number) => {
    if (competition < 0.3) return t('low');
    if (competition < 0.7) return t('medium');
    return t('high');
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

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
          <Hash className="h-5 w-5" style={{ color: '#34A7AD' }} />
        </div>
        <h3 className="text-foreground">Verwandte Keywords</h3>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">Keyword</TableHead>
              <TableHead className="text-right text-foreground">Suchvolumen</TableHead>
              <TableHead className="text-center text-foreground">Konkurrenz</TableHead>
              <TableHead className="text-right text-foreground">CPC</TableHead>
              <TableHead className="text-center text-foreground">Trend</TableHead>
              <TableHead className="text-foreground">Verwandte Keywords</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className="hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{item.keyword}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-foreground">
                  {item.search_volume.toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  <span 
                    className="px-2 py-0.5 rounded-md text-xs font-medium"
                    style={getCompetitionColor(item.competition)}
                  >
                    {getCompetitionText(item.competition)}
                  </span>
                </TableCell>
                <TableCell className="text-right text-foreground">
                  ${item.cpc.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {getTrendIcon(item.trend)}
                    <span className={`text-sm ${
                      item.trend > 0 ? 'text-green-600 dark:text-green-400' :
                      item.trend < 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
                    }`}>
                      {item.trend > 0 ? '+' : ''}{item.trend.toFixed(1)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.related_keywords.slice(0, 3).map((related, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-0.5 rounded-md text-xs border"
                        style={{
                          backgroundColor: 'rgba(52,167,173,0.1)',
                          borderColor: 'rgba(52,167,173,0.2)',
                          color: '#34A7AD'
                        }}
                      >
                        {related}
                      </span>
                    ))}
                    {item.related_keywords.length > 3 && (
                      <span 
                        className="px-2 py-0.5 rounded-md text-xs border"
                        style={{
                          backgroundColor: 'rgba(52,167,173,0.1)',
                          borderColor: 'rgba(52,167,173,0.2)',
                          color: '#34A7AD'
                        }}
                      >
                        +{item.related_keywords.length - 3} mehr
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </GlassCard>
  );
}
