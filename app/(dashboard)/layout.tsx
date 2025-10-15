import dynamic from 'next/dynamic';

// Dynamische Imports für Client-Komponenten um Build-Probleme zu vermeiden
const Sidebar = dynamic(() => import('@/components/layout/sidebar').then(mod => ({ default: mod.Sidebar })), {
  ssr: false,
  loading: () => <div className="w-64 bg-card border-r animate-pulse" />
});

const Topbar = dynamic(() => import('@/components/layout/topbar').then(mod => ({ default: mod.Topbar })), {
  ssr: false,
  loading: () => <div className="h-16 border-b bg-card animate-pulse" />
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
