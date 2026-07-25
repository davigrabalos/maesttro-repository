import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // RLS will automatically filter orders the user has access to
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        customer_email,
        customer_phone,
        amount,
        status,
        payment_method,
        created_at,
        workspace_id,
        store:stores (
          id,
          name,
          source_id_1,
          source_id_2
        ),
        pix_proofs (
          id,
          file_url,
          uploaded_at
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

