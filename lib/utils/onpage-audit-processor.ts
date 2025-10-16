import { updateAnalysis } from '@/lib/utils/analysis';

// Task-Ergebnis verarbeiten (wird vom Task-Handler aufgerufen)
export async function processOnPageAuditResult(taskId: string, taskResult: any, analysisId: string) {
  try {
    if (!taskResult || !taskResult.results || taskResult.results.length === 0) {
      throw new Error('Keine OnPage Audit Daten erhalten');
    }

    const result = taskResult.results[0];
    
    // Issues verarbeiten
    const issues: any[] = [];
    let errors = 0;
    let warnings = 0;
    let infos = 0;

    if (result.items) {
      result.items.forEach((item: any) => {
        if (item.issues) {
          item.issues.forEach((issue: any) => {
            const severity = issue.severity || 'info';
            if (severity === 'error') errors++;
            else if (severity === 'warning') warnings++;
            else infos++;

            issues.push({
              type: issue.type || 'unknown',
              severity: severity,
              message: issue.message || '',
              url: item.url || '',
              line: issue.line || 0,
              column: issue.column || 0,
              description: issue.description || '',
              recommendation: issue.recommendation || ''
            });
          });
        }
      });
    }

    // Summary berechnen
    const summary = {
      title_issues: issues.filter(i => i.type.includes('title')).length,
      meta_description_issues: issues.filter(i => i.type.includes('meta_description')).length,
      heading_issues: issues.filter(i => i.type.includes('heading')).length,
      image_issues: issues.filter(i => i.type.includes('image')).length,
      internal_link_issues: issues.filter(i => i.type.includes('internal_link')).length,
      external_link_issues: issues.filter(i => i.type.includes('external_link')).length,
      technical_issues: issues.filter(i => i.type.includes('technical')).length
    };

    const processedResult = {
      total_pages: result.total_pages || 0,
      crawled_pages: result.crawled_pages || 0,
      issues_count: issues.length,
      errors,
      warnings,
      infos,
      issues: issues.slice(0, 1000), // Limit für Performance
      summary
    };

    // Analysis updaten
    await updateAnalysis(analysisId, {
      status: 'completed',
      result: processedResult
    });

    return processedResult;

  } catch (error) {
    console.error('OnPage Audit Task Processing Error:', error);
    
    await updateAnalysis(analysisId, {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Fehler beim Verarbeiten der Ergebnisse'
    });

    throw error;
  }
}
