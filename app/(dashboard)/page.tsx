export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2">Übersicht</h2>
        <p className="text-muted-foreground">Hier sehen Sie Ihre wichtigsten Metriken.</p>
      </div>
      
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2">Aktuelle Projekte</h2>
        <p className="text-muted-foreground">Verwalten Sie Ihre laufenden Projekte.</p>
      </div>
      
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2">Neueste Aktivitäten</h2>
        <p className="text-muted-foreground">Verfolgen Sie Ihre letzten Aktionen.</p>
      </div>
    </div>
  );
}