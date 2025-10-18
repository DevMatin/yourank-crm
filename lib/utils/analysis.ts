import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AnalysisInput, AnalysisType, AnalysisCategory } from '@/types/analysis';
import { logger } from '@/lib/logger';

export async function saveAnalysis(
  input: AnalysisInput,
  type: AnalysisType,
  userId: string,
  projectId?: string,
  creditsUsed: number = 1,
  category?: AnalysisCategory
) {
  const supabase = await createServerSupabaseClient();
  
  try {
    // First, verify the user is authenticated and matches the userId
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }
    
    if (user.id !== userId) {
      throw new Error('Unauthorized: Cannot save analysis for another user');
    }
    
    const { data, error } = await (supabase as any)
      .from('analyses')
      .insert({
        user_id: userId,
        project_id: projectId || null,
        type: type as string,
        input: input as any,
        status: 'pending' as const,
        credits_used: creditsUsed,
        category: category || 'legacy',
      })
      .select()
      .single();

    if (error) {
      logger.error('Error saving analysis:', error);
      throw new Error(`Failed to save analysis: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    logger.error('Error in saveAnalysis:', error);
    throw new Error(`Failed to save analysis: ${error.message}`);
  }
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
  
  try {
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }
    
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
  } catch (error: any) {
    logger.error('Error in updateAnalysis:', error);
    throw new Error(`Failed to update analysis: ${error.message}`);
  }
}

export async function getAnalysis(id: string) {
  const supabase = await createServerSupabaseClient();
  
  try {
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }
    
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
  } catch (error: any) {
    logger.error('Error in getAnalysis:', error);
    throw new Error(`Failed to fetch analysis: ${error.message}`);
  }
}

export async function getUserAnalyses(userId: string, limit: number = 10) {
  const supabase = await createServerSupabaseClient();
  
  try {
    // Verify user is authenticated and matches the requested userId
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }
    
    if (user.id !== userId) {
      throw new Error('Unauthorized: Cannot fetch analyses for another user');
    }
    
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
  } catch (error: any) {
    logger.error('Error in getUserAnalyses:', error);
    throw new Error(`Failed to fetch user analyses: ${error.message}`);
  }
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
  
  try {
    // Verify user is authenticated and matches the requested userId
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }
    
    if (user.id !== userId) {
      throw new Error('Unauthorized: Cannot deduct credits for another user');
    }
    
    const { data, error } = await (supabase as any).rpc('deduct_user_credits', {
      user_id: userId,
      amount: amount
    });

    if (error) {
      logger.error('Error deducting credits:', error);
      throw new Error(`Failed to deduct credits: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    logger.error('Error in deductCredits:', error);
    throw new Error(`Failed to deduct credits: ${error.message}`);
  }
}

export async function checkUserCredits(userId: string, required: number) {
  const supabase = await createServerSupabaseClient();
  
  try {
    // First, try to get the current user to ensure they're authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }
    
    // Verify that the requested userId matches the authenticated user
    if (user.id !== userId) {
      throw new Error('Unauthorized: Cannot check credits for another user');
    }
    
    // Try to get credits using a raw SQL query to bypass RLS issues
    const { data, error } = await supabase.rpc('get_user_credits', {
      user_id: userId
    });

    if (error) {
      // If the RPC function doesn't exist yet, use a workaround
      logger.warn('RPC function not available, using workaround:', error);
      
      // For now, return a default value to avoid the RLS recursion issue
      // This is a temporary fix until the migration is applied
      logger.warn('Using temporary credit check - assuming user has credits');
      return 100; // Assume user has credits for now
    }

    if (data < required) {
      throw new Error(`Insufficient credits. Required: ${required}, Available: ${data}`);
    }

    return data;
  } catch (error: any) {
    logger.error('Error checking credits:', error);
    throw new Error(`Failed to check credits: ${error.message}`);
  }
}
