'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { getStatusBadgeStyle } from '@/lib/utils/theme-helpers';
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
          setError('Task timeout - maximum duration exceeded');
          onError?.('Task timeout');
          return;
        }

        // Continue polling
        setTimeout(pollTask, pollInterval);
      } catch (err) {
        console.error('Error polling task status:', err);
        setStatus('failed');
        setError('Failed to get task status');
        onError?.('Failed to get task status');
      }
    };

    // Start polling after a short delay
    const initialDelay = setTimeout(pollTask, 1000);

    return () => {
      clearTimeout(initialDelay);
    };
  }, [taskId, pollInterval, maxDuration, elapsedTime, estimatedTime, onComplete, onError]);

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
    <GlassCard className="w-full max-w-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
              boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
            }}
          >
            {status === 'processing' ? (
              <Loader2 className="h-5 w-5 animate-spin" style={{ color: '#34A7AD' }} />
            ) : status === 'completed' ? (
              <CheckCircle className="h-5 w-5" style={{ color: '#10B981' }} />
            ) : status === 'failed' ? (
              <XCircle className="h-5 w-5" style={{ color: '#EF4444' }} />
            ) : (
              <Clock className="h-5 w-5" style={{ color: '#34A7AD' }} />
            )}
          </div>
          <h3 className="text-foreground">Analyse wird verarbeitet</h3>
        </div>
        {onCancel && status === 'processing' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-center mb-4">
        <span 
          className="px-2 py-0.5 rounded-md text-xs font-medium"
          style={getStatusBadgeStyle(
            status === 'completed' ? 'success' :
            status === 'failed' ? 'error' :
            status === 'processing' ? 'info' : 'primary'
          )}
        >
          {getStatusText()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm text-foreground">
          <span>Fortschritt</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Time Information */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="text-muted-foreground">Verstrichene Zeit:</span>
          <div className="font-medium text-foreground">{formatTime(elapsedTime)}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Task ID:</span>
          <div className="font-mono text-xs text-foreground">{taskId.slice(0, 8)}...</div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div 
          className="p-3 border rounded-lg"
          style={{
            backgroundColor: 'rgba(239,68,68,0.1)',
            borderColor: 'rgba(239,68,68,0.2)'
          }}
        >
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <XCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {status === 'completed' && result && (
        <div 
          className="p-3 border rounded-lg"
          style={{
            backgroundColor: 'rgba(16,185,129,0.1)',
            borderColor: 'rgba(16,185,129,0.2)'
          }}
        >
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Task erfolgreich abgeschlossen!</span>
          </div>
        </div>
      )}
    </GlassCard>
  );
}