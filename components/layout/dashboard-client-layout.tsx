'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { AIChat } from '@/components/layout/ai-chat';
import { RealtimeProvider } from '@/components/providers/realtime-provider';
import { Toaster } from 'sonner';

export function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RealtimeProvider>
      <div className="flex h-screen bg-background">
        {/* Linke Spalte: Sidebar */}
        <Sidebar />
        
        {/* Mittlere Spalte: Hauptinhalt */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
        
        {/* Rechte Spalte: AI Chat */}
        <AIChat />
      </div>
      <Toaster position="top-right" />
    </RealtimeProvider>
  );
}
