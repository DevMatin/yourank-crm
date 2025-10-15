import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AnalysisInput, AnalysisType } from '@/types/analysis';
import { logger } from '@/lib/logger';

export async function saveAnalysis(
  input: AnalysisInput,
  type: AnalysisType,
  userId: string,
  projectId?: string,
  creditsUsed: number = 1
) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await (supabase as any)
    .from('analyses')
    .insert({
      user_id: userId,
      project_id: projectId || null,
      type: type as string,
      input: input as any,
      status: 'pending' as const,
      credits_used: creditsUsed,
    })
    .select()
    .single();

  if (error) {
    logger.error('Error saving analysis:', error);
    throw new Error(`Failed to save analysis: ${error.message}`);
  }

  return data;
}

export async function updateAnalysis(
  id: string,
  updates: {
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    result?: any;
    task_id?: string;
  }
) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await (supabase as any)
    .from('analyses')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Error updating analysis:', error);
    throw new Error(`Failed to update analysis: ${error.message}`);
  }

  return data;
}

export async function getAnalysis(id: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await (supabase as any)
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    logger.error('Error fetching analysis:', error);
    throw new Error(`Failed to fetch analysis: ${error.message}`);
  }

  return data;
}

export async function getUserAnalyses(userId: string, limit: number = 10) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await (supabase as any)
    .from('analyses')
    .select(`
      *,
      projects (
        id,
        name,
        domain
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    logger.error('Error fetching user analyses:', error);
    throw new Error(`Failed to fetch user analyses: ${error.message}`);
  }

  return data;
}

export async function pollTaskStatus(_taskId: string, _endpoint: string) {
  // This would be implemented to poll DataForSEO task status
  // For now, return a placeholder
  return {
    status: 'completed',
    result: null,
  };
}

export async function deductCredits(userId: string, amount: number) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await (supabase as any).rpc('deduct_user_credits', {
    user_id: userId,
    amount: amount
  });

  if (error) {
    logger.error('Error deducting credits:', error);
    throw new Error(`Failed to deduct credits: ${error.message}`);
  }

  return data;
}

export async function checkUserCredits(userId: string, required: number) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await (supabase as any)
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  if (error) {
    logger.error('Error checking credits:', error);
    throw new Error(`Failed to check credits: ${error.message}`);
  }

  if (data.credits < required) {
    throw new Error(`Insufficient credits. Required: ${required}, Available: ${data.credits}`);
  }

  return data.credits;
}
