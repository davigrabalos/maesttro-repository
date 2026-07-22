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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, source_id } = body;

    if (!name || !source_id) {
      return NextResponse.json({ error: 'Name and source_id are required' }, { status: 400 });
    }

    const { data: store, error } = await supabase
      .from('stores')
      .insert([{ name, source_id, active: true }])
      .select()
      .single();

    if (error) {
      console.error('Error creating store:', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Já existe uma loja com este ID.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create store' }, { status: 500 });
    }

    return NextResponse.json({ store }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
