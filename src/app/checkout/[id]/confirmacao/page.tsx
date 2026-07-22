import React from 'react';
import { supabase } from '@/lib/supabase';
import { ConfirmacaoStatusClient } from '@/components/checkout/ConfirmacaoStatusClient';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ orderId?: string }>;
}

async function getOrderDetails(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, customer_email, amount, status, payment_method, created_at,
      store:stores (name, source_id),
      pix_proofs (file_url, uploaded_at)
    `)
    .eq('id', orderId)
    .single();

  if (error) return null;
  return data;
}

export default async function ConfirmacaoPage({ params, searchParams }: PageProps) {
  const resolvedSearch = await searchParams;
  await params;
  const orderId = resolvedSearch.orderId || '';
  const order = orderId ? await getOrderDetails(orderId) : null;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      backgroundColor: 'var(--md-background)',
    }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/LOGO.png" alt="Maesttro" style={{ height: '40px', objectFit: 'contain' }} />
        </div>

        {/* Client Component with Polling & Confetti */}
        <ConfirmacaoStatusClient 
          orderId={orderId}
          initialStatus={order?.status || 'pending'}
          initialOrder={order}
        />

      </div>
    </div>
  );
}
