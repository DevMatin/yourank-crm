import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  MousePointer, 
  DollarSign, 
  Eye, 
  Loader2,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';

interface PerformanceMetricsCardProps {
  organicTraffic: number;
  paidTraffic: number;
  ctr: number;
  estimatedClicks: number;
  estimatedCost: number;
  cpc: number;
  loading?: boolean;
}

export function PerformanceMetricsCard({ 
  organicTraffic, 
  paidTraffic, 
  ctr, 
  estimatedClicks, 
  estimatedCost, 
  cpc,
  loading = false 
}: PerformanceMetricsCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    return `$${num.toFixed(2)}`;
  };

  const getTrafficEfficiency = () => {
    if (organicTraffic === 0 && paidTraffic === 0) return 0;
    return (organicTraffic / (organicTraffic + paidTraffic)) * 100;
  };

  const getCostEfficiency = () => {
    if (estimatedCost === 0) return 0;
    return (estimatedClicks / estimatedCost) * 100;
  };

  const trafficEfficiency = getTrafficEfficiency();
  const costEfficiency = getCostEfficiency();

  return (
    <div className="space-y-6">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Organic Traffic */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Organic Traffic</p>
                <p className="text-2xl font-bold text-green-600">{formatNumber(organicTraffic)}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={trafficEfficiency} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {trafficEfficiency.toFixed(1)}% of total traffic
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Paid Traffic */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid Traffic</p>
                <p className="text-2xl font-bold text-blue-600">{formatNumber(paidTraffic)}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={100 - trafficEfficiency} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {(100 - trafficEfficiency).toFixed(1)}% of total traffic
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTR */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Click-Through Rate</p>
                <p className="text-2xl font-bold text-purple-600">{ctr.toFixed(2)}%</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <MousePointer className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <Badge variant={ctr >= 2 ? "default" : ctr >= 1 ? "secondary" : "outline"}>
                {ctr >= 2 ? 'Excellent' : ctr >= 1 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* CPC */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cost Per Click</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(cpc)}</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-orange-600" />
              </div>
            </div>
            <div className="mt-2">
              <Badge variant={cpc <= 1 ? "default" : cpc <= 3 ? "secondary" : "destructive"}>
                {cpc <= 1 ? 'Low Cost' : cpc <= 3 ? 'Medium Cost' : 'High Cost'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traffic Potential */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Traffic Potential</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estimated Clicks</span>
                  <span className="font-medium">{formatNumber(estimatedClicks)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estimated Cost</span>
                  <span className="font-medium">{formatCurrency(estimatedCost)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cost Efficiency</span>
                  <Badge variant={costEfficiency >= 10 ? "default" : costEfficiency >= 5 ? "secondary" : "outline"}>
                    {costEfficiency.toFixed(1)} clicks/$
                  </Badge>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recommendations</h3>
              <div className="space-y-2">
                {trafficEfficiency > 70 && (
                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-green-800">Strong Organic Performance</p>
                      <p className="text-xs text-green-600">Focus on maintaining SEO efforts</p>
                    </div>
                  </div>
                )}
                
                {ctr < 1 && (
                  <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Low CTR</p>
                      <p className="text-xs text-yellow-600">Improve ad copy and targeting</p>
                    </div>
                  </div>
                )}
                
                {cpc > 3 && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-red-800">High CPC</p>
                      <p className="text-xs text-red-600">Consider long-tail keywords</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
