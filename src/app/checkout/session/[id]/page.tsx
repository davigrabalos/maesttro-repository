import React from 'react';
import { notFound } from 'next/navigation';
import { SessionCheckoutClientWrapper } from '@/components/checkout/SessionCheckoutClientWrapper';
import { createClient } from '@supabase/supabase-js';

// Usamos Service Role para buscar a sessão e os settings já que a página pública de pagamento
// não tem um usuário autenticado acessando-a.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function SessionCheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const sessionId = resolvedParams.id;

  // 1. Fetch the Checkout Session
  const { data: session, error: sessionError } = await supabaseAdmin
    .from('checkout_sessions')
    .select('*, workspaces(name)')
    .eq('id', sessionId)
    .single();

  if (sessionError || !session || session.status !== 'active') {
    console.error('Session not found or inactive:', sessionId, sessionError);
    notFound();
  }

  // 2. Fetch the Checkout Settings for visual identity
  const { data: settings } = await supabaseAdmin
    .from('checkout_settings')
    .select('*')
    .eq('workspace_id', session.workspace_id)
    .single();

  const primaryColor = settings?.primary_color || 'var(--md-primary)';
  const logoUrl = settings?.logo_url || null;
  const rawWs = session.workspaces as any;
  const storeName = Array.isArray(rawWs) ? rawWs[0]?.name : rawWs?.name;

  return (
    <div className="checkout-layout">
      {/* Esquerda: Formulário de Pagamento */}
      <div className="checkout-left md-surface" style={{ borderTopLeftRadius: '24px', borderBottomLeftRadius: '24px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Store Logo" style={{ maxHeight: '50px', objectFit: 'contain' }} />
          ) : (
            <h1 style={{ margin: 0, fontSize: '24px', color: primaryColor }}>{storeName}</h1>
          )}
        </div>
        <h2 style={{ marginBottom: '8px', fontSize: '20px' }}>Finalize sua compra</h2>
        <p style={{ marginBottom: '32px', color: 'var(--md-text-secondary)', fontSize: '13px' }}>
          Ambiente 100% seguro.
        </p>
        
        {/* Usamos a cor do lojista nas variáveis CSS locais */}
        <div style={{ '--checkout-primary': primaryColor } as any}>
          <SessionCheckoutClientWrapper session={session} settings={settings} />
        </div>
      </div>
      
      {/* Direita: Resumo do Carrinho Real */}
      <div className="checkout-right">
        <div className="md-surface" style={{ padding: 0, borderTopRightRadius: '24px', borderBottomRightRadius: '24px', overflow: 'hidden' }}>

          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--md-border)', backgroundColor: '#F9FAFB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: primaryColor }}>shopping_bag</span>
              <h2 style={{ margin: 0, fontSize: '18px' }}>Resumo do Pedido</h2>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {(session.cart_items as any[]).map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '64px', height: '64px', backgroundColor: '#F3F4F6', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span className="material-symbols-outlined" style={{ color: '#9CA3AF' }}>image</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#111827' }}>{item.name}</h4>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>Qtd: {item.quantity}</span>
                  </div>
                  <div style={{ fontWeight: 600, color: '#111827', fontSize: '14px' }}>
                    R$ {(item.total_price).toFixed(2).replace('.', ',')}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed #D1D5DB', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6B7280', fontSize: '14px' }}>Total a pagar</span>
              <span style={{ fontWeight: '800', fontSize: '24px', color: primaryColor }}>
                R$ {session.total_amount.toFixed(2).replace('.', ',')}
              </span>
            </div>

          </div>

          {/* Rodapé da Nota */}
          <div style={{ padding: '14px 24px', borderTop: '1px solid var(--md-border)', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F9FAFB' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: primaryColor }}>verified_user</span>
            <span style={{ fontSize: '11px', color: '#4B5563' }}>Compra protegida pela tecnologia Maesttro</span>
          </div>

        </div>
      </div>
    </div>
  );
}
