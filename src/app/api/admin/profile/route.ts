import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    // Get workspaces
    const { data: workspaces, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id, name, total_revenue')
      .order('created_at', { ascending: true });

    if (workspaceError) {
      console.error('Error fetching workspaces:', workspaceError);
    }

    return NextResponse.json({ 
      user: {
        ...user,
        profile: profile || null,
        workspaces: workspaces || []
      } 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
