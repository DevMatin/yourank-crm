<!-- 712ed138-5c47-4368-ae90-564747180051 1a7e349e-4bb9-4c20-ad3e-993939be1d27 -->
# yourank.ai – MVP Phase 1-3: Setup & Dashboard

## Projektziel

Aufbau der Grundinfrastruktur für yourank.ai mit Next.js 15, Supabase-Backend, modularem Layout und vorbereitetem Creditsystem.

## Technologie-Stack

- Next.js 15 (App Router) mit TypeScript (Strict Mode)
- Tailwind CSS + ShadCN UI
- Supabase (PostgreSQL + Auth + Realtime)
- DataForSEO v3 (API-Proxy)
- OpenAI GPT (AI-Layer)

## Implementierungsschritte

### 1. Projekt-Initialisierung

- Next.js 15 mit TypeScript und Tailwind aufsetzen
- Strict TypeScript-Konfiguration aktivieren
- ShadCN UI initialisieren
- Verzeichnisstruktur nach Best Practices anlegen:
  ```
  /app
    /api
    /(auth)
    /(dashboard)
  /components
    /ui (ShadCN)
    /layout
    /dashboard
  /lib
    /supabase
    /dataforseo
    /utils
  /types
  /config
  ```


### 2. Umgebungsvariablen & Konfiguration

- `.env.local` mit Platzhaltern für:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `DATAFORSEO_API_KEY`
  - `OPENAI_API_KEY`
- `modules.config.ts` für zentrale Modulverwaltung (13 API-Gruppen vorbereitet)

### 3. Supabase-Setup

- **Database Schema** (SQL-Migrations):
  - `users` (id, email, name, credits, plan, created_at)
  - `projects` (id, user_id, name, domain, created_at)
  - `analyses` (id, project_id, type, input, task_id, status, result, credits_used, created_at, updated_at)
  - `rank_tracking` (id, project_id, keyword, position, volume, trend, checked_at)
- Supabase Client initialisieren (`/lib/supabase/client.ts`, `/lib/supabase/server.ts`)
- Auth Helper Funktionen (Login, Logout, Session-Handling)
- Row Level Security (RLS) Policies für alle Tabellen

### 4. TypeScript-Typen

- `/types/database.ts` – Supabase-generierte Typen
- `/types/modules.ts` – Module & Tools
- `/types/analysis.ts` – Analyse-Datenstrukturen
- `/types/dataforseo.ts` – DataForSEO API-Responses

### 5. Layout & UI-Komponenten

**Hauptlayout** (`/app/(dashboard)/layout.tsx`):

- Sidebar (Navigation mit allen 13 Modulgruppen)
- Topbar (User-Menü, Credits-Badge, Dark Mode Toggle)
- Content-Area (responsive)

**Core-Komponenten**:

- `CreditBadge.tsx` – Credits-Anzeige mit Fortschrittsbalken
- `Sidebar.tsx` – Dynamische Navigation aus `modules.config.ts`
- `DataTable.tsx` – Wiederverwendbare Tabelle (TanStack Table)
- `ChartCard.tsx` – Container für Recharts-Visualisierungen
- `AnalysisCard.tsx` – Ergebnis-Karten für Dashboard

### 6. Auth-System

- `/app/(auth)/login/page.tsx` – Login-Seite mit Supabase Auth
- `/app/(auth)/signup/page.tsx` – Registrierung
- Middleware für geschützte Routen (`middleware.ts`)
- Automatische User-Erstellung in `users`-Tabelle (Trigger/Hook)

### 7. Dashboard

**`/app/(dashboard)/page.tsx`**:

- Credits-Übersicht (aktuell / limit)
- Projekt-Liste mit Quick-Actions
- Letzte Analysen (5 neueste, Realtime-Updates)
- Quick-Start-Buttons ("Analyze Keyword", "Check Domain")
- Statistik-Cards (Gesamt-Analysen, verwendete Credits)

### 8. API-Infrastruktur

**DataForSEO Proxy** (`/lib/dataforseo/client.ts`):

```typescript
export async function fetchDataForSeo(endpoint: string, payload: any) {
  // POST zu DataForSEO mit Auth-Header
  // Error-Handling & Rate-Limiting
}
```

**Analysis Handler** (`/lib/utils/analysis.ts`):

