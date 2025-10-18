import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get setting key from query params
    const { searchParams } = new URL(request.url);
    const settingKey = searchParams.get('key');
    
    if (!settingKey) {
      return NextResponse.json({ error: 'Setting key is required' }, { status: 400 });
    }

    // Get setting value from database
    const { data, error } = await supabase
      .from('user_settings')
      .select('setting_value')
      .eq('user_id', user.id)
      .eq('setting_key', settingKey)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching user setting:', error);
      return NextResponse.json({ error: 'Failed to fetch setting' }, { status: 500 });
    }

    return NextResponse.json({ 
      value: data?.setting_value || null 
    });

  } catch (error) {
    console.error('Error in GET /api/user-settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized', details: authError?.message }, { status: 401 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
    }

    console.log('Attempting to save setting:', { userId: user.id, key, value });

    // Try to insert first, then update if it exists
    const { error: insertError } = await supabase
      .from('user_settings')
      .insert({
        user_id: user.id,
        setting_key: key,
        setting_value: value
      });

    if (insertError) {
      // If insert fails due to unique constraint, try update
      if (insertError.code === '23505') { // Unique violation
        console.log('Setting exists, updating...');
        const { error: updateError } = await supabase
          .from('user_settings')
          .update({ setting_value: value })
          .eq('user_id', user.id)
          .eq('setting_key', key);

        if (updateError) {
          console.error('Error updating user setting:', updateError);
          return NextResponse.json({ 
            error: 'Failed to update setting', 
            details: updateError.message,
            code: updateError.code 
          }, { status: 500 });
        }
      } else {
        console.error('Error inserting user setting:', insertError);
        return NextResponse.json({ 
          error: 'Failed to save setting', 
          details: insertError.message,
          code: insertError.code 
        }, { status: 500 });
      }
    }

    console.log('Setting saved successfully');
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in POST /api/user-settings:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
