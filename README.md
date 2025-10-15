# yourank.ai - SEO Analysis Platform

Eine moderne, AI-gestützte SEO-Analyseplattform mit Next.js 15, Supabase und DataForSEO.

## 🚀 Features

- **13 API-Module** mit 50+ SEO-Tools
- **Supabase-Backend** mit PostgreSQL, Auth und Realtime
- **DataForSEO v3 Integration** (komplett anonymisiert)
- **AI-Layer** mit OpenAI GPT-Integration
- **Creditsystem** mit Echtzeit-Updates
- **Modulares Design** - White-Label-fähig
- **TypeScript Strict Mode** für maximale Code-Qualität
- **Dark Mode** Support

## 🛠️ Technologie-Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + ShadCN UI
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **SEO-APIs**: DataForSEO v3 (Server-side Proxy)
- **AI**: OpenAI GPT-4
- **Styling**: Tailwind CSS + ShadCN UI Components
- **Icons**: Lucide React

## 📋 Voraussetzungen

- Node.js 18+ 
- npm oder yarn
- Supabase-Account
- DataForSEO-Account
- OpenAI-Account (optional)

## ⚡ Quick Start

### 1. Repository klonen und Dependencies installieren

```bash
git clone <repository-url>
cd yourank-ai
npm install
```

### 2. Umgebungsvariablen konfigurieren

Kopieren Sie `env.example` zu `.env.local` und füllen Sie die Werte aus:

```bash
cp env.example .env.local
```

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# DataForSEO API
DATAFORSEO_API_KEY=your_dataforseo_api_key_here
DATAFORSEO_LOGIN=your_dataforseo_login_here
DATAFORSEO_PASSWORD=your_dataforseo_password_here

# OpenAI API (optional)
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Supabase-Datenbank einrichten

1. Erstellen Sie ein neues Supabase-Projekt
2. Führen Sie die SQL-Migrations aus:

```sql
-- Führen Sie die Dateien in supabase/migrations/ in der richtigen Reihenfolge aus:
-- 001_initial_schema.sql
-- 002_rls_policies.sql
```

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist jetzt unter `http://localhost:3000` verfügbar.

## 📁 Projektstruktur

```
yourank-ai/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth-Seiten (Login/Signup)
│   ├── (dashboard)/       # Dashboard-Bereich
│   ├── api/               # API-Routen
│   └── globals.css        # Globale Styles
├── components/            # React-Komponenten
│   ├── ui/               # ShadCN UI-Komponenten
│   ├── layout/           # Layout-Komponenten
│   └── dashboard/        # Dashboard-spezifische Komponenten
├── lib/                  # Utility-Funktionen
│   ├── supabase/         # Supabase-Client-Konfiguration
│   ├── dataforseo/       # DataForSEO-API-Client
│   └── utils/            # Allgemeine Utilities
├── types/                # TypeScript-Typen
├── config/               # Konfigurationsdateien
└── supabase/             # Supabase-Migrations
```

## 🔧 Verfügbare Scripts

```bash
npm run dev          # Entwicklungsserver starten
npm run build        # Production Build
npm run start        # Production Server starten
npm run lint         # ESLint ausführen
npm run type-check   # TypeScript-Validierung
```

## 🎯 API-Module

Das System ist in 13 Hauptmodule unterteilt:

1. **SERP Analysis** - Suchergebnisanalyse
2. **Keywords Data** - Keyword-Recherche
3. **Domain Analytics** - Domain-Performance
4. **Labs API** - Keyword-Gap, Competitors
5. **Backlinks API** - Linkprofile
6. **OnPage API** - Technische SEO-Audits
7. **Content API** - Textanalyse, AI Content
8. **Merchant API** - Google Shopping
9. **App Data API** - App Store Analysen
10. **Business API** - Local Finder
11. **Databases Layer** - Historische Daten
12. **AI Optimization** - GPT-basierte Insights

## 💳 Creditsystem

- **Standard**: 100 Credits bei Registrierung
- **Abzug**: Pro Analyse werden Credits abgezogen
- **Realtime**: Credits werden in Echtzeit aktualisiert
- **Warnung**: Bei <10 Credits wird gewarnt

## 🔒 Sicherheit

- **Row Level Security (RLS)** für alle Tabellen
- **Server-side API-Calls** zu DataForSEO
- **Umgebungsvariablen** für alle Secrets
- **Supabase Auth** für Benutzerauthentifizierung

## 🎨 Design-System

- **Primärfarbe**: #2563EB (Blue)
- **Akzentfarbe**: #1E3A8A (Dark Blue)
- **Schriftarten**: Inter (Sans), Rubik (Display)
- **Dark Mode**: Vollständig unterstützt
- **Responsive**: Mobile-first Design

## 🚀 Deployment

### Vercel (Empfohlen)

1. Verbinden Sie Ihr Repository mit Vercel
2. Fügen Sie die Umgebungsvariablen in Vercel hinzu
3. Deploy automatisch bei Git-Push

### Docker

```bash
docker build -t yourank-ai .
docker run -p 3000:3000 yourank-ai
```

## 📊 Monitoring

- **Supabase Dashboard** für Datenbank-Monitoring
- **Vercel Analytics** für Performance
- **Error Tracking** (optional: Sentry)

## 🤝 Contributing

1. Fork das Repository
2. Erstellen Sie einen Feature-Branch
3. Committen Sie Ihre Änderungen
4. Erstellen Sie einen Pull Request

## 📄 Lizenz

MIT License - siehe LICENSE-Datei für Details.

## 🆘 Support

Bei Fragen oder Problemen:
- Erstellen Sie ein Issue im Repository
- Kontaktieren Sie das Team über [E-Mail]

---

**yourank.ai** - Moderne SEO-Analyse für das digitale Zeitalter 🚀
