'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { PaymentMethodSelector } from './PaymentMethodSelector';

export function CheckoutForm({ source, checkoutId, onOrderCreated }: { source: string, checkoutId: string, onOrderCreated: (id: string) => void }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/checkout/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source,
          email,
          phone,
          amount: 197.00,
        }),
      });

      const data = await res.json();

      if (res.ok && data.orderId) {
        setOrderId(data.orderId);
        setOrderCreated(true);
        onOrderCreated(data.orderId);
        // Scroll user down to payment section smoothly
        setTimeout(() => {
          document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      } else {
        alert('Erro ao processar pedido: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Erro interno ao processar pedido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Dados Pessoais */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)' }}>person</span>
        <h2>Dados Pessoais</h2>
      </div>

      <Input
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={orderCreated}
      />
      <Input
        label="Telefone / WhatsApp"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        disabled={orderCreated}
      />

      {/* Payment Method Selector (always visible) */}
      <div id="payment-section">
        <PaymentMethodSelector orderId={orderId} />
      </div>

      {/* Submit Button */}
      {!orderCreated && (
        <Button
          type="submit"
          variant="primary"
          style={{ width: '100%', marginTop: '28px', gap: '8px' }}
          disabled={loading}
        >
          <span className="material-symbols-outlined">{loading ? 'hourglass_empty' : 'lock'}</span>
          <span>{loading ? 'Processando...' : 'Confirmar Pedido'}</span>
        </Button>
      )}

      {/* Success state after order created */}
      {orderCreated && orderId && (
        <div style={{ marginTop: '28px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 16px',
            backgroundColor: 'var(--md-primary-light)',
            border: '1px solid var(--md-primary)',
            fontSize: '13px',
            color: 'var(--md-primary)',
            marginBottom: '12px',
          }}>
            <span className="material-symbols-outlined">check_circle</span>
            <span>Pedido registrado! Conclua o pagamento acima e depois acesse sua confirmação.</span>
          </div>
          <button
            type="button"
            onClick={() => router.push(`/checkout/${checkoutId}/confirmacao?orderId=${orderId}`)}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: '1px solid var(--md-primary)',
              backgroundColor: 'transparent',
              color: 'var(--md-primary)',
              fontFamily: 'inherit',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--md-primary-light)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>open_in_new</span>
            <span>Ver Confirmação do Pedido</span>
          </button>
        </div>
      )}
    </form>
  );
}
