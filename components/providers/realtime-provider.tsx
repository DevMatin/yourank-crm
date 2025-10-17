'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DatabaseAnalysis } from '@/types/database';
import { toast } from 'sonner';

interface RealtimeContextType {
  isConnected: boolean;
  subscribeToAnalyses: (callback: (analysis: DatabaseAnalysis) => void) => () => void;
  subscribeToUserUpdates: (callback: (updates: any) => void) => () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Check if supabase client is available
    if (!supabase) {
      console.warn('Supabase client not available - realtime features disabled');
      setIsConnected(false);
      return;
    }

    // Check connection status
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase
          .channel('connection-check')
          .on('system', {}, (payload: any) => {
            setIsConnected(true);
          })
          .subscribe((status: any) => {
            setIsConnected(status === 'SUBSCRIBED');
          });

        if (error) {
          console.error('Error subscribing to connection check:', error);
          setIsConnected(false);
          return;
        }

        // Cleanup after 5 seconds
        if (data?.subscription) {
          setTimeout(() => {
            data.subscription.unsubscribe();
          }, 5000);
        }
      } catch (error) {
        console.error('Error checking Supabase connection:', error);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, [supabase]);

  const subscribeToAnalyses = (callback: (analysis: DatabaseAnalysis) => void) => {
    if (!supabase) {
      console.warn('Supabase client not available - cannot subscribe to analyses');
      return () => {}; // Return empty cleanup function
    }

    const channel = supabase
      .channel('analyses-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analyses'
        },
        (payload: any) => {
          const analysis = payload.new as DatabaseAnalysis;
          
          // Show toast notification for completed analyses
          if (payload.eventType === 'UPDATE' && analysis.status === 'completed') {
            toast.success('Analyse abgeschlossen!', {
              description: `Die Analyse "${analysis.type}" wurde erfolgreich abgeschlossen.`,
              action: {
                label: 'Anzeigen',
                onClick: () => {
                  // Navigate to analysis result
                  window.location.href = `/dashboard/analyses/${analysis.id}`;
                }
              }
            });
          }
          
          // Show toast for failed analyses
          if (payload.eventType === 'UPDATE' && analysis.status === 'failed') {
            toast.error('Analyse fehlgeschlagen', {
              description: `Die Analyse "${analysis.type}" konnte nicht abgeschlossen werden.`,
            });
          }

          callback(analysis);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const subscribeToUserUpdates = (callback: (updates: any) => void) => {
    if (!supabase) {
      console.warn('Supabase client not available - cannot subscribe to user updates');
      return () => {}; // Return empty cleanup function
    }

    const channel = supabase
      .channel('user-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users'
        },
        (payload: any) => {
          callback(payload.new);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  return (
    <RealtimeContext.Provider
      value={{
        isConnected,
        subscribeToAnalyses,
        subscribeToUserUpdates
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}
