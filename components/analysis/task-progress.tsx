'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  X
} from 'lucide-react';

interface TaskProgressProps {
  taskId: string;
  analysisId: string;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  pollInterval?: number;
  maxDuration?: number; // in seconds
}

export function TaskProgress({
  taskId,
  analysisId,
  onComplete,
  onError,
  onCancel,
  pollInterval = 5000,
  maxDuration = 300 // 5 minutes default
}: TaskProgressProps) {
  const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!taskId) return;

    const startTime = Date.now();
    let pollCount = 0;
    const maxPolls = Math.floor((maxDuration * 1000) / pollInterval);

    const pollTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${taskId}/status`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to get task status');
        }

        setStatus(data.status);
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));

        // Calculate progress based on elapsed time and estimated duration
        if (data.status === 'processing') {
          const estimatedDuration = estimatedTime || 120; // Default 2 minutes
          const calculatedProgress = Math.min((elapsedTime / estimatedDuration) * 90, 90);
          setProgress(calculatedProgress);
        } else if (data.status === 'completed') {
          setProgress(100);
          setResult(data.result);
          onComplete?.(data.result);
          return; // Stop polling
        } else if (data.status === 'failed') {
          setProgress(0);
          setError(data.error || 'Task failed');
          onError?.(data.error || 'Task failed');
          return; // Stop polling
        }

        pollCount++;
        if (pollCount >= maxPolls) {
          setStatus('failed');
          setError('Task timed out');
          onError?.('Task timed out');
          return;
        }

        // Continue polling if still processing
        if (data.status === 'processing') {
          setTimeout(pollTask, pollInterval);
        }
      } catch (err) {
        setStatus('failed');
        setError(err instanceof Error ? err.message : 'Unknown error');
        onError?.(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    // Start polling after a short delay
    const initialDelay = setTimeout(pollTask, 1000);

    return () => {
      clearTimeout(initialDelay);
    };
  }, [taskId, pollInterval, maxDuration, elapsedTime, estimatedTime, onComplete, onError]);

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Wartet auf Verarbeitung...';
      case 'processing':
        return 'Wird verarbeitet...';
      case 'completed':
        return 'Abgeschlossen';
      case 'failed':
        return 'Fehlgeschlagen';
      default:
        return 'Unbekannt';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCancel = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/cancel`, {
        method: 'POST',
      });

      if (response.ok) {
        setStatus('failed');
        setError('Task wurde abgebrochen');
        onCancel?.();
      }
    } catch (err) {
      console.error('Error canceling task:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Analyse wird verarbeitet
          </CardTitle>
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Fortschritt</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Verstrichene Zeit:</span>
            <div className="font-medium">{formatTime(elapsedTime)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Task ID:</span>
            <div className="font-mono text-xs">{taskId.slice(0, 8)}...</div>
          </div>
        </div>

        {estimatedTime && (
          <div className="text-sm">
            <span className="text-muted-foreground">Geschätzte Dauer:</span>
            <div className="font-medium">{formatTime(estimatedTime)}</div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-800">
              <XCircle className="h-4 w-4" />
              <span className="font-medium">Fehler:</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {status === 'completed' && result && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Erfolgreich abgeschlossen!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Die Analyse wurde erfolgreich verarbeitet.
            </p>
          </div>
        )}

        {status === 'processing' && onCancel && (
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancel}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              Abbrechen
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
