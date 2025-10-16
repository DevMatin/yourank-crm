import { logger } from '@/lib/logger';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { updateAnalysis } from './analysis';

export interface TaskResult {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

/**
 * Creates a new task with DataForSEO and returns the task ID
 */
export async function createTask(endpoint: string, payload: any[]): Promise<string> {
  try {
    logger.info(`Creating task for endpoint: ${endpoint}`);
    
    // Make the initial API call to create the task
    const response = await fetch(`https://api.dataforseo.com${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.DATAFORSEO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Task creation failed: ${errorData.status_message || 'Unknown error'}`);
    }

    const result = await response.json();
    const taskId = result.tasks?.[0]?.id;

    if (!taskId) {
      throw new Error('No task ID returned from DataForSEO');
    }

    logger.info(`Task created successfully with ID: ${taskId}`);
    return taskId;
  } catch (error) {
    logger.error('Error creating task:', error);
    throw error;
  }
}

/**
 * Polls the task status and returns the result when completed
 */
export async function pollTask(taskId: string, endpoint: string): Promise<TaskResult> {
  try {
    logger.info(`Polling task status for ID: ${taskId}`);
    
    // Convert task_post endpoint to task_get endpoint
    const getEndpoint = endpoint.replace('/task_post', '/task_get');
    
    const response = await fetch(`https://api.dataforseo.com${getEndpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.DATAFORSEO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ id: taskId }]),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Task polling failed: ${errorData.status_message || 'Unknown error'}`);
    }

    const result = await response.json();
    const task = result.tasks?.[0];

    if (!task) {
      throw new Error('Task not found');
    }

    const status = task.status_message?.toLowerCase();
    
    if (status === 'ok.') {
      return {
        status: 'completed',
        result: task.result
      };
    } else if (status === 'in_progress' || status === 'pending') {
      return {
        status: 'processing'
      };
    } else {
      return {
        status: 'failed',
        error: task.status_message || 'Task failed'
      };
    }
  } catch (error) {
    logger.error('Error polling task:', error);
    return {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Waits for task completion with polling
 */
export async function waitForTaskCompletion(
  taskId: string, 
  endpoint: string, 
  maxAttempts: number = 30,
  pollInterval: number = 5000
): Promise<TaskResult> {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const result = await pollTask(taskId, endpoint);
    
    if (result.status === 'completed') {
      logger.info(`Task ${taskId} completed successfully`);
      return result;
    }
    
    if (result.status === 'failed') {
      logger.error(`Task ${taskId} failed: ${result.error}`);
      return result;
    }
    
    // Task is still processing, wait and try again
    attempts++;
    logger.info(`Task ${taskId} still processing, attempt ${attempts}/${maxAttempts}`);
    
    if (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
  }
  
  // Max attempts reached
  logger.warn(`Task ${taskId} timed out after ${maxAttempts} attempts`);
  return {
    status: 'failed',
    error: 'Task timed out'
  };
}

/**
 * Processes a task asynchronously and updates the analysis record
 */
export async function processTaskAsync(
  analysisId: string,
  taskId: string,
  endpoint: string
): Promise<void> {
  try {
    logger.info(`Starting async processing for analysis ${analysisId}, task ${taskId}`);
    
    // Update analysis status to processing
    await updateAnalysis(analysisId, {
      status: 'processing',
      task_id: taskId
    });
    
    // Wait for task completion
    const result = await waitForTaskCompletion(taskId, endpoint);
    
    // Update analysis with final result
    if (result.status === 'completed') {
      await updateAnalysis(analysisId, {
        status: 'completed',
        result: result.result
      });
      logger.info(`Analysis ${analysisId} completed successfully`);
    } else {
      await updateAnalysis(analysisId, {
        status: 'failed',
        result: { error: result.error }
      });
      logger.error(`Analysis ${analysisId} failed: ${result.error}`);
    }
  } catch (error) {
    logger.error(`Error processing task for analysis ${analysisId}:`, error);
    
    // Update analysis with error
    await updateAnalysis(analysisId, {
      status: 'failed',
      result: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }
}

/**
 * Gets task status without waiting
 */
export async function getTaskStatus(taskId: string, endpoint: string): Promise<TaskResult> {
  return await pollTask(taskId, endpoint);
}

/**
 * Cancels a task (if supported by DataForSEO)
 */
export async function cancelTask(taskId: string, endpoint: string): Promise<boolean> {
  try {
    // Note: DataForSEO doesn't always support task cancellation
    // This is a placeholder for future implementation
    logger.info(`Attempting to cancel task ${taskId}`);
    
    // For now, we'll just log the attempt
    // In the future, this could make an API call to cancel the task
    return false;
  } catch (error) {
    logger.error('Error canceling task:', error);
    return false;
  }
}
