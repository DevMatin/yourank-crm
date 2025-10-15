import { DataForSeoRequest, DataForSeoResponse, DataForSeoError } from '@/types/dataforseo';
import { logger } from '@/lib/logger';

const DATAFORSEO_BASE_URL = 'https://api.dataforseo.com';

export class DataForSeoClient {
  private login: string;
  private password: string;

  constructor() {
    this.login = process.env.DATAFORSEO_LOGIN || '';
    this.password = process.env.DATAFORSEO_PASSWORD || '';
  }

  private getAuthHeader(): string {
    // Use API key if available, otherwise use login:password
    const apiKey = process.env.DATAFORSEO_API_KEY;
    if (apiKey) {
      return `Basic ${apiKey}`;
    }
    
    const credentials = Buffer.from(`${this.login}:${this.password}`).toString('base64');
    return `Basic ${credentials}`;
  }

  async fetchDataForSeo(endpoint: string, payload: DataForSeoRequest[]): Promise<DataForSeoResponse> {
    const apiKey = process.env.DATAFORSEO_API_KEY;
    if (!apiKey && (!this.login || !this.password)) {
      throw new Error('DataForSEO credentials not configured');
    }

    const url = `${DATAFORSEO_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData: DataForSeoError = await response.json();
        throw new Error(`DataForSEO API Error: ${errorData.status_message} (${errorData.status_code})`);
      }

      const data: DataForSeoResponse = await response.json();
      return data;
    } catch (error) {
      logger.error('DataForSEO API Error:', error);
      throw error;
    }
  }

  async fetchTaskResult(taskId: string, endpoint: string): Promise<DataForSeoResponse> {
    const url = `${DATAFORSEO_BASE_URL}${endpoint}/${taskId}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData: DataForSeoError = await response.json();
        throw new Error(`DataForSEO API Error: ${errorData.status_message} (${errorData.status_code})`);
      }

      const data: DataForSeoResponse = await response.json();
      return data;
    } catch (error) {
      logger.error('DataForSEO Task Result Error:', error);
      throw error;
    }
  }

  // Helper method to create standard request payload
  createRequest(data: DataForSeoRequest): DataForSeoRequest[] {
    return [data];
  }

  // Helper method to extract results from response
  extractResults(response: DataForSeoResponse): any[] {
    if (response.tasks && response.tasks.length > 0) {
      const task = response.tasks[0];
      if (task.result && task.result.length > 0) {
        return task.result[0].items || [];
      }
    }
    return [];
  }
}

// Export singleton instance
export const dataForSeoClient = new DataForSeoClient();

// Convenience function for API routes
export async function fetchDataForSeo(endpoint: string, payload: DataForSeoRequest[]): Promise<DataForSeoResponse> {
  return dataForSeoClient.fetchDataForSeo(endpoint, payload);
}