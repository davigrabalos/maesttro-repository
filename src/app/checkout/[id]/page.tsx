import React from 'react';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { PixPayment } from '@/components/checkout/PixPayment';

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
      <div className="checkout-left md-surface">
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Logo da Marca Maesttro */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/ICONLOGO.png" 
            alt="Maesttro Logo" 
            style={{ height: '40px', objectFit: 'contain' }} 
          />
        </div>
        <h1 style={{ marginBottom: '8px', fontSize: '24px' }}>Checkout - {storeName}</h1>
        <p style={{ marginBottom: '32px', color: 'var(--md-text-secondary)', fontSize: '13px' }}>
          Finalize sua compra com segurança na Maesttro. (ID: {checkoutId})
        </p>
        
        <CheckoutForm />
        
        <div style={{ marginTop: '32px', borderTop: '1px solid var(--md-border)', paddingTop: '32px' }}>
          <PixPayment />
        </div>
      </div>
      
      <div className="checkout-right">
        <div className="md-surface">
          <h2 style={{ marginBottom: '16px' }}>Resumo do Pedido</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span>Produto Exemplo</span>
            <span>R$ 197,00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 'bold' }}>
            <span>Total</span>
            <span>R$ 197,00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
