import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Target, BarChart3, AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface KeywordBasics {
  keyword: string;
  searchVolume?: number;
  cpc?: number;
  difficulty?: number;
  trend?: number;
}

interface OverviewBasicsCardProps {
  data: KeywordBasics | null;
  loading?: boolean;
}

export function OverviewBasicsCard({ data, loading = false }: OverviewBasicsCardProps) {
  const t = useTranslations('keywords');
  
  if (loading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t('keywordBasics')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
                <div className="h-8 bg-muted animate-pulse rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number | undefined) => {
    if (!num) return 'N/A';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = (num: number | undefined) => {
    if (!num) return 'N/A';
    return `$${num.toFixed(2)}`;
  };

  const formatDifficulty = (num: number | undefined) => {
    if (!num) return 'N/A';
    return `${Math.round(num)}%`;
  };

  const getDataStatus = (value: any) => {
    if (value === null || value === undefined) {
      return { status: 'missing', color: 'text-orange-500', icon: AlertTriangle };
    }
    return { status: 'available', color: 'text-foreground', icon: null };
  };

  const getTrendIcon = (trend: number | undefined) => {
    if (!trend) return null;
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400" />;
    if (trend < 0) return <TrendingUp className="h-4 w-4 text-red-500 dark:text-red-400 rotate-180" />;
    return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
  };

  const getTrendColor = (trend: number | undefined) => {
    if (!trend) return 'text-muted-foreground';
    if (trend > 0) return 'text-green-600 dark:text-green-400';
    if (trend < 0) return 'text-red-600 dark:text-red-400';
    return 'text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {t('keywordBasics')}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {data.keyword}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Search Volume */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span className="text-sm font-medium text-muted-foreground">{t('searchVolume')}</span>
              {getDataStatus(data.searchVolume).status === 'missing' && (
                <AlertTriangle className="h-3 w-3 text-orange-500" />
              )}
            </div>
            <div className={`text-2xl font-bold ${getDataStatus(data.searchVolume).color}`}>
              {formatNumber(data.searchVolume)}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('monthlySearches')}
            </div>
          </div>

          {/* CPC */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">{t('cpc')}</span>
              {getDataStatus(data.cpc).status === 'missing' && (
                <AlertTriangle className="h-3 w-3 text-orange-500" />
              )}
            </div>
            <div className={`text-2xl font-bold ${getDataStatus(data.cpc).color}`}>
              {formatCurrency(data.cpc)}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('costPerClick')}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">{t('difficulty')}</span>
              {getDataStatus(data.difficulty).status === 'missing' && (
                <AlertTriangle className="h-3 w-3 text-orange-500" />
              )}
            </div>
            <div className={`text-2xl font-bold ${getDataStatus(data.difficulty).color}`}>
              {formatDifficulty(data.difficulty)}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('rankingDifficulty')}
            </div>
          </div>

          {/* Trend */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getTrendIcon(data.trend)}
              <span className="text-sm font-medium text-muted-foreground">{t('trend')}</span>
              {getDataStatus(data.trend).status === 'missing' && (
                <AlertTriangle className="h-3 w-3 text-orange-500" />
              )}
            </div>
            <div className={`text-2xl font-bold ${getTrendColor(data.trend)}`}>
              {data.trend ? `${data.trend > 0 ? '+' : ''}${data.trend.toFixed(1)}%` : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('last12Months')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
