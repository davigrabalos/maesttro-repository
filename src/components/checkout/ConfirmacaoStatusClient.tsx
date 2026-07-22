'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfirmacaoStatusClientProps {
  orderId: string;
  initialStatus: string;
  initialOrder: any;
}

export function ConfirmacaoStatusClient({ orderId, initialStatus, initialOrder }: ConfirmacaoStatusClientProps) {
  const [status, setStatus] = useState(initialStatus);
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    // If already paid, trigger confetti on load
    if (initialStatus === 'paid') {
      triggerConfetti();
      return;
    }

    // Polling every 3 seconds if pending/processing
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/checkout/status/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            const newStatus = data.order.status;
            if (newStatus !== status) {
              setStatus(newStatus);
              setOrder(data.order);
              if (newStatus === 'paid') {
                triggerConfetti();
              }
            }
          }
        }
      } catch (err) {
        console.error('Polling status error', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, status, initialStatus]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const isPaid = status === 'paid';

  return (
    <div style={{ backgroundColor: 'var(--md-surface)', border: '1px solid var(--md-border)', overflow: 'hidden', borderRadius: '0px' }}>
      
      {/* Header (Dinâmico) */}
      <div style={{
        backgroundColor: isPaid ? '#10B981' : 'var(--md-primary)',
        padding: '32px 24px',
        textAlign: 'center',
        color: '#FFFFFF',
        transition: 'background-color 0.5s ease'
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '56px', display: 'block', marginBottom: '12px' }}>
          {isPaid ? 'verified' : 'hourglass_top'}
        </span>
        <h1 style={{ color: '#FFFFFF', fontSize: '24px', marginBottom: '8px', fontWeight: 700 }}>
          {isPaid ? '🎉 Pagamento Confirmado!' : 'Pedido em Análise'}
        </h1>
        <p style={{ fontSize: '13px', opacity: 0.9 }}>
          {isPaid ? 'Seu pedido foi aprovado! O acesso ao produto está liberado.' : 'Estamos processando seu comprovante Pix em tempo real.'}
        </p>
      </div>

      {/* Detalhes do Pedido */}
      {order && (
        <div style={{ padding: '24px' }}>
          {/* Badge de Liberação quando Pago */}
          {isPaid && (
            <div style={{
              backgroundColor: '#ECFDF5', border: '1px solid #10B981', padding: '16px',
              borderRadius: '0px', marginBottom: '20px', textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#065F46', fontSize: '15px' }}>🚀 Produto Liberado!</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#047857' }}>
                Enviamos os dados de acesso para o e-mail: <strong>{order.customer_email}</strong>
              </p>
              <button 
                onClick={triggerConfetti}
                style={{
                  marginTop: '12px', padding: '8px 16px', backgroundColor: '#10B981', color: '#fff',
                  border: 'none', borderRadius: '0px', fontWeight: 700, fontSize: '12px', cursor: 'pointer'
                }}
              >
                Comemorar Novamente! 🥳
              </button>
            </div>
          )}

          {/* ID do Pedido */}
          <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'var(--md-primary-light)', border: '1px solid var(--md-border)', borderRadius: '0px' }}>
            <p style={{ fontSize: '11px', color: 'var(--md-text-secondary)', marginBottom: '4px' }}>Número do Pedido</p>
            <p style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--md-primary)', fontWeight: '700', margin: 0 }}>
              #{order.id.toUpperCase()}
            </p>
          </div>

          {/* Status Box */}
          <div className={isPaid ? 'status-badge status-paid' : 'status-badge status-pending'} style={{
            padding: '12px 16px',
            borderRadius: '0px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            width: '100%'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {isPaid ? 'task_alt' : 'sync'}
            </span>
            <span>
              Status: {isPaid ? 'Aprovado / Pago' : 'Aguardando validação do admin'}
            </span>
          </div>
        </div>
      )}

      {/* Footer Securo */}
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
        Processado com segurança em tempo real pela Maesttro
      </div>
    </div>
  );
}
