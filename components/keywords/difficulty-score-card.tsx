import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface DifficultyScoreCardProps {
  difficulty: number;
  keyword: string;
  loading?: boolean;
}

export function DifficultyScoreCard({ difficulty, keyword, loading = false }: DifficultyScoreCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Keyword Difficulty
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-20 bg-muted animate-pulse rounded-lg"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getDifficultyLevel = (score: number) => {
    if (score >= 80) return { level: 'Very Hard', color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-950/20', icon: AlertTriangle };
    if (score >= 60) return { level: 'Hard', color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-950/20', icon: AlertTriangle };
    if (score >= 40) return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-950/20', icon: TrendingUp };
    return { level: 'Easy', color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-950/20', icon: CheckCircle };
  };

  const difficultyInfo = getDifficultyLevel(difficulty);
  const Icon = difficultyInfo.icon;

  const getDifficultyDescription = (level: string) => {
    switch (level) {
      case 'Very Hard':
        return 'Sehr hohe Konkurrenz. Erfordert starke Domain-Autorität und umfangreiche SEO-Arbeit.';
      case 'Hard':
        return 'Hohe Konkurrenz. Benötigt gute Domain-Stärke und qualitativ hochwertigen Content.';
      case 'Medium':
        return 'Moderate Konkurrenz. Mit der richtigen Strategie erreichbar.';
      case 'Easy':
        return 'Niedrige Konkurrenz. Gute Chance auf Top-Rankings mit wenig Aufwand.';
      default:
        return 'Konkurrenz-Level unbekannt.';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Keyword Difficulty für "{keyword}"
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Circle */}
        <div className="flex items-center justify-center">
          <div className={`relative w-32 h-32 rounded-full ${difficultyInfo.bgColor} flex items-center justify-center`}>
            <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
            <div 
              className="absolute inset-0 rounded-full border-8 border-current"
              style={{
                borderColor: difficultyInfo.color.replace('text-', ''),
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((difficulty * 3.6 - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((difficulty * 3.6 - 90) * Math.PI / 180)}%)`
              }}
            ></div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${difficultyInfo.color}`}>
                {Math.round(difficulty)}
              </div>
              <div className="text-sm text-muted-foreground">/ 100</div>
            </div>
          </div>
        </div>

        {/* Difficulty Level */}
        <div className="text-center space-y-2">
          <div className={`flex items-center justify-center gap-2 text-lg font-semibold ${difficultyInfo.color}`}>
            <Icon className="h-5 w-5" />
            {difficultyInfo.level}
          </div>
          <p className="text-sm text-muted-foreground">
            {getDifficultyDescription(difficultyInfo.level)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Difficulty Score</span>
            <span className="font-medium">{Math.round(difficulty)}%</span>
          </div>
          <Progress value={difficulty} className="h-2" />
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {difficulty >= 70 ? '🔴' : difficulty >= 50 ? '🟡' : '🟢'}
            </div>
            <div className="text-xs text-muted-foreground">Konkurrenz-Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {difficulty >= 70 ? '📈' : difficulty >= 50 ? '⚖️' : '📉'}
            </div>
            <div className="text-xs text-muted-foreground">SEO-Aufwand</div>
          </div>
        </div>

        {/* Recommendation Badge */}
        <div className="text-center">
          <Badge 
            variant={difficulty >= 70 ? "destructive" : difficulty >= 50 ? "secondary" : "default"}
            className="text-xs"
          >
            {difficulty >= 70 ? 'Hoher Aufwand erforderlich' : 
             difficulty >= 50 ? 'Moderater Aufwand empfohlen' : 
             'Geringer Aufwand ausreichend'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
