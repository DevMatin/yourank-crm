// Server-only logger utility
// This file should only be imported on server-side

export const serverLogger = {
  error: async (message: string, error?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      error: error ? (error instanceof Error ? error.message : error) : undefined,
      stack: error instanceof Error ? error.stack : undefined
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ERROR] ${message}`, error);
    }
    
    await writeToLogFile(logEntry);
  },
  
  warn: async (message: string, data?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      message,
      data
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[WARN] ${message}`, data);
    }
    
    await writeToLogFile(logEntry);
  },
  
  info: async (message: string, data?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      data
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.info(`[INFO] ${message}`, data);
    }
    
    await writeToLogFile(logEntry);
  },
  
  debug: async (message: string, data?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'DEBUG',
      message,
      data
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data);
    }
    
    await writeToLogFile(logEntry);
  },

  apiDebug: async (apiName: string, data: any) => {
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
    
    await writeToLogFile(logEntry);
  },

  dataValidation: async (message: string, data?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'DATA_VALIDATION',
      message,
      data
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ [DATA_VALIDATION] ${message}`, data);
    }
    
    await writeToLogFile(logEntry);
  }
};

// Hilfsfunktion zum Schreiben in Log-Datei
async function writeToLogFile(logEntry: any) {
  try {
    const fs = await import('fs').then(fs => fs.promises);
    const path = await import('path');
    
    const logsDir = path.join(process.cwd(), 'logs');
    
    // Erstelle logs Verzeichnis falls es nicht existiert
    try {
      await fs.mkdir(logsDir, { recursive: true });
    } catch (error) {
      // Verzeichnis existiert bereits
    }
    
    const logFileName = `api-debug-${new Date().toISOString().split('T')[0]}.log`;
    const logFilePath = path.join(logsDir, logFileName);
    
    // Formatiere Log-Eintrag
    const logLine = JSON.stringify(logEntry) + '\n';
    
    // Schreibe asynchron in Datei
    await fs.appendFile(logFilePath, logLine);
    
  } catch (error) {
    console.error('Logger error:', error);
  }
}
