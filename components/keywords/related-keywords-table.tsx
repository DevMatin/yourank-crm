'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingUp, TrendingDown, Minus, Hash } from 'lucide-react';

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
  const getCompetitionColor = (competition: number) => {
    if (competition < 0.3) return 'bg-green-100 text-green-800';
    if (competition < 0.7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getCompetitionText = (competition: number) => {
    if (competition < 0.3) return 'Niedrig';
    if (competition < 0.7) return 'Mittel';
    return 'Hoch';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verwandte Keywords</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead className="text-right">Suchvolumen</TableHead>
                <TableHead className="text-center">Konkurrenz</TableHead>
                <TableHead className="text-right">CPC</TableHead>
                <TableHead className="text-center">Trend</TableHead>
                <TableHead>Verwandte Keywords</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{item.keyword}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.search_volume.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="secondary" 
                      className={getCompetitionColor(item.competition)}
                    >
                      {getCompetitionText(item.competition)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ${item.cpc.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {getTrendIcon(item.trend)}
                      <span className="text-sm">
                        {item.trend > 0 ? '+' : ''}{item.trend.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.related_keywords.slice(0, 3).map((related, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {related}
                        </Badge>
                      ))}
                      {item.related_keywords.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.related_keywords.length - 3} mehr
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
