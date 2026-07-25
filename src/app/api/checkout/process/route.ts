import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Usamos Service Role para ignorar RLS na inserção da Ordem a partir de um usuário não logado.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { session_id, customer_name, customer_email, customer_phone, payment_method } = data;

    if (!session_id || !customer_email || !customer_phone) {
      return NextResponse.json({ error: 'Faltam campos obrigatórios' }, { status: 400 });
    }

    // 1. Fetch Session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('checkout_sessions')
      .select('*')
      .eq('id', session_id)
      .single();

    if (sessionError || !session || session.status !== 'active') {
      return NextResponse.json({ error: 'Sessão inválida ou expirada.' }, { status: 404 });
    }

    // 2. Insert Order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        workspace_id: session.workspace_id,
        customer_email: customer_email,
        customer_phone: customer_phone,
        amount: session.total_amount,
        status: 'pending',
        payment_method: payment_method || 'pix'
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 });
    }

    // 3. Create Order Items from Cart Items
    const cartItems = session.cart_items as any[];
    if (cartItems && cartItems.length > 0) {
      const orderItemsToInsert = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        product_name: item.name,
        image_url: item.image_url
      }));

      const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // We continue so we don't break the payment loop, but this is bad.
      }
    }

    // 4. Update session status
    await supabaseAdmin
      .from('checkout_sessions')
      .update({ status: 'converted', customer_info: { name: customer_name, email: customer_email, phone: customer_phone } })
      .eq('id', session_id);

    // Return the created order ID to redirect to status
    return NextResponse.json({ success: true, order_id: order.id });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
