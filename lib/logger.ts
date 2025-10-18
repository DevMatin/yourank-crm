// Enhanced logger utility with file logging and better formatting
// Client-safe logger that only logs to console in browser environment
export const logger = {
  error: (message: string, error?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      error: error ? (error instanceof Error ? error.message : error) : undefined,
      stack: error instanceof Error ? error.stack : undefined
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ [ERROR] ${message}`, error);
    }
    
    // Write to log file (server-side only)
    if (typeof window === 'undefined') {
      writeToLogFile(logEntry);
    }
  },
  
  warn: (message: string, data?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      message,
      data
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ [WARN] ${message}`, data);
    }
    
    if (typeof window === 'undefined') {
      writeToLogFile(logEntry);
    }
  },
  
  info: (message: string, data?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      data
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.info(`ℹ️ [INFO] ${message}`, data);
    }
    
    if (typeof window === 'undefined') {
      writeToLogFile(logEntry);
    }
  },
  
  debug: (message: string, data?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'DEBUG',
      message,
      data
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.debug(`🐛 [DEBUG] ${message}`, data);
    }
    
    if (typeof window === 'undefined') {
      writeToLogFile(logEntry);
    }
  },

  // Spezielle Methode für API-Debug-Logs
  apiDebug: (apiName: string, data: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'API_DEBUG',
      message: `API Debug: ${apiName}`,
      apiName,
      data
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 [API_DEBUG] ${apiName}:`, data);
    }
    
    if (typeof window === 'undefined') {
      writeToLogFile(logEntry);
    }
  },

  // Spezielle Methode für Datenvalidierung
  dataValidation: (message: string, data?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'DATA_VALIDATION',
      message: `Data Validation: ${message}`,
      data
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ [DATA_VALIDATION] ${message}`, data);
    }
    
    if (typeof window === 'undefined') {
      writeToLogFile(logEntry);
    }
  },

  // Spezielle Methode für API-Erfolg/Fehler-Status
  apiStatus: (apiName: string, status: 'SUCCESS' | 'FAILED', details?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'API_STATUS',
      message: `API Status: ${apiName} - ${status}`,
      apiName,
      status,
      details
    };
    
    if (process.env.NODE_ENV === 'development') {
      const icon = status === 'SUCCESS' ? '✅' : '❌';
      console.log(`${icon} [API_STATUS] ${apiName}: ${status}`, details);
    }
    
    if (typeof window === 'undefined') {
      writeToLogFile(logEntry);
    }
  }
};

// Hilfsfunktion zum Schreiben in Log-Datei (nur Server-side)
function writeToLogFile(logEntry: any) {
  // Nur auf Server-Seite ausführen
  if (typeof window !== 'undefined') {
    return;
  }
  
  // Nur in Node.js Umgebung versuchen
  if (typeof process === 'undefined' || !process.cwd) {
    return;
  }
  
  try {
    // Dynamische Imports für Node.js Module nur auf Server-Seite
    const fs = eval('require')('fs');
    const path = eval('require')('path');
    
    const logsDir = path.join(process.cwd(), 'logs');
    
    // Erstelle logs Verzeichnis falls es nicht existiert
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    const logFileName = `api-debug-${new Date().toISOString().split('T')[0]}.log`;
    const logFilePath = path.join(logsDir, logFileName);
    
    // Formatiere Log-Eintrag
    const logLine = JSON.stringify(logEntry) + '\n';
    
    // Schreibe asynchron in Datei
    fs.appendFile(logFilePath, logLine, (err: any) => {
      if (err) {
        console.error('Failed to write to log file:', err);
      }
    });
    
  } catch (error) {
    // Ignoriere Fehler beim Datei-Schreiben
    console.error('Logger error:', error);
  }
}