```typescript
export async function saveAnalysis(input, type) { ... }
export async function updateAnalysis(id, data) { ... }
export async function pollTaskStatus(taskId) { ... }
```

**Beispiel-API-Route** (`/app/api/test/route.ts`):

- Test-Endpoint für DataForSEO-Verbindung
- Credits-Abzug-Logik demonstrieren

### 9. Creditsystem

- Funktion zum Abzug von Credits (`deductCredits(userId, amount)`)
- Client-seitige Credits-Anzeige mit Realtime-Updates
- Warning bei niedrigen Credits (<10)
- Standard: 100 Credits bei Registrierung

### 10. Modul-Vorbereitung

**`/config/modules.config.ts`**:

- Alle 13 API-Gruppen definiert (SERP, Keywords, Domain, Labs, etc.)
- Pro Gruppe: id, name, icon, basePath, tools[]
- Tools-Array mit Platzhaltern für MVP-Phase 4+

**Beispiel-Modulseite** (`/app/(dashboard)/keywords/page.tsx`):

- Liste aller Keywords-Tools
- Navigation zu Unterseiten vorbereitet
- Dokumentation, was jedes Tool macht

### 11. Styling & Branding

- Tailwind-Config mit yourank.ai-Farben:
  - Primary: `#2563EB`
  - Accent: `#1E3A8A`
  - Background: `#F8FAFC`
- Inter & Rubik Fonts
- Dark Mode Support (next-themes)
- Logo-Platzhalter (SVG oder Text)

### 12. Entwicklungs-Scripts

- `package.json` Scripts:
  - `dev` – Entwicklungsserver
  - `build` – Production Build
  - `lint` – ESLint
  - `type-check` – TypeScript-Validierung
  - `supabase:types` – Typen generieren

## Wichtige Dateien

**Kern-Dateien**:

- `/app/layout.tsx` – Root-Layout mit Providers
- `/app/(dashboard)/layout.tsx` – Dashboard-Layout
- `/app/(dashboard)/page.tsx` – Dashboard-Hauptseite
- `/config/modules.config.ts` – Zentrale Modul-Konfiguration
- `/lib/supabase/client.ts` – Supabase Browser Client
- `/lib/supabase/server.ts` – Supabase Server Client
- `/lib/dataforseo/client.ts` – DataForSEO Proxy
- `/middleware.ts` – Auth-Middleware

**SQL-Migrations**:

- `/supabase/migrations/001_initial_schema.sql` – Tabellen-Schema
- `/supabase/migrations/002_rls_policies.sql` – Security Policies

## Ergebnis nach Umsetzung

✅ Vollständig funktionsfähige Next.js-App mit Auth

✅ Supabase-Datenbank mit 4 Haupttabellen

✅ Modulares Dashboard mit 13 API-Gruppen vorbereitet

✅ Creditsystem implementiert

✅ DataForSEO-Proxy-Layer einsatzbereit

✅ Vercel-kompatible Projektstruktur

✅ TypeScript Strict Mode mit vollständiger Typisierung

✅ White-Label-fähiges Design

## Nächste Schritte (nach Phase 3)

Phase 4–7: Implementierung der einzelnen API-Module (Keywords, Domain, SERP, etc.)

### To-dos

- [ ] Next.js 15 Projekt mit TypeScript (strict), Tailwind und ShadCN initialisieren
- [ ] Umgebungsvariablen (.env.local) und modules.config.ts einrichten
- [ ] Supabase Client/Server Setup + SQL-Schema (users, projects, analyses, rank_tracking)
- [ ] TypeScript-Typen für Database, Modules, Analysis und DataForSEO erstellen
- [ ] Layout-Komponenten (Sidebar, Topbar, CreditBadge) mit ShadCN implementieren
- [ ] Auth-System (Login/Signup-Seiten + Middleware) mit Supabase Auth einrichten
- [ ] Dashboard-Hauptseite mit Credits, Projekten, letzten Analysen implementieren
- [ ] DataForSEO Proxy + Analysis Handler + Test-API-Route erstellen
- [ ] Creditsystem mit Abzugsfunktion und Realtime-Updates implementieren
- [ ] Modul-Konfiguration finalisieren und Beispiel-Modulseite (Keywords) erstellen