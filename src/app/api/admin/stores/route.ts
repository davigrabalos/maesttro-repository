import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: stores, error } = await supabase
      .from('stores')
      .select(`
        id,
        name,
        source_id,
        active,
        created_at,
        orders (count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stores:', error);
      return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 });
    }

    return NextResponse.json({ stores });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
