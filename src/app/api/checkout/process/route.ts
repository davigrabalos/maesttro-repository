import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { source, email, phone, amount } = data;

    if (!source || !email || !phone || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch store by source ID (or auto-create if missing)
    let { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('source_id', source)
      .maybeSingle();

    if (!store) {
      // Auto-create store if source doesn't exist yet
      const { data: newStore, error: createStoreError } = await supabase
        .from('stores')
        .insert({
          name: `Loja ${source}`,
          source_id: source,
          active: true
        })
        .select('id')
        .single();

      if (createStoreError || !newStore) {
        console.error('Error auto-creating store:', createStoreError);
        return NextResponse.json({ error: 'Store not found and could not be created' }, { status: 404 });
      }
      store = newStore;
    }

    // 2. Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        store_id: store.id,
        customer_email: email,
        customer_phone: phone,
        amount: amount,
        status: 'pending',
        payment_method: 'pix'
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
    }

    // Return the created order ID
    return NextResponse.json({ success: true, orderId: order.id });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
