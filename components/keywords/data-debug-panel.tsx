'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bug, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { CombinedKeywordOverview } from '@/types/analysis';
import { validateOverviewData } from '@/lib/utils/dataforseo-validator';

interface DataDebugPanelProps {
  data: CombinedKeywordOverview | null;
  loading?: boolean;
}

export function DataDebugPanel({ data, loading = false }: DataDebugPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (loading) {
    return (
      <GlassCard className="p-4">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Debug Panel - Loading...</span>
        </div>
      </GlassCard>
    );
  }

  if (!data) {
    return (
      <GlassCard className="p-4">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Debug Panel - No data available</span>
        </div>
      </GlassCard>
    );
  }

  const validation = validateOverviewData(data);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getStatusIcon = (isValid: boolean, hasWarnings: boolean) => {
    if (isValid && !hasWarnings) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (isValid && hasWarnings) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const formatJsonData = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return 'Error formatting data';
    }
  };

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4" style={{ color: '#34A7AD' }} />
          <span className="text-sm font-medium">Debug Panel</span>
          <Badge variant="outline" className="text-xs">
            Development Only
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(!isVisible)}
          className="hover:bg-white/20 dark:hover:bg-white/10"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {isVisible ? 'Hide' : 'Show'}
        </Button>
      </div>

      {isVisible && (
        <div className="space-y-4">
          {/* Validation Summary */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Validation Summary</span>
              {getStatusIcon(validation.isValid, validation.warnings.length > 0)}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Errors:</span>
                <Badge variant={validation.errors.length > 0 ? "destructive" : "outline"} className="text-xs">
                  {validation.errors.length}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Warnings:</span>
                <Badge variant={validation.warnings.length > 0 ? "secondary" : "outline"} className="text-xs">
                  {validation.warnings.length}
                </Badge>
              </div>
            </div>
          </div>

          {/* API Status */}
          <div className="space-y-2">
            <span className="text-sm font-medium">API Status</span>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(validation.apiStatus).map(([apiName, status]) => (
                <div key={apiName} className="flex items-center justify-between p-2 rounded-lg bg-white/10 dark:bg-white/5">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status.isValid, status.warnings.length > 0)}
                    <span className="text-sm capitalize">{apiName.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {status.warnings.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {status.warnings.length} warnings
                      </Badge>
                    )}
                    {status.errors.length > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {status.errors.length} errors
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Data Sections */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Raw API Data</span>
            <div className="space-y-2">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                  <div 
                    className="flex items-center justify-between p-2 cursor-pointer hover:bg-white/10 dark:hover:bg-white/5"
                    onClick={() => toggleSection(key)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium capitalize">{key}</span>
                      <Badge variant="outline" className="text-xs">
                        {value ? 'Available' : 'Missing'}
                      </Badge>
                    </div>
                    {expandedSections.has(key) ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </div>
                  
                  {expandedSections.has(key) && (
                    <div className="border-t p-3" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                      <pre className="text-xs overflow-auto max-h-64 bg-black/20 dark:bg-black/40 p-2 rounded">
                        {formatJsonData(value)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Errors and Warnings */}
          {(validation.errors.length > 0 || validation.warnings.length > 0) && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Issues</span>
              
              {validation.errors.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs font-medium text-red-500">Errors:</span>
                  {validation.errors.map((error, index) => (
                    <div key={index} className="text-xs text-red-400 bg-red-500/10 p-2 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              )}
              
              {validation.warnings.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs font-medium text-yellow-500">Warnings:</span>
                  {validation.warnings.map((warning, index) => (
                    <div key={index} className="text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded">
                      {warning}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}
