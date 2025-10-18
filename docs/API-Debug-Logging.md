# API Debug Logging System

## Übersicht

Das erweiterte Logging-System schreibt alle DataForSEO API-Calls und Debug-Informationen in strukturierte Log-Dateien, die über eine Web-Oberfläche eingesehen werden können.

## Features

### 1. **Automatisches Datei-Logging**
- Alle Logs werden in `logs/api-debug-YYYY-MM-DD.log` geschrieben
- JSON-formatierte Einträge für einfache Verarbeitung
- Automatische Verzeichnis-Erstellung

### 2. **Log-Level**
- `ERROR`: Fehler und Exceptions
- `WARN`: Warnungen
- `INFO`: Allgemeine Informationen
- `DEBUG`: Debug-Informationen
- `API_DEBUG`: Spezielle API-Debug-Logs mit detaillierten Response-Daten

### 3. **Debug-Web-Interface**
- Zugriff über `/debug/logs` im Dashboard
- Filterung nach Datum und Log-Level
- Download-Funktion für Log-Dateien
- Strukturierte Anzeige mit Syntax-Highlighting

## Verwendung

### 1. **Logs anzeigen**
```
http://localhost:3000/debug/logs
```

### 2. **API-Calls testen**
```
http://localhost:3000/keywords/overview-v2
```

### 3. **Log-Dateien finden**
```
logs/
├── api-debug-2024-01-15.log
├── api-debug-2024-01-16.log
└── ...
```

## Log-Struktur

### Standard Log-Eintrag
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "INFO",
  "message": "Starting Overview Analysis",
  "data": {
    "keyword": "seo tools",
    "location": "Germany",
    "language": "German",
    "userId": "user-123"
  }
}
```

### API Debug Eintrag
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "API_DEBUG",
  "message": "API Debug: Related Keywords - Response Data",
  "apiName": "Related Keywords",
  "data": {
    "tasks": [...],
    "status": "success"
  }
}
```

### Error Eintrag
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "ERROR",
  "message": "API call failed",
  "error": "Connection timeout",
  "stack": "Error: Connection timeout\n    at ..."
}
```

## API-Endpunkte

### GET `/api/debug/logs`
- Lädt Logs für ein bestimmtes Datum
- Optional: Filterung nach Log-Level
- Parameter:
  - `date`: YYYY-MM-DD Format (Standard: heute)
  - `level`: ERROR, WARN, INFO, DEBUG, API_DEBUG

### Beispiel-Aufruf
```javascript
// Alle Logs für heute
fetch('/api/debug/logs')

// Nur Errors für gestern
fetch('/api/debug/logs?date=2024-01-14&level=ERROR')
```

## Logger-Verwendung

### Im Backend (API Routes)
```typescript
import { logger } from '@/lib/logger';

// Standard Logging
logger.info('API call started', { keyword, location });
logger.error('API call failed', error);

// API Debug Logging
logger.apiDebug('Related Keywords - Response Data', responseData);
```

### Im Frontend (Console bleibt aktiv)
```typescript
// Console-Logs bleiben für Browser-Debugging
console.log('🔍 Overview API Response:', data);
console.log('✅ API Success Status:', data.partialResults);
```

## Debug-Informationen

### Keywords Overview API
Die `/api/keywords/overview` Route loggt:
- Jeden einzelnen API-Call (Related Keywords, Search Volume, etc.)
- Erfolg/Fehler-Status für jeden Call
- Vollständige Response-Daten
- Credit-Verbrauch
- Finale Datenstruktur

### Beispiel-Log-Sequenz
```
[INFO] Starting Overview Analysis
[INFO] Starting Related Keywords API call
[API_DEBUG] Related Keywords - Response Data: {...}
[INFO] ✅ Related Keywords API completed successfully
[INFO] Starting Search Volume API call
[API_DEBUG] Search Volume - Response Data: {...}
[INFO] ✅ Search Volume API completed successfully
[INFO] Overview Analysis Completed
```

## Vorteile

1. **Persistente Debug-Informationen**: Logs bleiben auch nach Server-Restart erhalten
2. **Strukturierte Daten**: JSON-Format ermöglicht einfache Analyse
3. **Web-Interface**: Benutzerfreundliche Anzeige ohne Terminal-Zugriff
4. **Filterung**: Schnelle Suche nach spezifischen Events
5. **Download**: Export für weitere Analyse
6. **Automatische Rotation**: Tägliche Log-Dateien verhindern zu große Dateien

## Troubleshooting

### Log-Dateien werden nicht erstellt
- Prüfe Schreibrechte im Projekt-Verzeichnis
- Stelle sicher, dass `logs/` Verzeichnis erstellt werden kann

### Debug-Interface zeigt keine Logs
- Prüfe ob Log-Dateien für das gewählte Datum existieren
- Kontrolliere Browser-Console auf JavaScript-Fehler

### Performance-Impact
- Logging ist asynchron und sollte keine Performance-Probleme verursachen
- Log-Dateien werden täglich rotiert
- Alte Log-Dateien können gelöscht werden
