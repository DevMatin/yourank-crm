import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Briefcase, 
  Target, 
  TrendingUp, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

interface AudienceInsightsCardProps {
  topProfessions: any[];
  targetingRecommendations: string[];
  loading?: boolean;
}

export function AudienceInsightsCard({ 
  topProfessions, 
  targetingRecommendations, 
  loading = false 
}: AudienceInsightsCardProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Top Professions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Targeting Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getProfessionIcon = (profession: string) => {
    const professionLower = profession.toLowerCase();
    if (professionLower.includes('tech') || professionLower.includes('software')) return '💻';
    if (professionLower.includes('marketing') || professionLower.includes('sales')) return '📈';
    if (professionLower.includes('health') || professionLower.includes('medical')) return '🏥';
    if (professionLower.includes('education') || professionLower.includes('teacher')) return '🎓';
    if (professionLower.includes('finance') || professionLower.includes('banking')) return '💰';
    if (professionLower.includes('design') || professionLower.includes('creative')) return '🎨';
    return '👔';
  };

  const getRecommendationIcon = (recommendation: string) => {
    if (recommendation.includes('Age Group')) return <Users className="h-4 w-4 text-blue-500" />;
    if (recommendation.includes('Profession')) return <Briefcase className="h-4 w-4 text-green-500" />;
    if (recommendation.includes('Mobile')) return <TrendingUp className="h-4 w-4 text-purple-500" />;
    if (recommendation.includes('Desktop')) return <Target className="h-4 w-4 text-orange-500" />;
    return <Lightbulb className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Professions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Top Professions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topProfessions.length > 0 ? (
            <div className="space-y-4">
              {topProfessions.slice(0, 5).map((profession, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getProfessionIcon(profession.profession || profession.name || 'Unknown')}
                    </div>
                    <div>
                      <div className="font-medium">{profession.profession || profession.name || 'Unknown'}</div>
                      {profession.percentage && (
                        <div className="text-sm text-muted-foreground">
                          {profession.percentage.toFixed(1)}% of audience
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    {profession.search_volume && (
                      <Badge variant="secondary" className="text-xs">
                        {formatNumber(profession.search_volume)} searches
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    {topProfessions.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Professions</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    {topProfessions.length > 0 ? 
                      Math.round(topProfessions.reduce((sum, p) => sum + (p.percentage || 0), 0)) : 0}%
                  </div>
                  <div className="text-xs text-muted-foreground">Coverage</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Keine Berufsfeld-Daten verfügbar</p>
              <p className="text-sm">Professionelle Insights werden geladen...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Targeting Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Targeting Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {targetingRecommendations.length > 0 ? (
            <div className="space-y-4">
              {targetingRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    {getRecommendationIcon(recommendation)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{recommendation}</p>
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Recommended
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Additional Insights */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">Additional Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Audience Size</span>
                    </div>
                    <p className="text-xs text-blue-600">
                      {topProfessions.length > 0 ? 'Large professional audience' : 'Moderate audience size'}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Targeting Quality</span>
                    </div>
                    <p className="text-xs text-green-600">
                      {targetingRecommendations.length >= 3 ? 'High precision targeting' : 'Standard targeting'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Keine Targeting-Empfehlungen verfügbar</p>
              <p className="text-sm">Empfehlungen werden basierend auf den Daten generiert...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Content Strategy</p>
                <p className="text-xs text-yellow-600">
                  Erstelle Content, der die Top-Berufsfelder anspricht
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Target className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Ad Targeting</p>
                <p className="text-xs text-blue-600">
                  Nutze die Berufsfeld-Daten für präzise Google Ads Targeting
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">SEO Optimization</p>
                <p className="text-xs text-green-600">
                  Optimiere für Keywords, die deine Zielgruppe verwendet
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
