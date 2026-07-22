import React from 'react';
import { CheckoutClientWrapper } from '@/components/checkout/CheckoutClientWrapper';

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ source?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const checkoutId = resolvedParams.id;
  const source = resolvedSearchParams.source || 'default';

  // In a real scenario, fetch store configuration from Supabase using checkoutId + source
  const storeName = source === 'lojaA' ? 'Loja Principal (Facebook)' : 'Loja Secundária (Google)';
  
  return (
    <div className="checkout-layout">
      <div className="checkout-left md-surface" style={{ borderTopLeftRadius: '24px', borderBottomLeftRadius: '24px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Logo da Marca Maesttro */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/LOGO.png" 
            alt="Maesttro Logo" 
            style={{ height: '40px', objectFit: 'contain' }} 
          />
        </div>
        <h1 style={{ marginBottom: '8px', fontSize: '24px' }}>Checkout - {storeName}</h1>
        <p style={{ marginBottom: '32px', color: 'var(--md-text-secondary)', fontSize: '13px' }}>
          Finalize sua compra com segurança na Maesttro. (ID: {checkoutId})
        </p>
        
        <CheckoutClientWrapper source={source} checkoutId={checkoutId} />
      </div>
      
      <div className="checkout-right">
        <div className="md-surface" style={{ padding: 0, borderTopRightRadius: '24px', borderBottomRightRadius: '24px', overflow: 'hidden' }}>

          {/* Cabeçalho da Nota */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--md-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--md-primary)' }}>receipt_long</span>
              <h2 style={{ margin: 0 }}>Resumo do Pedido</h2>
            </div>
          </div>

          {/* Itens da Nota */}
          <div style={{ padding: '16px 24px' }}>

            {/* Linha de item */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px dashed var(--md-border)', fontSize: '13px' }}>
              <span style={{ color: 'var(--md-on-surface)' }}>Produto Exemplo</span>
              <span>R$ 197,00</span>
            </div>

            {/* Linha de frete (exemplo) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px dashed var(--md-border)', fontSize: '13px' }}>
              <span style={{ color: 'var(--md-text-secondary)' }}>Frete</span>
              <span style={{ color: 'var(--md-success)' }}>Grátis</span>
            </div>

            {/* Linha de desconto (exemplo) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', fontSize: '13px' }}>
              <span style={{ color: 'var(--md-text-secondary)' }}>Desconto</span>
              <span style={{ color: 'var(--md-error)' }}>- R$ 0,00</span>
            </div>

            {/* Divisor forte antes do Total */}
            <div style={{ borderTop: '2px solid var(--md-on-background)', marginTop: '8px', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: '700', fontSize: '14px' }}>Total</span>
              <span style={{ fontWeight: '700', fontSize: '18px', color: 'var(--md-primary)' }}>R$ 197,00</span>
            </div>

            {/* Parcelamento */}
            <p style={{ fontSize: '11px', color: 'var(--md-text-secondary)', marginTop: '6px', textAlign: 'right' }}>
              ou 12x de R$ 17,78
            </p>

          </div>

          {/* Rodapé da Nota */}
          <div style={{ padding: '14px 24px', borderTop: '1px solid var(--md-border)', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--md-primary-light)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--md-primary)' }}>verified_user</span>
            <span style={{ fontSize: '11px', color: 'var(--md-primary)' }}>Compra 100% segura e protegida</span>
          </div>

        </div>
      </div>
    </div>
  );
}
