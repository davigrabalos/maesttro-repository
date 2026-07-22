import React from 'react';
import { supabase } from '@/lib/supabase';

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

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr));
}

export default async function ConfirmacaoPage({ params, searchParams }: PageProps) {
  const resolvedSearch = await searchParams;
  await params; // Resolve params even if not used directly
  const orderId = resolvedSearch.orderId;
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

        {/* Main Card */}
        <div style={{ backgroundColor: 'var(--md-surface)', border: '1px solid var(--md-border)', overflow: 'hidden' }}>

          {/* Header Verde */}
          <div style={{
            backgroundColor: 'var(--md-primary)',
            padding: '32px 24px',
            textAlign: 'center',
            color: '#FFFFFF',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>
              check_circle
            </span>
            <h1 style={{ color: '#FFFFFF', fontSize: '22px', marginBottom: '8px' }}>
              Pedido Recebido!
            </h1>
            <p style={{ fontSize: '13px', opacity: 0.8 }}>
              Sua solicitação foi registrada com sucesso.
            </p>
          </div>

          {/* Detalhes do Pedido */}
          {order ? (
            <div style={{ padding: '24px' }}>

              {/* ID do Pedido */}
              <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'var(--md-primary-light)', border: '1px solid var(--md-border)' }}>
                <p style={{ fontSize: '11px', color: 'var(--md-text-secondary)', marginBottom: '4px' }}>Número do Pedido</p>
                <p style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--md-primary)', fontWeight: '700' }}>
                  #{order.id.toUpperCase()}
                </p>
              </div>

              {/* Linhas de Detalhe */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { label: 'E-mail', value: order.customer_email, icon: 'email' },
                  { label: 'Valor Total', value: formatCurrency(order.amount), icon: 'payments' },
                  { label: 'Data', value: formatDate(order.created_at), icon: 'calendar_today' },
                  { label: 'Método', value: order.payment_method === 'pix' ? 'Pix' : 'Cartão de Crédito', icon: 'credit_card' },
                ].map((item, idx, arr) => (
                  <div key={item.label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: idx < arr.length - 1 ? '1px dashed var(--md-border)' : 'none',
                    fontSize: '13px',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--md-text-secondary)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>{item.icon}</span>
                      {item.label}
                    </span>
                    <span style={{ fontWeight: '600' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Status do Comprovante */}
              {order.pix_proofs && order.pix_proofs.length > 0 ? (
                <div style={{
                  marginTop: '20px',
                  padding: '12px 16px',
                  backgroundColor: '#DCFCE7',
                  border: '1px solid #86EFAC',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#15803D',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>task_alt</span>
                  <span>Comprovante recebido! Em análise.</span>
                </div>
              ) : (
                <div style={{
                  marginTop: '20px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--md-secondary-light)',
                  border: '1px solid #FCD34D',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: 'var(--md-secondary-variant)',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>info</span>
                  <span>Aguardando envio do comprovante Pix.</span>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '32px 24px', textAlign: 'center' }}>
              <p style={{ color: 'var(--md-text-secondary)', fontSize: '13px' }}>
                Pedido registrado! Guarde o número para acompanhar o status.
              </p>
            </div>
          )}

          {/* Rodapé */}
          <div style={{
            borderTop: '1px solid var(--md-border)',
            padding: '16px 24px',
            backgroundColor: 'var(--md-background)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '11px',
            color: 'var(--md-text-secondary)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--md-primary)' }}>verified_user</span>
            Processado com segurança pela Maesttro
          </div>
        </div>

      </div>
    </div>
  );
}
