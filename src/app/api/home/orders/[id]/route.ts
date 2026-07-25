import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['paid', 'failed', 'pending', 'processing'].includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      return NextResponse.json({ error: 'Erro ao atualizar pedido' }, { status: 500 });
    }

    return NextResponse.json({ order, message: `Pedido alterado para ${status}` });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
