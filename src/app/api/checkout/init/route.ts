import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface CartItemInput {
  variant_id: string;
  quantity: number;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const { workspace_id, cart } = body as { workspace_id: string; cart: CartItemInput[] };

    if (!workspace_id || !cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Parâmetros inválidos. Necessário workspace_id e cart.' }, { status: 400 });
    }

    // 1. Fetch real prices from DB to prevent frontend price spoofing
    const variantIds = cart.map(item => item.variant_id);
    
    // We use service role bypass logic or assume the user is public?
    // Wait, products and product_variants might not be public for SELECT.
    // Let's use the service_role key to bypass RLS for fetching products safely.
    // However, since we are using createClient (which uses ANON), we need to ensure we can read them.
    // For now, let's just query. If RLS blocks, we'll need to create a service client.
    
    // Create an Admin client for secure internal operations
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: variants, error: variantsError } = await supabaseAdmin
      .from('product_variants')
      .select('id, price, stock, image_url, name, products(name)')
      .in('id', variantIds);

    if (variantsError || !variants || variants.length === 0) {
      return NextResponse.json({ error: 'Produtos inválidos ou não encontrados.' }, { status: 404 });
    }

    // 2. Build cart session data and calculate total
    let totalAmount = 0;
    const finalCartItems = [];

    for (const item of cart) {
      const dbVariant = variants.find(v => v.id === item.variant_id);
      if (dbVariant) {
        const qty = item.quantity > 0 ? item.quantity : 1;
        const lineTotal = dbVariant.price * qty;
        totalAmount += lineTotal;

        const prodNameRaw = dbVariant.products as any;
        const prodName = Array.isArray(prodNameRaw) ? prodNameRaw[0]?.name : prodNameRaw?.name;

        finalCartItems.push({
          product_id: dbVariant.products ? (dbVariant as any).products.id : null,
          variant_id: dbVariant.id,
          name: `${prodName} ${dbVariant.name ? `- ${dbVariant.name}` : ''}`.trim(),
          image_url: dbVariant.image_url,
          unit_price: dbVariant.price,
          quantity: qty,
          total_price: lineTotal
        });
      }
    }

    // 3. Create Checkout Session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('checkout_sessions')
      .insert({
        workspace_id,
        total_amount: totalAmount,
        cart_items: finalCartItems,
        status: 'active'
      })
      .select('id')
      .single();

    if (sessionError || !session) {
      throw sessionError || new Error("Erro ao criar sessão");
    }

    // 4. Return Redirect URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return NextResponse.json({ 
      success: true, 
      session_id: session.id,
      checkout_url: `${baseUrl}/checkout/session/${session.id}` 
    });

  } catch (error: any) {
    console.error('Erro no init checkout:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
