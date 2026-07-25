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

    // Get workspaces
    const { data: workspaceUser } = await supabase
      .from('workspace_users')
      .select('workspace_id')
      .eq('user_id', user.id)
      .single();
    
    const workspaceId = workspaceUser?.workspace_id;

    // Calc achievements
    const [{ count: storesCount }, { count: ordersCount }] = await Promise.all([
      supabase.from('stores').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
    ]);
    const { data: maxOrder } = await supabase.from('orders').select('amount').eq('workspace_id', workspaceId).order('amount', { ascending: false }).limit(1);
    const { data: minOrder } = await supabase.from('orders').select('amount').eq('workspace_id', workspaceId).order('amount', { ascending: true }).limit(1);
    const { count: pixPaidCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId).eq('payment_method', 'pix').eq('status', 'paid');

    // Get profile to check current level
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    let unlockedCount = 0;
    if ((storesCount || 0) >= 1) unlockedCount++; // start
    if ((storesCount || 0) >= 5) unlockedCount++; // magnata
    if ((ordersCount || 0) >= 10) unlockedCount++; // lobo
    if (maxOrder && maxOrder.length > 0 && maxOrder[0].amount >= 1000) unlockedCount++; // baleia
    if (minOrder && minOrder.length > 0 && minOrder[0].amount < 10) unlockedCount++; // centavo
    if ((pixPaidCount || 0) >= 10) unlockedCount++; // rei_pix
    if (profile?.avatar_url) unlockedCount++; // avatar

    // Update if needed
    if (profile && profile.achievement_level !== unlockedCount) {
      await supabase.from('profiles').update({ achievement_level: unlockedCount }).eq('id', user.id);
      profile.achievement_level = unlockedCount;
    }

    const { data: workspaces, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id, name, total_revenue')
      .order('created_at', { ascending: true });

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
