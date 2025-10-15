export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 bg-card border-r">
        <div className="flex h-16 items-center border-b px-6">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">YR</span>
          </div>
          <span className="font-display font-bold text-lg ml-2">yourank.ai</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <div className="px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground">
            Dashboard
          </div>
          <div className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent">
            Keywords
          </div>
          <div className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent">
            Analytics
          </div>
        </nav>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 border-b bg-card flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-muted rounded-full" />
          </div>
        </div>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
