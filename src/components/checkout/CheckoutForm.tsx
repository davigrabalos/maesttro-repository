'use client';

import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function CheckoutForm() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cardError, setCardError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate card error to trigger Pix fallback
    setCardError(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '16px' }}>Dados Pessoais</h2>
      <Input 
        label="E-mail" 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <Input 
        label="Telefone / WhatsApp" 
        type="tel" 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)} 
        required 
      />

      <h2 style={{ marginBottom: '16px', marginTop: '32px' }}>Pagamento</h2>
      <p style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--md-text-secondary)' }}>
        Opções: Cartão, Pix, Boleto (Variável da Operação)
      </p>
      
      <Input label="Número do Cartão" type="text" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input label="Validade" type="text" />
        <Input label="CVV" type="text" />
      </div>
      <Input label="Nome no Cartão" type="text" />

      {cardError && (
        <div style={{ 
          padding: '16px', 
          backgroundColor: 'var(--md-error)', 
          color: '#FFFFFF', 
          border: '1px solid var(--md-error)',
          marginBottom: '24px',
          fontSize: '13px'
        }}>
          Cartão recusado. Que tal pagar via Pix com aprovação imediata? 👇
        </div>
      )}

      <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '16px' }}>
        Comprar Agora
      </Button>
    </form>
  );
}
